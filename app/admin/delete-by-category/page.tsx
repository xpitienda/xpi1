// app/admin/delete-by-category/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryInfo {
  name: string;
  count: number;
}

export default function DeleteByCategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [orphanImages, setOrphanImages] = useState<string[]>([]);
  const [showOrphans, setShowOrphans] = useState(false);

  // Cargar categorías y contar productos
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Obtener categorías reales
        const catRes = await fetch('/api/admin/categories', {
          headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
        });
        const categoriesData = await catRes.json();
        
        // 2. Obtener todos los productos
        const prodRes = await fetch('/api/admin/products', {
          headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
        });
        const productsData = await prodRes.json();

        // 3. Contar productos por categoría
        const categoryMap: Record<string, number> = {};
        
        // Inicializar con categorías existentes
        categoriesData.forEach((cat: any) => {
          categoryMap[cat.name] = 0;
        });

        // Contar productos por categoría
        productsData.forEach((product: any) => {
          const cat = product.category || 'Sin categoría';
          categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });

        // Convertir a array
        const categoryList = Object.entries(categoryMap)
          .filter(([_, count]) => count > 0) // Solo categorías con productos
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count); // Ordenar por cantidad

        setCategories(categoryList);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('No se pudieron cargar las categorías');
      }
    };
    loadData();
  }, []);

  // Cargar imágenes huérfanas de R2
  const loadOrphanImages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orphan-images', {
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      const data = await res.json();
      
      if (res.ok) {
        setOrphanImages(data.orphans || []);
        setShowOrphans(true);
      } else {
        setError(data.error || 'Error cargando imágenes huérfanas');
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) {
      setError('Selecciona una categoría');
      return;
    }

    const confirm = window.confirm(
      `⚠️ ¿Estás SEGURO de eliminar TODOS los productos de la categoría "${selectedCategory}"?\n\n` +
      `Esta acción:\n` +
      `• Eliminará los productos de la base de datos\n` +
      `• Eliminará las imágenes de Cloudflare R2\n` +
      `• NO se puede deshacer\n\n` +
      `¿Continuar?`
    );

    if (!confirm) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/delete-by-category', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        },
        body: JSON.stringify({ category: selectedCategory }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message}\n📦 ${data.productsDeleted} productos eliminados\n🖼️ ${data.imagesDeleted} imágenes borradas de R2`);
        setSelectedCategory('');
        // Recargar datos
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setError(` Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrphans = async () => {
    if (orphanImages.length === 0) return;

    const confirm = window.confirm(
      `⚠️ ¿Eliminar ${orphanImages.length} imágenes huérfanas de R2?\n\n` +
      `Estas imágenes no están asociadas a ningún producto.\n` +
      `Esta acción NO se puede deshacer.\n\n` +
      `¿Continuar?`
    );

    if (!confirm) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/delete-orphans', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        },
        body: JSON.stringify({ keys: orphanImages }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Eliminadas ${data.deleted} imágenes huérfanas de R2`);
        setOrphanImages([]);
        setShowOrphans(false);
      } else {
        setError(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setError(`❌ Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #faf5ff, #f0fdf4)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Botón de regreso */}
        <button
          onClick={() => router.push('/admin')}
          style={{
            marginBottom: '1.5rem',
            background: 'none',
            border: 'none',
            color: '#7e22ce',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>←</span>
          <span>Volver al Panel Admin</span>
        </button>

        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          border: '2px solid #d8b4fe'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#7e22ce',
            marginBottom: '0.5rem'
          }}>
            🗑️ Eliminación Masiva por Categoría
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Elimina todos los productos de una categoría específica, incluyendo sus imágenes en la nube.
          </p>

          {/* Selector de categoría */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Selecciona la categoría a eliminar
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none',
                background: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="">-- Selecciona una categoría --</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name} ({cat.count} productos)
                </option>
              ))}
            </select>
          </div>

          {/* Botón de eliminar categoría */}
          <button
            onClick={handleDelete}
            disabled={!selectedCategory || loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading || !selectedCategory ? '#9ca3af' : '#dc2626',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: loading || !selectedCategory ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              marginBottom: '1.5rem'
            }}
          >
            {loading ? (
              <>
                <span>⏳</span>
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <span>🗑️</span>
                <span>Eliminar Categoría Completa</span>
              </>
            )}
          </button>

          {/* Sección de imágenes huérfanas */}
          <div style={{
            borderTop: '2px solid #e5e7eb',
            paddingTop: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              🖼️ Imágenes Huérfanas en R2
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Imágenes que existen en Cloudflare R2 pero no están asociadas a ningún producto
            </p>

            {!showOrphans ? (
              <button
                onClick={loadOrphanImages}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6366f1',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {loading ? 'Cargando...' : '🔍 Buscar Imágenes Huérfanas'}
              </button>
            ) : (
              <div>
                <div style={{
                  background: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {orphanImages.length === 0 ? (
                    <p style={{ color: '#10b981', fontWeight: 'bold', margin: 0 }}>
                      ✅ No hay imágenes huérfanas. ¡Todo limpio!
                    </p>
                  ) : (
                    <>
                      <p style={{ color: '#dc2626', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        ⚠️ {orphanImages.length} imágenes huérfanas encontradas:
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                        {orphanImages.map((img, idx) => (
                          <li key={idx} style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                            {img}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {orphanImages.length > 0 && (
                  <button
                    onClick={handleDeleteOrphans}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#dc2626',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.5 : 1
                    }}
                  >
                    ️ Eliminar {orphanImages.length} Imágenes Huérfanas
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mensajes */}
          {message && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#dcfce7',
              border: '2px solid #86efac',
              borderRadius: '0.5rem'
            }}>
              <pre style={{
                color: '#166534',
                whiteSpace: 'pre-wrap',
                fontWeight: '500',
                margin: 0
              }}>
                {message}
              </pre>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#fee2e2',
              border: '2px solid #fca5a5',
              borderRadius: '0.5rem'
            }}>
              <p style={{ color: '#991b1b', fontWeight: '500', margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          {/* Advertencia */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '0.5rem'
          }}>
            <p style={{ color: '#92400e', fontSize: '0.875rem', margin: 0 }}>
              ️ <strong>Advertencia:</strong> Estas acciones son permanentes. Las imágenes eliminadas de R2 no se pueden recuperar (por eso es importante tener backups).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}