// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, ShieldCheck, LogIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/catalog');
  };

  const handleAvance = () => {
    router.push('/catalog');
  };

  const handleRetroceso = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b4e] via-[#1a0a2e] to-[#2d1b4e] flex flex-col items-center justify-between px-4 py-8">
      {/* Logo */}
      <div className="mt-4">
        <Image
          src="/logo-xpitienda.png"
          alt="XPI Tienda"
          width={200}
          height={80}
          className="object-contain"
          priority
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mt-6">
        <span className="text-white">Iniciar </span>
        <span className="text-xpi-green">Sesion</span>
      </h1>

      {/* Login Card */}
      <div className="w-full max-w-md mt-6">
        <div 
          className="bg-[#1a0a2e]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#6b3fa0]/30"
          style={{
            boxShadow: '0 0 40px rgba(107, 63, 160, 0.3), inset 0 0 20px rgba(107, 63, 160, 0.1)'
          }}
        >
          {/* Shield Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#6b3fa0]/20 border border-[#6b3fa0]/40 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-xpi-green" />
            </div>
          </div>

          <p className="text-gray-400 text-center text-sm mb-6">
            Ingresa con tu correo registrado
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Correo electronico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full bg-[#2d1b4e]/50 border border-[#6b3fa0]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green/50 focus:ring-1 focus:ring-xpi-green/30 transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Contrasena
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#2d1b4e]/50 border border-[#6b3fa0]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green/50 focus:ring-1 focus:ring-xpi-green/30 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-xpi-green/20"
              style={{
                background: 'linear-gradient(to right, #00d4aa, #06b6d4)'
              }}
            >
              <LogIn className="w-5 h-5" />
              Ingresar
            </button>
          </form>

          <p className="text-gray-500 text-xs text-center mt-4">
            Ingresa con tu correo registrado en el sistema.
          </p>
        </div>
      </div>

      {/* Page Indicators */}
      <div className="flex items-center gap-2 mt-6">
        <div className={`w-3 h-3 rounded-full transition-colors ${currentPage === 0 ? 'bg-xpi-green' : 'bg-[#6b3fa0]'}`} />
        <div className={`w-3 h-3 rounded-full transition-colors ${currentPage === 1 ? 'bg-xpi-green' : 'bg-[#6b3fa0]'}`} />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-8 mt-6 mb-4">
        <div className="flex flex-col items-center">
          <button
            onClick={handleRetroceso}
            className="w-14 h-14 rounded-full bg-xpi-blue flex items-center justify-center text-white hover:bg-xpi-blue/80 transition-all hover:scale-105 shadow-lg shadow-xpi-blue/30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-xpi-blue text-sm mt-2 font-medium">Retroceso</span>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={handleAvance}
            className="w-14 h-14 rounded-full bg-xpi-orange flex items-center justify-center text-white hover:bg-xpi-orange/80 transition-all hover:scale-105 shadow-lg shadow-xpi-orange/30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <span className="text-xpi-orange text-sm mt-2 font-medium">Avance</span>
        </div>
      </div>
    </div>
  );
}
