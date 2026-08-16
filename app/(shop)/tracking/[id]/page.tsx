'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Shipment {
  id: number;
  tracking_number: string;
  courier_company_id: number;
  courier_name: string;
  api_endpoint: string;
}

export default function TrackingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shipmentId = params.id as string;
  
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [openingWindow, setOpeningWindow] = useState(false);

  useEffect(() => {
    fetch(`/api/shipment/${shipmentId}`).then(res => res.ok ? res.json() : null).then(setShipment).finally(() => setLoading(false));
  }, [shipmentId]);

  const handleTrack = async () => {
    if (!shipment || !shipment.tracking_number || !shipment.api_endpoint) return;
    setOpeningWindow(true);
    try {
      const res = await fetch('/api/tracking/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: shipment.tracking_number, companyId: shipment.courier_company_id })
      });
      const data = await res.json();
      if (res.ok && data.success && data.trackingUrl) window.open(data.trackingUrl, '_blank');
      else alert('No se pudo generar el enlace de rastreo');
    } catch {
      alert('Error al abrir el sitio de rastreo');
    } finally {
      setOpeningWindow(false);
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3E8FF' }}><p style={{ color: '#6B2D8B', fontWeight: 'bold' }}>Cargando...</p></div>;
  if (!shipment) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3E8FF' }}>
      <div style={{ textAlign: 'center', background: 'white', padding: '3rem', borderRadius: '1.5rem', border: '2px solid #1B8A3B' }}>
        <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Envío no encontrado</h2>
        <button onClick={() => router.push('/my-orders')} style={{ marginTop: '1rem', background: '#6B2D8B', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>← Volver a Mis Pedidos</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F3E8FF', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <button onClick={() => router.push('/my-orders')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#6B2D8B', fontWeight: 'bold', textDecoration: 'none', marginBottom: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>← Volver a Mis Pedidos</button>

        <div style={{ background: '#6B2D8B', borderRadius: '1.5rem', padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>📦 Seguimiento de Envío</h1>
          <p style={{ color: '#1B8A3B', fontSize: '1.125rem', margin: 0, fontWeight: '600', background: 'white', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>Rastrea tu pedido en tiempo real</p>
        </div>

        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '2px solid #1B8A3B' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6B2D8B', marginBottom: '1.5rem' }}>🚚 Información del Envío</h2>
          
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#F3E8FF', padding: '1rem', borderRadius: '1rem', border: '1px solid #1B8A3B' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Transportadora:</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{shipment.courier_name || 'No especificada'}</p>
            </div>
            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '1rem', border: '1px solid #1B8A3B' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Número de Guía:</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1B8A3B', margin: 0, fontFamily: 'monospace' }}>{shipment.tracking_number}</p>
            </div>
          </div>

          <div style={{ background: '#F3E8FF', padding: '2rem', borderRadius: '1rem', border: '2px solid #6B2D8B', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>📍 ¿Dónde está mi pedido?</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Haz clic para ver el rastreo en <strong>{shipment.courier_name}</strong></p>
            
            <button onClick={handleTrack} disabled={openingWindow} style={{ background: '#6B2D8B', color: 'white', padding: '1.25rem 2.5rem', borderRadius: '1rem', border: '2px solid #1B8A3B', fontWeight: 'bold', fontSize: '1.125rem', cursor: openingWindow ? 'not-allowed' : 'pointer', width: '100%', maxWidth: '400px' }}>
              {openingWindow ? '⏳ Abriendo...' : `🔍 Rastrear en ${shipment.courier_name}`}
            </button>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>Se abrirá en una nueva pestaña</p>
          </div>
        </div>
      </div>
    </div>
  );
}