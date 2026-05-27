'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, Tag, Sparkles, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-xpi-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-xpi-green/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo-xpitienda.png"
              alt="XPI Tienda"
              width={280}
              height={120}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>

          {/* Tagline */}
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">
            <span className="text-xpi-purple">Tu Marketplace</span>{' '}
            <span className="text-xpi-green">de Confianza</span>
          </h1>
          <p className="text-gray-600 text-center text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Compra y vende productos de forma segura y rapida
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => router.push('/catalog')}
              className="w-full sm:w-auto px-8 py-4 bg-xpi-purple text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-xpi-purple-dark transition-colors shadow-lg shadow-xpi-purple/30"
            >
              <ShoppingBag className="w-6 h-6" />
              Ver Catalogo
            </button>
            <button
              onClick={() => router.push('/vender')}
              className="w-full sm:w-auto px-8 py-4 bg-xpi-green text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-xpi-green-dark transition-colors shadow-lg shadow-xpi-green/30"
            >
              <Tag className="w-6 h-6" />
              Vender Producto
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-xpi-purple/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-xpi-purple" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Seguro</h3>
              <p className="text-gray-500 text-sm">Transacciones protegidas y verificadas</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-xpi-green/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-xpi-green" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Rapido</h3>
              <p className="text-gray-500 text-sm">Publica y compra en minutos</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-xpi-purple/10 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-xpi-purple" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Variedad</h3>
              <p className="text-gray-500 text-sm">Miles de productos disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>&copy; 2024 XPI Tienda. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
