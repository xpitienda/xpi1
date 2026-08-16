'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ShoppingCart, Trash2, MessageCircle, Plus, Minus, ArrowLeft, MapPin, Phone, User, Mail, Wallet, CreditCard } from 'lucide-react';
import Header from '@/components/Header';

export default function CartPage() {
  const { cart, customerInfo, saveCustomerData, updateCustomerInfo, toggleSaveData, removeFromCart, updateQuantity, clearCart, total, subtotal } = useCart();
  const { showToast } = useToast();
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [showNequiModal, setShowNequiModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (customerInfo.name && customerInfo.phone && customerInfo.address) {
      setShowAddressForm(false);
    }
  }, []);

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      showToast('Por favor completa todos los datos de envío', 'error');
      setShowAddressForm(true);
      return;
    }

    setSending(true);
    try {
      const emailResponse = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerInfo, cart, total }),
      });

      if (emailResponse.ok) showToast('✅ Pedido enviado por correo electrónico', 'success');

      const message = `*NUEVO PEDIDO - XPI TIENDA*\n\n*Datos del Cliente:*\n👤 Nombre: ${customerInfo.name}\n📱 Teléfono: ${customerInfo.phone}\n📧 Email: ${customerInfo.email || 'No proporcionado'}\n📍 Dirección: ${customerInfo.address}\n${customerInfo.city ? `🏙️ Ciudad: ${customerInfo.city}\n` : ''}\n*Productos:*\n\n${cart.map((item) => `• ${item.name}\n  Cantidad: ${item.quantity}\n  Precio: $${(item.price * item.quantity).toLocaleString('es-CO')}`).join('\n\n')}\n\n*TOTAL: $${total.toLocaleString('es-CO')}*`;

      window.location.href = `https://wa.me/573234475311?text=${encodeURIComponent(message)}`;
      showToast('Redirigiendo a WhatsApp...', 'success');
    } catch (error) {
      console.error('Error en checkout:', error);
      showToast('Error al procesar el pedido', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleMercadoPagoCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      showToast('Por favor completa todos los datos de envío', 'error');
      setShowAddressForm(true);
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, customer: customerInfo }),
      });

      const data = await response.json();
      if (response.ok && data.init_point) {
        showToast('Redirigiendo a pasarela de pago segura...', 'success');
        window.location.href = data.init_point;
      } else {
        showToast('Error al generar el pago: ' + (data.error || 'Desconocido'), 'error');
      }
    } catch (error) {
      console.error('Error en checkout MP:', error);
      showToast('Error al procesar el pago', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleNequiPayment = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      showToast('Por favor completa todos los datos de envío', 'error');
      setShowAddressForm(true);
      return;
    }
    setShowNequiModal(true);
  };

  const handleNequiConfirm = () => {
    setShowNequiModal(false);
    const message = `*PEDIDO XPI TIENDA - PAGO CON NEQUI*\n\n*Datos del Cliente:*\n👤 Nombre: ${customerInfo.name}\n📱 Teléfono: ${customerInfo.phone}\n📧 Email: ${customerInfo.email || 'No proporcionado'}\n📍 Dirección: ${customerInfo.address}\n${customerInfo.city ? `🏙️ Ciudad: ${customerInfo.city}\n` : ''}\n*Método de pago:* 💜 Nequi\n*Monto a pagar:* $${total.toLocaleString('es-CO')}\n\n*Productos:*\n${cart.map((item) => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-CO')}`).join('\n')}\n\n *Ya realicé la transferencia por Nequi al 3234475311*`;

    window.location.href = `https://wa.me/573234475311?text=${encodeURIComponent(message)}`;
    showToast('Redirigiendo a WhatsApp para confirmar pago Nequi...', 'success');
  };

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
          <ShoppingCart style={{ width: '8rem', height: '8rem', color: '#E07A5F', opacity: 0.5 }} />
          <p style={{ fontSize: '1.5rem', color: '#e9d5ff', marginBottom: '1.5rem' }}>Tu carrito está vacío</p>
          <Link href="/catalog" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2E7D32 0%, #16a34a 100%)', color: 'white', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '1.125rem', border: '2px solid #00FF41', textDecoration: 'none' }}>
            Ver Catálogo
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2D1B4E 0%, #1a1a2e 100%)', padding: '2rem 1rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, #00FF41 0%, #E07A5F 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Carrito de Compras
          </h1>

          {/* Formulario de Datos del Cliente */}
          <div style={{ background: 'rgba(45,27,78,0.8)', borderRadius: '1.5rem', border: '3px solid #F59E0B', boxShadow: '0 0 30px rgba(245,158,11,0.3)', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => setShowAddressForm(!showAddressForm)}>
              <h3 style={{ color: '#F59E0B', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>📋 Datos de Envío</h3>
              <span style={{ color: '#a78bfa', fontSize: '0.9rem' }}>{showAddressForm ? '▲ Ocultar' : '▼ Mostrar'}</span>
            </div>

            {showAddressForm && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}><User style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />Nombre completo *</label>
                  <input type="text" value={customerInfo.name} onChange={(e) => updateCustomerInfo({ name: e.target.value })} placeholder="Tu nombre completo" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '2px solid #F59E0B', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}><Phone style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />Teléfono de contacto *</label>
                  <input type="tel" value={customerInfo.phone} onChange={(e) => updateCustomerInfo({ phone: e.target.value })} placeholder="300 123 4567" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '2px solid #F59E0B', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }} />
                </div>
                
                {/* CAMPO EMAIL - OPCIONAL (sin required) */}
                <div>
                  <label style={{ display: 'block', color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}><Mail style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />Correo electrónico <span style={{ opacity: 0.7 }}>(opcional)</span></label>
                  <input type="email" value={customerInfo.email || ''} onChange={(e) => updateCustomerInfo({ email: e.target.value })} placeholder="tu@email.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '2px solid #F59E0B', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}><MapPin style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />Dirección de envío *</label>
                  <input type="text" value={customerInfo.address} onChange={(e) => updateCustomerInfo({ address: e.target.value })} placeholder="Calle 123 #45-67, Barrio" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '2px solid #F59E0B', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>Ciudad</label>
                  <input type="text" value={customerInfo.city} onChange={(e) => updateCustomerInfo({ city: e.target.value })} placeholder="Tu ciudad (opcional)" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '2px solid #F59E0B', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <input type="checkbox" id="saveData" checked={saveCustomerData} onChange={toggleSaveData} style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer', accentColor: '#00FF41' }} />
                  <label htmlFor="saveData" style={{ color: 'white', fontSize: '0.9rem', cursor: 'pointer', flex: 1 }}>💾 Guardar mis datos para futuras compras</label>
                </div>
                <div style={{ background: saveCustomerData ? 'rgba(0,255,65,0.1)' : 'rgba(167,139,250,0.1)', border: `2px solid ${saveCustomerData ? '#00FF41' : '#a78bfa'}`, borderRadius: '0.75rem', padding: '1rem', transition: 'all 0.3s' }}>
                  <p style={{ color: saveCustomerData ? '#00FF41' : '#a78bfa', fontSize: '0.85rem', margin: 0 }}>{saveCustomerData ? '✅ Tus datos se guardarán automáticamente para futuras compras' : 'ℹ️ Tus datos NO se guardarán. Deberás ingresarlos en cada compra.'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Grid de imágenes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ aspectRatio: '1/1', borderRadius: '1rem', overflow: 'hidden', border: '2px solid #2E7D32', boxShadow: '0 0 15px rgba(46,125,50,0.3)', background: '#FDF6E3' }}>
                <img src={item.image || item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect fill="%23e5e7eb" width="120" height="120"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="40">📦</text></svg>'; }} />
              </div>
            ))}
          </div>

          {/* Tabla de productos */}
          <div style={{ background: 'rgba(45,27,78,0.8)', borderRadius: '1.5rem', border: '3px solid #2E7D32', boxShadow: '0 0 30px rgba(46,125,50,0.3)', overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 0.5fr', gap: '1rem', padding: '1rem 1.5rem', background: 'linear-gradient(135deg, #4B0082 0%, #2E7D32 100%)', borderBottom: '2px solid #00FF41', fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
              <div>Producto</div>
              <div style={{ textAlign: 'center' }}>Cantidad</div>
              <div style={{ textAlign: 'right' }}>Precio Unit.</div>
              <div style={{ textAlign: 'right' }}>Subtotal</div>
              <div></div>
            </div>
            {cart.map((item, index) => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 0.5fr', gap: '1rem', padding: '1rem 1.5rem', borderBottom: index !== cart.length - 1 ? '1px solid rgba(46,125,50,0.3)' : 'none', alignItems: 'center', color: '#e9d5ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '0.5rem', overflow: 'hidden', border: '2px solid #2E7D32', background: '#FDF6E3', flexShrink: 0 }}>
                    <img src={item.image || item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect fill="%23e5e7eb" width="60" height="60"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="30">📦</text></svg>'; }} />
                  </div>
                  <span style={{ fontWeight: '600', color: 'white', fontSize: '1.1rem' }}>{item.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'rgba(224,122,95,0.2)', border: '2px solid #E07A5F', color: '#E07A5F', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus style={{ width: '1rem', height: '1rem' }} /></button>
                  <span style={{ width: '2rem', textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'rgba(0,255,65,0.2)', border: '2px solid #00FF41', color: '#00FF41', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus style={{ width: '1rem', height: '1rem' }} /></button>
                </div>
                <div style={{ textAlign: 'right', color: '#a78bfa', fontSize: '1rem' }}>${item.price.toLocaleString('es-CO')}</div>
                <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#00FF41', fontSize: '1.1rem' }}>${(item.price * item.quantity).toLocaleString('es-CO')}</div>
                <div style={{ textAlign: 'center' }}>
                  <button onClick={() => { if (window.confirm("¿Eliminar este producto del carrito?")) { removeFromCart(item.id); } }} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(220,38,38,0.2)', border: '2px solid #dc2626', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: '0 auto' }} title="Eliminar producto"><Trash2 style={{ width: '1.25rem', height: '1.25rem' }} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Total a pagar */}
          <div style={{ background: 'linear-gradient(135deg, rgba(75,0,130,0.9) 0%, rgba(46,125,50,0.9) 100%)', borderRadius: '1.5rem', padding: '2rem', border: '3px solid #00FF41', boxShadow: '0 0 40px rgba(0,255,65,0.4)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'white', fontWeight: '600' }}>Total a pagar:</span>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00FF41', textShadow: '0 0 20px rgba(0,255,65,0.5)' }}>${total.toLocaleString('es-CO')}</span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => { if (window.confirm("¿Estás seguro de vaciar todo el carrito?")) { clearCart(); } }} style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '1rem', borderRadius: '1rem', fontWeight: 'bold', border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />Vaciar Carrito</button>

              <button onClick={handleNequiPayment} disabled={sending} style={{ flex: 1, minWidth: '250px', background: 'linear-gradient(135deg, #9D00FF 0%, #6B00A8 100%)', color: 'white', padding: '1rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: sending ? 0.7 : 1, boxShadow: '0 0 20px rgba(157,0,255,0.4)' }}>
                <Wallet style={{ width: '1.5rem', height: '1.5rem' }} /> 💜 Pagar con Nequi
              </button>

              <button onClick={handleMercadoPagoCheckout} disabled={sending} style={{ flex: 1, minWidth: '250px', background: 'linear-gradient(135deg, #009EE3 0%, #007BB5 100%)', color: 'white', padding: '1rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: sending ? 0.7 : 1, boxShadow: '0 0 20px rgba(0,158,227,0.4)' }}>
                <CreditCard style={{ width: '1.5rem', height: '1.5rem' }} /> 💳 MercadoPago
              </button>

              <button onClick={handleCheckout} disabled={sending} style={{ flex: 1, minWidth: '250px', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white', padding: '1rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '1.125rem', border: 'none', cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: sending ? 0.7 : 1, boxShadow: '0 0 20px rgba(37,211,102,0.4)' }}>
                <MessageCircle style={{ width: '1.5rem', height: '1.5rem' }} /> {sending ? 'Procesando...' : '📱 Pedir por WhatsApp'}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(75,0,130,0.6)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: 'bold', border: '2px solid #4B0082', textDecoration: 'none', transition: 'all 0.3s' }}>
              <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} /> Seguir comprando
            </Link>
          </div>
        </div>
      </div>

      {/* MODAL DE NEQUI */}
      {showNequiModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }} onClick={() => setShowNequiModal(false)}>
          <div style={{ background: 'linear-gradient(135deg, #9D00FF 0%, #6B00A8 100%)', borderRadius: '2rem', padding: '2rem', maxWidth: '500px', width: '100%', border: '3px solid #00FF41', boxShadow: '0 0 60px rgba(157,0,255,0.6)', color: 'white' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Wallet style={{ width: '5rem', height: '5rem', margin: '0 auto 1rem', color: '#00FF41' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>💜 Pagar con Nequi</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Sigue estos pasos:</p>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>1️⃣ Abre tu app de Nequi</p>
                <p style={{ margin: 0, opacity: 0.9 }}>Inicia sesión en tu aplicación de Nequi</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>2️⃣ Realiza el pago</p>
                <p style={{ margin: '0 0 0.5rem', opacity: 0.9 }}>Envía a: <strong style={{ color: '#00FF41' }}>323 447 5311</strong></p>
                <p style={{ margin: 0, opacity: 0.9 }}>Monto: <strong style={{ color: '#00FF41', fontSize: '1.3rem' }}>${total.toLocaleString('es-CO')}</strong></p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>3️ Confirma tu pago</p>
                <p style={{ margin: 0, opacity: 0.9 }}>Te redirigiremos a WhatsApp para que envíes el comprobante</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowNequiModal(false)} style={{ flex: 1, padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Cancelar</button>
              <button onClick={handleNequiConfirm} style={{ flex: 2, padding: '1rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #00FF41 0%, #16a34a 100%)', color: '#1a1a2e', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 0 20px rgba(0,255,65,0.4)' }}>✅ Ya realicé el pago</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}