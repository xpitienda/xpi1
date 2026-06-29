'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CategoryNode {
  id: string;
  name: string;
  parent_id: string | null;
  children: CategoryNode[];
}

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'Todas';
  const currentSearch = searchParams.get('q') || '';
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories/tree')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCategoryTree(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error cargando categorías:', err);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    if (category !== 'Todas') params.set('category', category);
    if (currentSearch) params.set('q', currentSearch);
    router.push(`/catalog?${params.toString()}`);
    setActiveDropdown(null);
  };

  const handleMouseEnter = (categoryId: string) => {
    setActiveDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    setTimeout(() => setActiveDropdown(null), 200);
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
    'Animales': '🐾',
    'Deportes': '⚽',
    'General': '📦',
    'Hogar': '🏠',
    'Plantas': '🌱',
    'Ropa': '👕',
    'Calzado': '👟',
    'Tecnologia': '📱',
    'Tecnología': '📱',
    'Accesorios': '💍',
    'Bisutería': '💎',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ color: '#8D6E63', fontSize: '0.9rem' }}>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes neonGlow {
          0% { box-shadow: 0 0 5px var(--neon-color), 0 0 10px var(--neon-color), 0 0 20px var(--neon-color), 0 0 40px var(--neon-color); }
          50% { box-shadow: 0 0 10px var(--neon-color), 0 0 20px var(--neon-color), 0 0 30px var(--neon-color), 0 0 50px var(--neon-color); }
          100% { box-shadow: 0 0 5px var(--neon-color), 0 0 10px var(--neon-color), 0 0 20px var(--neon-color), 0 0 40px var(--neon-color); }
        }
        .nav-category {
          transition: all 0.3s ease;
          position: relative;
        }
        .nav-category:hover {
          --neon-color: var(--hover-color);
          animation: neonGlow 1.5s infinite;
          transform: translateY(-2px);
        }
        .dropdown-menu {
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }
        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .dropdown-item {
          transition: all 0.2s ease;
        }
        .dropdown-item:hover {
          transform: translateX(5px);
        }
      `}</style>
      
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'linear-gradient(135deg, #3D1A78 0%, #2A1155 50%, #006B3C 100%)',
        boxShadow: `
          0 10px 0 rgba(0,0,0,0.3),
          0 10px 20px rgba(0,0,0,0.4),
          0 20px 40px rgba(0,0,0,0.3),
          inset 0 2px 0 rgba(255,255,255,0.2),
          inset 0 -2px 0 rgba(0,0,0,0.3)
        `,
        padding: '1.25rem 0',
        marginBottom: '2rem',
        borderRadius: '0 0 20px 20px',
        border: '3px solid rgba(255,255,255,0.1)',
        borderBottom: 'none'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          {/* Botón Todas */}
          <button
            onClick={() => handleCategoryChange('Todas')}
            className="nav-category"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.75rem',
              background: currentCategory === 'Todas' 
                ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
                : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: `2px solid ${currentCategory === 'Todas' ? '#F59E0B' : 'rgba(255,255,255,0.3)'}`,
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginRight: '0.5rem',
              backdropFilter: 'blur(10px)',
              boxShadow: currentCategory === 'Todas'
                ? '0 6px 0 #92400E, 0 8px 16px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.3)'
                : '0 4px 0 rgba(0,0,0,0.3), 0 6px 12px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.2)',
              ['--hover-color' as string]: '#F59E0B',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🏪</span>
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
                  display: 'inline-block',
                  position: 'relative',
                  marginRight: '0.5rem'
                }}
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleCategoryChange(cat.name)}
                  className="nav-category"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1.75rem',
                    background: isSelected 
                      ? `linear-gradient(135deg, ${colorScheme.bg} 0%, ${colorScheme.shadow} 100%)`
                      : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: `2px solid ${isSelected ? colorScheme.bg : colorScheme.shadow}`,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    boxShadow: isSelected
                      ? `0 6px 0 ${colorScheme.shadow}, 0 8px 16px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.3)`
                      : '0 4px 0 rgba(0,0,0,0.3), 0 6px 12px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.2)',
                    ['--hover-color' as string]: colorScheme.hover,
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                  <span>{cat.name}</span>
                  {hasChildren && (
                    <span style={{ fontSize: '0.8rem', marginLeft: '0.25rem' }}>
                      {isActive ? '▲' : '▼'}
                    </span>
                  )}
                </button>

                {/* Dropdown de subcategorías */}
                {hasChildren && (
                  <div
                    className={`dropdown-menu ${isActive ? 'show' : ''}`}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '0.5rem',
                      minWidth: '200px',
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: '12px',
                      boxShadow: `
                        0 10px 30px rgba(0,0,0,0.3),
                        0 0 20px rgba(147, 51, 234, 0.3),
                        0 6px 0 rgba(0,0,0,0.2),
                        inset 0 2px 0 rgba(255,255,255,0.8)
                      `,
                      border: `2px solid ${colorScheme.bg}`,
                      overflow: 'hidden',
                      zIndex: 1001
                    }}
                  >
                    {cat.children.map((child, childIndex) => {
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
                            padding: '0.875rem 1.25rem',
                            background: isChildSelected 
                              ? `${colorScheme.bg}30` 
                              : 'transparent',
                            color: '#3D1A78',
                            border: 'none',
                            borderBottom: '1px solid rgba(0,107,60,0.1)',
                            fontSize: '0.95rem',
                            fontWeight: isChildSelected ? 'bold' : '500',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                            boxShadow: isChildSelected
                              ? 'inset 0 2px 4px rgba(0,0,0,0.1)'
                              : 'none',
                          }}
                        >
                          <span style={{ fontSize: '1.1rem' }}>{childIcon}</span>
                          <span>{child.name}</span>
                          {isChildSelected && (
                            <span style={{ marginLeft: 'auto', color: colorScheme.bg }}>●</span>
                          )}
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
