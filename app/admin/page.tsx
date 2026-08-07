'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  stock: number;
  is_active: number;
  on_sale?: number;
  sale_price?: number;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'General',
    stock: '',
    image_url: '',
    is_active: 1,
  });
  const [categories, setCategories] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products', {
        cache: 'no-store',
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      const data = await res.json();
      const activeProducts = Array.isArray(data) ? data.filter((p: Product) => p.is_active === 1) : [];
      setProducts(activeProducts);
    } catch (err: any) {
      console.error('Error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchProducts();
      fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories', {
        cache: 'no-store',
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data.map((c: any) => c.name) : []);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Eliminar "${name}" permanentemente?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}` }
      });
      
      const responseData = await res.json();
      
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('Producto eliminado correctamente');
      } else {
        alert('Error: ' + (responseData.error || 'No se pudo eliminar'));
      }
    } catch (err: any) {
      alert('Error de conexión: ' + err.message);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || 'General',
      stock: product.stock.toString(),
      image_url: product.image_url || '',
      is_active: product.is_active,
    });
    setImagePreview(product.image_url || '');
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'General',
      stock: '',
      image_url: '',
      is_active: 1,
    });
    setImagePreview('');
    setImageError({});
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      
      const res = await fetch('/api/admin/upload', { 
        method: 'POST', 
        body: formDataUpload,
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}` }
      });
      
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData(prev => ({ ...prev, image_url: data.url }));
      } else {
        alert('Error al subir imagen: ' + (data.error || 'Error desconocido'));
        setImagePreview('');
      }
    } catch (err: any) {
      alert('Error de conexión al subir imagen: ' + err.message);
      setImagePreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('El nombre es obligatorio');
    
    const priceNum = parseFloat(formData.price);
    const stockNum = parseInt(formData.stock);
    
    if (isNaN(priceNum) || priceNum <= 0) return alert('El precio debe ser mayor a 0');
    if (isNaN(stockNum) || stockNum < 0) return alert('Stock inválido');

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const bodyData = {
        name: String(formData.name).trim(),
        description: String(formData.description || '').trim(),
        price: Number(priceNum),
        category: String(formData.category || 'General'),
        stock: Number(stockNum),
        image_url: String(formData.image_url || ''),
        is_active: Number(formData.is_active || 0),
      };

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}` 
        },
        body: JSON.stringify(bodyData),
      });
      
      const responseData = await res.json();

      if (res.ok) {
        if (editingProduct) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...bodyData, id: editingProduct.id } : p));
          alert('Producto actualizado');
        } else {
          setProducts(prev => [...prev, { ...bodyData, id: responseData.id }]);
          alert('Producto creado correctamente');
        }
        setShowModal(false);
        setImagePreview('');
        fetchProducts(); 
      } else {
        alert('Error: ' + (responseData.error || 'Error al guardar'));
      }
    } catch (err: any) {
      alert('Error de conexión: ' + err.message);
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_pass=; path=/; max-age=0';
    router.push('/');
  };

  const handleImageError = (productId: string) => {
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  const cardStyle = { background: 'white', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
  const labelStyle = { fontSize: '0.875rem', color: '#6b7280' };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>;
  }

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #faf5ff, #f0fdf4)', padding: '1.5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Panel de Control</h1>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => router.push('/admin/categories')} style={{ background: 'linear-gradient(135deg, #9333ea, #16a34a)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #16a34a', cursor: 'pointer' }}>📂 Categorías</button>
            <button onClick={() => router.push('/admin/invoices')} style={{ background: 'linear-gradient(135deg, #4B0082, #2E7D32)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #2E7D32', cursor: 'pointer' }}>🧾 Factureros</button>
            <button onClick={() => router.push('/admin/sellers')} style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #7c3aed', cursor: 'pointer' }}>👥 Vendedores</button>
            <button onClick={() => router.push('/admin/sales')} style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #10b981', cursor: 'pointer' }}>📊 Ventas</button>
            <button onClick={() => router.push('/admin/stickers')} style={{ background: 'linear-gradient(135deg, #FF006E, #FFBE0B)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #FFBE0B', cursor: 'pointer' }}>⭐ Pegatinas</button>
          </div>
          <button onClick={handleLogout} style={{ background: '#4b5563', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Cerrar Sesión</button>
        <button 
          onClick={() => router.push('/admin/banners')} 
          style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: 'white', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          <span>📢</span>
          <span>Gestión de Banners y Anuncios</span>
        </button>
        <button 
          onClick={() => router.push('/admin/advanced-banners')} 
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          <span>🖼️</span>
          <span>Gestión de Banners Visuales (Imágenes)</span>
        </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={cardStyle}>
            <div style={labelStyle}>Total Productos</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7e22ce' }}>{products.length}</div>
          </div>
          <div style={{ ...cardStyle, border: lowStockCount > 0 ? '2px solid #f59e0b' : 'none' }}>
            <div style={labelStyle}>⚠️ Stock Bajo (≤ 5)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: lowStockCount > 0 ? '#d97706' : '#15803d' }}>{lowStockCount}</div>
          </div>
          <div style={{ ...cardStyle, border: outOfStockCount > 0 ? '2px solid #dc2626' : 'none' }}>
            <div style={labelStyle}>🚫 Sin Stock (0)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: outOfStockCount > 0 ? '#dc2626' : '#15803d' }}>{outOfStockCount}</div>
          </div>
          <div style={cardStyle}>
            <div style={labelStyle}>Valor Inventario</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1d4ed8' }}>
              ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Gestión de Productos</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/admin/featured')} style={{ background: '#fbbf24', color: '#1f2937', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Destacados</button>
            <button onClick={() => router.push('/admin/add-product')} style={{ background: '#8B5CF6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Carga Masiva</button>
            <button onClick={() => router.push('/admin/generate-csv')} style={{ background: '#EC4899', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>CSV Fotos</button>
            
            {/* ✅ SECCIÓN INDEPENDIENTE: PROCESADORES DE IMÁGENES */}
            <div style={{ display: 'flex', gap: '0.5rem', borderLeft: '2px solid #e5e7eb', paddingLeft: '1rem' }}>
              <button 
                onClick={() => router.push('/admin/process-images')} 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.5rem', 
                  fontWeight: 'bold', 
                  border: 'none', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                title="Procesa y comprime imágenes en tu PC, descarga un ZIP"
              >
                💻 Procesador Local
              </button>
              <button 
                onClick={() => router.push('/admin/process-images-cloud')} 
                style={{ 
                  background: 'linear-gradient(135deg, #059669, #10b981)', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.5rem', 
                  fontWeight: 'bold', 
                  border: 'none', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                title="Comprime y sube imágenes directamente a Cloudflare R2 desde el navegador"
              >
                ☁️ Procesador Cloud
              </button>
            </div>

            <button onClick={handleAddNew} style={{ background: '#16a34a', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>+ Nuevo Producto</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {products.map((product) => {
            const hasImageError = imageError[product.id];
            const showPlaceholder = !product.image_url || hasImageError;
            return (
              <div key={product.id} style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '2px solid #16a34a', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '192px', position: 'relative', background: showPlaceholder ? '#e5e7eb' : '#f3f4f6' }}>
                  {showPlaceholder ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '3rem' }}>📷</div>
                  ) : (
                    <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => handleImageError(product.id)} />
                  )}

                  {product.stock === 0 && product.is_active === 1 && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(220, 38, 38, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      🚫 SIN STOCK
                    </div>
                  )}
                  {product.stock > 0 && product.stock <= 5 && product.is_active === 1 && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#f59e0b', color: 'white', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      ⚠️ Stock: {product.stock}
                    </div>
                  )}
                  {!product.is_active && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      INACTIVO
                    </div>
                  )}
                </div>
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{product.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>{product.category}</p>
                    <p style={{ color: '#15803d', fontWeight: 'bold', fontSize: '1.3rem' }}>${product.price.toLocaleString()}</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: product.stock === 0 ? '#dc2626' : (product.stock <= 5 ? '#d97706' : '#16a34a') }}>
                      Stock: {product.stock}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={() => handleEdit(product)} style={{ flex: 1, background: '#9333ea', color: 'white', padding: '0.6rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => handleDelete(product.id, product.name)} style={{ flex: 1, background: '#dc2626', color: 'white', padding: '0.6rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '1rem', marginTop: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151' }}>No hay productos</h3>
            <button onClick={handleAddNew} style={{ marginTop: '1rem', background: '#16a34a', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Agregar Primer Producto</button>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }} onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setImagePreview(''); } }}>
          <div style={{ background: 'white', borderRadius: '1rem', maxWidth: '42rem', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7e22ce' }}>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => { setShowModal(false); setImagePreview(''); }} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.25rem' }}>Nombre *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.25rem' }}>Descripción</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.25rem' }}>Precio *</label>
                  <input type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.25rem' }}>Stock *</label>
                  <input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.25rem' }}>Categoría</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box', background: 'white' }}>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.25rem' }}>Imagen</label>
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.5rem', border: '2px solid #16a34a' }} />}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
                {uploading && <p style={{ color: '#9333ea', fontSize: '0.875rem', marginTop: '0.25rem' }}>Subiendo...</p>}
              </div>
              <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.is_active === 1} onChange={(e) => setFormData({...formData, is_active: e.target.checked ? 1 : 0})} style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Producto Activo</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" disabled={uploading} style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(to right, #9333ea, #16a34a)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', opacity: uploading ? 0.5 : 1 }}>
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setImagePreview(''); }} style={{ flex: 1, padding: '0.75rem', background: '#9ca3af', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}