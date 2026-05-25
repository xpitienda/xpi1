'use client';

import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    // Crear mensaje de WhatsApp con el resumen del carrito
    const message = `¡Hola! Quiero finalizar mi compra:\n\n${cart
      .map((item) => `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toLocaleString('es-CO')}`)
      .join('\n')}\n\n*Total: $${total.toLocaleString('es-CO')}*`;
    
    // Codificar para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Redirigir a WhatsApp en la MISMA página
    window.location.href = `https://wa.me/573234475311?text=${encodedMessage}`;
  };

  if (!mounted) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-9