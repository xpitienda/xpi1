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
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 50%, #dce3ec 100%)'
      }}
    >
      {/* Imagen 1 - Centrada, giro horario */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <img
          src="/celu.png"
          alt=""
          style={{
            width: '600px',
            height: '600px',
            objectFit: 'contain',
            animation: 'spin-clockwise 25s linear infinite',
            filter: 'drop-shadow(0 0 40px rgba(46, 125, 50, 0.5))',
            opacity: 0.9
          }}
        />
      </div>

      {/* Imagen 2 - Centrada, giro antihorario */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        <img
          src="/celu2.png"
          alt=""
          style={{
            width: '500px',
            height: '500px',
            objectFit: 'contain',
            animation: 'spin-counterclockwise 20s linear infinite',
            filter: 'drop-shadow(0 0 40px rgba(156, 39, 176, 0.5))',
            opacity: 0.85
          }}
        />
      </div>

      {/* Botón Volver */}
      <button
        onClick={() => router.push('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          borderRadius: '50px',
          background: 'rgba(224, 229, 236, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.15), -6px -6px 12px rgba(255, 255, 255, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          color: '#555',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        <ArrowLeft size={20} />
        Volver
      </button>

      {/* Box del Login - Centrado y flotando sobre las imágenes */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '450px',
        maxWidth: '90vw',
        padding: '40px',
        borderRadius: '30px',
        background: 'rgba(224, 229, 236, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '20px 20px 60px rgba(0, 0, 0, 0.3), -20px -20px 60px rgba(255, 255, 255, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.4)'
      }}>
        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#9C27B0',
            margin: 0,
            textShadow: '0 2px 4px rgba(156, 39, 176, 0.2)'
          }}>XpiTienda</h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#2E7D32',
            fontWeight: '600',
            margin: '10px 0 0 0'
          }}>Bienvenidos</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: '20px',
            padding: '12px',
            borderRadius: '15px',
            background: '#e0e5ec',
            boxShadow: 'inset 4px 4px 8px #bec3c9, inset -4px -4px 8px #ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Input Clave */}
          <input
            type="text"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            placeholder="Clave de Acceso"
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '50px',
              background: '#e0e5ec',
              boxShadow: 'inset 6px 6px 12px #bec3c9, inset -6px -6px 12px #ffffff',
              border: 'none',
              fontSize: '16px',
              color: '#555',
              outline: 'none'
            }}
          />

          {/* Input Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Contraseña"
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '50px',
              background: '#e0e5ec',
              boxShadow: 'inset 6px 6px 12px #bec3c9, inset -6px -6px 12px #ffffff',
              border: 'none',
              fontSize: '16px',
              color: '#555',
              outline: 'none'
            }}
          />

          {/* Botón Ingresar */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '50px',
              background: '#e0e5ec',
              boxShadow: '8px 8px 16px #bec3c9, -8px -8px 16px #ffffff',
              border: 'none',
              color: '#2E7D32',
              fontWeight: 'bold',
              fontSize: '18px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
            onMouseDown={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #bec3c9, inset -4px -4px 8px #ffffff';
              }
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.boxShadow = '8px 8px 16px #bec3c9, -8px -8px 16px #ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '8px 8px 16px #bec3c9, -8px -8px 16px #ffffff';
            }}
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>

      {/* Animaciones */}
      <style jsx>{`
        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-counterclockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}