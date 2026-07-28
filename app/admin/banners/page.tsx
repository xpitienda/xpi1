'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Banner {
  id: string;
  text: string;
  type: 'rolling' | 'static';
  background_color: string;
  text_color: string;
  link_url: string;
  display_order: number;
  is_active: number;
}

export default function AdminBanners() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  
  const [formData, setFormData] = useState({
    text: '',
    type: 'rolling' as 'rolling' | 'static',
    background_color: '#3D1A78',
    text_color: '#ffffff',
    link_url: '',
    display_order: '0'
  });

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/banners', {
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      if (res.ok) setBanners(await res.json());
    } catch (err) {
      console.error('Error cargando banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingBanner ? 'PUT' : 'POST';
      const body = editingBanner ? { ...formData, id: editingBanner.id, is_active: editingBanner.is_active } : formData;

      const res = await fetch('/api/admin/banners', {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert(editingBanner ? '✅ Banner actualizado' : '✅ Banner creado');
        setShowForm(false);
        setEditingBanner(null);
        setFormData({ text: '', type: 'rolling', background_color: '#3D1A78', text_color: '#ffffff', link_url: '', display_order: '0' });
        fetchBanners();
      } else {
        const error = await res.json();
        alert('❌ Error: ' + error.error);
      }
    } catch (err: any) {
      alert('❌ Error de conexión: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      if (res.ok) {
        alert('✅ Banner eliminado');
        fetchBanners();
      }
    } catch (err: any) {
      alert('❌ Error: ' + err.message);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD },
        body: JSON.stringify({ ...banner, is_active: banner.is_active === 1 ? 0 : 1 })
      });
      fetchBanners();
    } catch (err: any) {
      alert('❌ Error: ' + err.message);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3D1A78' }}>📢 Gestión de Banners</h1>
          <button onClick={() => router.push('/admin')} style={{ background: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>← Volver</button>
        </div>

        <button onClick={() => { setShowForm(!showForm); setEditingBanner(null); }} style={{ background: '#3D1A78', color: 'white', padding: '1rem 2rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '2rem' }}>
          {showForm ? 'Cancelar' : '+ Crear Nuevo Banner'}
        </button>

        {showForm && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#3D1A78' }}>{editingBanner ? 'Editar' : 'Nuevo'} Banner</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <input type="text" value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} required placeholder="Texto del banner" style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
                  <option value="rolling">📜 Rolling (Marquee)</option>
                  <option value="static">📌 Estático</option>
                </select>
                <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: e.target.value})} min="0" placeholder="Orden" style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="color" value={formData.background_color} onChange={e => setFormData({...formData, background_color: e.target.value})} style={{ height: '45px', border: '1px solid #ddd', borderRadius: '0.5rem', cursor: 'pointer' }} />
                <input type="color" value={formData.text_color} onChange={e => setFormData({...formData, text_color: e.target.value})} style={{ height: '45px', border: '1px solid #ddd', borderRadius: '0.5rem', cursor: 'pointer' }} />
              </div>
              <input type="url" value={formData.link_url} onChange={e => setFormData({...formData, link_url: e.target.value})} placeholder="URL de destino (opcional)" style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
              <button type="submit" style={{ background: '#10B981', color: 'white', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>💾 Guardar</button>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {banners.length === 0 ? <div style={{ background: 'white', padding: '3rem', borderRadius: '0.75rem', textAlign: 'center' }}>No hay banners</div> : 
            banners.map((banner) => (
              <div key={banner.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', opacity: banner.is_active === 0 ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ background: banner.background_color, color: banner.text_color, padding: '1rem', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                      {banner.type === 'rolling' ? '📜 ' : '📌 '}{banner.text}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => toggleActive(banner)} style={{ background: banner.is_active === 1 ? '#10B981' : '#6b7280', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
                      {banner.is_active === 1 ? '✅ Activo' : '❌ Inactivo'}
                    </button>
                    <button onClick={() => { setEditingBanner(banner); setFormData({ text: banner.text, type: banner.type, background_color: banner.background_color, text_color: banner.text_color, link_url: banner.link_url || '', display_order: banner.display_order.toString() }); setShowForm(true); }} style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>✏️ Editar</button>
                    <button onClick={() => handleDelete(banner.id)} style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>🗑️ Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}