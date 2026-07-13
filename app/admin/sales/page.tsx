'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSales() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSeller, setExpandedSeller] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalGeneral: 0,
    totalVendedores: 0,
    totalVentas: 0
  });
  const router = useRouter();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch('/api/admin/sales');
        const data = await res.json();
        
        if (res.ok) {
          setSales(data.ventas);
          setStats({
            totalGeneral: data.totalGeneral,
            totalVendedores: data.totalVendedores,
            totalVentas: data.totalVentas
          });
        } else {
          alert('Error: ' + data.error);
        }
      } catch (err) {
        console.error('Error cargando ventas:', err);
        alert('Error de conexion');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const toggleSeller = (sellerName: string) => {
    setExpandedSeller(expandedSeller === sellerName ? null : sellerName);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.25rem' }}>
        Cargando ventas...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
            Ventas por Vendedor
          </h1>
          <button
            onClick={() => router.push('/admin')}
            style={{
              background: '#6b7280',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Volver al Admin
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #1e40af, #7c3aed)', 
            padding: '1.5rem', 
            borderRadius: '0.75rem',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Total General</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>
              ${stats.totalGeneral.toLocaleString('es-CO')}
            </p>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #059669, #10b981)', 
            padding: '1.5rem', 
            borderRadius: '0.75rem',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Total Ventas</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.totalVentas}
            </p>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #dc2626, #f87171)', 
            padding: '1.5rem', 
            borderRadius: '0.75rem',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Vendedores</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.totalVendedores}
            </p>
          </div>
        </div>

        {sales.length === 0 ? (
          <div style={{ 
            background: 'white', 
            padding: '3rem', 
            borderRadius: '0.75rem', 
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              No hay ventas registradas aun
            </p>
          </div>
        ) : (
          sales.map((sellerData: any, index: number) => (
            <div 
              key={index}
              style={{ 
                background: 'white', 
                borderRadius: '0.75rem', 
                marginBottom: '1.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                overflow: 'hidden'
              }}
            >
              <div 
                onClick={() => toggleSeller(sellerData.vendedor)}
                style={{
                  background: expandedSeller === sellerData.vendedor 
                    ? 'linear-gradient(135deg, #7c3aed, #a855f7)' 
                    : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  color: 'white',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {sellerData.vendedor}
                  </h2>
                  <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.875rem' }}>
                    {sellerData.cantidadVentas} ventas
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                    ${sellerData.totalVendedor.toLocaleString('es-CO')}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                    {expandedSeller === sellerData.vendedor ? 'Ocultar detalles' : 'Ver detalles'}
                  </p>
                </div>
              </div>

              {expandedSeller === sellerData.vendedor && (
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Factura</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Cliente</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Productos</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellerData.ventas.map((sale: any, saleIndex: number) => {
                          let items = [];
                          try {
                            items = JSON.parse(sale.items || '[]');
                          } catch (e) {
                            items = [];
                          }
                          
                          return (
                            <tr key={saleIndex} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#1e40af' }}>
                                {sale.invoice_number}
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <div>
                                  <div style={{ fontWeight: '600' }}>{sale.customer_name}</div>
                                  {sale.customer_phone && (
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                      {sale.customer_phone}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                {items.map((item: any) => (
                                  <div key={item.name} style={{ marginBottom: '0.25rem' }}>
                                    {item.name} x{item.quantity}
                                  </div>
                                ))}
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#16a34a' }}>
                                ${Number(sale.total_amount).toLocaleString('es-CO')}
                              </td>
                              <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                {new Date(sale.created_at).toLocaleString('es-CO')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
}