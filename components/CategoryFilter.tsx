'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'Todas';
  const currentSearch = searchParams.get('q') || '';
  const [categories, setCategories] = useState<string[]>(['Todas']);

  useEffect(() => {
    fetch('/api/admin/categories', {
      headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
    })
      .then(res => res.json())
      .then(data => setCategories(['Todas', ...data.map((c: any) => c.name)]))
      .catch(err => console.error('Error cargando categorías:', err));
  }, []);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    if (category !== 'Todas') params.set('category', category);
    if (currentSearch) params.set('q', currentSearch);
    router.push(`/catalog?${params.toString()}`);
  };

  // Colores modernos y dinámicos
  const modernColors = [
    { bg: '#8B5CF6', shadow: '#6D28D9', hover: '#A78BFA', selected: '#F59E0B' }, // Violeta
    { bg: '#10B981', shadow: '#059669', hover: '#34D399', selected: '#EF4444' }, // Verde
    { bg: '#F59E0B', shadow: '#D97706', hover: '#FBBF24', selected: '#8B5CF6' }, // Ámbar
    { bg: '#EC4899', shadow: '#DB2777', hover: '#F472B6', selected: '#10B981' }, // Rosa
    { bg: '#3B82F6', shadow: '#2563EB', hover: '#60A5FA', selected: '#F59E0B' }, // Azul
    { bg: '#EF4444', shadow: '#DC2626', hover: '#F87171', selected: '#3B82F6' }, // Rojo
  ];

  const icons: Record<string, string> = {
    'Todas': '🏪',
    'Animales': '🐾',
    'Deportes': '⚽',
    'General': '📦',
    'Hogar': '🏠',
    'Plantas': '🌱',
  };

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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', padding: '1rem' }}>
        {categories.map((cat, index) => {
          const isSelected = currentCategory === cat;
          const colorScheme = modernColors[index % modernColors.length];
          const icon = icons[cat] || '🏷️';
          const bgColor = isSelected ? colorScheme.selected : colorScheme.bg;
          
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="category-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                background: bgColor,
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: `0 6px 0 ${colorScheme.shadow}, 0 8px 16px rgba(0,0,0,0.2)`,
                ['--shadow-color' as string]: colorScheme.shadow,
                textTransform: 'capitalize',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{icon}</span>
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}