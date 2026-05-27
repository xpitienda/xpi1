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
      
      {/* Fondo crema con visos verde y morado */}
      <div className="absolute inset-0 bg-[#FDF6E3]">
        {/* Viso verde superior izquierdo */}
        <div className="absolute top-0 left-0 w-[60%] h-[50%] bg-gradient-to-br from-[#00FF41]/15 via-[#00CC33]/10 to-transparent rounded-full blur-3xl transform -translate-x-1/4 -translate-y-1/4"></div>
        {/* Viso morado superior derecho */}
        <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-[#BF00FF]/15 via-[#9900CC]/10 to-transparent rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
        {/* Viso morado inferior izquierdo */}
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-[#BF00FF]/12 via-[#9900CC]/8 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        {/* Viso verde inferior derecho */}
        <div className="absolute bottom-0 right-0 w-[60%] h-[50%] bg-gradient-to-tl from-[#00FF41]/12 via-[#00CC33]/8 to-transparent rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
        {/* Viso central suave */}
        <div className="absolute top-1/2 left-1/2 w-[40%] h-[40%] bg-gradient-to-r from-[#00FF41]/5 to-[#BF00FF]/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
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
            <h1 className="text-7xl md:text-9xl font-extrabold mb-6 tracking-wider">
              {'Bienvenidos'.split('').map((letter, index) => (
                <span 
                  key={index} 
                  className={`animate-letter animate-letter-${index}`}
                >
                  {letter}
                </span>
              ))}
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide">
              <span className="text-[#00CC33] font-semibold">Xpi Tienda</span>
              <span className="text-gray-600 mx-2">Una Alternativa</span>
              <span className="text-[#9900CC] font-semibold">Inteligente</span>
            </p>
          </div>
        )}

        {/* Botones con intermitencia neon */}
        {showButtons && (
          <div className="animate-fade-in-up flex flex-col gap-5 items-center mt-12">
            
            {/* Boton Explorar - Verde Neon */}
            <button
              onClick={() => router.push('/catalog')}
              className="px-12 py-4 bg-[#00FF41]/10 hover:bg-[#00FF41]/30 text-[#00CC33] font-bold text-xl rounded-xl transform hover:scale-105 transition-all duration-300 min-w-[220px] animate-neon-green"
            >
              Explorar
            </button>

            {/* Boton Super Administrador - Morado Neon - mas abajo */}
            <button
              onClick={() => router.push('/admin/login')}
              className="px-8 py-3 bg-[#BF00FF]/10 hover:bg-[#BF00FF]/30 text-[#9900CC] font-bold text-sm rounded-xl transform hover:scale-105 transition-all duration-300 min-w-[200px] animate-neon-purple mt-4"
            >
              Super Administrador
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
