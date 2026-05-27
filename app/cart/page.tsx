'use client';

import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, MessageCircle, Minus, Plus } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity, total } = useCart();
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
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          <span className="text-white">Carrito de </span>
          <span className="text-xpi-green">Compras</span>
        </h1>

        {cart.length === 0 ? (
          <div 
            className="bg-[#1a0a2e]/80 backdrop-blur-sm rounded-2xl p-12 border border-[#6b3fa0]/30 text-center"
            style={{ boxShadow: '0 0 40px rgba(107, 63, 160, 0.2)' }}
          >
            <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Tu carrito esta vacio</h2>
            <p className="text-gray-400 mb-6">Agrega productos desde el catalogo</p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(to right, #00d4aa, #06b6d4)' }}
            >
              Ver Catalogo
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div 
              className="bg-[#1a0a2e]/80 backdrop-blur-sm rounded-2xl border border-[#6b3fa0]/30 overflow-hidden mb-6"
              style={{ boxShadow: '0 0 40px rgba(107, 63, 160, 0.2)' }}
            >
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 ${index !== cart.length - 1 ? 'border-b border-[#6b3fa0]/20' : ''}`}
                >
                  {/* Product Image - 48x48px */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#2d1b4e] flex-shrink-0">
                    <Image
                      src={item.image || '/images/placeholder.jpg'}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-xpi-green text-sm">${item.price.toLocaleString('es-CO')}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-[#2d1b4e] border border-[#6b3fa0]/30 text-white flex items-center justify-center hover:bg-[#6b3fa0]/30 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-[#2d1b4e] border border-[#6b3fa0]/30 text-white flex items-center justify-center hover:bg-[#6b3fa0]/30 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-bold text-white">
                      ${(item.price * item.quantity).toLocaleString('es-CO')}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div 
              className="bg-[#1a0a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#6b3fa0]/30"
              style={{ boxShadow: '0 0 40px rgba(107, 63, 160, 0.2)' }}
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-gray-400">Total:</span>
                <span className="text-3xl font-bold text-xpi-green">
                  ${total.toLocaleString('es-CO')}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={clearCart}
                  className="flex-1 py-3 rounded-lg font-semibold text-white bg-[#2d1b4e] border border-[#6b3fa0]/30 hover:bg-[#6b3fa0]/30 transition-colors"
                >
                  Vaciar Carrito
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-xpi-green/20"
                  style={{ background: 'linear-gradient(to right, #00d4aa, #06b6d4)' }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Finalizar por WhatsApp
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
