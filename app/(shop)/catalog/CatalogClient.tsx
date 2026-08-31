'use client';

import { useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';

interface CatalogClientProps {
  initialCategories: any[];
  products: any[];
  query: string;
  category: string;
  filter: string;
}

export default function CatalogClient({ initialCategories, products, query, category, filter }: CatalogClientProps) {
  // Estado para la vista: 'grid', 'list', o 'carousel'
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'carousel'>('grid');

  const filters = [
    { key: '', label: '🏪 Todos', color: '#5D4037' },
    { key: 'featured', label: '⭐ Destacados', color: '#F59E0B' },
    { key: 'day', label: '🔥 Oferta del Día', color: '#10B981' },
    { key: 'week', label: '📅 Oferta de la Semana', color: '#3B82F6' },
  ];

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem 0 1rem' }}>

      {/* Título y Buscador */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: 0, color: '#6B2D8B' }}>
          Catálogo de <span style={{ color: '#1B8A3B' }}>Productos</span>
        </h1>
        <div style={{ minWidth: '280px', maxWidth: '360px' }}>
          <SearchBar />
        </div>
      </div>

      <CategoryFilter initialCategories={initialCategories} />

      {/* Selector de Vista (Cuadrícula / Lista / Carrusel) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
        {(['grid', 'list', 'carousel'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.75rem',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              border: '2px solid #1B8A3B',
              background: viewMode === mode ? '#1B8A3B' : 'white',
              color: viewMode === mode ? 'white' : '#1B8A3B',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'capitalize'
            }}
          >
            {mode === 'grid' ? '🔲 Cuadrícula' : mode === 'list' ? '📝 Lista' : '🎠 Carrusel'}
          </button>
        ))}
      </div>

      {/* ✅ Filtros de oferta - Horizontal scroll en móvil */}
      <style>{`
        .filter-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .filter-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div 
        className="filter-scroll"
        style={{ 
          display: 'flex', 
          flexWrap: 'nowrap',          // ✅ Sin salto de línea
          gap: '0.5rem', 
          justifyContent: 'flex-start', // ✅ Alinear a la izquierda para scroll
          margin: '1rem 0',
          overflowX: 'auto',            // ✅ Scroll horizontal
          padding: '0 1rem',            // ✅ Padding para que no se corte el borde
          WebkitOverflowScrolling: 'touch' // ✅ Scroll suave en iOS
        }}
      >
        {filters.map((f) => {
          const isActive = filter === f.key;
          return (
            <a
              key={f.key}
              href={`/catalog?${new URLSearchParams({
                ...(query ? { q: query } : {}),
                ...(category ? { category } : {}),
                ...(f.key ? { filter: f.key } : {}),
              })}`}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '2rem',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                textDecoration: 'none',
                background: isActive ? f.color : 'white',
                color: isActive ? 'white' : f.color,
                border: `2px solid ${f.color}`,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',   // ✅ Evitar que el texto se rompa
                flexShrink: 0,          // ✅ Evitar que los botones se encojan
                boxShadow: isActive ? `0 4px 6px ${f.color}40` : 'none'
              }}
            >
              {f.label}
            </a>
          );
        })}
      </div>

      {/* Resultados */}
      {(query || (category && category !== 'Todas') || filter) && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#6B2D8B', fontWeight: '600' }}>
            {query && <span>Buscando: <strong style={{ color: '#1B8A3B' }}>"{query}"</strong></span>}
            {query && (category || filter) && <span> | </span>}
            {category && category !== 'Todas' && <span>Categoría: <strong style={{ color: '#1B8A3B' }}>{category}</strong></span>}
            {(query || (category && category !== 'Todas')) && filter && <span> | </span>}
            {filter && <span>Filtro: <strong style={{ color: filters.find(f => f.key === filter)?.color }}>{filters.find(f => f.key === filter)?.label}</strong></span>}
            <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>({products.length} productos)</span>
          </p>
        </div>
      )}

      {/* Grid de Productos */}
      <ProductGrid products={products} viewMode={viewMode} />

    </div>
  );
}