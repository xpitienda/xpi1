import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Usamos valores por defecto seguros para evitar errores si falta algo
    const customerInfo = body.customerInfo || {};
    const cart = body.cart || [];
    const total = body.total || 0;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s/g, ''), // Limpia espacios si los hay
      },
    });

    // Mantenemos tu HTML original simple, solo asegurando que no falle si faltan datos
    const htmlContent = `
      <h2>Nuevo Pedido - XPI Tienda</h2>
      <p><strong>Cliente:</strong> ${customerInfo.name || 'N/A'}</p>
      <p><strong>Teléfono:</strong> ${customerInfo.phone || 'N/A'}</p>
      <p><strong>Dirección:</strong> ${customerInfo.address || 'N/A'}</p>
      <hr/>
      <h3>Productos:</h3>
      <ul>
        ${cart.map((item: any) => `<li>${item.name || 'Item'} x${item.quantity || 1} - $${(item.price * item.quantity).toLocaleString('es-CO')}</li>`).join('')}
      </ul>
      <h3>Total: $${total.toLocaleString('es-CO')}</h3>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ORDER_EMAIL_DESTINO,
      subject: `Nuevo Pedido de ${customerInfo.name || 'Cliente'}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error enviando email:', error.message);
    // Retornamos 200 para no interrumpir el flujo del usuario aunque falle el email
    return NextResponse.json({ error: 'Error interno', details: error.message }, { status: 200 });
  }
}