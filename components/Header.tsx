// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import CartIcon from './CartIcon';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-xpi-purple">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="XPI Essentials Logo"
                fill
                sizes="40px"
                className="object-contain group-hover:scale-110 transition-transform"
                priority
              />
            </div>
            <div className="hidden md:block leading-none">
              <span className="text-2xl font-bold text-xpi-purple">XPI</span>
              <span className="text-2xl font-bold text-xpi-green">π</span>
            </div>
          </Link>

          {/* Navegación */}
          <nav className="flex items-center gap-4 md:gap-6">
            <Link 
              href="/catalog" 
              className="text-gray-700 hover:text-xpi-purple font-medium transition-colors hidden md:block"
            >
              Catálogo
            </Link>
            
            <Link 
              href="/vender" 
              className="bg-xpi-purple text-white px-4 py-2 rounded-full font-medium hover:bg-xpi-purple-dark transition-all hover:shadow-lg text-sm md:text-base"
            >
              + Vender
            </Link>
            
            <CartIcon />
          </nav>
        </div>
      </div>
    </header>
  );
}