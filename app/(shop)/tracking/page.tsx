'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CourierCompany { id: number; name: string; code: string; }

export default function PublicTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<number | ''>('');
  const [companies, setCompanies] = useState<CourierCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin/couriers', { headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setCompanies(Array.isArray(data) ? data.filter((c: any) => c.is_active) : []))
      .catch(console.error);
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!trackingNumber.trim()) return setError('Por favor ingresa el número de guía');
    if (!selectedCompany) return setError('Por favor selecciona la empresa de transporte');

    setLoading(true);
    try {
      const res = await fetch('/api/tracking/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: trackingNumber.trim(), companyId: selectedCompany })
      });
      const data = await res.json();
      if (res.ok && data.success && data.trackingUrl) {
        setSuccess(`Redirigiendo al sitio de ${data.companyName}...`);
        setTimeout(() => window.open(data.trackingUrl, '_blank'), 500);
      } else {
        setError(data.error || 'No se pudo generar el enlace de rastreo');
      }
    } catch (error) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3E8FF', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <Link href="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#6B2D8B', fontWeight: 'bold', textDecoration: 'none', marginBottom: '1rem' }}>← Volver al Catálogo</Link>

        <div style={{ background: '#6B2D8B', borderRadius: '1.5rem', padding: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>📍 Rastrea tu Pedido</h1>
          <p style={{ color: '#1B8A3B', fontSize: '1.125rem', margin: 0, fontWeight: '600', background: 'white', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            Ingresa tu número de guía
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '2px solid #1B8A3B' }}>
          <form onSubmit={handleTrack}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#1B8A3B', marginBottom: '0.5rem' }}>🏢 Empresa de transporte *</label>
              <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value ? Number(e.target.value) : '')} style={{ width: '100%', padding: '0.875rem', border: '2px solid #1B8A3B', borderRadius: '0.75rem', fontSize: '1rem', background: 'white' }} required>
                <option value="">Selecciona una empresa</option>
                {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#1B8A3B', marginBottom: '0.5rem' }}>🔢 Número de guía *</label>
              <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Ej: 123456789" style={{ width: '100%', padding: '0.875rem', border: '2px solid #1B8A3B', borderRadius: '0.75rem', fontSize: '1rem' }} required />
            </div>

            {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid #fca5a5' }}>⚠️ {error}</div>}
            {success && <div style={{ background: '#d1fae5', color: '#059669', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid #6ee7b7' }}>✅ {success}</div>}

            <button type="submit" disabled={loading} style={{ width: '100%', background: '#6B2D8B', color: 'white', padding: '1rem', borderRadius: '0.75rem', border: '2px solid #1B8A3B', fontWeight: 'bold', fontSize: '1.125rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '⏳ Generando enlace...' : '🔍 Rastrear mi Pedido'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#F3E8FF', borderRadius: '1rem', border: '2px solid #1B8A3B' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1B8A3B', margin: '0 0 0.75rem 0' }}>💡 ¿Dónde encuentro mi número de guía?</h3>
            <ul style={{ color: '#4b5563', fontSize: '0.875rem', margin: 0, paddingLeft: '1.25rem', lineHeight: '1.6' }}>
              <li>En el correo de confirmación de tu pedido</li>
              <li>En la sección <strong style={{ color: '#1B8A3B' }}>"Mis Pedidos"</strong> de tu cuenta</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}