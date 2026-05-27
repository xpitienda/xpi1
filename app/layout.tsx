// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';
import { ImageModalProvider } from '@/context/ImageModalContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'XPI Tienda - Tu Marketplace',
  description: 'Compra y vende productos de forma segura',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans`}>
        <CartProvider>
          <ToastProvider>
            <ImageModalProvider>
              {children}
            </ImageModalProvider>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
