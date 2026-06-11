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
    const timer = setTimeout(() => {
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

      setShowText(true);

      setTimeout(() => {
        setShowButtons(true);
      }, 800);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
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

      <div className="absolute inset-0 bg-[#6B21A8]/60 z-10"></div>

      <div className="relative z-20 flex flex-col items-center justify-center gap-8 p-8">
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

        {showText && (
          <div className="animate-fade-in-up text-center">
            <h1 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-extrabold mb-4 tracking-wider leading-none">
              {'Bienvenidos'.split('').map((letter, index) => (
                <span
                  key={index}
                  className={`animate-letter animate-letter-${index}`}
                >
                  {letter}
                </span>
              ))}
            </h1>

            {showButtons && (
              <div className="animate-fade-in-up flex flex-row justify-between items-center w-full max-w-4xl mt-8 mb-10 px-4">
                <button
                  onClick={() => router.push('/home')}
                  className="px-10 py-4 bg-[#00BFFF]/30 hover:bg-[#00BFFF]/50 text-[#00BFFF] font-bold text-2xl rounded-2xl transform hover:scale-105 transition-all duration-300 animate-neon-blue border-3 border-[#00BFFF]/80 shadow-lg"
                >
                  Explorar
                </button>

                <button
                  onClick={() => router.push('/admin/login')}
                  className="px-10 py-4 bg-[#FF6B00]/30 hover:bg-[#FF6B00]/50 text-[#FF6B00] font-bold text-2xl rounded-2xl transform hover:scale-105 transition-all duration-300 animate-neon-orange border-3 border-[#FF6B00]/80 shadow-lg"
                >
                  Administrador
                </button>
              </div>
            )}

            <p className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
              <span className="text-[#00FF41] font-semibold drop-shadow-lg">Xpi Tienda</span>
              <span className="text-white mx-3">Una Alternativa</span>
              <span className="text-[#E879F9] font-semibold drop-shadow-lg">Inteligente</span>
            </p>

            {showButtons && (
              <div className="mt-12 animate-bounce">
                <p className="text-white/80 text-xl mb-2">Desliza hacia abajo</p>
                <div className="text-white/80 text-4xl">↓</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}