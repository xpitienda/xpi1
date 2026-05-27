'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Shield, Eye, EyeOff, LogIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/catalog');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b4e] via-[#1a0a2e] to-[#2d1b4e] flex flex-col items-center justify-between px-4 py-8">
      {/* Logo */}
      <div className="w-full flex justify-center pt-4">
        <Image
          src="/logo-xpitienda.png"
          alt="XPI Tienda"
          width={200}
          height={80}
          className="object-contain"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          <span className="text-white">Iniciar </span>
          <span className="text-xpi-green">Sesion</span>
        </h1>

        {/* Login Card */}
        <div className="w-full bg-[#1a0a2e]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#6b3fa0]/30 shadow-[0_0_30px_rgba(107,63,160,0.3)]">
          {/* Shield Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#6b3fa0]/20 flex items-center justify-center border border-xpi-green/50">
              <Shield className="w-8 h-8 text-xpi-green" />
            </div>
          </div>

          <p className="text-gray-400 text-center mb-6">Ingresa con tu correo registrado</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Correo electronico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 bg-[#2d1b4e]/50 border border-[#6b3fa0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green/50 focus:ring-1 focus:ring-xpi-green/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Contrasena</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full px-4 py-3 bg-[#2d1b4e]/50 border border-[#6b3fa0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green/50 focus:ring-1 focus:ring-xpi-green/50 transition-colors pr-12"
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

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-xpi-green via-xpi-green to-xpi-cyan hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-5 h-5" />
              Ingresar
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-4">
            Ingresa con tu correo registrado en el sistema.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full flex flex-col items-center gap-4 pb-4">
        {/* Page Indicators */}
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-xpi-green"></div>
          <div className="w-3 h-3 rounded-full bg-[#6b3fa0]"></div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-6">
          <button
            onClick={() => router.back()}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-14 h-14 rounded-full bg-xpi-blue flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg">
              <ChevronLeft className="w-7 h-7 text-white" />
            </div>
            <span className="text-xpi-blue text-sm font-medium">Retroceso</span>
          </button>

          <button
            onClick={() => router.push('/catalog')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-14 h-14 rounded-full bg-xpi-orange flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg">
              <ChevronRight className="w-7 h-7 text-white" />
            </div>
            <span className="text-xpi-orange text-sm font-medium">Avance</span>
          </button>
        </div>
      </div>
    </div>
  );
}
