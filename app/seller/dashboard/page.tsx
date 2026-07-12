'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Estado para el formulario de venta
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('seller_session');
    if (!session) {
      router.push('/login-seller');
    } else {
      try {
        const data = JSON.parse(session);
        setSeller(data);
      } catch (e) {
        localStorage.removeItem('seller_session');
        router.push('/login-seller');
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('seller_session');
    router.push('/login-seller');
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Procesando...');
    
    if (!seller?.assigned_series_id) {
      setMsg('❌ Error: No tienes una serie de facturas asignada. Contacta al admin.');
      return;
    }

    try {
      const res = await fetch('/api/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller.id,
          seriesId: seller.assigned_series_id,
          customer: { name: customerName, phone: customerPhone },
          items: [{ name: productName, price: Number(price), quantity: Number(quantity) }]
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMsg(`✅ Venta exitosa! Factura: ${data.invoice}`);
        setCustomerName(''); setCustomerPhone(''); setProductName(''); setPrice(''); setQuantity('1');
      } else {
        setMsg(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setMsg('❌ Error de conexión');
    }
  };

  if (loading || !seller) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando panel...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>Panel Vendedor</h1>
            <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{seller.full_name}</p>
          </div>
          <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar Sesión</button>
        </div>

        {/* INFO VENDEDOR */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Email</span>
              <p style={{ fontWeight: 'bold', color: '#374151' }}>{seller.email}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Serie Asignada</span>
              <p style={{ fontWeight: 'bold', color: seller.assigned_series_id ? '#16a34a' : '#dc2626' }}>
                {seller.assigned_series_id ? 'Activa ✅' : 'Sin asignar ❌'}
              </p>
            </div>
          </div>
        </div>

        {/* FORMULARIO DE VENTA RÁPIDA */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#374151' }}>🧾 Nueva Venta Rápida</h2>
          
          {msg && (
            <div style={{ 
              background: msg.includes('✅') ? '#dcfce7' : '#fee2e2', 
              color: msg.includes('✅') ? '#166534' : '#991b1b',
              padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontWeight: 'bold' 
            }}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSell} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="text" placeholder="Nombre Cliente" value={customerName} onChange={e => setCustomerName(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
              <input type="tel" placeholder="Celular Cliente" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              <input type="text" placeholder="Producto" value={productName} onChange={e => setProductName(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
              <input type="number" placeholder="Precio" value={price} onChange={e => setPrice(e.target.value)} required min="0" style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
              <input type="number" placeholder="Cant." value={quantity} onChange={e => setQuantity(e.target.value)} required min="1" style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
            </div>

            <button type="submit" style={{ 
              background: 'linear-gradient(135deg, #1e40af, #7c3aed)', 
              color: 'white', padding: '1rem', borderRadius: '0.5rem', 
              fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1rem' 
            }}>
              Generar Factura y Enviar
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}