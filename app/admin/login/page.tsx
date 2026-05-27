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
        background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#6B2D8B]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-xpi-green/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver</span>
      </button>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/logo-xpitienda.png"
            alt="XPI Tienda"
            width={200}
            height={90}
            className="object-contain mx-auto mb-6"
            priority
          />
          <h1 className="text-2xl font-bold">
            <span className="text-white">Panel de </span>
            <span className="text-xpi-green">Administrador</span>
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-[#2d1b4e]/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#6B2D8B]/50 shadow-[0_0_40px_rgba(107,45,139,0.3)]">
          
          {/* Shield Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-xpi-green to-[#22A84A] flex items-center justify-center shadow-lg shadow-xpi-green/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <p className="text-gray-400 text-center mb-6">
            Ingresa tus credenciales de super administrador
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-2 text-red-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Clave Input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-xpi-green" />
                Clave de Acceso
              </label>
              <input
                type="text"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a0a2e]/80 border-2 border-[#6B2D8B]/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green focus:ring-1 focus:ring-xpi-green transition-colors"
                placeholder="Ingresa tu clave"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-xpi-green" />
                Contrasena
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 bg-[#1a0a2e]/80 border-2 border-[#6B2D8B]/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green focus:ring-1 focus:ring-xpi-green transition-colors"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-xpi-green to-[#22A84A] hover:from-[#22A84A] hover:to-xpi-green text-white font-bold text-lg rounded-xl shadow-lg shadow-xpi-green/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <p className="text-gray-500 text-xs text-center mt-6">
            Acceso restringido solo para administradores autorizados
          </p>
        </div>
      </div>
    </div>
  );
}
