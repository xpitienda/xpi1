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
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#e0e5ec' }}
    >
      {/* Back Button - Outside Card, Top Left */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 z-30 flex items-center gap-2 px-5 py-3 rounded-full text-[#666] hover:text-[#333] transition-all"
        style={{
          background: '#e0e5ec',
          boxShadow: '6px 6px 12px #bec3c9, -6px -6px 12px #ffffff',
        }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Volver</span>
      </button>

      {/* Login Card Container */}
      <div className="relative">
        
        {/* Animated Rotating Border - Single continuous line, no segments */}
        <div 
          className="absolute inset-[-8px] rounded-[38px] pointer-events-none"
          style={{
            animation: 'spin-slow 12s linear infinite',
            background: `conic-gradient(
              from 0deg,
              #2E7D32 0deg,
              #9C27B0 180deg,
              #2E7D32 360deg
            )`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '3px',
          }}
        />

        {/* Login Card - Neumorphic 3D Style */}
        <div 
          className="rounded-[30px] px-8 py-10 relative"
          style={{
            width: '340px',
            background: '#e0e5ec',
            boxShadow: '20px 20px 60px #bec3c9, -20px -20px 60px #ffffff',
          }}
        >
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">XpiTienda</h1>
            <p className="text-[#9C27B0] font-semibold text-xl">Bienvenidos</p>
          </div>

          {/* Error Message */}
          {error && (
            <div 
              className="mb-6 p-3 rounded-2xl flex items-center gap-3 text-red-600"
              style={{
                background: '#e0e5ec',
                boxShadow: 'inset 5px 5px 10px #bec3c9, inset -5px -5px 10px #ffffff'
              }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Clave Input - Narrower, no label */}
            <div className="flex justify-center">
              <input
                type="text"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
                className="w-[85%] px-5 py-3 rounded-full text-[#555] placeholder-[#999] focus:outline-none text-sm"
                style={{
                  background: '#e0e5ec',
                  boxShadow: 'inset 6px 6px 12px #bec3c9, inset -6px -6px 12px #ffffff',
                  border: 'none'
                }}
                placeholder="Clave de Acceso"
              />
            </div>

            {/* Password Input - Narrower, no label, no eye icon */}
            <div className="flex justify-center">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-[85%] px-5 py-3 rounded-full text-[#555] placeholder-[#999] focus:outline-none text-sm"
                style={{
                  background: '#e0e5ec',
                  boxShadow: 'inset 6px 6px 12px #bec3c9, inset -6px -6px 12px #ffffff',
                  border: 'none'
                }}
                placeholder="Contrasena"
              />
            </div>

            {/* Submit Button - Narrower, Neumorphic Raised 3D Effect */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-[70%] py-3 text-[#2E7D32] font-bold text-base rounded-full transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: '#e0e5ec',
                  boxShadow: '6px 6px 12px #bec3c9, -6px -6px 12px #ffffff',
                }}
                onMouseDown={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #bec3c9, inset -4px -4px 8px #ffffff';
                  }
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = '6px 6px 12px #bec3c9, -6px -6px 12px #ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '6px 6px 12px #bec3c9, -6px -6px 12px #ffffff';
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#2E7D32]/30 border-t-[#2E7D32] rounded-full animate-spin" />
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

      {/* CSS Animation for rotating border - slower rotation */}
      <style jsx>{`
        @keyframes spin-slow {
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
