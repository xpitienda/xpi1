'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [clave, setClave] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(clave, password);

    if (success) {
      router.push('/admin');
    } else {
      setError('Credenciales incorrectas. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 50%, #dce3ec 100%)' }}
    >
      {/* Imagen de fondo 1 - Centrada, giro horario */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <img
          src="/Celu.png"
          alt=""
          className="max-w-[700px] max-h-[700px] w-full h-auto"
          style={{
            animation: 'spin-clockwise 25s linear infinite',
            filter: 'drop-shadow(0 0 40px rgba(46, 125, 50, 0.4))',
            opacity: 0.85
          }}
        />
      </div>

      {/* Imagen de fondo 2 - Centrada, giro antihorario */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <img
          src="/Celu2.png"
          alt=""
          className="max-w-[600px] max-h-[600px] w-full h-auto"
          style={{
            animation: 'spin-counterclockwise 20s linear infinite',
            filter: 'drop-shadow(0 0 40px rgba(156, 39, 176, 0.4))',
            opacity: 0.8
          }}
        />
      </div>

      {/* Back Button - Flotante arriba izquierda */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-30 flex items-center gap-2 px-5 py-3 rounded-full text-[#555] hover:text-[#2E7D32] transition-all"
        style={{
          background: 'rgba(224, 229, 236, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.15), -6px -6px 12px rgba(255, 255, 255, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Volver</span>
      </button>

      {/* Login Card - Centrado, flotando sobre las imágenes, doble tamaño */}
      <div className="relative z-10 flex items-center justify-center">
        <div
          className="rounded-[40px] px-16 py-14 relative"
          style={{
            width: '700px',
            maxWidth: '90vw',
            background: 'rgba(224, 229, 236, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '25px 25px 70px rgba(0, 0, 0, 0.35), -25px -25px 70px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}
        >
          {/* Título - XpiTienda en morado, doble tamaño */}
          <div className="text-center mb-12">
            <h1 className="font-bold mb-3" style={{ 
              fontSize: '3.5rem',
              color: '#9C27B0',
              textShadow: '0 4px 8px rgba(156, 39, 176, 0.3), 0 2px 4px rgba(0,0,0,0.1)'
            }}>XpiTienda</h1>
            <p className="font-semibold" style={{ 
              fontSize: '1.5rem',
              color: '#2E7D32' 
            }}>Bienvenidos</p>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div
              className="mb-8 p-4 rounded-2xl flex items-center gap-3 text-red-600"
              style={{
                background: '#e0e5ec',
                boxShadow: 'inset 5px 5px 10px #bec3c9, inset -5px -5px 10px #ffffff'
              }}
            >
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span style={{ fontSize: '1rem' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Input Clave - Doble tamaño */}
            <div className="flex justify-center">
              <input
                type="text"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
                style={{
                  width: '80%',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '2rem',
                  background: '#e0e5ec',
                  boxShadow: 'inset 8px 8px 16px #bec3c9, inset -8px -8px 16px #ffffff',
                  border: 'none',
                  fontSize: '1.125rem',
                  color: '#555',
                  outline: 'none'
                }}
                placeholder="Clave de Acceso"
              />
            </div>

            {/* Input Password - Doble tamaño */}
            <div className="flex justify-center">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '80%',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '2rem',
                  background: '#e0e5ec',
                  boxShadow: 'inset 8px 8px 16px #bec3c9, inset -8px -8px 16px #ffffff',
                  border: 'none',
                  fontSize: '1.125rem',
                  color: '#555',
                  outline: 'none'
                }}
                placeholder="Contraseña"
              />
            </div>

            {/* Botón Submit - Doble tamaño */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '60%',
                  padding: '1.25rem',
                  borderRadius: '2rem',
                  background: '#e0e5ec',
                  boxShadow: '10px 10px 20px #bec3c9, -10px -10px 20px #ffffff',
                  color: '#2E7D32',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
                onMouseDown={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = 'inset 5px 5px 10px #bec3c9, inset -5px -5px 10px #ffffff';
                  }
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = '10px 10px 20px #bec3c9, -10px -10px 20px #ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '10px 10px 20px #bec3c9, -10px -10px 20px #ffffff';
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      border: '2px solid rgba(46, 125, 50, 0.3)',
                      borderTop: '2px solid #2E7D32',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Verificando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes spin-clockwise {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-counterclockwise {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}