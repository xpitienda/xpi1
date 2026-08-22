"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';

const infoSections = [
  {
    id: 'about',
    title: 'Quiénes Somos',
    icon: '🚀',
    content: `
      <h3>Nuestra Misión</h3>
      <p>En <strong>XPI Tienda</strong>, somos un marketplace colombiano dedicado a conectar a compradores y vendedores de todo el país. Nuestra misión es democratizar el comercio electrónico, ofreciendo una plataforma segura, intuitiva y confiable donde los emprendedores puedan hacer crecer sus negocios y los clientes puedan encontrar productos únicos con los mejores precios.</p>
      
      <h3>¿Por qué elegirnos?</h3>
      <ul>
        <li><strong>Seguridad:</strong> Protegemos tus datos y tus transacciones con los más altos estándares.</li>
        <li><strong>Variedad:</strong> Miles de productos de vendedores verificados.</li>
        <li><strong>Soporte:</strong> Nuestro equipo está siempre disponible para ayudarte a través de WhatsApp.</li>
      </ul>
    `
  },
  {
    id: 'terms',
    title: 'Términos y Condiciones',
    icon: '⚖️',
    content: `
      <h3>Aceptación de los Términos</h3>
      <p>Al acceder y utilizar el sitio web de XPI Tienda (https://xpi1-tienda.vercel.app), usted acepta estar sujeto a estos Términos y Condiciones de Uso. Si no está de acuerdo con alguna parte de estos términos, le rogamos no utilizar nuestro sitio.</p>
      
      <h3>Uso de la Plataforma</h3>
      <p>XPI Tienda actúa como un intermediario tecnológico que facilita la conexión entre vendedores y compradores. No somos propietarios de los productos listados, por lo que la calidad, entrega y garantía de los productos es responsabilidad directa de cada vendedor independiente.</p>
      
      <h3>Registro de Usuario</h3>
      <p>Para realizar compras o ventas, es necesario crear una cuenta proporcionando información veraz, actualizada y completa. Usted es responsable de mantener la confidencialidad de su contraseña.</p>
    `
  },
  {
    id: 'privacy',
    title: 'Política de Privacidad',
    icon: '',
    content: `
      <h3>Protección de Datos (Ley 1581 de 2012)</h3>
      <p>En XPI Tienda nos comprometemos a proteger su información personal de acuerdo con la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.</p>
      
      <h3>¿Qué datos recopilamos?</h3>
      <p>Recopilamos información como nombre, dirección, correo electrónico y número de teléfono únicamente para procesar sus pedidos, gestionar envíos a través de nuestras aliadas logísticas (Servientrega, Interrapidisimo, etc.) y emitir facturas electrónicas.</p>
      
      <h3>Uso de la Información</h3>
      <p>Sus datos nunca serán vendidos ni compartidos con terceros con fines comerciales no autorizados. Utilizamos pasarelas de pago seguras (MercadoPago, Nequi) que cifran su información financiera.</p>
    `
  },
  {
    id: 'returns',
    title: 'Devoluciones y Cambios',
    icon: '🔄',
    content: `
      <h3>Derecho de Retracto (Ley 1480 de 2011)</h3>
      <p>De acuerdo con la legislación colombiana, usted tiene derecho a retractarse de su compra dentro de los <strong>5 días hábiles</strong> siguientes a la entrega del producto, siempre y cuando el producto no haya sido usado, esté en su empaque original y conserve sus etiquetas.</p>
      
      <h3>Productos con Defectos</h3>
      <p>Si recibe un producto defectuoso o diferente al que ordenó, contáctenos inmediatamente a través de nuestro WhatsApp (+57 323 447 5311). Asumiremos los costos de envío para la devolución y le enviaremos un reemplazo o realizaremos el reembolso.</p>
      
      <h3>Proceso de Devolución</h3>
      <ol>
        <li>Contáctenos por WhatsApp con su número de pedido y fotos del producto.</li>
        <li>Nuestro equipo evaluará la solicitud en un plazo máximo de 48 horas.</li>
        <li>Una vez aprobada, le indicaremos cómo realizar el envío de regreso.</li>
      </ol>
    `
  }
];

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState('about');

  const activeContent = infoSections.find(s => s.id === activeTab);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #FDF6E3, #FFECD2, #FDF6E3)' }}>
      <Header />
      <NavBar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* ✅ NUEVO: Botón de Regreso al Catálogo */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            href="/catalog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.8)',
              color: '#9d00ff',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              border: '2px solid #9d00ff',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#9d00ff';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.color = '#9d00ff';
            }}
          >
            ← Volver al Catálogo
          </Link>
        </div>

        {/* Título Principal */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            color: '#1a1a1a', 
            marginBottom: '10px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Centro de Información
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Todo lo que necesitas saber sobre XPI Tienda
          </p>
        </div>

        {/* Contenedor Principal con Efecto Vidrio */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.6)'
        }}>
          
          {/* Pestañas (Tabs) */}
          <div style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            background: 'rgba(255,255,255,0.5)',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}>
            {infoSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                style={{
                  flex: 1,
                  padding: '20px 15px',
                  border: 'none',
                  background: activeTab === section.id ? 'white' : 'transparent',
                  color: activeTab === section.id ? '#1a1a1a' : '#9d00ff',
                  fontWeight: activeTab === section.id ? '700' : '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderBottom: activeTab === section.id ? '3px solid #39ff14' : '3px solid #9d00ff',
                  boxShadow: activeTab === section.id ? '0 -5px 15px rgba(57, 255, 20, 0.15)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>

          {/* Contenido de la Pestaña Activa */}
          <div style={{ padding: '40px' }}>
            <div 
              className="info-content"
              dangerouslySetInnerHTML={{ __html: activeContent?.content || '' }} 
            />
          </div>
        </div>

        {/* Botón de Contacto Rápido */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a 
            href="https://wa.me/573234475311?text=Hola,%20tengo%20una%20duda%20sobre%20los%20términos%20y%20condiciones"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: 'bold',
              boxShadow: '0 10px 20px rgba(37, 211, 102, 0.3)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            💬 ¿Tienes más dudas? Escríbenos por WhatsApp
          </a>
        </div>

      </div>

      {/* Estilos CSS para el contenido de texto */}
      <style>{`
        .info-content h3 {
          color: #1a1a1a;
          font-size: 1.5rem;
          margin-top: 25px;
          margin-bottom: 15px;
          font-weight: 700;
          border-left: 4px solid #9d00ff;
          padding-left: 15px;
        }
        .info-content p {
          color: #4a4a4a;
          line-height: 1.8;
          margin-bottom: 15px;
          font-size: 1.05rem;
        }
        .info-content ul, .info-content ol {
          color: #4a4a4a;
          line-height: 1.8;
          margin-bottom: 20px;
          padding-left: 25px;
          font-size: 1.05rem;
        }
        .info-content li {
          margin-bottom: 10px;
        }
        .info-content strong {
          color: #1a1a1a;
        }
        @media (max-width: 768px) {
          .info-content h3 { font-size: 1.2rem; }
          .info-content p, .info-content li { font-size: 0.95rem; }
        }
      `}</style>
    </div>
  );
}