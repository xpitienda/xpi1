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
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Video de fondo - se reproduce automaticamente */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/video-splash.mov" type="video/quicktime" />
        <source src="/video-splash.mov" type="video/mp4" />
      </video>

      {/* Overlay morado medio semi-transparente */}
      <div className="absolute inset-0 bg-[#6B21A8]/60 z-10"></div>

      {/* Contenido principal */}
      <div className="relative z-20 flex flex-col items-center justify-center gap-8 p-8">
        
        {/* Logo giratorio sobre su propio eje */}
        <div 
          className="animate-logo-spin perspective-1000"
          style={{ perspective: '1000px' }}
        >
          <Image
            src={logoUrl}
            alt="XPI Tienda"
            width={400}
            height={180}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Texto Bienvenidos - aparece despues de 5 segundos - TRES VECES MAS GRANDE */}
        {showText && (
          <div className="animate-fade-in-up text-center">
            <h1 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-extrabold mb-6 tracking-wider leading-none">
              {'Bienvenidos'.split('').map((letter, index) => (
                <span 
                  key={index} 
                  className={`animate-letter animate-letter-${index}`}
                >
                  {letter}
                </span>
              ))}
            </h1>
            <p className="text-2xl md:text-3xl font-light tracking-wide">
              <span className="text-[#00FF41] font-semibold drop-shadow-lg">Xpi Tienda</span>
              <span className="text-white mx-3">Una Alternativa</span>
              <span className="text-[#E879F9] font-semibold drop-shadow-lg">Inteligente</span>
            </p>
          </div>
        )}

        {/* Botones con intermitencia neon */}
        {showButtons && (
          <div className="animate-fade-in-up flex flex-col gap-5 items-center mt-12">
            
            {/* Boton Explorar - Verde Neon */}
            <button
              onClick={() => router.push('/catalog')}
              className="px-12 py-4 bg-[#00FF41]/20 hover:bg-[#00FF41]/40 text-[#00FF41] font-bold text-xl rounded-xl transform hover:scale-105 transition-all duration-300 min-w-[220px] animate-neon-green border border-[#00FF41]/50"
            >
              Explorar
            </button>

            {/* Boton Super Administrador - Morado Neon - mas abajo */}
            <button
              onClick={() => router.push('/admin/login')}
              className="px-8 py-3 bg-[#E879F9]/20 hover:bg-[#E879F9]/40 text-[#E879F9] font-bold text-sm rounded-xl transform hover:scale-105 transition-all duration-300 min-w-[200px] animate-neon-purple mt-4 border border-[#E879F9]/50"
            >
              Super Administrador
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
