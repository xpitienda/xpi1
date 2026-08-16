'use client';

import { useEffect, useState } from 'react';

interface Shipment {
  id: number;
  sale_id: number;
  courier_company_id: number;
  tracking_number: string;
  status: string;
  status_details: string;
  estimated_delivery: string;
  created_at: string;
  courier_name?: string;
  courier_code?: string;
}

interface Courier {
  id: number;
  name: string;
  code: string;
}

interface Sale {
  id: number;
  customer_name?: string;
  customer_email?: string;
  total?: number;
  [key: string]: any;
}

export default function ShipmentsAdminPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);

  const [newShipmentData, setNewShipmentData] = useState({
    sale_id: '',
    courier_company_id: '',
    tracking_number: '',
    estimated_delivery: ''
  });

  const [newEventData, setNewEventData] = useState({
    status: 'pending',
    location: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [shipRes, courRes, salesRes] = await Promise.all([
        fetch('/api/admin/shipments'),
        fetch('/api/admin/couriers'),
        fetch('/api/admin/sales')
      ]);

      if (shipRes.ok) setShipments(await shipRes.json());
      if (courRes.ok) setCouriers(await courRes.json());
      if (salesRes.ok) setSales(await salesRes.json());
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShipmentData)
      });

      if (res.ok) {
        alert('Envío creado exitosamente');
        setShowShipmentModal(false);
        setNewShipmentData({ sale_id: '', courier_company_id: '', tracking_number: '', estimated_delivery: '' });
        fetchData();
      } else {
        alert('Error al crear el envío');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/shipments/${selectedShipment.id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEventData,
          event_date: new Date().toISOString()
        })
      });

      if (res.ok) {
        alert('Evento agregado exitosamente');
        setShowEventModal(false);
        setNewEventData({ status: 'pending', location: '', description: '' });
        fetchData();
      } else {
        alert('Error al agregar el evento');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return '#16a34a';
      case 'in_transit': return '#9333ea';
      case 'returned': return '#dc2626';
      default: return '#f59e0b';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'delivered': return 'Entregado';
      case 'in_transit': return 'En tránsito';
      case 'returned': return 'Devuelto';
      default: return 'Pendiente';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'url(/entrega3.png) center center / cover no-repeat fixed',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      padding: '2rem', 
      position: 'relative'
    }}>
      {/* Overlay sutil para mejorar legibilidad */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(255,255,255,0.3)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Contenido principal */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '80rem', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#9333ea', margin: 0, textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
              📦 Gestión de Envíos
            </h1>
            <p style={{ color: '#16a34a', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: '600', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
              Administra los envíos y seguimientos de tus ventas
            </p>
          </div>
          <button 
            onClick={() => setShowShipmentModal(true)}
            disabled={couriers.length === 0 || sales.length === 0}
            style={{ 
              background: couriers.length === 0 ? '#9ca3af' : '#16a34a', 
              color: 'white', 
              padding: '1rem 2rem', 
              borderRadius: '0.75rem', 
              fontWeight: 'bold', 
              border: 'none',
              cursor: couriers.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontSize: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            ➕ Nuevo Envío
          </button>
        </div>

        {couriers.length === 0 && (
          <div style={{ 
            background: 'rgba(254, 243, 199, 0.95)', 
            border: '2px solid #f59e0b', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            marginBottom: '2rem', 
            color: '#92400e',
            fontWeight: '600',
            backdropFilter: 'blur(4px)'
          }}>
            ⚠️ Primero debes crear las empresas de mensajería en la sección "Empresas de Mensajería".
          </div>
        )}

        {/* Lista de Envíos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {shipments.map((shipment) => (
            <div key={shipment.id} style={{ 
              background: 'rgba(255,255,255,0.95)', 
              padding: '1.5rem', 
              borderRadius: '1rem', 
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)', 
              border: '1px solid rgba(229, 231, 235, 0.8)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', margin: 0, color: '#1f2937' }}>
                    Venta #{shipment.sale_id}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                    {shipment.courier_name || 'Empresa desconocida'}
                  </p>
                </div>
                <span style={{ 
                  background: getStatusColor(shipment.status) + '20', 
                  color: getStatusColor(shipment.status), 
                  padding: '0.5rem 1rem', 
                  borderRadius: '9999px', 
                  fontSize: '0.875rem', 
                  fontWeight: 'bold' 
                }}>
                  {getStatusLabel(shipment.status)}
                </span>
              </div>

              <div style={{ 
                background: '#f9fafb', 
                padding: '1rem', 
                borderRadius: '0.75rem', 
                marginBottom: '1rem',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                   Guía: <strong style={{ color: '#1f2937', fontSize: '1rem' }}>{shipment.tracking_number}</strong>
                </p>
              </div>

              <button 
                onClick={() => { setSelectedShipment(shipment); setShowEventModal(true); }}
                style={{ 
                  width: '100%', 
                  background: '#9333ea', 
                  color: 'white', 
                  padding: '0.75rem', 
                  borderRadius: '0.75rem', 
                  fontWeight: 'bold', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)'
                }}
              >
                 Agregar Evento de Rastreo
              </button>
            </div>
          ))}
        </div>

        {shipments.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem', 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '1rem', 
            border: '2px dashed rgba(229, 231, 235, 0.8)',
            backdropFilter: 'blur(8px)'
          }}>
            <p style={{ fontSize: '4rem', marginBottom: '1rem' }}></p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
              No hay envíos registrados
            </h3>
            <p style={{ color: '#6b7280' }}>
              Crea tu primer envío para comenzar a dar seguimiento
            </p>
          </div>
        )}
      </div>

      {/* Modal: Crear Envío */}
      {showShipmentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }} onClick={(e) => { if (e.target === e.currentTarget) setShowShipmentModal(false); }}>
          <div style={{ background: 'white', borderRadius: '1rem', maxWidth: '32rem', width: '100%', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#9333ea' }}>
               Crear Nuevo Envío
            </h2>
            <form onSubmit={handleCreateShipment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#1f2937' }}>
                  Venta *
                </label>
                <select 
                  value={newShipmentData.sale_id} 
                  onChange={(e) => setNewShipmentData({...newShipmentData, sale_id: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: '#f9fafb', color: '#1f2937' }}
                >
                  <option value="">Seleccionar venta...</option>
                  {sales.map(sale => (
                    <option key={sale.id} value={sale.id}>Venta #{sale.id} - {sale.customer_name || sale.customer_email || 'Cliente'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#1f2937' }}>
                  Empresa de Mensajería *
                </label>
                <select 
                  value={newShipmentData.courier_company_id} 
                  onChange={(e) => setNewShipmentData({...newShipmentData, courier_company_id: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: '#f9fafb', color: '#1f2937' }}
                >
                  <option value="">Seleccionar empresa...</option>
                  {couriers.map(courier => (
                    <option key={courier.id} value={courier.id}>{courier.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#1f2937' }}>
                  Número de Guía *
                </label>
                <input 
                  type="text" 
                  value={newShipmentData.tracking_number} 
                  onChange={(e) => setNewShipmentData({...newShipmentData, tracking_number: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: '#f9fafb', color: '#1f2937' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.75rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  {loading ? 'Creando...' : 'Crear Envío'}
                </button>
                <button type="button" onClick={() => setShowShipmentModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#f3f4f6', color: '#1f2937', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agregar Evento */}
      {showEventModal && selectedShipment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }} onClick={(e) => { if (e.target === e.currentTarget) setShowEventModal(false); }}>
          <div style={{ background: 'white', borderRadius: '1rem', maxWidth: '32rem', width: '100%', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#9333ea' }}>
               Agregar Evento de Rastreo
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Guía: {selectedShipment.tracking_number} ({selectedShipment.courier_name})
            </p>
            
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#1f2937' }}>
                  Estado *
                </label>
                <select 
                  value={newEventData.status} 
                  onChange={(e) => setNewEventData({...newEventData, status: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: '#f9fafb', color: '#1f2937' }}
                >
                  <option value="pending"> Pendiente / Guía Creada</option>
                  <option value="in_transit"> En tránsito</option>
                  <option value="out_for_delivery"> En reparto</option>
                  <option value="delivered">✅ Entregado</option>
                  <option value="returned">❌ Devuelto / Fallido</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#1f2937' }}>
                  Ubicación
                </label>
                <input 
                  type="text" 
                  value={newEventData.location} 
                  onChange={(e) => setNewEventData({...newEventData, location: e.target.value})}
                  placeholder="Ej: Centro de distribución Bogotá"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: '#f9fafb', color: '#1f2937' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#1f2937' }}>
                  Descripción
                </label>
                <textarea 
                  value={newEventData.description} 
                  onChange={(e) => setNewEventData({...newEventData, description: e.target.value})}
                  placeholder="Ej: El paquete salió hacia la ciudad de destino"
                  rows={3}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: '#f9fafb', color: '#1f2937' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.75rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  {loading ? 'Guardando...' : 'Guardar Evento'}
                </button>
                <button type="button" onClick={() => setShowEventModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#f3f4f6', color: '#1f2937', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
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