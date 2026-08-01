'use client';

import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function CartIcon() {
  const { cart, isCartOpen, setIsCartOpen } = useCart();
  
  // Estado para evitar el error de hidratación
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 1. Durante la hidratación (servidor), mostramos el carrito vacío para que coincida
  if (!mounted) {
    return (
      <button 
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
        aria-label="Abrir carrito"
      >
        <img
          src="/car2.ico"
          alt="Carrito"
          width={32}
          height={32}
          className="object-contain"
        />
      </button>
    );
  }

  // 2. Después de montar (cliente), mostramos el estado real con el contador
  return (
    <button 
      onClick={() => setIsCartOpen(true)}
      className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
      aria-label="Abrir carrito"
    >
      <img
        src={count > 0 ? "/car1.ico" : "/car2.ico"}
        alt="Carrito"
        width={32}
        height={32}
        className="object-contain"
      />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
          {count}
        </span>
      )}
    </button>
  );
}