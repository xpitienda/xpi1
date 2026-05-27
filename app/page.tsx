'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight, Shield, Sparkles } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Animación escalonada
    setTimeout(() => setShowContent(true), 300);
    setTimeout(() => setShowButtons(true), 800);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 30%, #1a0a2e 50%, #0d3d1a 80%, #1B8A3B 100%)'
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#6B2D8B]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#1B8A3B]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6B2D8B]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Sparkles decorativos */}
      <Sparkles className="absolute top-20 right-20 w-8 h-8 text-xpi-green/40 animate-pulse" />
      <Sparkles className="absolute bottom-32 left-16 w-6 h-6 text-[#6B2D8B]/40 animate-pulse" style={{ animationDelay: '0.7s' }} />
      <Sparkles className="absolute top-40 left-1/4 w-5 h-5 text-xpi-green/30 animate-pulse" style={{ animationDelay: '1.2s' }} />

      {/* Main Content */}
      <div className={`relative z-10 text-center px-6 max-w-lg transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Logo con glow */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-xpi-green/30 blur-3xl rounded-full scale-150" />
          <Image
            src="/logo-xpitienda.png"
            alt="XPI Tienda"
            width={280}
            height={130}
            className="object-contain mx-auto relative z-10 drop-shadow-2xl"
            priority
          />
        </div>

        {/* Mensaje de Bienvenida */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Bienvenido a
          </h1>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            <span className="text-[#6B2D8B] drop-shadow-lg">XPI</span>
            <span className="text-xpi-green drop-shadow-lg"> Tienda</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Tu marketplace de confianza para comprar y vender productos de forma segura
          </p>
        </div>

        {/* Indicadores de Pagina */}
        <div className="flex justify-center gap-2 mb-10">
          <div className="w-3 h-3 rounded-full bg-xpi-green" />
          <div className="w-3 h-3 rounded-full bg-[#6B2D8B]/50" />
          <div className="w-3 h-3 rounded-full bg-[#6B2D8B]/30" />
        </div>

        {/* Botones */}
        <div className={`space-y-4 transition-all duration-700 ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          
          {/* Boton Avance - Ir al Catalogo */}
          <button
            onClick={() => router.push('/catalog')}
            className="w-full group px-8 py-4 bg-gradient-to-r from-xpi-green to-[#22A84A] hover:from-[#22A84A] hover:to-xpi-green text-white font-bold text-lg rounded-2xl shadow-lg shadow-xpi-green/30 hover:shadow-xl hover:shadow-xpi-green/40 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <ChevronRight className="w-6 h-6" />
            Comenzar a Explorar
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Boton Login Super Administrador */}
          <button
            onClick={() => router.push('/admin/login')}
            className="w-full group px-8 py-4 bg-gradient-to-r from-[#6B2D8B] to-[#4a1f61] hover:from-[#4a1f61] hover:to-[#6B2D8B] text-white font-bold text-lg rounded-2xl shadow-lg shadow-[#6B2D8B]/30 hover:shadow-xl hover:shadow-[#6B2D8B]/40 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Shield className="w-6 h-6" />
            Super Administrador
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-gray-500 text-sm">
          2024 XPI Tienda. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
