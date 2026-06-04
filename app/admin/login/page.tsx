'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [clave, setClave] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Back Button - Top Left with Neumorphic Style */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full text-[#666] hover:text-[#333] transition-all"
        style={{
          background: '#e0e5ec',
          boxShadow: '5px 5px 10px #bec3c9, -5px -5px 10px #ffffff',
        }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Volver</span>
      </button>

      {/* Login Card Container */}
      <div className="relative">
        
        {/* Animated Rotating Border */}
        <div 
          className="absolute inset-[-6px] rounded-[36px] pointer-events-none"
          style={{
            animation: 'spin-slow 8s linear infinite',
            background: `conic-gradient(
              from 0deg,
              #2E7D32 0deg,
              #2E7D32 40deg,
              transparent 40deg,
              transparent 90deg,
              #9C27B0 90deg,
              #9C27B0 130deg,
              transparent 130deg,
              transparent 180deg,
              #2E7D32 180deg,
              #2E7D32 220deg,
              transparent 220deg,
              transparent 270deg,
              #9C27B0 270deg,
              #9C27B0 310deg,
              transparent 310deg,
              transparent 360deg
            )`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '4px',
          }}
        />

        {/* Login Card - Neumorphic 3D Style */}
        <div 
          className="rounded-[30px] px-10 py-12 relative"
          style={{
            width: '380px',
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
              className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-red-600"
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
            {/* Clave Input - Neumorphic Inset */}
            <input
              type="text"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-full text-[#555] placeholder-[#999] focus:outline-none text-base"
              style={{
                background: '#e0e5ec',
                boxShadow: 'inset 8px 8px 16px #bec3c9, inset -8px -8px 16px #ffffff',
                border: 'none'
              }}
              placeholder="Clave de Acceso"
            />

            {/* Password Input - Neumorphic Inset */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 pr-14 rounded-full text-[#555] placeholder-[#999] focus:outline-none text-base"
                style={{
                  background: '#e0e5ec',
                  boxShadow: 'inset 8px 8px 16px #bec3c9, inset -8px -8px 16px #ffffff',
                  border: 'none'
                }}
                placeholder="Contrasena"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#555] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit Button - Neumorphic Raised 3D Effect */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-[#2E7D32] font-bold text-lg rounded-full transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              style={{
                background: '#e0e5ec',
                boxShadow: '8px 8px 16px #bec3c9, -8px -8px 16px #ffffff',
              }}
              onMouseDown={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = 'inset 5px 5px 10px #bec3c9, inset -5px -5px 10px #ffffff';
                }
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = '8px 8px 16px #bec3c9, -8px -8px 16px #ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '8px 8px 16px #bec3c9, -8px -8px 16px #ffffff';
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#2E7D32]/30 border-t-[#2E7D32] rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <p className="text-[#888] text-xs text-center mt-8">
            Acceso restringido para administradores
          </p>
        </div>
      </div>

      {/* CSS Animation for rotating border */}
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
