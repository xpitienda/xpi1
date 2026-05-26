'use client';

import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, MessageCircle } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    const message = `Hola! Quiero finalizar mi compra:\n\n${cart
      .map((item) => `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toLocaleString('es-CO')}`)
      .join('\n')}\n\n*Total: $${total.toLocaleString('es-CO')}*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/573234475311?text=${encodedMessage}`;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-xpi-purple-dark via-xpi-purple to-xpi-purple-light flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-xpi-purple-dark via-xpi-purple to-xpi-purple-light">
        <Header />
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-73px)]">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-xpi-purple-light/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-xpi-purple-glow/50">
              <ShoppingCart className="w-12 h-12 text-xpi-green" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Tu carrito esta vacio
            </h1>
            <p className="text-gray-400 mb-8">
              Explora nuestro catalogo y encuentra productos increibles
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-xpi-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-xpi-orange/80 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
              Ver Catalogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-xpi-purple-dark via-xpi-purple to-xpi-purple-light">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link 
                href="/catalog" 
                className="inline-flex items-center gap-2 text-gray-400 hover:text-xpi-green mb-2 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Seguir comprando
              </Link>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-xpi-green" />
                <span className="text-white">Carrito de </span>
                <span className="text-xpi-green">Compras</span>
              </h1>
            </div>
            <span className="text-gray-400">
              {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Products List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-xpi-purple-dark/80 backdrop-blur-sm rounded-xl border border-xpi-purple-glow/30 p-4 flex items-center gap-4 hover:border-xpi-purple-glow/50 transition-all"
                >
                  {/* Product Image - 48x48px */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border border-xpi-purple-glow/30"
                  />
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-xpi-green font-bold">
                      ${item.price.toLocaleString('es-CO')}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-xpi-blue hover:bg-xpi-blue/80 flex items-center justify-center transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    
                    <span className="w-8 text-center font-semibold text-white">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-xpi-orange hover:bg-xpi-orange/80 flex items-center justify-center transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-white">
                      ${(item.price * item.quantity).toLocaleString('es-CO')}
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-10 h-10 rounded-full hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-xpi-purple-dark/80 backdrop-blur-sm rounded-xl border border-xpi-purple-glow/30 p-6 sticky top-24 animate-glow">
                <h2 className="text-lg font-bold text-white mb-4">
                  Resumen del Pedido
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">${total.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Envio</span>
                    <span className="text-xpi-green font-medium">Gratis</span>
                  </div>
                  <div className="border-t border-xpi-purple-glow/30 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-white">Total</span>
                      <span className="text-xl font-bold text-xpi-green">
                        ${total.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-xpi-green via-xpi-cyan to-xpi-green text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Finalizar por WhatsApp
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full mt-3 text-gray-400 py-3 rounded-xl font-medium hover:bg-xpi-purple-light/30 transition-colors text-sm"
                >
                  Vaciar carrito
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Al finalizar seras redirigido a WhatsApp para completar tu pedido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
