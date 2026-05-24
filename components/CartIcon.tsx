// components/CartIcon.tsx
'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function CartIcon() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  // Esperar a que el componente se monte en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calcular cuántos items hay en total
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Si no está montado, mostrar solo el icono sin el badge
  if (!mounted) {
    return (
      <Link href="/cart" className="relative group p-2">
        <span className="text-2xl group-hover:scale-110 transition-transform block">
          🛒
        </span>
      </Link>
    );
  }

  return (
    <Link href="/cart" className="relative group p-2">
      <span className="text-2xl group-hover:scale-110 transition-transform block">
        🛒
      </span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
          {count}
        </span>
      )}
    </Link>
  );
}