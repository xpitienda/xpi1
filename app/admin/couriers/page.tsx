'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CourierCompany {
  id: number;
  name: string;
  code: string;
  logo_url: string;
  api_endpoint: string;
  api_key: string;
  is_active: number;
}

export default function CouriersPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CourierCompany[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CourierCompany | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    logo_url: '',
    api_endpoint: '',
    api_key: '',
    api_secret: '',
    is_active: 1,
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/admin/couriers', {
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando empresas:', error);
    }
  };

  const handleAddNew = () => {
    setEditingCompany(null);
    setFormData({ name: '', code: '', logo_url: '', api_endpoint: '', api_key: '', api_secret: '', is_active: 1 });
    setShowModal(true);
  };

  const handleEdit = (company: CourierCompany) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      code: company.code,
      logo_url: company.logo_url || '',
      api_endpoint: company.api_endpoint || '',
      api_key: company.api_key || '',
      api_secret: '',
      is_active: company.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCompany ? `/api/admin/couriers/${editingCompany.id}` : '/api/admin/couriers';
      const method = editingCompany ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editingCompany ? 'Empresa actualizada' : 'Empresa creada');
        setShowModal(false);
        fetchCompanies();
      } else {
        const err = await res.json();
        alert('Error: ' + (err.error || 'No se pudo guardar'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Eliminar "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/couriers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}` }
      });

      if (res.ok) {
        alert('Empresa eliminada');
        fetchCompanies();
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexion');
    }
  };

  const colors = {
    purple: '#6B2D8B',
    purpleDark: '#4a1f61',
    purpleLight: '#8B45B3',
    green: '#1B8A3B',
    greenDark: '#156b2e',
    greenVibrant: '#22A84A',
    pastel: '#F3E8FF',
    pastelDark: '#E9D5FF',
  };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.pastel} 0%, white 50%, ${colors.pastelDark} 100%)`, padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        <div style={{
          background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.green} 100%)`,
          borderRadius: '1.5rem',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px rgba(107, 45, 139, 0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              {/* BOTÓN DE REGRESO */}
              <button
                onClick={() => router.push('/admin')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.75rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.3)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                }}
              >
                ← Volver
              </button>
              
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '3rem' }}></span>
                  Empresas de Mensajeria
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.125rem', marginTop: '0.5rem' }}>
                  Gestiona las transportadoras y sus credenciales
                </p>
              </div>
            </div>
            <button
              onClick={handleAddNew}
              style={{
                background: 'white',
                color: colors.purple,
                padding: '1rem 2rem',
                borderRadius: '1rem',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>+</span> Nueva Empresa
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {companies.map((company) => (
            <div
              key={company.id}
              style={{
                background: 'white',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: `2px solid ${colors.pastelDark}`,
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(107, 45, 139, 0.2)';
                (e.currentTarget as HTMLElement).style.borderColor = colors.purple;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                (e.currentTarget as HTMLElement).style.borderColor = colors.pastelDark;
              }}
            >
              <div style={{
                background: `linear-gradient(135deg, ${colors.pastel} 0%, ${colors.pastelDark} 100%)`,
                padding: '1.5rem',
                borderBottom: `2px solid ${colors.pastelDark}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {company.logo_url ? (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'white',
                      borderRadius: '1rem',
                      padding: '0.5rem',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      border: `2px solid ${colors.pastelDark}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <img
                        src={`/logos-couriers/${company.logo_url}`}
                        alt={company.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.green} 100%)`,
                      borderRadius: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}>

                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0' }}>
                      {company.name}
                    </h3>
                    <p style={{
                      color: colors.purple,
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem',
                      letterSpacing: '0.05em',
                      margin: 0,
                    }}>
                      {company.code}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div style={{
                  background: colors.pastel,
                  borderRadius: '1rem',
                  padding: '1rem',
                  marginBottom: '1rem',
                  border: `1px solid ${colors.pastelDark}`,
                }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0', fontWeight: '600' }}>
                    API Endpoint:
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#374151', margin: 0, wordBreak: 'break-all' }}>
                    {company.api_endpoint || 'No configurada'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{
                    background: company.is_active ? colors.green : '#fee2e2',
                    color: company.is_active ? 'white' : '#dc2626',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    boxShadow: company.is_active ? '0 4px 8px rgba(27, 138, 59, 0.3)' : 'none',
                  }}>
                    {company.is_active ? 'Activa' : 'Inactiva'}
                  </div>
                  {company.api_key && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      API configurada
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleEdit(company)}
                    style={{
                      flex: 1,
                      background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.purpleLight} 100%)`,
                      color: 'white',
                      padding: '0.875rem',
                      borderRadius: '0.75rem',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 8px rgba(107, 45, 139, 0.3)',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(company.id, company.name)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      padding: '0.875rem',
                      borderRadius: '0.75rem',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 8px rgba(239, 68, 68, 0.3)',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {companies.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '2rem',
            border: `4px dashed ${colors.purple}40`,
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🚚</div>
            <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
              No hay empresas configuradas
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
              Comienza agregando tu primera empresa de mensajeria
            </p>
            <button
              onClick={handleAddNew}
              style={{
                background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.green} 100%)`,
                color: 'white',
                padding: '1rem 2.5rem',
                borderRadius: '1rem',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(107, 45, 139, 0.3)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              + Agregar Primera Empresa
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{
            background: 'white',
            borderRadius: '2rem',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            border: `4px solid ${colors.pastelDark}`,
          }}>

            <div style={{
              background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.green} 100%)`,
              padding: '1.5rem 2rem',
              borderRadius: '1.75rem 1.75rem 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                {editingCompany ? 'Editar Empresa' : 'Nueva Empresa'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>
                    Nombre de la empresa *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: `2px solid ${colors.pastelDark}`,
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: `${colors.pastel}20`,
                    }}
                    placeholder="Ej: Servientrega"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>
                    Codigo interno (sin espacios) *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toLowerCase().replace(/\s/g, '')})}
                    placeholder="servientrega"
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: `2px solid ${colors.pastelDark}`,
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: `${colors.pastel}20`,
                    }}
                    required
                  />
                </div>

                <div style={{
                  background: `linear-gradient(135deg, ${colors.pastel} 0%, ${colors.pastelDark}40 100%)`,
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  border: `2px solid ${colors.purple}40`,
                }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: colors.purpleDark }}>
                    Nombre del archivo del logo
                  </label>
                  <input
                    type="text"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                    placeholder="ej: servientrega.png"
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: `2px solid ${colors.purple}40`,
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: 'white',
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: colors.purpleDark, marginTop: '0.75rem', background: 'rgba(255,255,255,0.7)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                    <strong>Nota:</strong> Copia el archivo de imagen manualmente a la carpeta <code style={{ background: colors.pastel, padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontFamily: 'monospace' }}>public/logos-couriers/</code>
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>
                    API Endpoint (URL de rastreo)
                  </label>
                  <input
                    type="url"
                    value={formData.api_endpoint}
                    onChange={(e) => setFormData({...formData, api_endpoint: e.target.value})}
                    placeholder="https://rastreo.com/?guia={tracking}"
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: `2px solid ${colors.pastelDark}`,
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: `${colors.pastel}20`,
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>
                      API Key
                    </label>
                    <input
                      type="password"
                      value={formData.api_key}
                      onChange={(e) => setFormData({...formData, api_key: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        border: `2px solid ${colors.pastelDark}`,
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                        background: `${colors.pastel}20`,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>
                      API Secret
                    </label>
                    <input
                      type="password"
                      value={formData.api_secret}
                      onChange={(e) => setFormData({...formData, api_secret: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        border: `2px solid ${colors.pastelDark}`,
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                        background: `${colors.pastel}20`,
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  background: `linear-gradient(135deg, ${colors.green}10 0%, ${colors.purple}10 100%)`,
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  border: `2px solid ${colors.green}40`,
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active === 1}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked ? 1 : 0})}
                      style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer', accentColor: colors.green }}
                    />
                    <span style={{ fontWeight: 'bold', color: '#374151', fontSize: '1.125rem' }}>Marcar como Empresa Activa</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: `2px solid ${colors.pastelDark}` }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.green} 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '1rem',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 10px 20px rgba(107, 45, 139, 0.3)',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Guardando...' : (editingCompany ? 'Actualizar Empresa' : 'Crear Empresa')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: '#e5e7eb',
                    color: '#374151',
                    border: '2px solid #d1d5db',
                    borderRadius: '1rem',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    cursor: 'pointer',
                  }}
                >
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