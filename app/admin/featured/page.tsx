'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Tag, DollarSign } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  is_featured: number;
  offer_type: string | null;
  offer_price: number | null;
}

export default function FeaturedManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const router = useRouter();

  const categories = ['Todas', 'Ropa', 'Tecnologia', 'Hogar', 'Deportes', 'Accesorios', 'General'];

  const fetchProducts = async () => {
    try {
      setError(null);
      const res = await fetch('/api/admin/featured', {
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}` }
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Asegurar que data sea un array
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error('La respuesta no es un array:', data);
        setProducts([]);
        setError('Formato de datos inesperado del servidor');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProduct = async (product: Product, updates: Partial<Product>) => {
    try {
      const res = await fetch('/api/admin/featured', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`
        },
        body: JSON.stringify({
          id: product.id,
          is_featured: updates.is_featured !== undefined ? updates.is_featured : product.is_featured,
          offer_type: updates.offer_type !== undefined ? updates.offer_type : product.offer_type,
          offer_price: updates.offer_price !== undefined ? updates.offer_price : product.offer_price
        })
      });

      if (res.ok) {
        setProducts(products.map(p => 
          p.id === product.id ? { ...p, ...updates } : p
        ));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleFeatured = (product: Product) => {
    const categoryCount = products.filter(p => 
      p.category === product.category && p.is_featured === 1 && p.id !== product.id
    ).length;

    if (product.is_featured === 0 && categoryCount >= 5) {
      alert(`⚠️ Ya hay 5 productos destacados en la categoría "${product.category}". Elimina uno primero.`);
      return;
    }

    updateProduct(product, { is_featured: product.is_featured === 1 ? 0 : 1 });
  };

  const setOffer = (product: Product, offerType: 'day' | 'week' | null) => {
    const currentOffer = product.offer_type;
    const newOffer = currentOffer === offerType ? null : offerType;
    
    let offerPrice = product.offer_price;
    
    if (newOffer && !offerPrice) {
      offerPrice = Math.round(product.price * 0.8);
    }
    
    if (!newOffer) {
      offerPrice = null;
    }

    updateProduct(product, { 
      offer_type: newOffer, 
      offer_price: offerPrice 
    });
  };

  const updateOfferPrice = (product: Product, price: number) => {
    updateProduct(product, { offer_price: price });
  };

  // Asegurar que filteredProducts siempre sea un array
  const filteredProducts = Array.isArray(products)
    ? (selectedCategory === 'Todas' 
        ? products 
        : products.filter(p => p.category === selectedCategory))
    : [];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>⏳ Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #faf5ff, #f0fdf4)', padding: '1.5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>⭐ Destacados y Ofertas</h1>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Gestiona los productos destacados y ofertas especiales</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            style={{ background: '#6b7280', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            ← Volver al Panel
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '0.5rem', color: '#991b1b' }}>
            ⚠️ Error: {error}
            <button 
              onClick={fetchProducts}
              style={{ marginLeft: '1rem', background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Filtro por categoría */}
        <div style={{ marginBottom: '2rem', background: 'white', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
            Filtrar por Categoría:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #16a34a',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              background: 'white'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Lista de productos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredProducts.map((product) => {
            const categoryFeaturedCount = products.filter(p => 
              p.category === product.category && p.is_featured === 1
            ).length;

            return (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                border: product.is_featured ? '2px solid #fbbf24' : '2px solid transparent'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
                  {/* Imagen */}
                  <img
                    src={product.image_url || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23e5e7eb" width="80" height="80"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="30">📦</text></svg>'}
                    alt={product.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }}
                  />

                  {/* Info */}
                  <div>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                      {product.name}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {product.category} | Precio: ${product.price.toLocaleString()}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {product.is_featured === 1 && (
                        <span style={{ background: '#fbbf24', color: '#1f2937', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          ⭐ Destacado
                        </span>
                      )}
                      {product.offer_type === 'day' && (
                        <span style={{ background: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          🔥 Oferta del Día
                        </span>
                      )}
                      {product.offer_type === 'week' && (
                        <span style={{ background: '#3b82f6', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          📅 Oferta de la Semana
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controles */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Destacado */}
                    <button
                      onClick={() => toggleFeatured(product)}
                      style={{
                        background: product.is_featured ? '#fbbf24' : '#e5e7eb',
                        color: product.is_featured ? '#1f2937' : '#6b7280',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <Star style={{ width: '1rem', height: '1rem' }} />
                      {product.is_featured ? 'Quitar Destacado' : 'Marcar Destacado'}
                    </button>

                    {/* Ofertas */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setOffer(product, 'day')}
                        style={{
                          background: product.offer_type === 'day' ? '#10b981' : '#e5e7eb',
                          color: product.offer_type === 'day' ? 'white' : '#6b7280',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          flex: 1
                        }}
                      >
                        🔥 Día
                      </button>
                      <button
                        onClick={() => setOffer(product, 'week')}
                        style={{
                          background: product.offer_type === 'week' ? '#3b82f6' : '#e5e7eb',
                          color: product.offer_type === 'week' ? 'white' : '#6b7280',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          flex: 1
                        }}
                      >
                        📅 Semana
                      </button>
                    </div>

                    {/* Precio oferta */}
                    {product.offer_type && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DollarSign style={{ width: '1rem', color: '#6b7280' }} />
                        <input
                          type="number"
                          value={product.offer_price || ''}
                          onChange={(e) => updateOfferPrice(product, parseFloat(e.target.value) || 0)}
                          placeholder="Precio oferta"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '2px solid #16a34a',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info de destacados por categoría */}
                {selectedCategory === 'Todas' && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    Destacados en {product.category}: {categoryFeaturedCount}/5
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && !error && (
          <div style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
            <p style={{ color: '#6b7280' }}>No hay productos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}