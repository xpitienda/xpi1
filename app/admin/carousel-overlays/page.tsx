'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OverlayText {
  id: number;
  text: string;
  font_size: number;
  font_color: string;
  animation_speed: number;
  direction: string;
  background_color: string;
  starts_at?: string;
  ends_at?: string;
  pause_on_hover: number;
  is_active: number;
}

export default function CarouselOverlaysPage() {
  const router = useRouter();
  const [texts, setTexts] = useState<OverlayText[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // ✅ Estados alineados EXACTAMENTE con la API
  const [formData, setFormData] = useState({
    text: 'NUEVA COLECCIÓN',
    font_size: 48,
    font_color: '#FFFFFF',
    font_weight: 'bold',
    animation_speed: 30,
    direction: 'left',
    background_color: 'transparent',
    bg_color_hex: '#6B2D8B',
    starts_at: '',
    ends_at: '',
    pause_on_hover: 1,
    is_active: 1
  });

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      const res = await fetch('/api/admin/carousel-overlays', {
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      if (res.ok) {
        const data = await res.json();
        setTexts(data || []);
      }
    } catch (error) {
      console.error('Error cargando textos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // ✅ Formatear fechas como las espera la API: "YYYY-MM-DDTHH:mm"
      const formatDateTime = (dateStr: string) => {
        if (!dateStr) return null;
        return dateStr + 'T00:00';
      };

      const res = await fetch('/api/admin/carousel-overlays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        },
        body: JSON.stringify({
          text: formData.text,
          font_size: formData.font_size,
          font_color: formData.font_color,
          font_weight: formData.font_weight,
          background_color: formData.background_color,
          animation_speed: formData.animation_speed,
          direction: formData.direction,
          pause_on_hover: formData.pause_on_hover,
          starts_at: formatDateTime(formData.starts_at),
          ends_at: formatDateTime(formData.ends_at),
          is_active: formData.is_active
        })
      });
      
      if (res.ok) {
        setFormData({
          text: 'NUEVA COLECCIÓN',
          font_size: 48,
          font_color: '#FFFFFF',
          font_weight: 'bold',
          animation_speed: 30,
          direction: 'left',
          background_color: 'transparent',
          bg_color_hex: '#6B2D8B',
          starts_at: '',
          ends_at: '',
          pause_on_hover: 1,
          is_active: 1
        });
        setShowForm(false);
        fetchTexts();
      } else {
        const errorData = await res.json();
        console.error('Error de la API:', errorData);
        alert('Error al guardar: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error guardando texto:', error);
      alert('Error de conexión al guardar');
    }
  };

  const toggleActive = async (id: number, currentStatus: number) => {
    try {
      const res = await fetch(`/api/admin/carousel-overlays/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        },
        body: JSON.stringify({ is_active: currentStatus === 1 ? 0 : 1 })
      });
      if (res.ok) fetchTexts();
    } catch (error) {
      console.error('Error actualizando:', error);
    }
  };

  const deleteText = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este texto?')) return;
    try {
      const res = await fetch(`/api/admin/carousel-overlays/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      if (res.ok) fetchTexts();
    } catch (error) {
      console.error('Error eliminando:', error);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf5ff', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <button 
          onClick={() => router.push('/admin')} 
          style={{ 
            marginBottom: '1.5rem', 
            background: '#6B2D8B', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            fontSize: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 6px rgba(107,45,139,0.3)'
          }}
        >
          ← Volver al Panel
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6B2D8B', margin: '0 0 0.5rem 0' }}>
            Textos Flotantes del Carrusel
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: 0 }}>
            Crea textos animados que se desplazan sobre el carrusel
          </p>
        </div>

        {!showForm && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button 
              onClick={() => setShowForm(true)}
              style={{ 
                background: '#6B2D8B', 
                color: 'white', 
                border: 'none', 
                padding: '0.75rem 2rem', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                fontSize: '1rem',
                boxShadow: '0 4px 6px rgba(107,45,139,0.3)'
              }}
            >
              ✨ Nuevo Texto
            </button>
          </div>
        )}

        {showForm && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 10px 25px rgba(107,45,139,0.1)' }}>
            <h2 style={{ color: '#6B2D8B', marginTop: 0, marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.75rem' }}>
              Configurar Texto Rolling
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                value={formData.text}
                onChange={(e) => updateField('text', e.target.value)}
                placeholder="Nombre del texto"
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', fontWeight: 'bold' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151', fontSize: '0.9rem' }}>Tamaño (px)</label>
                <input
                  type="number"
                  value={formData.font_size}
                  onChange={(e) => updateField('font_size', Number(e.target.value))}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151', fontSize: '0.9rem' }}>Color del texto</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={formData.font_color}
                    onChange={(e) => updateField('font_color', e.target.value)}
                    style={{ width: '60px', height: '46px', border: '2px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={formData.font_color}
                    onChange={(e) => updateField('font_color', e.target.value)}
                    style={{ flex: 1, padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151', fontSize: '0.9rem' }}>Velocidad (segundos)</label>
                <select
                  value={formData.animation_speed}
                  onChange={(e) => updateField('animation_speed', Number(e.target.value))}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px', background: 'white', boxSizing: 'border-box' }}
                >
                  <option value={15}>Rápida (15s)</option>
                  <option value={30}>Normal (30s)</option>
                  <option value={60}>Lenta (60s)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151', fontSize: '0.9rem' }}>Dirección</label>
                <select
                  value={formData.direction}
                  onChange={(e) => updateField('direction', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px', background: 'white', boxSizing: 'border-box' }}
                >
                  <option value="left">Derecha a Izquierda</option>
                  <option value="right">Izquierda a Derecha</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151', fontSize: '0.9rem' }}>Color de fondo del texto</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { updateField('background_color', 'transparent'); updateField('bg_color_hex', '#6B2D8B'); }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: formData.background_color === 'transparent' ? '#6B2D8B' : '#f3f4f6',
                    color: formData.background_color === 'transparent' ? 'white' : '#374151',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Transparente
                </button>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.bg_color_hex}
                    onChange={(e) => {
                      updateField('bg_color_hex', e.target.value);
                      updateField('background_color', e.target.value);
                    }}
                    style={{ width: '50px', height: '42px', border: '2px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={formData.bg_color_hex}
                    onChange={(e) => {
                      updateField('bg_color_hex', e.target.value);
                      updateField('background_color', e.target.value);
                    }}
                    style={{ width: '120px', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
                Tip: Agrega "80" al final del hex para transparencia (ej: #6B2D8B80 = 50% opaco)
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151', fontSize: '0.9rem' }}>Inicio (opcional)</label>
                <input
                  type="date"
                  value={formData.starts_at}
                  onChange={(e) => updateField('starts_at', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151', fontSize: '0.9rem' }}>Fin (opcional)</label>
                <input
                  type="date"
                  value={formData.ends_at}
                  onChange={(e) => updateField('ends_at', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ background: '#faf5ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="checkbox"
                checked={formData.pause_on_hover === 1}
                onChange={(e) => updateField('pause_on_hover', e.target.checked ? 1 : 0)}
                id="pause-hover"
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <label htmlFor="pause-hover" style={{ fontWeight: 'bold', color: '#6B2D8B', cursor: 'pointer', flex: 1 }}>
                Pausar animación al pasar el mouse
              </label>
            </div>

            <div style={{ border: '2px dashed #6B2D8B', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', background: '#faf5ff', position: 'relative' }}>
              <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6B2D8B', marginBottom: '1rem', fontWeight: 'bold' }}>
                👁️ VISTA PREVIA EN VIVO
              </div>
              
              <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)', padding: '2rem 1rem', borderRadius: '8px', minHeight: '100px', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <div 
                  style={{
                    whiteSpace: 'nowrap',
                    color: formData.font_color,
                    fontSize: `${Math.min(formData.font_size, 40)}px`,
                    fontWeight: formData.font_weight as any,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    animation: `scrollText ${formData.animation_speed}s linear infinite`,
                    animationPlayState: formData.pause_on_hover === 1 ? 'paused' : 'running',
                    position: 'relative',
                    ...(formData.direction === 'left' ? { left: '100%' } : { right: '100%' })
                  }}
                >
                  {formData.text || 'NUEVA COLECCIÓN'}
                </div>
              </div>

              <style>{`
                @keyframes scrollText {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(${formData.direction === 'left' ? '-200%' : '200%'}); }
                }
              `}</style>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleSave}
                style={{ flex: 1, background: '#10B981', color: 'white', border: 'none', padding: '1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                💾 Guardar Texto
              </button>
              <button 
                onClick={() => setShowForm(false)}
                style={{ background: '#9ca3af', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 25px rgba(107,45,139,0.1)' }}>
          <h2 style={{ color: '#6B2D8B', marginTop: 0, marginBottom: '1.5rem' }}>Textos Activos</h2>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Cargando textos...</p>
          ) : texts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>No hay textos flotantes configurados.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {texts.map((item) => (
                <div key={item.id} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold', color: item.is_active === 1 ? '#1e3a8a' : '#6b7280' }}>
                      {item.text}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', color: '#6b7280', fontSize: '0.85rem' }}>
                      <span>⏱️ {item.animation_speed}s</span>
                      <span>📏 {item.font_size}px</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => toggleActive(item.id, item.is_active)}
                      style={{ background: item.is_active === 1 ? '#10B981' : '#d1d5db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      {item.is_active === 1 ? 'Activo' : 'Inactivo'}
                    </button>
                    <button 
                      onClick={() => deleteText(item.id)}
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
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