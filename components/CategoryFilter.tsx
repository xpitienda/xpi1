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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        setError(true);
      });
  }, []);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    if (category !== 'Todas') params.set('category', category);
    if (currentSearch) params.set('q', currentSearch);
    router.push(`/catalog?${params.toString()}`);
  };

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const modernColors = [
    { bg: '#8B5CF6', shadow: '#6D28D9', hover: '#A78BFA', selected: '#F59E0B' },
    { bg: '#10B981', shadow: '#059669', hover: '#34D399', selected: '#EF4444' },
    { bg: '#F59E0B', shadow: '#D97706', hover: '#FBBF24', selected: '#8B5CF6' },
    { bg: '#EC4899', shadow: '#DB2777', hover: '#F472B6', selected: '#10B981' },
    { bg: '#3B82F6', shadow: '#2563EB', hover: '#60A5FA', selected: '#F59E0B' },
    { bg: '#EF4444', shadow: '#DC2626', hover: '#F87171', selected: '#3B82F6' },
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
  };

  const renderCategoryButton = (cat: CategoryNode, index: number, isSubcategory: boolean = false) => {
    const isSelected = currentCategory === cat.name;
    const colorScheme = modernColors[index % modernColors.length];
    const icon = icons[cat.name] || '🏷️';
    const bgColor = isSelected ? colorScheme.selected : colorScheme.bg;
    const hasChildren = cat.children && cat.children.length > 0;
    const isExpanded = expandedCategories.has(cat.id);

    return (
      <div key={cat.id} style={{ marginBottom: isSubcategory ? '0.5rem' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => handleCategoryChange(cat.name)}
            className="category-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: isSubcategory ? '0.625rem 1.25rem' : '0.875rem 1.5rem',
              background: bgColor,
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: isSubcategory ? '0.9rem' : '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: `0 6px 0 ${colorScheme.shadow}, 0 8px 16px rgba(0,0,0,0.2)`,
              ['--shadow-color' as string]: colorScheme.shadow,
              textTransform: 'capitalize',
              marginLeft: isSubcategory ? '2rem' : '0',
            }}
          >
            <span style={{ fontSize: isSubcategory ? '1.2rem' : '1.4rem' }}>{icon}</span>
            <span>{cat.name}</span>
          </button>
          {hasChildren && (
            <button
              onClick={() => toggleExpand(cat.id)}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: `2px solid ${colorScheme.bg}`,
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: colorScheme.bg,
                transition: 'all 0.2s',
              }}
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
            {cat.children.map((child, childIndex) => 
              renderCategoryButton(child, childIndex, true)
            )}
          </div>
        )}
      </div>
    );
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
          0% { box-shadow: 0 0 5px #ff00de, 0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 40px #ff00de, 0 6px 0 var(--shadow-color), 0 8px 16px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff, 0 6px 0 var(--shadow-color), 0 8px 16px rgba(0,0,0,0.2); }
          100% { box-shadow: 0 0 5px #ff00de, 0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 40px #ff00de, 0 6px 0 var(--shadow-color), 0 8px 16px rgba(0,0,0,0.2); }
        }
        .category-btn {
          transition: all 0.15s ease;
          position: relative;
        }
        .category-btn:hover {
          animation: neonGlow 1s infinite;
          transform: translateY(-2px);
        }
        .category-btn:active {
          transform: translateY(4px);
          box-shadow: 0 0px 0 var(--shadow-color), 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem' }}>
        {/* Botón "Todas" */}
        <button
          onClick={() => handleCategoryChange('Todas')}
          className="category-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            background: currentCategory === 'Todas' ? '#F59E0B' : '#6B7280',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: `0 6px 0 ${currentCategory === 'Todas' ? '#D97706' : '#4B5563'}, 0 8px 16px rgba(0,0,0,0.2)`,
            ['--shadow-color' as string]: currentCategory === 'Todas' ? '#D97706' : '#4B5563',
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>🏪</span>
          <span>Todas</span>
        </button>

        {/* Árbol de categorías */}
        {categoryTree.map((cat, index) => renderCategoryButton(cat, index))}
      </div>
    </>
  );
}
