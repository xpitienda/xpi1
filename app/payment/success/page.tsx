'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function PaymentSuccess() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Header />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #2D1B4E 0%, #1a1a2e 100%)' }}>
        <CheckCircle style={{ width: '6rem', height: '6rem', color: '#00FF41' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
          ¡Pago Exitoso!
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#e9d5ff', textAlign: 'center', maxWidth: '600px' }}>
          Gracias por tu compra. Hemos recibido tu pago correctamente y estamos preparando tu pedido.
        </p>
        <p style={{ fontSize: '1rem', color: '#F59E0B', textAlign: 'center' }}>
          📧 Te hemos enviado la factura a tu correo electrónico.
        </p>
        <Link href="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #2E7D32 0%, #16a34a 100%)', color: 'white', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '1.125rem', border: '2px solid #00FF41', textDecoration: 'none', marginTop: '1rem' }}>
          <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
          Volver al Catálogo
        </Link>
      </div>
    </>
  );
}