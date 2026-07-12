'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  is_active: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categories, setCategories] = useState<string[]>(['Todas']);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.filter((p: Product) => p.is_active === 1));
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(['Todas', ...data.map((c: any) => c.name)]);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Cargando catálogo...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* HEADER */}
      <header style={{ background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>XPI Tienda</h1>
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/catalog" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>Catálogo</Link>
            <Link href="/cart" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>🛒 Carrito</Link>
            
            {/* 👇 NUEVO BOTÓN PARA VENDEDORES 👇 */}
            <Link 
              href="/login-seller" 
              style={{ 
                background: 'linear-gradient(135deg, #1e40af, #7c3aed)', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.5rem', 
                textDecoration: 'none', 
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
            >
              Acceso Vendedores
            </Link>
            
            <Link 
              href="/admin/login" 
              style={{ 
                background: '#4b5563', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.5rem', 
                textDecoration: 'none', 
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Bienvenido a XPI Tienda</h2>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem' }}>Encuentra los mejores productos al mejor precio</p>
          <Link 
            href="/catalog" 
            style={{ 
              background: 'white', 
              color: '#1e40af', 
              padding: '1rem 2rem', 
              borderRadius: '0.5rem', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            Ver Catálogo
          </Link>
        </div>
      </section>

      {/* FILTROS Y BÚSQUEDA */}
      <section style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
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

        {/* GRID DE PRODUCTOS */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}></div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No se encontraron productos</h3>
            <p>Intenta con otra búsqueda o categoría</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {filteredProducts.map(product => (
              <Link 
                key={product.id} 
                href={`/catalog/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ 
                  background: 'white', 
                  borderRadius: '0.75rem', 
                  overflow: 'hidden', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}>
                  <div style={{ height: '200px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '3rem', color: '#9ca3af' }}>📷</span>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{product.name}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                      {product.description?.substring(0, 80)}{product.description && product.description.length > 80 ? '...' : ''}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>
                        ${product.price.toLocaleString('es-CO')}
                      </span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px',
                        background: product.stock > 0 ? '#dcfce7' : '#fee2e2',
                        color: product.stock > 0 ? '#166534' : '#991b1b',
                        fontWeight: 'bold'
                      }}>
                        {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1f2937', color: 'white', padding: '3rem 2rem', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>XPI Tienda</h3>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Línea Alternativas Inteligentes</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <Link href="/catalog" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Catálogo</Link>
            <Link href="/cart" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Carrito</Link>
            <Link href="/login-seller" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Vendedores</Link>
            <Link href="/admin/login" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Administración</Link>
          </div>
          <p style={{ marginTop: '2rem', opacity: 0.6, fontSize: '0.875rem' }}>© 2026 XPI Tienda. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}