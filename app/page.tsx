'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, DollarSign, Truck, CreditCard, Star, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <div 
        className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative"
        style={{ 
          background: 'linear-gradient(135deg, #6B2D8B 0%, #4a1f61 40%, #1B8A3B 100%)'
        }}
      >
        {/* Decorative Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center animate-fadeIn">
          {/* Logo */}
          <div className="mb-8 animate-scaleIn">
            <Image
              src="/logo-xpitienda.png"
              alt="XPI Tienda"
              width={220}
              height={100}
              className="object-contain mx-auto drop-shadow-2xl"
              priority
            />
          </div>

          {/* Tagline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Tu Marketplace
          </h1>
          <p className="text-2xl sm:text-3xl font-semibold text-white/90 mb-8">
            de Confianza
          </p>

          <p className="text-white/80 text-lg mb-10 max-w-md mx-auto">
            Compra y vende productos de forma segura, rapida y confiable
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => router.push('/catalog')}
              className="group px-8 py-4 bg-[#6B2D8B] hover:bg-[#4a1f61] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <ShoppingBag className="w-6 h-6" />
              Ver Catalogo
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => router.push('/vender')}
              className="group px-8 py-4 bg-[#1B8A3B] hover:bg-[#156b2e] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <DollarSign className="w-6 h-6" />
              Vender Productos
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#6B2D8B] mb-10">
            Por que elegirnos?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-[#F3E8FF] to-[#EDE9FE] p-6 rounded-xl text-center hover:shadow-lg transition-shadow border border-[#6B2D8B]/20">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#6B2D8B] rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-[#6B2D8B] text-lg mb-2">Envio Rapido</h3>
              <p className="text-gray-600 text-sm">Recibe tus productos en tiempo record</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-[#F3E8FF] to-[#EDE9FE] p-6 rounded-xl text-center hover:shadow-lg transition-shadow border border-[#6B2D8B]/20">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1B8A3B] rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-[#1B8A3B] text-lg mb-2">Pago Seguro</h3>
              <p className="text-gray-600 text-sm">Transacciones 100% protegidas</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-[#F3E8FF] to-[#EDE9FE] p-6 rounded-xl text-center hover:shadow-lg transition-shadow border border-[#6B2D8B]/20">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#22A84A] rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-[#22A84A] text-lg mb-2">Mejores Precios</h3>
              <p className="text-gray-600 text-sm">Ofertas exclusivas todos los dias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#6B2D8B] py-6 px-4 text-center">
        <p className="text-white/80 text-sm">
          2024 XPI Tienda. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
