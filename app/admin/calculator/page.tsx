'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

export default function CalculatorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('venta-completa');
  const [history, setHistory] = useState<any[]>([]);

  // 🎯 CALCULADORA VENTA COMPLETA (NUEVA - LA MÁS IMPORTANTE)
  const [costoProducto, setCostoProducto] = useState<number | ''>('');
  const [margenDeseado, setMargenDeseado] = useState<number | ''>('');
  const [costoEnvio, setCostoEnvio] = useState<number | ''>('');
  const [reenvio, setReenvio] = useState<number | ''>('');
  const [comisionPlataforma, setComisionPlataforma] = useState<number | ''>('');
  const [ivaPorc, setIvaPorc] = useState<number | ''>('');
  const [descuentoPorc, setDescuentoPorc] = useState<number | ''>('');

  // CALCULADORA 1: PRECIO Y MARGEN
  const [costo, setCosto] = useState<number | ''>('');
  const [margen, setMargen] = useState<number | ''>('');

  // CALCULADORA 2: DESCUENTOS E IVA
  const [precioOriginal, setPrecioOriginal] = useState<number | ''>('');
  const [descuentoPorc2, setDescuentoPorc2] = useState<number | ''>('');
  const [aplicarIva, setAplicarIva] = useState(false);

  // CALCULADORA 3: ENVÍO Y GANANCIA REAL
  const [precioVenta, setPrecioVenta] = useState<number | ''>('');
  const [costoProd, setCostoProd] = useState<number | ''>('');
  const [costoEnvio2, setCostoEnvio2] = useState<number | ''>('');
  const [comisionPorc, setComisionPorc] = useState<number | ''>('');

  // CALCULADORA 4: PROYECCIÓN Y ROI
  const [inversion, setInversion] = useState<number | ''>('');
  const [precioUnit, setPrecioUnit] = useState<number | ''>('');
  const [costoUnit, setCostoUnit] = useState<number | ''>('');
  const [unidades, setUnidades] = useState<number | ''>('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('xpi_calculator_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const saveToHistory = (type: string, details: string, result: string) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleString('es-CO'),
      type,
      details,
      result,
    };
    const updatedHistory = [newEntry, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('xpi_calculator_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('xpi_calculator_history');
  };

  //  CÁLCULOS VENTA COMPLETA
  const costoTotal = Number(costoProducto) + Number(costoEnvio) + Number(reenvio);
  
  // Fórmula: Precio Venta = Costo Total / (1 - margen - comisión - iva + descuento)
  const divisor = 1 - (Number(margenDeseado) / 100) - (Number(comisionPlataforma) / 100) - (Number(ivaPorc) / 100) + (Number(descuentoPorc) / 100);
  const precioVentaSugerido = divisor > 0 ? costoTotal / divisor : 0;
  
  const comisionAmount = precioVentaSugerido * (Number(comisionPlataforma) / 100);
  const ivaAmount = precioVentaSugerido * (Number(ivaPorc) / 100);
  const descuentoAmount = precioVentaSugerido * (Number(descuentoPorc) / 100);
  
  const gananciaNeta = precioVentaSugerido - costoTotal - comisionAmount - ivaAmount + descuentoAmount;
  const margenReal = precioVentaSugerido > 0 ? (gananciaNeta / precioVentaSugerido) * 100 : 0;

  // Porcentajes para la gráfica
  const pctCosto = precioVentaSugerido > 0 ? (Number(costoProducto) / precioVentaSugerido) * 100 : 0;
  const pctEnvio = precioVentaSugerido > 0 ? (Number(costoEnvio) / precioVentaSugerido) * 100 : 0;
  const pctReenvio = precioVentaSugerido > 0 ? (Number(reenvio) / precioVentaSugerido) * 100 : 0;
  const pctComision = precioVentaSugerido > 0 ? (comisionAmount / precioVentaSugerido) * 100 : 0;
  const pctIva = precioVentaSugerido > 0 ? (ivaAmount / precioVentaSugerido) * 100 : 0;
  const pctDescuento = precioVentaSugerido > 0 ? (descuentoAmount / precioVentaSugerido) * 100 : 0;
  const pctGanancia = precioVentaSugerido > 0 ? (gananciaNeta / precioVentaSugerido) * 100 : 0;

  // CÁLCULOS CALCULADORA 1
  const precioSugerido = Number(costo) + (Number(costo) * (Number(margen) / 100));
  const gananciaPrecio = precioSugerido - Number(costo);
  const margenVisual = Number(margen) || 0;

  // CÁLCULOS CALCULADORA 2
  const precioConDescuento = Number(precioOriginal) - (Number(precioOriginal) * (Number(descuentoPorc2) / 100));
  const ivaAmount2 = aplicarIva ? precioConDescuento * 0.19 : 0;
  const totalFinal = precioConDescuento + ivaAmount2;

  // CÁLCULOS CALCULADORA 3
  const totalCobrar = Number(precioVenta) + Number(costoEnvio2);
  const comisionAmount2 = Number(precioVenta) * (Number(comisionPorc) / 100);
  const gananciaNeta2 = Number(precioVenta) - Number(costoProd) - comisionAmount2;
  const margenReal2 = Number(precioVenta) > 0 ? (gananciaNeta2 / Number(precioVenta)) * 100 : 0;

  // CÁLCULOS CALCULADORA 4
  const ingresosProy = Number(precioUnit) * Number(unidades);
  const costosProy = Number(costoUnit) * Number(unidades);
  const utilidadProy = ingresosProy - costosProy;
  const roi = Number(inversion) > 0 ? (utilidadProy / Number(inversion)) * 100 : 0;

  // ESTILOS
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f5f5f0',
    padding: '1.5rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '1.5rem',
    border: '2px solid #e5e7eb',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem',
    fontSize: '1.1rem',
    border: '2px solid #d1d5db',
    borderRadius: '0.75rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontWeight: '600',
    color: '#1f2937',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tabs = [
    { id: 'venta-completa', label: '🎯 Venta Completa', highlight: true },
    { id: 'precio', label: '💰 Precio y Margen' },
    { id: 'descuento', label: '️ Descuentos e IVA' },
    { id: 'envio', label: ' Envío y Ganancia' },
    { id: 'proyeccion', label: '📈 Proyección y ROI' },
    { id: 'historial', label: '🕒 Historial' },
  ];

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '1rem', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        marginBottom: '2rem',
        border: '2px solid #6B2D8B',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => router.push('/admin')} 
            style={{ 
              background: '#6B2D8B', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            ← Volver al Admin
          </button>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            color: '#6B2D8B'
          }}>
            🧮 Calculadora de Ventas XpiTienda
          </h1>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600' }}>
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* MENÚ LATERAL */}
        <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? (tab.highlight ? '#1B8A3B' : '#6B2D8B') : 'white',
                color: activeTab === tab.id ? 'white' : '#374151',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: activeTab === tab.id ? '2px solid ' + (tab.highlight ? '#1B8A3B' : '#6B2D8B') : '2px solid #e5e7eb',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                textAlign: 'left',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ÁREA DE CONTENIDO */}
        <div style={{ flex: 1 }}>
          
          {/* 🎯 VENTA COMPLETA - LA NUEVA Y MÁS IMPORTANTE */}
          {activeTab === 'venta-completa' && (
            <div>
              <div style={{ 
                background: '#1B8A3B', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '1rem', 
                marginBottom: '1.5rem',
                border: '3px solid #14532d'
              }}>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>
                  🎯 Calculadora de Venta Completa
                </h2>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', opacity: 0.95 }}>
                  Ingresa TODOS tus costos y descubre exactamente a cuánto vender y cuánto te queda limpio.
                </p>
              </div>

              <div style={cardStyle}>
                {/* SECCIÓN 1: COSTOS */}
                <h3 style={{ color: '#6B2D8B', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                   TUS COSTOS
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={labelStyle}>Costo del Producto ($)</label>
                    <input type="number" value={costoProducto} onChange={(e) => setCostoProducto(Number(e.target.value))} placeholder="2350000" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Costo de Envío ($)</label>
                    <input type="number" value={costoEnvio} onChange={(e) => setCostoEnvio(Number(e.target.value))} placeholder="40000" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Reenvío / Adicional ($)</label>
                    <input type="number" value={reenvio} onChange={(e) => setReenvio(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                </div>

                {/* SECCIÓN 2: MARGEN Y COMISIONES */}
                <h3 style={{ color: '#6B2D8B', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                  📊 MARGEN Y COMISIONES
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={labelStyle}>Margen Deseado (%)</label>
                    <input type="number" value={margenDeseado} onChange={(e) => setMargenDeseado(Number(e.target.value))} placeholder="25" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Comisión Plataforma (%)</label>
                    <input type="number" value={comisionPlataforma} onChange={(e) => setComisionPlataforma(Number(e.target.value))} placeholder="7" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>IVA (%)</label>
                    <input type="number" value={ivaPorc} onChange={(e) => setIvaPorc(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Descuento (%)</label>
                    <input type="number" value={descuentoPorc} onChange={(e) => setDescuentoPorc(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                </div>

                {/* GRÁFICA DE DISTRIBUCIÓN */}
                {precioVentaSugerido > 0 && (
                  <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem', border: '2px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#4b5563', fontSize: '1rem' }}>
                      📊 ¿Cómo se distribuye tu precio de venta?
                    </h3>
                    <div style={{ display: 'flex', height: '50px', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '1rem' }}>
                      {pctCosto > 0 && (
                        <div style={{ 
                          width: `${pctCosto}%`, 
                          background: '#6B2D8B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}>
                          {pctCosto.toFixed(0)}%
                        </div>
                      )}
                      {pctEnvio > 0 && (
                        <div style={{ 
                          width: `${pctEnvio}%`, 
                          background: '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}>
                          {pctEnvio.toFixed(0)}%
                        </div>
                      )}
                      {pctReenvio > 0 && (
                        <div style={{ 
                          width: `${pctReenvio}%`, 
                          background: '#06b6d4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}>
                          {pctReenvio.toFixed(0)}%
                        </div>
                      )}
                      {pctComision > 0 && (
                        <div style={{ 
                          width: `${pctComision}%`, 
                          background: '#f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}>
                          {pctComision.toFixed(0)}%
                        </div>
                      )}
                      {pctIva > 0 && (
                        <div style={{ 
                          width: `${pctIva}%`, 
                          background: '#8b5cf6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}>
                          {pctIva.toFixed(0)}%
                        </div>
                      )}
                      {pctDescuento > 0 && (
                        <div style={{ 
                          width: `${pctDescuento}%`, 
                          background: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}>
                          {pctDescuento.toFixed(0)}%
                        </div>
                      )}
                      {pctGanancia > 0 && (
                        <div style={{ 
                          width: `${pctGanancia}%`, 
                          background: '#1B8A3B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}>
                          {pctGanancia.toFixed(0)}%
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '14px', height: '14px', background: '#6B2D8B', borderRadius: '0.25rem' }}></div>
                        <span>Costo</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '14px', height: '14px', background: '#3b82f6', borderRadius: '0.25rem' }}></div>
                        <span>Envío</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '14px', height: '14px', background: '#06b6d4', borderRadius: '0.25rem' }}></div>
                        <span>Reenvío</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '14px', height: '14px', background: '#f59e0b', borderRadius: '0.25rem' }}></div>
                        <span>Comisión</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '14px', height: '14px', background: '#8b5cf6', borderRadius: '0.25rem' }}></div>
                        <span>IVA</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '14px', height: '14px', background: '#ef4444', borderRadius: '0.25rem' }}></div>
                        <span>Descuento</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '14px', height: '14px', background: '#1B8A3B', borderRadius: '0.25rem' }}></div>
                        <span>Ganancia</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* RESULTADOS PRINCIPALES */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                  <div style={{ 
                    background: '#f3e8ff',
                    border: '3px solid #6B2D8B',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6B2D8B', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                       PRECIO DE VENTA
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#6B2D8B' }}>
                      {formatCurrency(precioVentaSugerido)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      A este precio debes vender
                    </div>
                  </div>
                  <div style={{ 
                    background: '#dcfce7',
                    border: '3px solid #1B8A3B',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#1B8A3B', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      💵 GANANCIA NETA
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1B8A3B' }}>
                      {formatCurrency(gananciaNeta)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      Lo que te queda limpio
                    </div>
                  </div>
                  <div style={{ 
                    background: '#fef3c7',
                    border: '3px solid #f59e0b',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#d97706', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      📈 MARGEN REAL
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#d97706' }}>
                      {margenReal.toFixed(2)}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      Tu ganancia real sobre la venta
                    </div>
                  </div>
                </div>

                {/* DESGLOSE DETALLADO */}
                {precioVentaSugerido > 0 && (
                  <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem', border: '2px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#4b5563', fontSize: '1rem' }}>
                      📋 Desglose detallado de tu venta
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.95rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'white', borderRadius: '0.5rem' }}>
                        <span> Costo producto:</span>
                        <strong>{formatCurrency(Number(costoProducto))}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'white', borderRadius: '0.5rem' }}>
                        <span>🚚 Envío:</span>
                        <strong>{formatCurrency(Number(costoEnvio))}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'white', borderRadius: '0.5rem' }}>
                        <span>🔄 Reenvío:</span>
                        <strong>{formatCurrency(Number(reenvio))}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'white', borderRadius: '0.5rem' }}>
                        <span>💳 Comisión plataforma:</span>
                        <strong>{formatCurrency(comisionAmount)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'white', borderRadius: '0.5rem' }}>
                        <span>🏛️ IVA:</span>
                        <strong>{formatCurrency(ivaAmount)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'white', borderRadius: '0.5rem' }}>
                        <span>🏷️ Descuento:</span>
                        <strong style={{ color: '#ef4444' }}>-{formatCurrency(descuentoAmount)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#dcfce7', borderRadius: '0.5rem', border: '2px solid #1B8A3B', gridColumn: '1 / -1' }}>
                        <span style={{ fontWeight: 'bold', color: '#1B8A3B' }}>✅ GANANCIA NETA:</span>
                        <strong style={{ color: '#1B8A3B', fontSize: '1.1rem' }}>{formatCurrency(gananciaNeta)}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {divisor <= 0 && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '0.75rem', color: '#991b1b', fontWeight: 'bold', textAlign: 'center' }}>
                    ⚠️ Los porcentajes de margen + comisión + IVA superan el 100%. Ajusta los valores.
                  </div>
                )}

                <button 
                  onClick={() => saveToHistory('Venta Completa', `Costo: ${formatCurrency(Number(costoProducto))} | Envío: ${formatCurrency(Number(costoEnvio))} | Margen: ${margenDeseado}%`, `Precio: ${formatCurrency(precioVentaSugerido)} | Ganancia: ${formatCurrency(gananciaNeta)} (${margenReal.toFixed(2)}%)`)}
                  style={{ 
                    marginTop: '1.5rem', 
                    width: '100%', 
                    padding: '1rem', 
                    background: '#1B8A3B', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '0.75rem', 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem', 
                    cursor: 'pointer'
                  }}
                >
                  💾 Guardar en Historial
                </button>
              </div>
            </div>
          )}

          {/* CALCULADORA 1: PRECIO Y MARGEN */}
          {activeTab === 'precio' && (
            <div>
              <h2 style={{ color: '#6B2D8B', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                💰 Calculadora de Precio y Margen
              </h2>
              <div style={cardStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={labelStyle}>Costo del Producto ($)</label>
                    <input type="number" value={costo} onChange={(e) => setCosto(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Margen de Ganancia Deseado (%)</label>
                    <input type="number" value={margen} onChange={(e) => setMargen(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                </div>
                
                {Number(costo) > 0 && Number(margen) > 0 && (
                  <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#4b5563', fontSize: '1rem' }}>📊 Distribución del Precio</h3>
                    <div style={{ display: 'flex', height: '60px', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '1rem' }}>
                      <div style={{ 
                        width: `${100 - margenVisual}%`, 
                        background: '#6B2D8B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        Costo: {(100 - margenVisual).toFixed(0)}%
                      </div>
                      <div style={{ 
                        width: `${margenVisual}%`, 
                        background: '#1B8A3B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        Ganancia: {margenVisual}%
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                  <div style={{ 
                    background: '#f3e8ff',
                    border: '3px solid #6B2D8B',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6B2D8B', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      PRECIO DE VENTA SUGERIDO
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6B2D8B' }}>
                      {formatCurrency(precioSugerido)}
                    </div>
                  </div>
                  <div style={{ 
                    background: '#dcfce7',
                    border: '3px solid #1B8A3B',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#1B8A3B', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      GANANCIA EN PESOS
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1B8A3B' }}>
                      {formatCurrency(gananciaPrecio)}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => saveToHistory('Precio y Margen', `Costo: ${formatCurrency(Number(costo))} | Margen: ${margen}%`, `Precio: ${formatCurrency(precioSugerido)} | Ganancia: ${formatCurrency(gananciaPrecio)}`)}
                  style={{ 
                    marginTop: '1.5rem', 
                    width: '100%', 
                    padding: '1rem', 
                    background: '#6B2D8B', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '0.75rem', 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem', 
                    cursor: 'pointer'
                  }}
                >
                  💾 Guardar en Historial
                </button>
              </div>
            </div>
          )}

          {/* CALCULADORA 2: DESCUENTOS E IVA */}
          {activeTab === 'descuento' && (
            <div>
              <h2 style={{ color: '#6B2D8B', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                🏷️ Descuentos e Impuestos (IVA 19%)
              </h2>
              <div style={cardStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={labelStyle}>Precio Original ($)</label>
                    <input type="number" value={precioOriginal} onChange={(e) => setPrecioOriginal(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Descuento (%)</label>
                    <input type="number" value={descuentoPorc2} onChange={(e) => setDescuentoPorc2(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem', 
                      cursor: 'pointer', 
                      padding: '0.875rem', 
                      background: aplicarIva ? '#dcfce7' : '#f3f4f6', 
                      borderRadius: '0.75rem', 
                      border: `2px solid ${aplicarIva ? '#1B8A3B' : '#d1d5db'}`
                    }}>
                      <input type="checkbox" checked={aplicarIva} onChange={(e) => setAplicarIva(e.target.checked)} style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span style={{ fontWeight: 'bold', color: aplicarIva ? '#1B8A3B' : '#4b5563' }}>
                        Aplicar IVA (19%)
                      </span>
                    </label>
                  </div>
                </div>

                {Number(precioOriginal) > 0 && (
                  <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#4b5563', fontSize: '1rem' }}>📊 Desglose del Precio</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '150px', marginBottom: '1rem' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          background: '#6B2D8B',
                          borderRadius: '0.5rem 0.5rem 0 0',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          paddingBottom: '0.5rem',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          {formatCurrency(Number(precioOriginal))}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold' }}>Original</span>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '100%', 
                          height: `${(precioConDescuento / Number(precioOriginal)) * 100}%`, 
                          background: '#f59e0b',
                          borderRadius: '0.5rem 0.5rem 0 0',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          paddingBottom: '0.5rem',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          {formatCurrency(precioConDescuento)}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold' }}>Con Descuento</span>
                      </div>
                      {aplicarIva && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '100%', 
                            height: `${(totalFinal / Number(precioOriginal)) * 100}%`, 
                            background: '#1B8A3B',
                            borderRadius: '0.5rem 0.5rem 0 0',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingBottom: '0.5rem',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.85rem'
                          }}>
                            {formatCurrency(totalFinal)}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold' }}>Con IVA</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                  <div style={{ 
                    background: '#fef3c7',
                    border: '3px solid #f59e0b',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#d97706', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      PRECIO CON DESCUENTO
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>
                      {formatCurrency(precioConDescuento)}
                    </div>
                  </div>
                  <div style={{ 
                    background: '#f3e8ff',
                    border: '3px solid #6B2D8B',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6B2D8B', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      VALOR DEL IVA
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6B2D8B' }}>
                      {formatCurrency(ivaAmount2)}
                    </div>
                  </div>
                  <div style={{ 
                    background: '#dcfce7',
                    border: '3px solid #1B8A3B',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#1B8A3B', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      TOTAL FINAL
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1B8A3B' }}>
                      {formatCurrency(totalFinal)}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => saveToHistory('Descuentos e IVA', `Original: ${formatCurrency(Number(precioOriginal))} | Desc: ${descuentoPorc2}% | IVA: ${aplicarIva ? 'Sí' : 'No'}`, `Total: ${formatCurrency(totalFinal)}`)}
                  style={{ 
                    marginTop: '1.5rem', 
                    width: '100%', 
                    padding: '1rem', 
                    background: '#6B2D8B', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '0.75rem', 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem', 
                    cursor: 'pointer'
                  }}
                >
                  💾 Guardar en Historial
                </button>
              </div>
            </div>
          )}

          {/* CALCULADORA 3: ENVÍO Y GANANCIA REAL */}
          {activeTab === 'envio' && (
            <div>
              <h2 style={{ color: '#6B2D8B', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                📦 Envío y Ganancia Real
              </h2>
              <div style={cardStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={labelStyle}>Precio de Venta ($)</label>
                    <input type="number" value={precioVenta} onChange={(e) => setPrecioVenta(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Costo del Producto ($)</label>
                    <input type="number" value={costoProd} onChange={(e) => setCostoProd(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Costo de Envío ($)</label>
                    <input type="number" value={costoEnvio2} onChange={(e) => setCostoEnvio2(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Comisión Plataforma/Vendedor (%)</label>
                    <input type="number" value={comisionPorc} onChange={(e) => setComisionPorc(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                </div>

                {Number(precioVenta) > 0 && (
                  <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#4b5563', fontSize: '1rem' }}>📊 Distribución de la Venta</h3>
                    <div style={{ display: 'flex', height: '40px', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '1rem' }}>
                      {Number(costoProd) > 0 && (
                        <div style={{ 
                          width: `${(Number(costoProd) / Number(precioVenta)) * 100}%`, 
                          background: '#6B2D8B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          Costo: {((Number(costoProd) / Number(precioVenta)) * 100).toFixed(0)}%
                        </div>
                      )}
                      {comisionAmount2 > 0 && (
                        <div style={{ 
                          width: `${(comisionAmount2 / Number(precioVenta)) * 100}%`, 
                          background: '#f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          Comisión: {((comisionAmount2 / Number(precioVenta)) * 100).toFixed(0)}%
                        </div>
                      )}
                      {gananciaNeta2 > 0 && (
                        <div style={{ 
                          width: `${(gananciaNeta2 / Number(precioVenta)) * 100}%`, 
                          background: '#1B8A3B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          Ganancia: {margenReal2.toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                  <div style={{ 
                    background: '#dbeafe',
                    border: '3px solid #3b82f6',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#1d4ed8', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      TOTAL A COBRAR
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1d4ed8' }}>
                      {formatCurrency(totalCobrar)}
                    </div>
                  </div>
                  <div style={{ 
                    background: '#dcfce7',
                    border: '3px solid #1B8A3B',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#1B8A3B', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      GANANCIA NETA
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1B8A3B' }}>
                      {formatCurrency(gananciaNeta2)}
                    </div>
                  </div>
                  <div style={{ 
                    background: '#f3e8ff',
                    border: '3px solid #6B2D8B',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6B2D8B', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      MARGEN REAL
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6B2D8B' }}>
                      {margenReal2.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => saveToHistory('Envío y Ganancia', `Venta: ${formatCurrency(Number(precioVenta))} | Envío: ${formatCurrency(Number(costoEnvio2))}`, `Ganancia Neta: ${formatCurrency(gananciaNeta2)} | Margen: ${margenReal2.toFixed(2)}%`)}
                  style={{ 
                    marginTop: '1.5rem', 
                    width: '100%', 
                    padding: '1rem', 
                    background: '#6B2D8B', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '0.75rem', 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem', 
                    cursor: 'pointer'
                  }}
                >
                  💾 Guardar en Historial
                </button>
              </div>
            </div>
          )}

          {/* CALCULADORA 4: PROYECCIÓN Y ROI */}
          {activeTab === 'proyeccion' && (
            <div>
              <h2 style={{ color: '#6B2D8B', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                📈 Proyección de Ventas y ROI
              </h2>
              <div style={cardStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={labelStyle}>Inversión Inicial ($)</label>
                    <input type="number" value={inversion} onChange={(e) => setInversion(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Unidades a Vender (Mes)</label>
                    <input type="number" value={unidades} onChange={(e) => setUnidades(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Precio Unitario de Venta ($)</label>
                    <input type="number" value={precioUnit} onChange={(e) => setPrecioUnit(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Costo Unitario ($)</label>
                    <input type="number" value={costoUnit} onChange={(e) => setCostoUnit(Number(e.target.value))} placeholder="0" style={inputStyle} />
                  </div>
                </div>

                {Number(unidades) > 0 && (
                  <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#4b5563', fontSize: '1rem' }}>📊 Ingresos vs Costos vs Utilidad</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '180px', marginBottom: '1rem' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          background: '#3b82f6',
                          borderRadius: '0.5rem 0.5rem 0 0',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          paddingBottom: '0.5rem',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}>
                          {formatCurrency(ingresosProy)}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 'bold' }}>Ingresos</span>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '100%', 
                          height: `${(costosProy / ingresosProy) * 100}%`, 
                          background: '#ef4444',
                          borderRadius: '0.5rem 0.5rem 0 0',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          paddingBottom: '0.5rem',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}>
                          {formatCurrency(costosProy)}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 'bold' }}>Costos</span>
                      </div>
                      {utilidadProy > 0 && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '100%', 
                            height: `${(utilidadProy / ingresosProy) * 100}%`, 
                            background: '#1B8A3B',
                            borderRadius: '0.5rem 0.5rem 0 0',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingBottom: '0.5rem',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}>
                            {formatCurrency(utilidadProy)}
                          </div>
                          <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 'bold' }}>Utilidad</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                  <div style={{ 
                    background: '#dbeafe',
                    border: '3px solid #3b82f6',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 'bold', marginBottom: '0.25rem' }}>INGRESOS</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1d4ed8' }}>{formatCurrency(ingresosProy)}</div>
                  </div>
                  <div style={{ 
                    background: '#fee2e2',
                    border: '3px solid #ef4444',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 'bold', marginBottom: '0.25rem' }}>COSTOS</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>{formatCurrency(costosProy)}</div>
                  </div>
                  <div style={{ 
                    background: '#dcfce7',
                    border: '3px solid #1B8A3B',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#1B8A3B', fontWeight: 'bold', marginBottom: '0.25rem' }}>UTILIDAD</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1B8A3B' }}>{formatCurrency(utilidadProy)}</div>
                  </div>
                  <div style={{ 
                    background: '#f3e8ff',
                    border: '3px solid #6B2D8B',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#6B2D8B', fontWeight: 'bold', marginBottom: '0.25rem' }}>ROI</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6B2D8B' }}>{roi.toFixed(2)}%</div>
                  </div>
                </div>

                <button 
                  onClick={() => saveToHistory('Proyección y ROI', `Inversión: ${formatCurrency(Number(inversion))} | Unidades: ${unidades}`, `Utilidad: ${formatCurrency(utilidadProy)} | ROI: ${roi.toFixed(2)}%`)}
                  style={{ 
                    marginTop: '1.5rem', 
                    width: '100%', 
                    padding: '1rem', 
                    background: '#6B2D8B', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '0.75rem', 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem', 
                    cursor: 'pointer'
                  }}
                >
                  💾 Guardar en Historial
                </button>
              </div>
            </div>
          )}

          {/* HISTORIAL */}
          {activeTab === 'historial' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#6B2D8B', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                  🕒 Historial de Cálculos
                </h2>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory} 
                    style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      padding: '0.75rem 1.5rem', 
                      borderRadius: '0.5rem', 
                      fontWeight: 'bold', 
                      cursor: 'pointer' 
                    }}
                  >
                    🗑️ Limpiar Historial
                  </button>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: 'center', color: '#9ca3af', padding: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                      Aún no has guardado ningún cálculo
                    </p>
                    <p style={{ margin: 0 }}>Los cálculos que guardes aparecerán aquí</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} style={cardStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '2px solid #e5e7eb' }}>
                        <span style={{ 
                          background: '#6B2D8B', 
                          color: 'white', 
                          padding: '0.35rem 1rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.8rem', 
                          fontWeight: 'bold' 
                        }}>
                          {item.type}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.date}</span>
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#4b5563', marginBottom: '0.75rem' }}>{item.details}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', background: '#f9fafb', padding: '0.75rem', borderRadius: '0.5rem' }}>
                        {item.result}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}