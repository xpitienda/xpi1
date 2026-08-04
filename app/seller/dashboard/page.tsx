'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [msg, setMsg] = useState('');
  const [sales, setSales] = useState<any[]>([]);
  const [showSales, setShowSales] = useState(false);
  
  // Nuevo estado para el buscador de productos
  const [searchQuery, setSearchQuery] = useState('');
  
  // NUEVO: Estado para el modal de imagen ampliada
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const [zoomedProductName, setZoomedProductName] = useState('');

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

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        console.log('Productos cargados:', data);
        setProducts(data);
      })
      .catch(err => console.error('Error cargando productos:', err));

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('seller_session');
    router.push('/login-seller');
  };

  // LA LÓGICA DE VENTA SE MANTIENE EXACTAMENTE IGUAL
  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Procesando...');

    if (!seller?.seriesId) {
      setMsg('❌ Error: No tienes una serie de facturas asignada.');
      return;
    }

    const selectedItem = products.find(p => p.id === selectedProductId);
    if (!selectedItem) {
      setMsg('❌ Error: Debes seleccionar un producto de la lista.');
      return;
    }

    try {
      const res = await fetch('/api/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller.id,
          seriesId: seller.seriesId,
          customer: { name: customerName, phone: customerPhone },
          items: [{
            id: selectedItem.id,
            name: selectedItem.name,
            price: Number(selectedItem.price),
            quantity: Number(quantity)
          }]
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMsg('✅ Venta exitosa! Factura: ' + data.invoice);
        setCustomerName('');
        setCustomerPhone('');
        setSelectedProductId('');
        setQuantity('1');
        setSearchQuery('');
      } else {
        setMsg('❌ Error: ' + data.error);
      }
    } catch (err) {
      setMsg('❌ Error de conexion');
    }
  };

  const fetchMySales = async () => {
    try {
      setMsg('Cargando ventas...');
      const res = await fetch('/api/seller/my-sales?sellerId=' + seller.id);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al cargar ventas');
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setSales(data);
        setShowSales(true);
        setMsg('');
      } else {
        setSales([]);
        setShowSales(true);
        setMsg('No se pudieron cargar las ventas');
      }
    } catch (err: any) {
      setSales([]);
      setShowSales(true);
      setMsg('Error: ' + (err?.message || 'No se pudieron cargar las ventas'));
    }
  };

  // NUEVO: Función para abrir el modal de zoom
  const openImageZoom = (imageUrl: string, productName: string) => {
    setZoomedImageUrl(imageUrl);
    setZoomedProductName(productName);
  };

  // NUEVO: Función para cerrar el modal
  const closeImageZoom = () => {
    setZoomedImageUrl(null);
    setZoomedProductName('');
  };

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedItem = products.find(p => p.id === selectedProductId);

  if (loading || !seller) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>Panel Vendedor</h1>
            <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{seller.name}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={fetchMySales} style={{ background: '#7c3aed', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>📊 Mis Ventas</button>
            <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar Sesión</button>
          </div>
        </div>

        {/* INFO DEL VENDEDOR */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>EMAIL</span>
              <p style={{ fontWeight: '600', color: '#374151', fontSize: '1rem', margin: 0 }}>{seller.email}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>SERIE ASIGNADA</span>
              <p style={{ fontWeight: 'bold', color: seller.seriesId ? '#16a34a' : '#dc2626', fontSize: '1rem', margin: 0 }}>
                {seller.seriesId ? 'Asignada' : 'Sin asignar'}
              </p>
            </div>
          </div>
        </div>

        {/* FORMULARIO DE VENTA CON CATÁLOGO VISUAL */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#374151' }}>Nueva Venta (Catálogo Visual)</h2>

          {msg && (
            <div style={{
              background: msg.includes('exitosa') || msg.includes('Cargando') ? '#dcfce7' : '#fee2e2',
              color: msg.includes('exitosa') || msg.includes('Cargando') ? '#166534' : '#991b1b',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              fontWeight: '600'
            }}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSell} style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Datos del Cliente */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Nombre del Cliente" 
                value={customerName} 
                onChange={e => setCustomerName(e.target.value)} 
                required 
                style={{ padding: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem' }} 
              />
              <input 
                type="tel" 
                placeholder="Celular del Cliente" 
                value={customerPhone} 
                onChange={e => setCustomerPhone(e.target.value)} 
                required 
                style={{ padding: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem' }} 
              />
            </div>

            {/* Buscador de Productos */}
            <input 
              type="text" 
              placeholder="🔍 Buscar producto por nombre..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              style={{ padding: '0.875rem', border: '2px solid #1e40af', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none' }} 
            />

            {/* CATÁLOGO VISUAL DE PRODUCTOS */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
              gap: '1rem', 
              maxHeight: '400px', 
              overflowY: 'auto', 
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              background: '#f9fafb'
            }}>
              {filteredProducts.length === 0 ? (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No se encontraron productos.</p>
              ) : (
                filteredProducts.map((p: any) => {
                  const isSelected = selectedProductId === p.id;
                  return (
                    <div 
                      key={p.id} 
                      onClick={() => setSelectedProductId(p.id)}
                      style={{
                        background: isSelected ? '#eff6ff' : 'white',
                        border: isSelected ? '3px solid #1e40af' : '1px solid #d1d5db',
                        borderRadius: '0.75rem',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 4px 12px rgba(30, 64, 175, 0.2)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    >
                      {/* Imagen del producto - CLICKABLE PARA ZOOM */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (p.image_url) {
                            openImageZoom(p.image_url, p.name);
                          }
                        }}
                        style={{ 
                          width: '100%', 
                          height: '120px', 
                          background: '#f3f4f6', 
                          borderRadius: '0.5rem', 
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          cursor: p.image_url ? 'zoom-in' : 'default',
                          position: 'relative'
                        }}
                      >
                        {p.image_url ? (
                          <img 
                            src={p.image_url} 
                            alt={p.name} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'contain',
                              transition: 'transform 0.2s'
                            }} 
                          />
                        ) : (
                          <span style={{ fontSize: '2rem', color: '#9ca3af' }}>📦</span>
                        )}
                        
                        {/* Indicador de zoom */}
                        {p.image_url && (
                          <div style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            background: 'rgba(30, 64, 175, 0.8)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            🔍
                          </div>
                        )}
                      </div>
                      
                      {/* Nombre y precio */}
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', margin: '0 0 0.25rem 0', lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {p.name}
                      </p>
                      <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>
                        ${Number(p.price).toLocaleString('es-CO')}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                        Stock: {p.stock}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Resumen de Selección y Cantidad */}
            {selectedItem && (
              <div style={{ 
                background: '#f0fdf4', 
                border: '1px solid #86efac', 
                borderRadius: '0.5rem', 
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534', fontWeight: 'bold' }}>✅ Producto seleccionado:</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: '#14532d' }}>{selectedItem.name}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#374151' }}>Cantidad:</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    required
                    min="1"
                    style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', width: '80px', textAlign: 'center', fontSize: '1.125rem', fontWeight: 'bold' }}
                  />
                </div>
              </div>
            )}

            {/* Botón de Enviar */}
            <button 
              type="submit" 
              disabled={!selectedItem}
              style={{ 
                background: selectedItem ? 'linear-gradient(135deg, #1e40af, #7c3aed)' : '#9ca3af', 
                color: 'white', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                fontWeight: 'bold', 
                border: 'none', 
                cursor: selectedItem ? 'pointer' : 'not-allowed', 
                fontSize: '1.125rem',
                transition: 'opacity 0.2s'
              }}
            >
              🧾 Generar Factura y Registrar Venta
            </button>
          </form>
        </div>

        {/* HISTORIAL DE VENTAS (INTACTO) */}
        {showSales && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#374151' }}>Historial de Mis Ventas</h2>
            {!Array.isArray(sales) || sales.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No has realizado ventas aun</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Factura</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Cliente</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Producto</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale: any, index: number) => {
                      let items = [];
                      try { items = JSON.parse(sale.items || '[]'); } catch (e) { items = []; }
                      return (
                        <tr key={sale.id || index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#1e40af' }}>{sale.invoice_number}</td>
                          <td style={{ padding: '0.75rem' }}>{sale.customer_name}</td>
                          <td style={{ padding: '0.75rem' }}>{items.map((item: any) => item.name).join(', ')}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#16a34a' }}>{'$' + Number(sale.total_amount).toLocaleString('es-CO')}</td>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>{new Date(sale.created_at).toLocaleString('es-CO')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* NUEVO: MODAL DE ZOOM DE IMAGEN */}
      {zoomedImageUrl && (
        <div 
          onClick={closeImageZoom}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
            padding: '2rem'
          }}
        >
          {/* Botón cerrar */}
          <button
            onClick={closeImageZoom}
            style={{
              position: 'absolute',
              top: '20px',
              right: '40px',
              background: 'white',
              color: 'black',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 10000
            }}
          >
            ✕
          </button>

          {/* Imagen ampliada (4x el tamaño original) */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '90%',
            maxHeight: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#374151',
              textAlign: 'center'
            }}>
              {zoomedProductName}
            </h3>
            <img 
              src={zoomedImageUrl} 
              alt={zoomedProductName}
              style={{
                width: '200%',  // 2 veces el tamaño
                maxWidth: '1200px',  // Límite máximo
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '0.5rem'
              }}
            />
            <p style={{ 
              marginTop: '1rem', 
              fontSize: '0.875rem', 
              color: '#6b7280',
              textAlign: 'center'
            }}>
               Haz clic fuera de la imagen o en la X para cerrar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}