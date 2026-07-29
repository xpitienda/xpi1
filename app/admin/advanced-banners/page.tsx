'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAdvancedBanners() {
  const router = useRouter();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    start_date: '',
    end_date: '',
    display_order: '0',
    is_active: true
  });

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/advanced-banners', {
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      if (res.ok) setBanners(await res.json());
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      // Reutilizamos el endpoint de subida que ya tienes para productos
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      
      if (res.ok) {
        const data = await res.json();
        // Asumimos que la API devuelve la URL en data.url o data.filePath
        const imageUrl = data.url || data.filePath || data.publicUrl; 
        setFormData({ ...formData, image_url: imageUrl });
        alert('✅ Imagen subida correctamente');
      } else {
        alert('❌ Error al subir la imagen');
      }
    } catch (err) {
      alert('❌ Error de conexión al subir');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert('⚠️ Primero debes subir una imagen');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch('/api/admin/advanced-banners', {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert(editingId ? '✅ Banner actualizado' : '✅ Banner creado');
        setShowForm(false);
        setEditingId(null);
        setFormData({ title: '', image_url: '', link_url: '', start_date: '', end_date: '', display_order: '0', is_active: true });
        fetchBanners();
      } else {
        const error = await res.json();
        alert('❌ Error: ' + error.error);
      }
    } catch (err) {
      alert('❌ Error de conexión');
    }
  };

  const handleEdit = (banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      image_url: banner.image_url,
      link_url: banner.link_url || '',
      start_date: banner.start_date || '',
      end_date: banner.end_date || '',
      display_order: banner.display_order.toString(),
      is_active: banner.is_active === 1
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este banner?')) return;
    try {
      const res = await fetch(`/api/admin/advanced-banners?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      if (res.ok) {
        alert('✅ Banner eliminado');
        fetchBanners();
      }
    } catch (err) {
      alert('❌ Error');
    }
  };

  const toggleActive = async (banner) => {
    try {
      await fetch('/api/admin/advanced-banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD },
        body: JSON.stringify({ ...banner, is_active: banner.is_active === 1 ? 0 : 1 })
      });
      fetchBanners();
    } catch (err) {
      alert('❌ Error');
    }
  };

  const getStatusBadge = (banner) => {
    const today = new Date().toISOString().split('T')[0];
    if (banner.is_active === 0) return { text: '⏸️ Pausado', color: '#6b7280' };
    if (banner.start_date && banner.start_date > today) return { text: '📅 Programado', color: '#3b82f6' };
    if (banner.end_date && banner.end_date < today) return { text: '⏰ Caducado', color: '#ef4444' };
    return { text: '✅ Visible en Catálogo', color: '#10b981' };
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3D1A78' }}>🖼️ Banners Visuales (Imágenes)</h1>
          <button onClick={() => router.push('/admin')} style={{ background: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>← Volver</button>
        </div>

        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', image_url: '', link_url: '', start_date: '', end_date: '', display_order: '0', is_active: true }); }} style={{ background: '#3D1A78', color: 'white', padding: '1rem 2rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '2rem' }}>
          {showForm ? 'Cancelar' : '+ Crear Nuevo Banner Visual'}
        </button>

        {showForm && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#3D1A78' }}>{editingId ? 'Editar' : 'Nuevo'} Banner</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Título interno (ej: Oferta Tenis Nike)" style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
              
              {/* SECCIÓN DE SUBIDA DE IMAGEN */}
              <div style={{ border: '2px dashed #ddd', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center', background: '#fafafa' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>Imagen del Banner</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange} 
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()} 
                  disabled={uploading}
                  style={{ background: uploading ? '#9ca3af' : '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                  {uploading ? '⏳ Subiendo...' : '📁 Seleccionar archivo de mi PC'}
                </button>
                {formData.image_url && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>✅ Imagen lista</p>
                    <img src={formData.image_url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '0.5rem', border: '1px solid #eee' }} />
                  </div>
                )}
              </div>

              <input type="url" value={formData.link_url} onChange={e => setFormData({...formData, link_url: e.target.value})} placeholder="URL de destino al hacer clic (opcional)" style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Fecha Inicio</label>
                  <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Fecha Fin</label>
                  <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Orden</label>
                  <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.is_active} 
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <label htmlFor="isActive" style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', color: '#1f2937' }}>
                   Mostrar este banner en el catálogo
                </label>
              </div>

              <button type="submit" style={{ background: '#10B981', color: 'white', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>💾 Guardar Banner</button>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {banners.length === 0 ? <div style={{ background: 'white', padding: '3rem', borderRadius: '0.75rem', textAlign: 'center' }}>No hay banners visuales</div> : 
            banners.map((banner) => {
              const status = getStatusBadge(banner);
              return (
                <div key={banner.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center', opacity: banner.is_active === 0 ? 0.7 : 1 }}>
                  <img src={banner.image_url} alt={banner.title} style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #eee' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{banner.title}</h3>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      {banner.start_date && <span>Desde: {banner.start_date} | </span>}
                      {banner.end_date && <span>Hasta: {banner.end_date}</span>}
                    </div>
                    <span style={{ background: status.color, color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>{status.text}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => toggleActive(banner)} style={{ background: banner.is_active === 1 ? '#f59e0b' : '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                      {banner.is_active === 1 ? '⏸️ Pausar' : '▶️ Activar'}
                    </button>
                    <button onClick={() => handleEdit(banner)} style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>✏️</button>
                    <button onClick={() => handleDelete(banner.id)} style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}
