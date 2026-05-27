'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CartIcon from './CartIcon';

export default function Header() {
  const router = useRouter();
  
  return (
    <header className="bg-gradient-to-r from-[#2d1b4e] to-[#1a0a2e] sticky top-0 z-50 border-b border-[#6b3fa0]/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-xpi-blue flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo-xpitienda.png" 
              alt="XPI Tienda"
              width={120}
              height={48}
              className="object-contain"
              priority
            />
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
              className="bg-xpi-orange text-white px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity text-sm"
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
