'use client';

import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { ShoppingCart, Trash2, MessageCircle } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, total } = useCart();
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
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b4e] via-[#1a0a2e] to-[#2d1b4e]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          <span className="text-white">Carrito de </span>
          <span className="text-xpi-green">Compras</span>
        </h1>

        {cart.length === 0 ? (
          <div className="bg-[#1a0a2e]/80 rounded-2xl p-12 border border-[#6b3fa0]/30 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-6">Tu carrito esta vacio</p>
            <Link
              href="/catalog"
              className="inline-block bg-xpi-green text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Ver Catalogo
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="bg-[#1a0a2e]/80 rounded-2xl border border-[#6b3fa0]/30 overflow-hidden mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border-b border-[#6b3fa0]/20 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-gray-400 text-sm">
                      ${item.price.toLocaleString('es-CO')} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <p className="font-bold text-xpi-green">
                      ${(item.price * item.quantity).toLocaleString('es-CO')}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Actions */}
            <div className="bg-[#1a0a2e]/80 rounded-2xl p-6 border border-[#6b3fa0]/30">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-gray-400">Total:</span>
                <span className="text-3xl font-bold text-xpi-green">
                  ${total.toLocaleString('es-CO')}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-[#2d1b4e] text-gray-300 py-3 rounded-lg hover:bg-[#3d2b5e] transition-colors font-medium border border-[#6b3fa0]/30"
                >
                  Vaciar Carrito
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={sending}
                  className="flex-1 bg-xpi-green text-white py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
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
