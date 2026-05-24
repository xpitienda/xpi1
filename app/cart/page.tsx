// app/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const WHATSAPP_NUMBER = "573000000000"; 

  const handleCheckout = () => {
    setSending(true);
    
    let message = "🛍️ *Nuevo Pedido desde XPI Tienda*\n\n";
    message += "📦 *Detalle del pedido:*\n";
    
    cart.forEach((item) => {
      message += `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toLocaleString()}\n`;
    });

    message += `\n💰 *TOTAL: $${total.toLocaleString()}*`;
    message += "\n\n¡Quedo atento para coordinar el pago y envío!";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    clearCart();
    setSending(false);
  };

  // Mostrar loading hasta que monte
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Cargando carrito...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">Tu carrito está vacío 🛒</h1>
        <p className="text-gray-500 mb-6">Agrega productos desde el catálogo.</p>
        <Link 
          href="/catalog" 
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🛒 Tu Carrito de Compras</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow border">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-20 h-20 object-cover rounded border"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">Cantidad: {item.quantity}</p>
                <p className="text-green-600 font-bold">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-2 text-sm font-medium"
              >
                🗑️ Quitar
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow border h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Resumen</h2>
          
          <div className="space-y-2 mb-4 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={sending}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            {sending ? 'Procesando...' : '✅ Pedir por WhatsApp'}
          </button>
          
          <p className="text-xs text-center text-gray-400 mt-2">
            Te redirigiremos a WhatsApp para confirmar tu compra.
          </p>
        </div>
      </div>
    </div>
  );
}