'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface InvoiceCounter {
  id: string;
  prefix_letter: string;
  city_letter: string;
  current_number: number;
  is_active: boolean;
  created_at: string;
}

export default function InvoicesAdmin() {
  const [counters, setCounters] = useState<InvoiceCounter[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPrefix, setNewPrefix] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newStartNumber, setNewStartNumber] = useState(0);
  const router = useRouter();

  const fetchCounters = async () => {
    try {
      const res = await fetch('/api/admin/invoice-counter', {
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      if (res.ok) {
        const data = await res.json();
        setCounters(data);
      }
    } catch (err) {
      console.error('Error cargando factureros:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCounters(); }, []);

  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrefix || !newCity) return alert('Completa todos los campos');
    
    try {
      const res = await fetch('/api/admin/invoice-counter', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD 
        },
        body: JSON.stringify({
          prefix_letter: newPrefix.toUpperCase(),
          city_letter: newCity.toUpperCase(),
          start_number: newStartNumber
        }),
      });

      if (res.ok) {
        alert('✅ Nueva serie activada correctamente');
        setNewPrefix('');
        setNewCity('');
        setNewStartNumber(0);
        fetchCounters();
      } else {
        alert('❌ Error al crear la serie');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  // NUEVA FUNCIÓN PARA ELIMINAR SERIES
  const handleDeleteSeries = async (id: string, serieName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la serie ${serieName}? Esta acción no se puede deshacer.`)) return;
    
    try {
      const res = await fetch('/api/admin/invoice-counter', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD 
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        alert('✅ Serie eliminada correctamente');
        fetchCounters();
      } else {
        alert('❌ Error al eliminar la serie');
      }
    } catch (err) {
      alert('Error de conexión al eliminar');
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: '#333' }}>Cargando factureros...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button onClick={() => router.push('/admin')} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', background: '#4B0082', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
          ← Volver al Panel
        </button>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem' }}>Gestión de Factureros</h1>

        {/* Formulario para nueva serie */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151', marginBottom: '1.5rem' }}>Activar Nueva Serie</h2>
          <form onSubmit={handleCreateSeries} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Letra Departamento</label>
              <input type="text" value={newPrefix} onChange={(e) => setNewPrefix(e.target.value)} maxLength={3} placeholder="Ej: T" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Letra Ciudad</label>
              <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} maxLength={3} placeholder="Ej: I" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Número Inicial</label>
              <input type="number" value={newStartNumber} onChange={(e) => setNewStartNumber(Number(e.target.value))} min={0} max={99999} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
            </div>
            <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#2E7D32', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Activar Serie
            </button>
          </form>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
            ⚠️ Al activar una nueva serie, la anterior quedará inactiva automáticamente.
          </p>
        </div>

        {/* Lista de series existentes */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151', marginBottom: '1.5rem' }}>Historial de Series</h2>
          {counters.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No hay series registradas.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>Serie</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>Último Número</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>Estado</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>Fecha Creación</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: '#374151' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {counters.map((counter) => (
                    <tr key={counter.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem', fontWeight: 'bold', color: counter.is_active ? '#2E7D32' : '#6b7280' }}>
                        {counter.prefix_letter}-{counter.city_letter}
                      </td>
                      <td style={{ padding: '1rem', color: '#374151' }}>{String(counter.current_number).padStart(5, '0')}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold',
                          background: counter.is_active ? '#dcfce7' : '#f3f4f6',
                          color: counter.is_active ? '#166534' : '#6b7280'
                        }}>
                          {counter.is_active ? 'ACTIVA' : 'INACTIVA'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(counter.created_at).toLocaleDateString('es-CO')}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDeleteSeries(counter.id, `${counter.prefix_letter}-${counter.city_letter}`)}
                          style={{ 
                            background: '#fee2e2', color: '#dc2626', border: 'none', 
                            padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.875rem'
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}