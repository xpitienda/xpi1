'use client';

import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { ShoppingCart, Trash2, MessageCircle, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [sending, setSending] = useState(false);
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          <span className="text-white">Carrito de </span>
          <span className="text-xpi-green">Compras</span>
        </h1>

        {cart.length === 0 ? (
          <div className="bg-[#2d1b4e]/80 rounded-2xl p-12 border-2 border-xpi-green/30 text-center">
            <ShoppingCart className="w-16 h-16 text-xpi-green/60 mx-auto mb-4" />
            <p className="text-xl text-gray-300 mb-6">Tu carrito esta vacio</p>
            <Link
              href="/catalog"
              className="inline-block bg-xpi-purple text-white px-8 py-3 rounded-xl font-semibold hover:bg-xpi-purple-dark transition-colors"
            >
              Ver Catalogo
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items - Green Container */}
            <div className="bg-xpi-green/10 rounded-2xl border-2 border-xpi-green/30 shadow-sm overflow-hidden mb-6">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 bg-white/80 ${index !== cart.length - 1 ? 'border-b-2 border-xpi-green/20' : ''}`}
                >
                  {/* Image 48-64px */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border-2 border-xpi-green/20"
                  />
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                    <p className="text-gray-400 text-sm">
                      ${item.price.toLocaleString('es-CO')} c/u
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-xpi-purple/10 flex items-center justify-center hover:bg-xpi-purple/20 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-xpi-purple" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-xpi-purple/10 flex items-center justify-center hover:bg-xpi-purple/20 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-xpi-purple" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right w-28">
                    <p className="font-bold text-xpi-green-vibrant text-lg">
                      ${(item.price * item.quantity).toLocaleString('es-CO')}
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total and Actions - Green Container */}
            <div className="bg-gradient-to-r from-xpi-green/10 to-xpi-green/20 rounded-2xl p-6 border-2 border-xpi-green/30 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-gray-600 font-medium">Total a pagar:</span>
                <span className="text-3xl font-bold text-xpi-green-vibrant">
                  ${total.toLocaleString('es-CO')}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-white text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium border border-gray-200"
                >
                  Vaciar Carrito
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={sending}
                  className="flex-1 bg-xpi-purple text-white py-3 rounded-xl hover:bg-xpi-purple-dark transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5" />
                  {sending ? 'Procesando...' : 'Finalizar por WhatsApp'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
