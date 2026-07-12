'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
  const [seller, setSeller] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('seller_session');
    if (!session) {
      router.push('/login-seller');
    } else {
      setSeller(JSON.parse(session));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('seller_session');
    router.push('/login-seller');
  };

  if (!seller) return <div style={{ padding: '2rem' }}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>Panel Vendedor</h1>
          <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar Sesión</button>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#374151' }}>Bienvenido, {seller.full_name}</h2>
          <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>📧 {seller.email}</p>
          <p style={{ color: '#6b7280' }}>
            🧾 Serie asignada: {seller.assigned_series_id ? 'Configurada' : 'Sin serie asignada'}
          </p>
        </div>

        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
            <h3 style={{ fontWeight: 'bold', color: '#374151' }}>Mis Productos</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Próximamente</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛒</div>
            <h3 style={{ fontWeight: 'bold', color: '#374151' }}>Mis Ventas</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Próximamente</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧾</div>
            <h3 style={{ fontWeight: 'bold', color: '#374151' }}>Facturar</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
}