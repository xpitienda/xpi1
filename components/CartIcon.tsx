'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function CartIcon() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const hasItems = count > 0;

  return (
    <Link href="/cart" className="relative p-2 hover:opacity-80 transition-opacity">
      <img
        src={hasItems ? '/car1.ico' : '/car2.ico'}
        alt={hasItems ? 'Carrito con productos' : 'Carrito vacío'}
        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
      />
      {mounted && hasItems && (
        <span className="absolute -top-1 -right-1 bg-[#E07A5F] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}