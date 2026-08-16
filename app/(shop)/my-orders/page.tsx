'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  sale_id: string;
  invoice_number?: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
  tracking_number?: string;
  courier_name?: string;
  shipment_id?: number;
  courier_company_id?: number;
  api_endpoint?: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [phone, setPhone] = useState('');
  const [invoice, setInvoice] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone && !invoice) {
      setSearchError('Por favor ingresa teléfono o número de factura');
      return;
    }

    setLoading(true);
    setSearchError('');
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (phone) params.append('phone', phone.trim());
      if (invoice) params.append('invoice', invoice.trim());

      const res = await fetch(`/api/my-orders?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setOrders(data);
        if (data.length === 0) {
          setSearchError('No se encontraron pedidos con estos datos');
        }
      } else {
        setSearchError(data.error || 'Error al buscar pedidos');
      }
    } catch (error) {
      console.error('Error buscando pedidos:', error);
      setSearchError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3E8FF', padding: '2rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>

        <Link href="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#6B2D8B', fontWeight: 'bold', textDecoration: 'none', marginBottom: '1rem', fontSize: '1rem' }}>
          ← Volver al Catálogo
        </Link>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6B2D8B', margin: 0 }}>📋 Mis Pedidos</h1>
          <p style={{ color: '#1B8A3B', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: '600' }}>Revisa el estado de tus compras</p>
        </div>

        {!searched ? (
          <div style={{ background: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '2px solid #1B8A3B', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h2 style={{ color: '#6B2D8B', marginBottom: '0.5rem' }}>Busca tus pedidos</h2>
              <p style={{ color: '#6b7280' }}>Ingresa el teléfono o número de factura que usaste al comprar</p>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#1B8A3B', marginBottom: '0.5rem' }}> Teléfono</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="3234475311" style={{ width: '100%', padding: '0.875rem', border: '2px solid #E9D5FF', borderRadius: '0.75rem', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>ó</div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#1B8A3B', marginBottom: '0.5rem' }}>🧾 Número de factura</label>
                <input type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder="A-M-00035" style={{ width: '100%', padding: '0.875rem', border: '2px solid #E9D5FF', borderRadius: '0.75rem', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>

              {searchError && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #fca5a5' }}>⚠️ {searchError}</div>
              )}

              <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #6B2D8B 0%, #1B8A3B 100%)', color: 'white', padding: '1rem', borderRadius: '0.75rem', border: 'none', fontWeight: 'bold', fontSize: '1.125rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 10px 20px rgba(107, 45, 139, 0.3)', opacity: loading ? 0.7 : 1 }}>
                {loading ? '🔍 Buscando...' : ' Buscar mis pedidos'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#6B2D8B', fontWeight: '600' }}>{orders.length} pedido{orders.length !== 1 ? 's' : ''} encontrado{orders.length !== 1 ? 's' : ''}</p>
              <button onClick={() => { setSearched(false); setOrders([]); setPhone(''); setInvoice(''); }} style={{ background: 'transparent', color: '#6B2D8B', border: '2px solid #6B2D8B', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                🔍 Nueva búsqueda
              </button>
            </div>

            {orders.length === 0 ? (
              <div style={{ background: 'white', padding: '4rem', borderRadius: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', border: '2px solid #1B8A3B' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                <h2 style={{ color: '#1f2937', marginBottom: '1rem' }}>No tienes pedidos aún</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>¡Explora nuestro catálogo y haz tu primera compra!</p>
                <Link href="/catalog" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #6B2D8B 0%, #1B8A3B 100%)', color: 'white', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 'bold', textDecoration: 'none' }}>🛍️ Ir al Catálogo</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {orders.map((order, index) => (
                  <div key={`${order.sale_id}-${index}`} style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: order.shipment_id ? '2px solid #1B8A3B' : '2px solid #E9D5FF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6B2D8B', margin: '0 0 0.5rem 0' }}>Pedido #{order.invoice_number || order.sale_id}</h3>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0' }}>📅 {formatDate(order.created_at || '')}</p>
                        <p style={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>💰 ${order.total_amount?.toLocaleString('es-CO') || '0'}</p>
                        <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', background: order.status === 'Entregado' ? '#d1fae5' : '#fef3c7', color: order.status === 'Entregado' ? '#059669' : '#d97706', marginTop: '0.5rem' }}>
                          {order.status || 'Pendiente'}
                        </span>
                      </div>

                      {order.shipment_id && (
                        <div style={{ flex: 1, minWidth: '200px', background: '#f0fdf4', padding: '1rem', borderRadius: '1rem', border: '1px solid #1B8A3B' }}>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0' }}>🚚 {order.courier_name || 'Empresa de envío'}</p>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0' }}>🔢 Guía: <strong style={{ color: '#1B8A3B' }}>{order.tracking_number}</strong></p>
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {order.shipment_id ? (
                          <Link href={`/tracking/${order.shipment_id}`} style={{ display: 'block', background: 'linear-gradient(135deg, #6B2D8B 0%, #1B8A3B 100%)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' }}>📦 Ver Seguimiento</Link>
                        ) : (
                          <span style={{ display: 'block', background: '#f3f4f6', color: '#6b7280', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 'bold', textAlign: 'center', fontSize: '0.875rem' }}> Pendiente de envío</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}