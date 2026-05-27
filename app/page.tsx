'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SplashPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden animate-bg-cycle">
      
      {/* Logo con Box de doble línea giratoria */}
      <div className="relative mb-12">
        
        {/* Línea exterior - Verde eléctrico - Gira como manecillas del reloj */}
        <div className="absolute inset-0 -m-6">
          <svg 
            className="w-full h-full animate-spin-clockwise" 
            viewBox="0 0 320 200"
            style={{ animationDuration: '8s' }}
          >
            <rect 
              x="4" 
              y="4" 
              width="312" 
              height="192" 
              fill="none" 
              stroke="#00FF41" 
              strokeWidth="3"
              strokeDasharray="20 10"
              rx="16"
            />
          </svg>
        </div>
        
        {/* Línea interior - Morado eléctrico - Gira en sentido contrario */}
        <div className="absolute inset-0 -m-3">
          <svg 
            className="w-full h-full animate-spin-counter" 
            viewBox="0 0 296 176"
            style={{ animationDuration: '8s' }}
          >
            <rect 
              x="4" 
              y="4" 
              width="288" 
              height="168" 
              fill="none" 
              stroke="#BF00FF" 
              strokeWidth="3"
              strokeDasharray="15 8"
              rx="12"
            />
          </svg>
        </div>
        
        {/* Logo Container */}
        <div className="relative z-10 bg-black/80 rounded-xl p-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_XpiTienda_sin_Fondo-removebg-preview-yVgQmLAPvivdFeznsaVzvVQlE2Y1zE.png"
            alt="XPI Tienda"
            width={260}
            height={120}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Botones pequeños y centrados */}
      <div className="flex flex-col gap-4 items-center">
        
        {/* Boton Explorar */}
        <button
          onClick={() => router.push('/catalog')}
          className="px-8 py-3 bg-[#00FF41] hover:bg-[#00CC33] text-black font-bold text-sm rounded-xl shadow-lg shadow-[#00FF41]/40 hover:shadow-xl hover:shadow-[#00FF41]/50 transform hover:scale-105 transition-all duration-300"
        >
          Explorar
        </button>

        {/* Boton Super Administrador */}
        <button
          onClick={() => router.push('/admin/login')}
          className="px-6 py-2.5 bg-[#BF00FF] hover:bg-[#9900CC] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#BF00FF]/40 hover:shadow-xl hover:shadow-[#BF00FF]/50 transform hover:scale-105 transition-all duration-300"
        >
          Super Administrador
        </button>
      </div>
    </div>
  );
}
