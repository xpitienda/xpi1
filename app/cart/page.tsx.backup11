'use client';

import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { ShoppingCart, Trash2, MessageCircle, Plus, Minus, Mail } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = async () => {
    setSending(true);

    try {
      // 1. Enviar correo electrónico
      const orderData = {
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        total: total,
        customerInfo: 'Pedido desde XPI Tienda Web',
      };

      const emailResponse = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const emailResult = await emailResponse.json();

      if (!emailResult.success) {
        console.error('Error enviando correo:', emailResult.error);
        alert('⚠️ Hubo un problema al enviar el correo, pero puedes continuar con WhatsApp');
      } else {
        console.log('✅ Correo enviado correctamente');
      }

      // 2. Preparar mensaje de WhatsApp
      const message = `Hola! Quiero finalizar mi compra:\n\n${cart
        .map((item) => `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toLocaleString('es-CO')}`)
        .join('\n')}\n\n*Total: $${total.toLocaleString('es-CO')}*`;

      const encodedMessage = encodeURIComponent(message);
      
      // 3. Redirigir a WhatsApp
      window.location.href = `https://wa.me/573234475311?text=${encodedMessage}`;
    } catch (error) {
      console.error('Error en checkout:', error);
      alert('❌ Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)' }}>
      <Header />

      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ color: '#9333EA' }}>Carrito de </span>
          <span style={{ color: '#00FF41' }}>Compras</span>
        </h1>

        {cart.length === 0 ? (
          <div style={{ background: 'rgba(45,27,78,0.8)', borderRadius: '1.5rem', padding: '3rem', textAlign: 'center', border: '3px solid #2E7D32', boxShadow: '0 0 30px rgba(46,125,50,0.3)' }}>
            <ShoppingCart style={{ width: '4rem', height: '4rem', color: '#E07A5F', margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1.5rem', color: '#e9d5ff', marginBottom: '1.5rem' }}>Tu carrito está vacío</p>
            <Link
              href="/catalog"
              style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2E7D32 0%, #16a34a 100%)', color: 'white', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '1.125rem', border: '2px solid #00FF41', textDecoration: 'none' }}
            >
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <>
            {/* Grid de imágenes pequeñas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {cart.map((item) => (
                <div key={item.id} style={{
                  background: 'rgba(45,27,78,0.6)',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  border: '2px solid #2E7D32',
                  boxShadow: '0 4px 15px rgba(0,255,65,0.2)'
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100%',
                      aspectRatio: '1/1',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23e5e7eb" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="30">📦</text></svg>';
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Tabla de productos */}
            <div style={{
              background: 'rgba(45,27,78,0.8)',
              borderRadius: '1.5rem',
              border: '3px solid #2E7D32',
              boxShadow: '0 0 30px rgba(46,125,50,0.3)',
              overflow: 'hidden',
              marginBottom: '2rem'
            }}>
              {/* Header de la tabla */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr',
                gap: '1rem',
                padding: '1rem 1.5rem',
                background: 'linear-gradient(135deg, #4B0082 0%, #2E7D32 100%)',
                borderBottom: '2px solid #00FF41',
                fontWeight: 'bold',
                color: 'white',
                fontSize: '1rem'
              }}>
                <div>Producto</div>
                <div style={{ textAlign: 'center' }}>Cantidad</div>
                <div style={{ textAlign: 'right' }}>Precio Unit.</div>
                <div style={{ textAlign: 'right' }}>Subtotal</div>
                <div></div>
              </div>

              {/* Filas de productos */}
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr',
                    gap: '1rem',
                    padding: '1rem 1.5rem',
                    borderBottom: index !== cart.length - 1 ? '1px solid rgba(46,125,50,0.3)' : 'none',
                    alignItems: 'center',
                    color: '#e9d5ff'
                  }}
                >
                  {/* Nombre del producto */}
                  <div style={{ fontWeight: '600', color: 'white', fontSize: '1.1rem' }}>
                    {item.name}
                  </div>

                  {/* Controles de cantidad */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(224,122,95,0.2)',
                        border: '2px solid #E07A5F',
                        color: '#E07A5F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Minus style={{ width: '1rem', height: '1rem' }} />
                    </button>
                    <span style={{ width: '2rem', textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(0,255,65,0.2)',
                        border: '2px solid #00FF41',
                        color: '#00FF41',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus style={{ width: '1rem', height: '1rem' }} />
                    </button>
                  </div>

                  {/* Precio unitario */}
                  <div style={{ textAlign: 'right', color: '#a78bfa', fontSize: '1rem' }}>
                    ${item.price.toLocaleString('es-CO')}
                  </div>

                  {/* Subtotal */}
                  <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#00FF41', fontSize: '1.1rem' }}>
                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                  </div>

                  {/* Botón eliminar */}
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '0.75rem',
                        background: 'rgba(220,38,38,0.2)',
                        border: '2px solid #dc2626',
                        color: '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        margin: '0 auto'
                      }}
                      title="Eliminar producto"
                    >
                      <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total a pagar */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(75,0,130,0.9) 0%, rgba(46,125,50,0.9) 100%)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '3px solid #00FF41',
              boxShadow: '0 0 40px rgba(0,255,65,0.4)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', color: 'white', fontWeight: '600' }}>Total a pagar:</span>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00FF41', textShadow: '0 0 20px rgba(0,255,65,0.5)' }}>
                  ${total.toLocaleString('es-CO')}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={clearCart}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '1rem',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    border: '2px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  🗑️ Vaciar Carrito
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={sending}
                  style={{
                    flex: 2,
                    minWidth: '250px',
                    background: sending 
                      ? 'linear-gradient(135deg, #6B21A8 0%, #2E7D32 100%)'
                      : 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '1rem',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    border: sending ? '2px solid #6B21A8' : '2px solid #25D366',
                    cursor: sending ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    boxShadow: sending 
                      ? '0 0 20px rgba(107,33,168,0.4)'
                      : '0 0 20px rgba(37,211,102,0.4)',
                    opacity: sending ? 0.8 : 1
                  }}
                >
                  {sending ? (
                    <>
                      <Mail style={{ width: '1.5rem', height: '1.5rem' }} />
                      Enviando pedido...
                    </>
                  ) : (
                    <>
                      <MessageCircle style={{ width: '1.5rem', height: '1.5rem' }} />
                      Finalizar por WhatsApp
                    </>
                  )}
                </button>
              </div>

              {sending && (
                <p style={{ textAlign: 'center', color: '#00FF41', marginTop: '1rem', fontSize: '0.875rem' }}>
                  ✉️ Enviando correo a xpiesenciales@gmail.com...
                </p>
              )}
            </div>

            {/* Botón volver */}
            <div style={{ textAlign: 'center' }}>
              <Link
                href="/catalog"
                style={{
                  display: 'inline-block',
                  background: 'rgba(147,51,234,0.3)',
                  color: '#e9d5ff',
                  padding: '1rem 2rem',
                  borderRadius: '1rem',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  border: '2px solid #9333EA',
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}
              >
                ← Seguir comprando
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}