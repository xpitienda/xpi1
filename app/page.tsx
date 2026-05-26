// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck, Eye, EyeOff, ChevronLeft, ChevronRight, LogIn } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to catalog after login
    router.push('/catalog');
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleForward = () => {
    // Navigate to catalog
    router.push('/catalog');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-xpi-purple-dark via-xpi-purple to-xpi-purple-light flex flex-col items-center justify-between px-4 py-8">
      
      {/* Logo */}
      <div className="flex items-center gap-3 mt-4">
        <div className="relative w-12 h-12">
          <Image 
            src="/logo.png" 
            alt="XPI Logo"
            fill
            sizes="48px"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-white">XPI</span>
          <span className="text-3xl font-bold text-xpi-green">π</span>
          <span className="text-xl font-semibold text-xpi-green ml-2">ESSENTIALS</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mt-8">
        <span className="text-white">Iniciar </span>
        <span className="text-xpi-green">Sesion</span>
      </h1>

      {/* Login Card */}
      <div className="w-full max-w-md mt-8">
        <div className="relative bg-xpi-purple-dark/80 backdrop-blur-sm rounded-2xl p-8 border border-xpi-purple-glow/50 animate-glow">
          
          {/* Shield Icon */}
          <div className="flex justify-center -mt-16 mb-6">
            <div className="w-16 h-16 bg-xpi-purple-light rounded-full flex items-center justify-center border-2 border-xpi-purple-glow">
              <ShieldCheck className="w-8 h-8 text-xpi-green" />
            </div>
          </div>

          <p className="text-gray-300 text-center mb-6">
            Ingresa con tu correo registrado
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full px-4 py-3 bg-xpi-purple-light/50 border border-xpi-purple-glow/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-xpi-green focus:ring-1 focus:ring-xpi-green transition-all"
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
                  className="w-full px-4 py-3 bg-xpi-purple-light/50 border border-xpi-purple-glow/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-xpi-green focus:ring-1 focus:ring-xpi-green transition-all pr-12"
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
              className="w-full py-3 bg-gradient-to-r from-xpi-green via-xpi-cyan to-xpi-green rounded-lg font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-6"
            >
              <LogIn className="w-5 h-5" />
              Ingresar
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-4">
            Ingresa con tu correo registrado en el sistema.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col items-center gap-4 mt-8 mb-4">
        {/* Page Indicators */}
        <div className="flex gap-2">
          <div className={`w-3 h-3 rounded-full ${currentStep === 0 ? 'bg-white' : 'bg-xpi-purple-glow'}`} />
          <div className={`w-3 h-3 rounded-full ${currentStep === 1 ? 'bg-white' : 'bg-xpi-purple-glow'}`} />
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            className="w-14 h-14 bg-xpi-blue rounded-full flex items-center justify-center hover:bg-xpi-blue/80 transition-colors shadow-lg"
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>
          <button
            onClick={handleForward}
            className="w-14 h-14 bg-xpi-orange rounded-full flex items-center justify-center hover:bg-xpi-orange/80 transition-colors shadow-lg"
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>
        </div>

        {/* Button Labels */}
        <div className="flex gap-8">
          <span className="text-xpi-blue text-sm font-medium">Retroceso</span>
          <span className="text-xpi-orange text-sm font-medium">Avance</span>
        </div>
      </div>

    </div>
  );
}
