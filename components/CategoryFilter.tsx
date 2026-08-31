'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import CategoryIcon from '@/components/CategoryIcon';

interface CategoryNode {
  id: string;
  name: string;
  parent_id: string | null;
  children: CategoryNode[];
}

interface CategoryFilterProps {
  initialCategories?: CategoryNode[];
}

export default function CategoryFilter({ initialCategories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'Todas';
  const currentSearch = searchParams.get('q') || '';
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>(() => {
    return initialCategories && initialCategories.length > 0 ? initialCategories : [];
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(() => {
    return !initialCategories || initialCategories.length === 0;
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (!initialCategories || initialCategories.length === 0) {
      const loadCategories = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/categories/tree');
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategoryTree(data);
          }
        } catch (err) {
          console.error('Error:', err);
        } finally {
          setLoading(false);
        }
      };
      loadCategories();
    } else {
      setLoading(false);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [initialCategories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setDropdownPosition(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    if (category !== 'Todas') params.set('category', category);
    if (currentSearch) params.set('q', currentSearch);
    router.push(`/catalog?${params.toString()}`);
    setActiveDropdown(null);
    setDropdownPosition(null);
  };

  const handleDropdownToggle = (categoryId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (activeDropdown === categoryId) {
      setActiveDropdown(null);
      setDropdownPosition(null);
    } else {
      // ✅ Calcular posición del botón de la flecha
      const button = buttonRefs.current[categoryId];
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8, // 8px debajo del botón
          left: rect.left
        });
      }
      setActiveDropdown(categoryId);
    }
  };

  const truncateName = (name: string, maxLength: number = 9): string => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '..';
  };

  const modernColors = [
    { bg: '#8B5CF6', shadow: '#6D28D9' },
    { bg: '#10B981', shadow: '#059669' },
    { bg: '#F59E0B', shadow: '#D97706' },
    { bg: '#EC4899', shadow: '#DB2777' },
    { bg: '#3B82F6', shadow: '#2563EB' },
    { bg: '#EF4444', shadow: '#DC2626' },
  ];

  if (loading) {
    return <div style={{ padding: '1rem', textAlign: 'center', background: 'white', margin: '1rem', borderRadius: '12px' }}>⏳ Cargando...</div>;
  }

  // ✅ Encontrar la categoría activa para el portal
  const activeCat = activeDropdown ? categoryTree.find(c => c.id === activeDropdown) : null;
  const activeColorIndex = activeCat ? categoryTree.indexOf(activeCat) : 0;
  const activeColorScheme = modernColors[activeColorIndex % modernColors.length];

  return (
    <>
      <style>{`
        .nav-category { transition: all 0.3s ease; }
        .nav-category:hover { transform: translateY(-2px); }
        .dropdown-toggle:active { transform: scale(0.9); background: rgba(255,255,255,0.3) !important; }
        .dropdown-item:active { background: rgba(0,0,0,0.1) !important; }
        .category-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .category-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div 
        ref={containerRef}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #3D1A78 0%, #2A1155 50%, #006B3C 100%)',
          boxShadow: '0 10px 0 rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.4)',
          padding: isMobile ? '0.5rem 0' : '1.25rem 0',
          marginBottom: isMobile ? '0.5rem' : '2rem',
          borderRadius: '0 0 20px 20px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderBottom: 'none'
        }}
      >
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: `0 ${isMobile ? '0.5rem' : '1rem'}`,
          display: 'flex',
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          gap: isMobile ? '0.5rem' : '0.75rem',
          alignItems: 'flex-start',
          overflowX: isMobile ? 'auto' : 'visible',
        }}
        className="category-scroll"
        >
          <button
            onClick={() => handleCategoryChange('Todas')}
            className="nav-category"
            title="Ver todos los productos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: isMobile ? '0.5rem 0.75rem' : '0.875rem 1.75rem',
              background: currentCategory === 'Todas'
                ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: `2px solid ${currentCategory === 'Todas' ? '#F59E0B' : 'rgba(255,255,255,0.3)'}`,
              borderRadius: '12px',
              fontSize: isMobile ? '0.75rem' : '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: currentCategory === 'Todas'
                ? '0 6px 0 #92400E, 0 8px 16px rgba(0,0,0,0.3)'
                : '0 4px 0 rgba(0,0,0,0.3), 0 6px 12px rgba(0,0,0,0.2)',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🏪</span>
            <span>Todas</span>
          </button>

          {categoryTree.map((cat, index) => {
            const colorScheme = modernColors[index % modernColors.length];
            const hasChildren = cat.children && cat.children.length > 0;
            const isSelected = currentCategory === cat.name;
            const truncatedName = truncateName(cat.name, 9);

            return (
              <div
                key={cat.id}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', gap: 0 }}>
                  <button
                    onClick={() => handleCategoryChange(cat.name)}
                    className="nav-category"
                    title={cat.name}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      background: 'transparent',
                      color: 'white',
                      border: `3px solid ${isSelected ? colorScheme.bg : 'rgba(255,255,255,0.3)'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                      boxShadow: isSelected
                        ? `0 6px 0 ${colorScheme.shadow}, 0 8px 16px rgba(0,0,0,0.3)`
                        : '0 4px 0 rgba(0,0,0,0.3), 0 6px 12px rgba(0,0,0,0.2)',
                      width: isMobile ? '65px' : '90px',
                      height: isMobile ? '65px' : '90px',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <CategoryIcon 
                      categoryName={cat.name} 
                      size={isMobile ? 65 : 90} 
                      showEmoji={true}
                      fill={true}
                    />
                    
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
                        padding: '10px 4px 5px 4px',
                        zIndex: 10,
                        pointerEvents: 'none',
                      }}
                    >
                      <div
                        style={{
                          color: 'white',
                          fontSize: isMobile ? '0.65rem' : '0.9rem',
                          fontWeight: '900',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {truncatedName}
                      </div>
                    </div>
                  </button>

                  {hasChildren && (
                    <button
                      ref={(el) => { buttonRefs.current[cat.id] = el; }}
                      onClick={(e) => handleDropdownToggle(cat.id, e)}
                      className="dropdown-toggle"
                      title={`Ver subcategorías de ${cat.name}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: isMobile ? '0.4rem 0.5rem' : '0.75rem 0.75rem',
                        background: isSelected
                          ? `${colorScheme.shadow}80`
                          : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: `2px solid ${colorScheme.shadow}`,
                        borderRadius: '0 12px 12px 0',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        minWidth: '1.8rem',
                        height: isMobile ? '65px' : '90px',
                        zIndex: 100,
                      }}
                    >
                      {activeDropdown === cat.id ? '▲' : '▼'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ PORTAL: Dropdown renderizado en el body, fuera de cualquier overflow */}
      {activeDropdown && dropdownPosition && activeCat && createPortal(
        <div
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            minWidth: '220px',
            background: 'rgba(255,255,255,0.98)',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: `2px solid ${activeColorScheme.bg}`,
            overflow: 'hidden',
            zIndex: 9999,
            width: 'auto',
          }}
        >
          {activeCat.children.map((child) => {
            const isChildSelected = currentCategory === child.name;
            return (
              <button
                key={child.id}
                onClick={() => handleCategoryChange(child.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 1.25rem',
                  background: isChildSelected ? `${activeColorScheme.bg}20` : 'transparent',
                  color: '#3D1A78',
                  border: 'none',
                  borderBottom: '1px solid rgba(0,107,60,0.1)',
                  fontSize: '0.875rem',
                  fontWeight: isChildSelected ? 'bold' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <CategoryIcon categoryName={child.name} size={24} showEmoji={true} />
                <span style={{ flex: 1 }}>{child.name}</span>
                {isChildSelected && <span style={{ color: activeColorScheme.bg }}>●</span>}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}