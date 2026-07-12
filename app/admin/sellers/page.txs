'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Seller {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  id_number: string;
  assigned_series_id: string | null;
  prefix_letter: string | null;
  city_letter: string | null;
  is_active: number;
  created_at: string;
}

interface InvoiceSeries {
  id: string;
  prefix_letter: string;
  city_letter: string;
  current_number: number;
}

export default function SellersAdmin() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [series, setSeries] = useState<InvoiceSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    id_number: '',
    password: '',
    assigned_series_id: '',
  });

  const fetchData = async () => {
    try {
      const [sellersRes, seriesRes] = await Promise.all([
        fetch('/api/admin/sellers', { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}` } }),
        fetch('/api/admin/invoice-counter', { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}` } }),
      ]);

      if (sellersRes.ok) setSellers(await sellersRes.json());
      if (seriesRes.ok) setSeries(await seriesRes.json());
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenCreate = () => {
    setEditingSeller(null);
    setFormData({ full_name: '', email: '', phone: '', id_number: '', password: '', assigned_series_id: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (seller: Seller) => {
    setEditingSeller(seller);
    setFormData({
      full_name: seller.full_name,
      email: seller.email,
      phone: seller.phone,
      id_number: seller.id_number,
      password: '',
      assigned_series_id: seller.assigned_series_id || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.phone || !formData.id_number) {
      return alert('Todos los campos son obligatorios');
    }

    if (!editingSeller && !formData.password) {
      return alert('La contraseña es obligatoria para nuevos vendedores');
    }

    try {
      const url = '/api/admin/sellers';
      const method = editingSeller ? 'PUT' : 'POST';

      const payload = editingSeller
        ? { id: editingSeller.id, ...formData }
        : formData;

      // Si es edición y no hay contraseña, no enviarla
      if (editingSeller && !formData.password) {
        delete (payload as any).password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(editingSeller ? '✅ Vendedor actualizado' : '✅ Vendedor creado');
        setShowModal(false);
        fetchData();
      } else {
        alert('❌ Error: ' + (data.error || 'Desconocido'));
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const handleToggleActive = async (seller: Seller) => {
    const action = seller.is_active ? 'desactivar' : 'activar';
    if (!confirm(`¿${action.charAt(0).toUpperCase() + action.slice(1)} a ${seller.full_name}?`)) return;

    try {
      const res = await fetch('/api/admin/sellers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`,
        },
        body: JSON.stringify({ id: seller.id, is_active: !seller.is_active }),
      });

      if (res.ok) {
        alert(`✅ Vendedor ${action}do`);
        fetchData();
      } else {
        alert('❌ Error al actualizar estado');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar permanentemente a ${name}? Esta acción no se puede deshacer.`)) return;

    try {
      const res = await fetch('/api/admin/sellers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        alert('✅ Vendedor eliminado');
        fetchData();
      } else {
        alert('❌ Error al eliminar');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: '#333' }}>Cargando vendedores...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button onClick={() => router.push('/admin')} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', background: '#4B0082', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
          ← Volver al Panel
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>👥 Gestión de Vendedores</h1>
          <button onClick={handleOpenCreate} style={{ padding: '0.75rem 1.5rem', background: '#2E7D32', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
            + Nuevo Vendedor
          </button>
        </div>

        {/* Tabla de vendedores */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          {sellers.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No hay vendedores registrados.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>Nombre</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>Celular</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>Documento</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>Serie Asignada</th>
                    <th style={{ padding: '1rem', textAlign: 'center', color: '#374151' }}>Estado</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: '#374151' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((seller) => (
                    <tr key={seller.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem', fontWeight: 'bold', color: '#111827' }}>{seller.full_name}</td>
                      <td style={{ padding: '1rem', color: '#6b7280' }}>{seller.email}</td>
                      <td style={{ padding: '1rem', color: '#6b7280' }}>{seller.phone}</td>
                      <td style={{ padding: '1rem', color: '#6b7280' }}>{seller.id_number}</td>
                      <td style={{ padding: '1rem' }}>
                        {seller.prefix_letter && seller.city_letter ? (
                          <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', background: '#dbeafe', color: '#1e40af' }}>
                            {seller.prefix_letter}-{seller.city_letter}
                          </span>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Sin serie</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold',
                          background: seller.is_active ? '#dcfce7' : '#fee2e2',
                          color: seller.is_active ? '#166534' : '#dc2626',
                        }}>
                          {seller.is_active ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleOpenEdit(seller)} style={{ padding: '0.4rem 0.8rem', background: '#9333ea', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                            ✏️ Editar
                          </button>
                          <button onClick={() => handleToggleActive(seller)} style={{ padding: '0.4rem 0.8rem', background: seller.is_active ? '#fbbf24' : '#22c55e', color: '#1f2937', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                            {seller.is_active ? '⏸️ Desactivar' : '▶️ Activar'}
                          </button>
                          <button onClick={() => handleDelete(seller.id, seller.full_name)} style={{ padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: 'white', borderRadius: '1rem', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4B0082' }}>
                {editingSeller ? '✏️ Editar Vendedor' : '➕ Nuevo Vendedor'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>Nombre Completo *</label>
                <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>Celular *</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>Documento *</label>
                  <input type="text" value={formData.id_number} onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                    Contraseña {!editingSeller && '*'}
                  </label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingSeller ? 'Dejar vacío para no cambiar' : ''}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                    required={!editingSeller} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>Serie de Facturas Asignada</label>
                <select value={formData.assigned_series_id} onChange={(e) => setFormData({ ...formData, assigned_series_id: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box', background: 'white' }}>
                  <option value="">-- Sin serie asignada --</option>
                  {series.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.prefix_letter}-{s.city_letter} (Actual: {String(s.current_number).padStart(5, '0')})
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  💡 El vendedor solo podrá usar esta serie para facturar.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #4B0082, #2E7D32)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  {editingSeller ? 'Actualizar' : 'Crear Vendedor'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#9ca3af', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}