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
        background: 'linear-gradient(135deg, #FDF6E3 0%, #FFECD2 50%, #FDF6E3 100%)'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#E07A5F]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#2E7D32]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_XpiTienda_sin_Fondo-removebg-preview-yVgQmLAPvivdFeznsaVzvVQlE2Y1zE.png"
            alt="XPI Tienda"
            width={200}
            height={90}
            className="object-contain mx-auto mb-6"
            priority
          />
          <h1 className="text-2xl font-bold">
            <span className="text-[#5D4037]">Panel de </span>
            <span className="text-[#2E7D32]">Administrador</span>
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#E07A5F]/30 shadow-lg">
          
          {/* Shield Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#256025] flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <p className="text-[#8D6E63] text-center mb-6">
            Ingresa tus credenciales de super administrador
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Clave Input */}
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
                className="w-full px-4 py-3 bg-[#FDF6E3] border-2 border-[#E07A5F]/30 rounded-xl text-[#3D2914] placeholder-[#8D6E63] focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-colors"
                placeholder="Ingresa tu clave"
              />
            </div>

            {/* Password Input */}
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
                  className="w-full px-4 py-3 pr-12 bg-[#FDF6E3] border-2 border-[#E07A5F]/30 rounded-xl text-[#3D2914] placeholder-[#8D6E63] focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-colors"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:text-[#5D4037] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#2E7D32] hover:bg-[#256025] text-white font-bold text-lg rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
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
