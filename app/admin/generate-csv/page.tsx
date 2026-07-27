'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ImageItem {
  url: string;
  originalName: string;
  name: string;
  price: string;
  stock: string;
  description: string;
  category: string;
}

export default function GenerateCsvPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories', {
          cache: 'no-store',
          headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data.map((c: any) => c.name));
        }
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setLoading(true);
    setMessage(null);
    setImageItems([]);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const res = await fetch('/api/admin/batch-upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const items = data.urls.map((u: { url: string; originalName: string }) => ({
          url: u.url,
          originalName: u.originalName,
          name: u.originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          price: '',
          stock: '',
          description: '',
          category: categories.length > 0 ? categories[0] : 'General'
        }));
        
        setImageItems(items);
        setMessage({ type: 'success', text: `✅ ${data.count} imágenes subidas. Define los valores antes de generar el CSV.` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al subir' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index: number, field: keyof ImageItem, value: string) => {
    setImageItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const applyFirstToAll = () => {
    if (imageItems.length === 0) return;
    
    const firstItem = imageItems[0];
    setImageItems(prev => prev.map((item, index) => 
      index === 0 ? item : {
        ...item,
        name: firstItem.name,
        price: firstItem.price,
        stock: firstItem.stock,
        description: firstItem.description,
        category: firstItem.category
      }
    ));
    
    setMessage({ type: 'success', text: `✅ Valores del primer producto aplicados a los ${imageItems.length} productos` });
  };

  const applyCategoryToAll = (category: string) => {
    setImageItems(prev => prev.map(item => ({ ...item, category })));
  };

  const downloadCsv = () => {
    if (imageItems.length === 0) return;

    let csv = "image_url,name,price,stock,description,category\n";

    imageItems.forEach(u => {
      csv += `${u.url},"${u.name}",${u.price || 0},${u.stock || 0},"${u.description}","${u.category}"\n`;
    });

    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = "productos_con_urls.csv";
    link.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '12px' }}>
        <h1 style={{ color: '#3D1A78', marginBottom: '1rem' }}>📸 Generar CSV desde Fotos</h1>
        <p style={{ marginBottom: '1rem' }}>Sube tus fotos. Define los valores y te daremos un CSV listo.</p>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          disabled={loading}
          style={{ width: '100%', padding: '1rem', border: '2px dashed #ccc', borderRadius: '8px', marginBottom: '1rem' }}
        />

        {message && (
          <div style={{
            padding: '1rem',
            background: message.type==='success' ? '#dcfce7' : '#fee2e2',
            borderRadius:'8px',
            marginBottom:'1rem'
          }}>
            {message.text}
          </div>
        )}

        {imageItems.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: '#3D1A78' }}>Define los valores para cada producto:</h2>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              marginBottom: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>⚡ ¿Todos los productos tienen los mismos datos?</h3>
              <p style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Edita el PRIMER producto y luego haz clic aquí para copiar sus valores a todos los demás
              </p>
              <button
                onClick={applyFirstToAll}
                style={{
                  background: 'white',
                  color: '#667eea',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                 Copiar primer producto a TODOS los demás
              </button>
            </div>

            <div style={{ 
              background: '#eff6ff', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem', 
              border: '1px solid #bfdbfe',
              display: 'flex',
              gap: '1rem',
              alignItems: 'end'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>📂 Aplicar categoría a todos:</label>
                <select
                  onChange={(e) => applyCategoryToAll(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {imageItems.map((item, index) => (
              <div key={index} style={{ 
                background: index === 0 ? '#fef3c7' : '#f9fafb',
                padding: '1.5rem', 
                borderRadius: '8px', 
                marginBottom: '1rem',
                border: index === 0 ? '2px solid #f59e0b' : '1px solid #eee'
              }}>
                {index === 0 && (
                  <div style={{ 
                    background: '#f59e0b', 
                    color: 'white', 
                    padding: '0.5rem', 
                    borderRadius: '6px', 
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    ⭐ PRIMER PRODUCTO - Edita aquí y usa el botón de arriba para copiar a todos
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <img src={item.url} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '1rem' }} />
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{item.originalName}</span>
                    {index === 0 && <span style={{ display: 'block', fontSize: '0.8rem', color: '#f59e0b', marginTop: '0.25rem' }}>Este es el producto maestro</span>}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nombre del producto</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Precio ($)</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Stock</label>
                    <input
                      type="number"
                      value={item.stock}
                      onChange={(e) => handleInputChange(index, 'stock', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Descripción</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    rows={2}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Categoría</label>
                  <select
                    value={item.category}
                    onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', background: 'white' }}
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    ) : (
                      <option value="General">General</option>
                    )}
                  </select>
                </div>
              </div>
            ))}
            
            <button
              onClick={downloadCsv}
              style={{
                background: '#10B981',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              📥 Descargar CSV con URLs y valores definidos
            </button>
          </div>
        )}

        <button
          onClick={() => router.push('/admin')}
          style={{
            marginTop: '2rem',
            background: '#eee',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}