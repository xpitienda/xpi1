'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Shield, Eye, EyeOff, Key, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

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

    // Simular delay de autenticación
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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #e8e8e8 100%)'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#2E7D32]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#9C27B0]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-[#5D4037] hover:text-[#3D2914] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver</span>
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center w-full px-6">
        
        {/* Login Card - Neumorphic 3D Style */}
        <div 
          className="rounded-3xl p-8 relative w-full"
          style={{
            maxWidth: '380px',
            background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
            boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
          }}
        >
          {/* Decorative Border - Green and Purple dashed */}
          <div className="absolute inset-[-3px] rounded-3xl pointer-events-none" style={{
            border: '3px dashed',
            borderTopColor: '#2E7D32',
            borderLeftColor: '#2E7D32',
            borderRightColor: '#9C27B0',
            borderBottomColor: '#9C27B0',
          }} />

          {/* Logo and Title */}
          <div className="text-center mb-6 relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_XpiTienda_sin_Fondo-removebg-preview-yVgQmLAPvivdFeznsaVzvVQlE2Y1zE.png"
              alt="XPI Tienda"
              width={150}
              height={70}
              className="object-contain mx-auto mb-4"
              priority
            />
            <h1 className="text-2xl font-bold text-[#2E7D32]">XpiTienda</h1>
            <p className="text-[#9C27B0] font-semibold">Bienvenidos</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2 text-red-600"
              style={{
                background: '#f0f0f0',
                boxShadow: 'inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff'
              }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Clave Input - Neumorphic Inset with Green bg and Purple border */}
            <div>
              <label className="block text-[#5D4037] text-sm font-medium mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#2E7D32]" />
                Clave de Acceso
              </label>
              <input
                type="text"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-full text-[#3D2914] placeholder-[#6B8E6B] focus:outline-none transition-all"
                style={{
                  background: 'linear-gradient(145deg, #d4e8d4, #e8f5e8)',
                  boxShadow: 'inset 6px 6px 12px #a8c8a8, inset -6px -6px 12px #ffffff',
                  border: '2px solid #9C27B0'
                }}
                placeholder="Ingresa tu clave"
              />
            </div>

            {/* Password Input - Neumorphic Inset with Green bg and Purple border */}
            <div>
              <label className="block text-[#5D4037] text-sm font-medium mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#2E7D32]" />
                Contrasena
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 pr-12 rounded-full text-[#3D2914] placeholder-[#6B8E6B] focus:outline-none transition-all"
                  style={{
                    background: 'linear-gradient(145deg, #d4e8d4, #e8f5e8)',
                    boxShadow: 'inset 6px 6px 12px #a8c8a8, inset -6px -6px 12px #ffffff',
                    border: '2px solid #9C27B0'
                  }}
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6B8E6B] hover:text-[#2E7D32] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button - Neumorphic Raised 3D Effect */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-[#2E7D32] font-bold text-lg rounded-full transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff, inset 0 0 0 transparent',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#2E7D32]/30 border-t-[#2E7D32] rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  Ingresar
                </>
              )}
            </button>
          </form>

          <p className="text-[#8D6E63] text-xs text-center mt-6">
            Acceso restringido solo para administradores autorizados
          </p>
        </div>
      </div>
    </div>
  );
}
