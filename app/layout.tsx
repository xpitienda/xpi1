import './globals.css';
import GlobalCartSidebar from '@/components/GlobalCartSidebar';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';
import { ImageModalProvider } from '@/context/ImageModalContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'XPI Tienda - Tu Marketplace de Confianza',
    template: '%s | XPI Tienda'
  },
  description: 'Compra y vende productos de forma segura en XPI Tienda. Envíos a todo el país, miles de productos y los mejores precios.',
  keywords: ['tienda online', 'marketplace', 'compras', 'envíos', 'productos', 'ventas', 'Colombia'],
  authors: [{ name: 'XPI Tienda' }],
  creator: 'XPI Tienda',
  publisher: 'XPI Tienda',
  verification: {
    google: 'google2159ce80c5529a14',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://xpi1-tienda.vercel.app',
    siteName: 'XPI Tienda',
    title: 'XPI Tienda - Tu Marketplace de Confianza',
    description: 'Compra y vende productos de forma segura. Envíos a todo el país.',
    images: [
      {
        url: 'https://pub-aa262763875e4dc4ab1d8c212bad2fa0.r2.dev/logo.png',
        width: 1200,
        height: 630,
        alt: 'XPI Tienda Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XPI Tienda - Tu Marketplace de Confianza',
    description: 'Compra y vende productos de forma segura',
    images: ['https://pub-aa262763875e4dc4ab1d8c212bad2fa0.r2.dev/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
          <AdminAuthProvider>
            <ToastProvider>
              <ImageModalProvider>
                {children}
              </ImageModalProvider>
            </ToastProvider>
          </AdminAuthProvider>
          <GlobalCartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}