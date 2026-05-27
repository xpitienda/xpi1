'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck, Eye, EyeOff, LogIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/catalog');
  };

  const handleRetroceso = () => {
    if (window.history.length > 1) {
      router.back();
    }
  };

  const handleAvance = () => {
    router.push('/catalog');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)' }}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/logo-xpitienda.png"
            alt="XPI Tienda"
            width={180}
            height={80}
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-8 text-center">
          <span className="text-white">Iniciar </span>
          <span style={{ color: '#00d4aa' }}>Sesion</span>
        </h1>

        {/* Login Card */}
        <div 
          className="rounded-2xl p-6 sm:p-8 bg-[#1a0a2e]/95 border-2 border-purple-500/50 shadow-[0_0_40px_rgba(147,51,234,0.3)]"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          {/* Shield Icon */}
          <div className="flex justify-center mb-4">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0, 212, 170, 0.15)' }}
            >
              <ShieldCheck className="w-7 h-7" style={{ color: '#00d4aa' }} />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-gray-400 text-center text-sm mb-6">
            Ingresa con tu correo registrado
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Correo electronico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 bg-[#2d1b4e]/50 border border-purple-500/30"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Contrasena
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 pr-12 bg-[#2d1b4e]/50 border border-purple-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 bg-gradient-to-r from-[#00d4aa] to-[#00b894]"
            >
              <LogIn className="w-5 h-5" />
              Ingresar
            </button>
          </form>

          {/* Footer Text */}
          <p className="text-gray-500 text-xs text-center mt-4">
            Ingresa con tu correo registrado en el sistema
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="pb-8 px-4">
        {/* Page Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-[#00d4aa]" />
          <div className="w-3 h-3 rounded-full bg-[#6b3fa0]" />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-6">
          {/* Retroceso Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleRetroceso}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 bg-[#3b82f6]"
            >
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <span className="text-sm mt-2 text-[#3b82f6]">Retroceso</span>
          </div>

          {/* Avance Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleAvance}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 bg-[#f97316]"
            >
              <ChevronRight className="w-7 h-7 text-white" />
            </button>
            <span className="text-sm mt-2 text-[#f97316]">Avance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
