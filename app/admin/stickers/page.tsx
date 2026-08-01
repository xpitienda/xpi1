'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
}

interface Sticker {
  id: string;
  product_id: string;
  message: string;
  points: number;
  color_start: string;
  color_end: string;
  text_color: string;
  start_date: string;
  end_date: string;
  is_active: number;
}

export default function AdminStickers() {
  const router = useRouter();
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    product_id: '',
    message: '',
    points: 6,
    color_start: '#FF006E',
    color_end: '#FFBE0B',
    text_color: '#FFFFFF',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    is_active: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stickersRes, productsRes] = await Promise.all([
        fetch('/api/admin/stickers', { headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD } }),
        fetch('/api/admin/products', { headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD } })
      ]);
      
      if (stickersRes.ok) setStickers(await stickersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch('/api/admin/stickers', {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD 
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert(editingId ? '✅ Pegatina actualizada' : '✅ Pegatina creada');
        setShowForm(false);
        setEditingId(null);
        setFormData({
          product_id: '',
          message: '',
          points: 6,
          color_start: '#FF006E',
          color_end: '#FFBE0B',
          text_color: '#FFFFFF',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          is_active: 1
        });
        fetchData();
      } else {
        const error = await res.json();
        alert('❌ Error: ' + error.error);
      }
    } catch (err) {
      alert('❌ Error de conexión');
    }
  };

  const handleEdit = (sticker: Sticker) => {
    setEditingId(sticker.id);
    setFormData({
      product_id: sticker.product_id,
      message: sticker.message,
      points: sticker.points,
      color_start: sticker.color_start,
      color_end: sticker.color_end,
      text_color: sticker.text_color,
      start_date: sticker.start_date,
      end_date: sticker.end_date,
      is_active: sticker.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta pegatina?')) return;
    try {
      const res = await fetch(`/api/admin/stickers?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      if (res.ok) {
        alert('✅ Pegatina eliminada');
        fetchData();
      }
    } catch (err) {
      alert('❌ Error');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3D1A78' }}>⭐ Gestión de Pegatinas Relámpago</h1>
          <button onClick={() => router.push('/admin')} style={{ background: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>← Volver</button>
        </div>

        <button 
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ product_id: '', message: '', points: 6, color_start: '#FF006E', color_end: '#FFBE0B', text_color: '#FFFFFF', start_date: new Date().toISOString().split('T')[0], end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], is_active: 1 }); }} 
          style={{ background: '#3D1A78', color: 'white', padding: '1rem 2rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '2rem' }}
        >
          {showForm ? 'Cancelar' : '+ Crear Nueva Pegatina'}
        </button>

        {showForm && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#3D1A78' }}>{editingId ? 'Editar' : 'Nueva'} Pegatina</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Producto</label>
                <select 
                  value={formData.product_id} 
                  onChange={(e) => setFormData({...formData, product_id: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                >
                  <option value="">Selecciona un producto...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Mensaje (máx. 20 caracteres)</label>
                <input 
                  type="text" 
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value.slice(0, 20)})} 
                  required 
                  placeholder="Ej: ¡COMPRA YA!" 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Puntas de la estrella (3-10)</label>
                  <input 
                    type="number" 
                    min="3" 
                    max="10" 
                    value={formData.points} 
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value) || 6})} 
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', boxSizing: 'border-box' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Color Inicio</label>
                  <input 
                    type="color" 
                    value={formData.color_start} 
                    onChange={(e) => setFormData({...formData, color_start: e.target.value})} 
                    style={{ width: '100%', height: '42px', padding: '0.25rem', border: '1px solid #ddd', borderRadius: '0.5rem', boxSizing: 'border-box', cursor: 'pointer' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Color Fin</label>
                  <input 
                    type="color" 
                    value={formData.color_end} 
                    onChange={(e) => setFormData({...formData, color_end: e.target.value})} 
                    style={{ width: '100%', height: '42px', padding: '0.25rem', border: '1px solid #ddd', borderRadius: '0.5rem', boxSizing: 'border-box', cursor: 'pointer' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Color del Texto</label>
                  <input 
                    type="color" 
                    value={formData.text_color} 
                    onChange={(e) => setFormData({...formData, text_color: e.target.value})} 
                    style={{ width: '100%', height: '42px', padding: '0.25rem', border: '1px solid #ddd', borderRadius: '0.5rem', boxSizing: 'border-box', cursor: 'pointer' }} 
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.is_active === 1} 
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked ? 1 : 0})}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isActive" style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', color: '#1f2937' }}>
                    Pegatina Activa
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Fecha de Inicio</label>
                  <input 
                    type="date" 
                    value={formData.start_date} 
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})} 
                    required 
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', boxSizing: 'border-box' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Fecha de Fin</label>
                  <input 
                    type="date" 
                    value={formData.end_date} 
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})} 
                    required 
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', boxSizing: 'border-box' }} 
                  />
                </div>
              </div>

              <button type="submit" style={{ background: '#10B981', color: 'white', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>💾 Guardar Pegatina</button>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {stickers.length === 0 ? <div style={{ background: 'white', padding: '3rem', borderRadius: '0.75rem', textAlign: 'center' }}>No hay pegatinas creadas</div> : 
            stickers.map((sticker) => {
              const product = products.find(p => p.id === sticker.product_id);
              const isExpired = (() => {
              const today = new Date().toISOString().split('T')[0];
              return sticker.end_date < today;
            })();
              return (
                <div key={sticker.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center', opacity: sticker.is_active === 0 || isExpired ? 0.6 : 1 }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: `linear-gradient(135deg, ${sticker.color_start}, ${sticker.color_end})`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: sticker.text_color,
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    padding: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    {sticker.message}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{product ? product.name : 'Producto desconocido'}</h3>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      {sticker.points} puntas | Del {sticker.start_date} al {sticker.end_date}
                    </div>
                    <span style={{ 
                      background: sticker.is_active === 0 ? '#6b7280' : (isExpired ? '#ef4444' : '#10b981'), 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold' 
                    }}>
                      {sticker.is_active === 0 ? 'Pausada' : (isExpired ? 'Caducada' : 'Activa')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(sticker)} style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>✏️</button>
                    <button onClick={() => handleDelete(sticker.id)} style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>🗑️</button>
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
