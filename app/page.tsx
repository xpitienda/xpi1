'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function SplashPage() {
  const router = useRouter();
  const [showText, setShowText] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const logoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_XpiTienda_sin_Fondo-removebg-preview-yVgQmLAPvivdFeznsaVzvVQlE2Y1zE.png";

  useEffect(() => {
    // Despues de 5 segundos, explosion de confetti y mostrar texto
    const timer = setTimeout(() => {
      // Explosion de confetti en colores verde y morado
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#00FF41', '#BF00FF', '#00CC33', '#9900CC'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      // Mostrar texto despues de la explosion inicial
      setShowText(true);
      
      // Mostrar botones un poco despues
      setTimeout(() => {
        setShowButtons(true);
      }, 800);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#0d051a]">
      
      {/* Fondo con logos repetidos en 4 colores pastel */}
      <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 p-4 opacity-10">
        {Array.from({ length: 80 }).map((_, i) => {
          const colors = [
            'brightness-100 sepia saturate-200 hue-rotate-[20deg]',   // Naranja pastel
            'brightness-100 saturate-150 hue-rotate-[80deg]',         // Verde pastel
            'brightness-100 saturate-150 hue-rotate-[260deg]',        // Morado pastel
            'brightness-150 saturate-0',                               // Blanco pastel
          ];
          const colorClass = colors[i % 4];
          return (
            <div key={i} className="flex items-center justify-center">
              <Image
                src={logoUrl}
                alt=""
                width={60}
                height={30}
                className={`object-contain ${colorClass}`}
              />
            </div>
          );
        })}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 p-8">
        
        {/* Logo giratorio sobre su propio eje */}
        <div 
          className="animate-logo-spin perspective-1000"
          style={{ perspective: '1000px' }}
        >
          <Image
            src={logoUrl}
            alt="XPI Tienda"
            width={350}
            height={160}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Texto Bienvenidos - aparece despues de 5 segundos */}
        {showText && (
          <div className="animate-fade-in-up text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold animate-text-color-change mb-4">
              Bienvenidos
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide">
              <span className="text-[#00FF41]">Xpi Tienda</span>
              <span className="text-white mx-2">Una Alternativa</span>
              <span className="text-[#BF00FF]">Inteligente</span>
            </p>
          </div>
        )}

        {/* Botones con intermitencia neon */}
        {showButtons && (
          <div className="animate-fade-in-up flex flex-col sm:flex-row gap-6 items-center mt-8">
            
            {/* Boton Explorar - Verde Neon */}
            <button
              onClick={() => router.push('/catalog')}
              className="px-10 py-4 bg-gradient-to-r from-[#00FF41]/20 to-[#00CC33]/20 hover:from-[#00FF41]/40 hover:to-[#00CC33]/40 text-[#00FF41] font-bold text-lg rounded-xl transform hover:scale-105 transition-all duration-300 min-w-[180px] animate-neon-green"
            >
              Explorar
            </button>

            {/* Boton Super Administrador - Morado Neon */}
            <button
              onClick={() => router.push('/admin/login')}
              className="px-8 py-3 bg-gradient-to-r from-[#BF00FF]/20 to-[#9900CC]/20 hover:from-[#BF00FF]/40 hover:to-[#9900CC]/40 text-[#BF00FF] font-bold text-sm rounded-xl transform hover:scale-105 transition-all duration-300 min-w-[200px] animate-neon-purple"
            >
              Super Administrador
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
