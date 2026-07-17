'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B6B'];

export default function AdminSales() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSeller, setExpandedSeller] = useState<string | null>(null);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [topProducts, setTopProducts] = useState<any[]>([]);
  
  const router = useRouter();

  const fetchSales = async () => {
    try {
      setLoading(true);
      const salesRes = await fetch('/api/admin/sales');
      const salesData = await salesRes.json();
      
      if (salesRes.ok) {
        setSales(salesData.ventas);
      } else {
        alert('Error: ' + salesData.error);
      }

      const topRes = await fetch('/api/admin/top-products');
      if (topRes.ok) {
        const topData = await topRes.json();
        setTopProducts(topData);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
      alert('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const toggleSeller = (sellerName: string) => {
    setExpandedSeller(expandedSeller === sellerName ? null : sellerName);
  };

  // NUEVO: Función para anular venta
  const handleVoidSale = async (saleId: string, invoiceNumber: string) => {
    if (!confirm(`¿Estás seguro de anular la factura ${invoiceNumber}?\n\nEsta acción devolverá el stock al inventario.`)) {
      return;
    }

    const reason = prompt('Motivo de la anulación (opcional):') || 'Anulada por administrador';

    try {
      const res = await fetch('/api/admin/void-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saleId, reason })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Venta anulada correctamente. Stock devuelto al inventario.');
        fetchSales(); // Recargar datos
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (err) {
      alert('❌ Error de conexión');
    }
  };

  const getFilteredSales = () => {
    if (!startDate && !endDate) return sales;

    return sales.map(sellerData => {
      const filteredVentas = sellerData.ventas.filter((venta: any) => {
        const ventaDate = new Date(venta.created_at);
        let include = true;

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (ventaDate < start) include = false;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (ventaDate > end) include = false;
        }

        return include;
      });

      const totalVendedor = filteredVentas.reduce((sum: number, v: any) => sum + Number(v.total_amount), 0);

      return {
        ...sellerData,
        ventas: filteredVentas,
        totalVendedor,
        cantidadVentas: filteredVentas.length
      };
    }).filter((sellerData: any) => sellerData.ventas.length > 0);
  };

  const dateFilteredSales = getFilteredSales();
  
  const filteredSales = searchTerm ? dateFilteredSales.map(seller => {
    const term = searchTerm.toLowerCase();
    const matchingVentas = seller.ventas.filter((v: any) => {
      const invoice = (v.invoice_number || '').toLowerCase();
      const customer = (v.customer_name || '').toLowerCase();
      const phone = (v.customer_phone || '').toLowerCase();
      return invoice.includes(term) || customer.includes(term) || phone.includes(term);
    });
    
    const totalVendedor = matchingVentas.reduce((sum: number, v: any) => sum + Number(v.total_amount), 0);
    return { 
      ...seller, 
      ventas: matchingVentas, 
      totalVendedor, 
      cantidadVentas: matchingVentas.length 
    };
  }).filter((s: any) => s.ventas.length > 0) : dateFilteredSales;

  const handleExportCSV = () => {
    const headers = ['Fecha', 'Factura', 'Vendedor', 'Cliente', 'Telefono', 'Productos', 'Total', 'Tipo'];
    const rows: string[] = [];
    
    filteredSales.forEach((sellerData: any) => {
      sellerData.ventas.forEach((venta: any) => {
        let items = [];
        try { items = JSON.parse(venta.items || '[]'); } catch (e) { items = []; }
        
        const productosStr = items.map((item: any) => `${item.name} (x${item.quantity})`).join(' | ');
        const fecha = new Date(venta.created_at).toLocaleString('es-CO');
        const tipo = venta.sale_type === 'cart' ? 'Carrito/Web' : 'Vendedor';
        
        rows.push([`"${fecha}"`, `"${venta.invoice_number}"`, `"${sellerData.vendedor}"`, `"${venta.customer_name}"`, `"${venta.customer_phone || 'N/A'}"`, `"${productosStr}"`, `"${Number(venta.total_amount).toLocaleString('es-CO')}"`, `"${tipo}"`].join(','));
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = startDate && endDate ? `${startDate}_a_${endDate}` : 'todas_las_fechas';
    link.setAttribute('download', `reporte_ventas_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTotalGeneral = filteredSales.reduce((sum: number, s: any) => sum + s.totalVendedor, 0);
  const filteredTotalVentas = filteredSales.reduce((sum: number, s: any) => sum + s.cantidadVentas, 0);

  const pieData = filteredSales.map((s: any) => ({
    name: s.vendedor,
    value: s.totalVendedor
  }));

  const monthlyDataObj: Record<string, number> = {};
  filteredSales.forEach((seller: any) => {
    seller.ventas.forEach((venta: any) => {
      const date = new Date(venta.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyDataObj[monthKey] = (monthlyDataObj[monthKey] || 0) + Number(venta.total_amount);
    });
  });
  const barData = Object.keys(monthlyDataObj).sort().map(key => ({
    name: key,
    Total: monthlyDataObj[key]
  }));

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.25rem' }}>Cargando ventas...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}> Dashboard de Ventas</h1>
          <button onClick={() => router.push('/admin')} style={{ background: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>← Volver al Admin</button>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'end' }}>
          <div style={{ flex: '2', minWidth: '250px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>🔍 Buscar (Factura, Cliente o Teléfono)</label>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej: F-001, Juan Pérez, 300..."
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>Fecha Inicio</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>Fecha Fin</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }} />
          </div>
          <button onClick={() => { setStartDate(''); setEndDate(''); setSearchTerm(''); }} style={{ background: '#f3f4f6', color: '#374151', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: 'bold', height: '42px' }}>Limpiar</button>
          <button onClick={handleExportCSV} style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', height: '42px' }}>📥 Descargar CSV</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)', padding: '1.5rem', borderRadius: '0.75rem', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Total General</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>${filteredTotalGeneral.toLocaleString('es-CO')}</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #059669, #10b981)', padding: '1.5rem', borderRadius: '0.75rem', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Total Ventas</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{filteredTotalVentas}</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #dc2626, #f87171)', padding: '1.5rem', borderRadius: '0.75rem', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Vendedores Activos</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{filteredSales.length}</p>
          </div>
        </div>

        {topProducts.length > 0 && (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151', marginBottom: '1rem', textAlign: 'center' }}>
              🏆 Top 10 Productos Más Vendidos
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {topProducts.map((product, index) => (
                <div 
                  key={index} 
                  style={{ 
                    background: index === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 
                               index === 1 ? 'linear-gradient(135deg, #e5e7eb, #9ca3af)' : 
                               index === 2 ? 'linear-gradient(135deg, #fdba74, #ea580c)' : 
                               'linear-gradient(135deg, #f3f4f6, #d1d5db)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: index < 3 ? '2px solid gold' : '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: index < 3 ? '#1f2937' : '#6b7280' }}>
                      #{index + 1}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#16a34a' }}>
                      {product.totalQuantity} unidades
                    </span>
                  </div>
                  <h4 style={{ margin: '0.5rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {product.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                    Ingresos: ${product.totalRevenue.toLocaleString('es-CO')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#374151', marginBottom: '1rem', textAlign: 'center' }}>📈 Tendencia de Ventas por Mes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-CO')}`} />
                <Bar dataKey="Total" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#374151', marginBottom: '1rem', textAlign: 'center' }}>🥧 Distribución por Vendedor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-CO')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {filteredSales.length === 0 ? (
          <div style={{ background: 'white', padding: '3rem', borderRadius: '0.75rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              {searchTerm ? 'No se encontraron ventas con ese criterio de búsqueda' : 'No hay ventas registradas en el periodo seleccionado'}
            </p>
          </div>
        ) : (
          filteredSales.map((sellerData: any, index: number) => (
            <div key={index} style={{ background: 'white', borderRadius: '0.75rem', marginBottom: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div onClick={() => toggleSeller(sellerData.vendedor)} style={{ background: expandedSeller === sellerData.vendedor ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{sellerData.vendedor}</h2>
                  <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.875rem' }}>{sellerData.cantidadVentas} ventas</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>${sellerData.totalVendedor.toLocaleString('es-CO')}</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>{expandedSeller === sellerData.vendedor ? '▲ Ocultar detalles' : '▶ Ver detalles'}</p>
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
                          <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellerData.ventas.map((sale: any, saleIndex: number) => {
                          let items = [];
                          try { items = JSON.parse(sale.items || '[]'); } catch (e) { items = []; }
                          return (
                            <tr key={saleIndex} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#1e40af' }}>{sale.invoice_number}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ fontWeight: '600' }}>{sale.customer_name}</div>
                                {sale.customer_phone && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{sale.customer_phone}</div>}
                              </td>
                              <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{items.map((item: any) => <div key={item.name} style={{ marginBottom: '0.25rem' }}>{item.name} x{item.quantity}</div>)}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#16a34a' }}>${Number(sale.total_amount).toLocaleString('es-CO')}</td>
                              <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>{new Date(sale.created_at).toLocaleString('es-CO')}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                <button 
                                  onClick={() => handleVoidSale(sale.id, sale.invoice_number)}
                                  style={{ 
                                    background: '#dc2626', 
                                    color: 'white', 
                                    padding: '0.4rem 0.8rem', 
                                    borderRadius: '0.375rem', 
                                    border: 'none', 
                                    cursor: 'pointer', 
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem'
                                  }}
                                  title="Anular venta y devolver stock"
                                >
                                   Anular
                                </button>
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