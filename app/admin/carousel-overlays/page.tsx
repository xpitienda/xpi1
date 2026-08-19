'use client';

import { useState, useEffect } from 'react';

interface Overlay {
  id: number;
  text: string;
  font_size: number;
  font_color: string;
  font_weight: string;
  background_color: string;
  animation_speed: number;
  direction: string;
  pause_on_hover: number;
  starts_at: string;
  ends_at: string;
  is_active: number;
}

export default function CarouselOverlaysAdmin() {
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    text: 'NUEVA COLECCIÓN',
    font_size: 48,
    font_color: '#FFFFFF',
    font_weight: 'bold',
    background_color: 'transparent',
    animation_speed: 30,
    direction: 'left',
    pause_on_hover: 1,
    starts_at: '',
    ends_at: '',
    is_active: 1
  });

  useEffect(() => { fetchOverlays(); }, []);

  const fetchOverlays = async () => {
    try {
      const res = await fetch('/api/admin/carousel-overlays');
      const data = await res.json();
      setOverlays(data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/carousel-overlays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('✅ Texto creado exitosamente');
        setShowForm(false);
        fetchOverlays();
      } else {
        alert('❌ Error al crear el texto');
      }
    } catch (error) { alert('❌ Error al crear'); }
  };

  const toggleActive = async (id: number, current: number) => {
    try {
      await fetch(`/api/admin/carousel-overlays/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: current === 1 ? 0 : 1 })
      });
      fetchOverlays();
    } catch (error) { console.error(error); }
  };

  const deleteOverlay = async (id: number) => {
    if (!confirm('¿Eliminar este texto?')) return;
    try {
      await fetch(`/api/admin/carousel-overlays/${id}`, { method: 'DELETE' });
      fetchOverlays();
    } catch (error) { console.error(error); }
  };

  // Estilos base
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#F3E8FF',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#6B2D8B',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  };

  const subtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '2rem'
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '0 auto 2rem auto'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '2px solid #E9D5FF',
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    border: '2px solid #E9D5FF',
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    background: 'white',
    outline: 'none',
    boxSizing: 'border-box'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3E8FF' }}>
      <p style={{ color: '#6B2D8B', fontWeight: 'bold', fontSize: '1.25rem' }}>Cargando...</p>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Título */}
        <h1 style={titleStyle}>Textos Flotantes del Carrusel</h1>
        <p style={subtitleStyle}>Crea textos animados que se desplazan sobre el carrusel</p>

        {/* Botón toggle */}
        {!showForm && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button 
              onClick={() => setShowForm(true)}
              style={{
                background: '#6B2D8B',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(107, 45, 139, 0.3)'
              }}
            >
               Nuevo Texto
            </button>
          </div>
        )}

        {/* Formulario */}
        {showForm && (
          <div style={cardStyle}>
            <h2 style={{ color: '#6B2D8B', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
              Configurar Texto Rolling
            </h2>
            
            <form onSubmit={handleSubmit}>
              {/* Texto */}
              <div style={{ marginBottom: '1rem' }}>
                <input 
                  type="text" 
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  placeholder="Ej: NUEVA COLECCIÓN"
                  style={inputStyle}
                  required 
                />
              </div>

              {/* Fila: Tamaño y Color */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Tamaño (px)</label>
                  <input 
                    type="number" 
                    value={formData.font_size || 48}
                    onChange={(e) => setFormData({...formData, font_size: parseInt(e.target.value) || 48})}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Color del texto</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="color" 
                      value={formData.font_color}
                      onChange={(e) => setFormData({...formData, font_color: e.target.value})}
                      style={{ height: '42px', width: '60px', border: '2px solid #E9D5FF', borderRadius: '0.75rem', cursor: 'pointer' }}
                    />
                    <input 
                      type="text" 
                      value={formData.font_color}
                      onChange={(e) => setFormData({...formData, font_color: e.target.value})}
                      style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Fila: Velocidad y Dirección */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Velocidad</label>
                  <select 
                    value={formData.animation_speed || 30}
                    onChange={(e) => setFormData({...formData, animation_speed: parseInt(e.target.value) || 30})}
                    style={selectStyle}
                  >
                    <option value="15"> Rápido (15s)</option>
                    <option value="30">🚶 Normal (30s)</option>
                    <option value="60">🐢 Lento (60s)</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Dirección</label>
                  <select 
                    value={formData.direction}
                    onChange={(e) => setFormData({...formData, direction: e.target.value})}
                    style={selectStyle}
                  >
                    <option value="left">⬅️ Derecha a Izquierda</option>
                    <option value="right">➡️ Izquierda a Derecha</option>
                  </select>
                </div>
              </div>

              {/* Color de fondo */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Color de fondo del texto</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, background_color: 'transparent'})}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: formData.background_color === 'transparent' ? '2px solid #6B2D8B' : '2px solid #E5E7EB',
                      background: formData.background_color === 'transparent' ? '#F3E8FF' : 'white',
                      color: formData.background_color === 'transparent' ? '#6B2D8B' : '#6b7280',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Transparente
                  </button>
                  <input 
                    type="color" 
                    value={formData.background_color === 'transparent' ? '#6B2D8B' : formData.background_color}
                    onChange={(e) => setFormData({...formData, background_color: e.target.value + 'CC'})}
                    style={{ height: '42px', width: '60px', border: '2px solid #E9D5FF', borderRadius: '0.75rem', cursor: 'pointer' }}
                  />
                  <input 
                    type="text" 
                    value={formData.background_color}
                    onChange={(e) => setFormData({...formData, background_color: e.target.value})}
                    placeholder="transparent o #6B2D8BCC"
                    style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                   Tip: Agrega "CC" al final del hex para transparencia (ej: #6B2D8BCC = 80% opaco)
                </p>
              </div>

              {/* Fila: Fechas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Inicio</label>
                  <input 
                    type="datetime-local" 
                    value={formData.starts_at}
                    onChange={(e) => setFormData({...formData, starts_at: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Fin</label>
                  <input 
                    type="datetime-local" 
                    value={formData.ends_at}
                    onChange={(e) => setFormData({...formData, ends_at: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* Checkbox Pausar */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                background: '#F3E8FF', 
                padding: '0.75rem 1rem', 
                borderRadius: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <input 
                  type="checkbox" 
                  checked={formData.pause_on_hover === 1}
                  onChange={(e) => setFormData({...formData, pause_on_hover: e.target.checked ? 1 : 0})}
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: '#6B2D8B' }}
                />
                <label style={{ fontWeight: 'bold', color: '#6B2D8B', margin: 0, cursor: 'pointer' }}>
                  Pausar animación al pasar el mouse
                </label>
              </div>

              {/* Preview en vivo */}
              <div style={{ 
                border: '2px dashed #6B2D8B', 
                borderRadius: '1rem', 
                padding: '1rem', 
                marginBottom: '1.5rem',
                background: '#F9FAFB'
              }}>
                <p style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  color: '#6B2D8B', 
                  marginBottom: '0.75rem', 
                  textAlign: 'center',
                  textTransform: 'uppercase'
                }}>
                  👁️ Vista Previa en Vivo
                </p>
                <div style={{ 
                  overflow: 'hidden', 
                  borderRadius: '0.75rem', 
                  padding: '1.5rem 1rem', 
                  position: 'relative',
                  background: 'linear-gradient(135deg, #A855F7, #7C3AED)',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <style>{`
                    @keyframes rollTextPreview {
                      0% { transform: translateX(100%); }
                      100% { transform: translateX(-100%); }
                    }
                    .rolling-preview {
                      animation: rollTextPreview ${formData.animation_speed}s linear infinite;
                      animation-direction: ${formData.direction === 'left' ? 'normal' : 'reverse'};
                      white-space: nowrap;
                      position: absolute;
                    }
                    .rolling-preview:hover {
                      animation-play-state: ${formData.pause_on_hover ? 'paused' : 'running'};
                    }
                  `}</style>
                  <div 
                    className="rolling-preview"
                    style={{
                      color: formData.font_color,
                      fontSize: '1.5rem',
                      fontWeight: formData.font_weight,
                      backgroundColor: formData.background_color,
                      padding: formData.background_color !== 'transparent' ? '0.5rem 1rem' : '0',
                      borderRadius: '0.5rem'
                    }}
                  >
                    {formData.text || 'TU TEXTO AQUÍ'}
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  type="submit" 
                  style={{
                    flex: 1,
                    background: '#1B8A3B',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(27, 138, 59, 0.3)'
                  }}
                >
                  💾 Guardar Texto
                </button>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    background: '#9CA3AF',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Textos Activos */}
        <div style={{ ...cardStyle, padding: '1.5rem' }}>
          <h2 style={{ color: '#6B2D8B', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Textos Activos
          </h2>
          
          {overlays.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0' }}>
              No hay textos creados aún.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {overlays.map((o) => (
                <div 
                  key={o.id} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    border: '2px solid #F3E8FF',
                    borderRadius: '0.75rem',
                    background: '#FAFAFA'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontWeight: 'bold', 
                      fontSize: '1rem', 
                      marginBottom: '0.25rem',
                      color: o.font_color,
                      backgroundColor: o.background_color !== 'transparent' ? o.background_color : 'transparent',
                      padding: o.background_color !== 'transparent' ? '0.25rem 0.75rem' : '0',
                      borderRadius: '0.5rem',
                      display: 'inline-block'
                    }}>
                      {o.text}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                      {o.animation_speed}s • {o.direction === 'left' ? '⬅️' : '➡️'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => toggleActive(o.id, o.is_active)}
                      style={{
                        background: o.is_active === 1 ? '#1B8A3B' : '#D1D5DB',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      {o.is_active === 1 ? 'Activo' : 'Inactivo'}
                    </button>
                    <button 
                      onClick={() => deleteOverlay(o.id)}
                      style={{
                        background: '#EF4444',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}