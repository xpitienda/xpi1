'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(() => {
    return !initialCategories || initialCategories.length === 0;
  });

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

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    if (category !== 'Todas') params.set('category', category);
    if (currentSearch) params.set('q', currentSearch);
    router.push(`/catalog?${params.toString()}`);
  };

  const handleDropdownToggle = (categoryId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  const modernColors = [
    { bg: '#8B5CF6', shadow: '#6D28D9', hover: '#A78BFA' },
    { bg: '#10B981', shadow: '#059669', hover: '#34D399' },
    { bg: '#F59E0B', shadow: '#D97706', hover: '#FBBF24' },
    { bg: '#EC4899', shadow: '#DB2777', hover: '#F472B6' },
    { bg: '#3B82F6', shadow: '#2563EB', hover: '#60A5FA' },
    { bg: '#EF4444', shadow: '#DC2626', hover: '#F87171' },
  ];

  const icons: Record<string, string> = {
    'Todas': '🏪',
    'Ropa': '👕',
    'Calzado': '👟',
    'Tecnologia': '📱',
    'Tecnología': '📱',
    'Accesorios': '💍',
    'Bisutería': '💎',
    'Deportes': '⚽',
    'General': '📦',
    'Hogar': '🏠',
  };

  if (loading) {
    return <div style={{ padding: '1rem', textAlign: 'center', background: 'white', margin: '1rem', borderRadius: '12px' }}>⏳ Cargando...</div>;
  }

  return (
    <>
      <style>{`
        .nav-category { transition: all 0.3s ease; }
        .nav-category:hover { transform: translateY(-2px); }
        .dropdown-toggle:active { transform: scale(0.9); background: rgba(255,255,255,0.3) !important; }
        .dropdown-item:active { background: rgba(0,0,0,0.1) !important; }
      `}</style>
      
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'linear-gradient(135deg, #3D1A78 0%, #2A1155 50%, #006B3C 100%)',
        boxShadow: '0 10px 0 rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.4)',
        padding: isMobile ? '0.75rem 0' : '1.25rem 0',
        marginBottom: isMobile ? '1rem' : '2rem',
        borderRadius: '0 0 20px 20px',
        border: '3px solid rgba(255,255,255,0.1)',
        borderBottom: 'none'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: `0 ${isMobile ? '0.5rem' : '1rem'}`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: isMobile ? '0.5rem' : '0.75rem',
          alignItems: 'flex-start'
        }}>
          {/* Botón Todas */}
          <button
            onClick={() => handleCategoryChange('Todas')}
            className="nav-category"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: isMobile ? '0.5rem 1rem' : '0.875rem 1.75rem',
              background: currentCategory === 'Todas' 
                ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
                : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: `2px solid ${currentCategory === 'Todas' ? '#F59E0B' : 'rgba(255,255,255,0.3)'}`,
              borderRadius: '12px',
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: currentCategory === 'Todas'
                ? '0 6px 0 #92400E, 0 8px 16px rgba(0,0,0,0.3)'
                : '0 4px 0 rgba(0,0,0,0.3), 0 6px 12px rgba(0,0,0,0.2)',
            }}
          >
            <span>🏪</span>
            <span>Todas</span>
          </button>

          {/* Categorías principales */}
          {categoryTree.map((cat, index) => {
            const colorScheme = modernColors[index % modernColors.length];
            const icon = icons[cat.name] || '🏷️';
            const hasChildren = cat.children && cat.children.length > 0;
            const isActive = activeDropdown === cat.id;
            const isSelected = currentCategory === cat.name;

            return (
              <div
                key={cat.id}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                <div style={{ display: 'flex', gap: 0 }}>
                  {/* Botón de categoría */}
                  <button
                    onClick={() => handleCategoryChange(cat.name)}
                    className="nav-category"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: isMobile ? '0.5rem 0.75rem' : '0.875rem 1.25rem',
                      background: isSelected 
                        ? `linear-gradient(135deg, ${colorScheme.bg} 0%, ${colorScheme.shadow} 100%)`
                        : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: `2px solid ${isSelected ? colorScheme.bg : colorScheme.shadow}`,
                      borderRadius: hasChildren ? '12px 0 0 12px' : '12px',
                      borderRight: hasChildren ? 'none' : undefined,
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                      boxShadow: isSelected
                        ? `0 6px 0 ${colorScheme.shadow}, 0 8px 16px rgba(0,0,0,0.3)`
                        : '0 4px 0 rgba(0,0,0,0.3), 0 6px 12px rgba(0,0,0,0.2)',
                    }}
                  >
                    <span>{icon}</span>
                    <span>{cat.name}</span>
                  </button>

                  {/* Botón de flecha */}
                  {hasChildren && (
                    <button
                      onClick={(e) => handleDropdownToggle(cat.id, e)}
                      className="dropdown-toggle"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: isMobile ? '0.5rem 0.625rem' : '0.875rem 0.75rem',
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
                        minWidth: '2rem',
                      }}
                    >
                      {isActive ? '▲' : '▼'}
                    </button>
                  )}
                </div>

                {/* Dropdown - En móvil se muestra debajo en flujo normal */}
                {hasChildren && isActive && (
                  <div
                    style={{
                      position: isMobile ? 'relative' : 'absolute',
                      top: isMobile ? 'auto' : '100%',
                      left: 0,
                      marginTop: isMobile ? '0.5rem' : '0',
                      minWidth: isMobile ? '100%' : '200px',
                      background: 'rgba(255,255,255,0.98)',
                      borderRadius: '12px',
                      boxShadow: isMobile 
                        ? '0 4px 12px rgba(0,0,0,0.2)'
                        : '0 10px 30px rgba(0,0,0,0.3)',
                      border: `2px solid ${colorScheme.bg}`,
                      overflow: 'hidden',
                      zIndex: 1001,
                      width: isMobile ? '100%' : 'auto',
                    }}
                  >
                    {cat.children.map((child) => {
                      const childIcon = icons[child.name] || '📁';
                      const isChildSelected = currentCategory === child.name;
                      return (
                        <button
                          key={child.id}
                          onClick={() => handleCategoryChange(child.name)}
                          className="dropdown-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: isMobile ? '0.875rem 1rem' : '0.75rem 1.25rem',
                            background: isChildSelected ? `${colorScheme.bg}20` : 'transparent',
                            color: '#3D1A78',
                            border: 'none',
                            borderBottom: '1px solid rgba(0,107,60,0.1)',
                            fontSize: isMobile ? '0.9rem' : '0.875rem',
                            fontWeight: isChildSelected ? 'bold' : '500',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <span>{childIcon}</span>
                          <span style={{ flex: 1 }}>{child.name}</span>
                          {isChildSelected && <span style={{ color: colorScheme.bg }}>●</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
