'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SplashPage() {
  const router = useRouter();

  // Logo URL
  const logoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_XpiTienda_sin_Fondo-removebg-preview-yVgQmLAPvivdFeznsaVzvVQlE2Y1zE.png";

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      
      {/* Fondo con logos repetidos en 4 colores pastel */}
      <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 p-4 opacity-20">
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
                width={80}
                height={40}
                className={`object-contain ${colorClass}`}
              />
            </div>
          );
        })}
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b4e]/90 via-[#1a0a2e]/95 to-[#0d051a]/90" />

      {/* Box principal - 70% de la página */}
      <div className="relative w-[90vw] h-[70vh] max-w-5xl flex flex-col items-center justify-center">
        
        {/* SVG para las líneas giratorias */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          {/* Línea exterior - Verde eléctrico - Segmentos largos y cortos */}
          <rect 
            x="1" 
            y="1" 
            width="98" 
            height="98" 
            fill="none" 
            stroke="#00FF41" 
            strokeWidth="0.5"
            strokeDasharray="8 3 4 3"
            rx="2"
            className="animate-dash-clockwise"
          />
          
          {/* Línea interior - Morado eléctrico - Segmentos largos y cortos */}
          <rect 
            x="3" 
            y="3" 
            width="94" 
            height="94" 
            fill="none" 
            stroke="#BF00FF" 
            strokeWidth="0.5"
            strokeDasharray="6 2 3 2"
            rx="1.5"
            className="animate-dash-counter"
          />
        </svg>

        {/* Box interno estático con gradiente verde/morado pastel */}
        <div 
          className="absolute inset-[12px] rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(152, 251, 152, 0.15) 0%, rgba(216, 191, 216, 0.15) 50%, rgba(152, 251, 152, 0.1) 100%)'
          }}
        />

        {/* Contenido del box */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-12 p-8">
          
          {/* Logo grande */}
          <div className="relative">
            <Image
              src={logoUrl}
              alt="XPI Tienda"
              width={400}
              height={180}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Botones funcionales centrados */}
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            
            {/* Boton Explorar */}
            <button
              onClick={() => router.push('/catalog')}
              className="px-10 py-4 bg-gradient-to-r from-[#00FF41] to-[#00CC33] hover:from-[#00CC33] hover:to-[#00FF41] text-black font-bold text-base rounded-xl shadow-lg shadow-[#00FF41]/30 hover:shadow-xl hover:shadow-[#00FF41]/50 transform hover:scale-105 transition-all duration-300 min-w-[160px]"
            >
              Explorar
            </button>

            {/* Boton Super Administrador */}
            <button
              onClick={() => router.push('/admin/login')}
              className="px-8 py-3 bg-gradient-to-r from-[#BF00FF] to-[#9900CC] hover:from-[#9900CC] hover:to-[#BF00FF] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#BF00FF]/30 hover:shadow-xl hover:shadow-[#BF00FF]/50 transform hover:scale-105 transition-all duration-300 min-w-[180px]"
            >
              Super Administrador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
