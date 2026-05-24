// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-xpi-purple/5 via-white to-xpi-green/5 flex flex-col items-center justify-center px-4 py-12">
      
      {/* Logo en texto */}
      <div className="mb-8">
        <h1 className="text-6xl md:text-8xl font-bold">
          <span className="text-xpi-purple">XPI</span>
          <span className="text-xpi-green">π</span>
        </h1>
        <p className="text-xpi-green text-2xl md:text-3xl font-bold text-center mt-2">ESSENTIALS</p>
      </div>

      <p className="text-gray-600 text-lg md:text-xl text-center mb-10 max-w-2xl">
        Tu marketplace de confianza. Compra y vende productos de forma segura y fácil.
      </p>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link 
          href="/catalog" 
          className="bg-xpi-purple text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-xpi-purple-dark transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          🛍️ Ver Catálogo
        </Link>
        
        <Link 
          href="/vender" 
          className="bg-white text-xpi-purple border-2 border-xpi-purple px-8 py-4 rounded-full font-bold text-lg hover:bg-xpi-purple/10 transition-all hover:shadow-lg flex items-center justify-center gap-2"
        >
          📦 Vender Producto
        </Link>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-xpi-purple/20 text-center">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="font-bold text-xpi-purple-dark mb-2">Seguro</h3>
          <p className="text-gray-600 text-sm">Transacciones protegidas</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-xpi-purple/20 text-center">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-bold text-xpi-purple-dark mb-2">Rápido</h3>
          <p className="text-gray-600 text-sm">Publica en segundos</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-xpi-purple/20 text-center">
          <div className="text-3xl mb-3">🌎</div>
          <h3 className="font-bold text-xpi-purple-dark mb-2">Global</h3>
          <p className="text-gray-600 text-sm">Conecta con todos</p>
        </div>
      </div>

    </div>
  );
}