// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import CartIcon from './CartIcon';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-[#2d1b4e] to-[#1a0a2e] sticky top-0 z-50 border-b border-[#6b3fa0]/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Back Button */}
          <Link 
            href="/" 
            className="w-10 h-10 rounded-full bg-xpi-blue flex items-center justify-center text-white hover:bg-xpi-blue/80 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-32 h-12 flex-shrink-0">
              <Image 
                src="/logo-xpitienda.png" 
                alt="XPI Tienda Logo"
                fill
                sizes="128px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            <Link 
              href="/catalog" 
              className="text-xpi-green hover:text-xpi-green/80 font-medium transition-colors hidden md:block"
            >
              Catalogo
            </Link>
            
            <Link 
              href="/vender" 
              className="bg-xpi-orange text-white px-4 py-2 rounded-full font-medium hover:bg-xpi-orange/80 transition-all text-sm"
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
