// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CartIcon from './CartIcon';
import { ChevronLeft } from 'lucide-react';

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-gradient-to-r from-xpi-purple-dark via-xpi-purple to-xpi-purple-dark shadow-lg sticky top-0 z-50 border-b border-xpi-purple-glow/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-xpi-blue rounded-full flex items-center justify-center hover:bg-xpi-blue/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

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
            <div className="leading-none">
              <span className="text-2xl font-bold text-white">XPI</span>
              <span className="text-2xl font-bold text-xpi-green">π</span>
            </div>
          </Link>

          {/* Navegacion */}
          <nav className="flex items-center gap-4">
            <Link 
              href="/catalog" 
              className="text-gray-300 hover:text-xpi-green font-medium transition-colors hidden md:block"
            >
              Catalogo
            </Link>
            
            <Link 
              href="/vender" 
              className="bg-xpi-orange text-white px-4 py-2 rounded-full font-medium hover:bg-xpi-orange/80 transition-all hover:shadow-lg text-sm md:text-base"
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
