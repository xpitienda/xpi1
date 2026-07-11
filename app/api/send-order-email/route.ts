import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { customerInfo, cart, total } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `<h2>Nuevo Pedido - XPI Tienda</h2>
      <p><strong>Cliente:</strong> ${customerInfo.name}</p>
      <p><strong>Tel?fono:</strong> ${customerInfo.phone}</p>
      <p><strong>Direcci?n:</strong> ${customerInfo.address}</p>
      <hr/>
      <h3>Productos:</h3>
      <ul>
        ${cart.map((item: any) => `<li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-CO')}</li>`).join('')}
      </ul>
      <h3>Total: $${total.toLocaleString('es-CO')}</h3>`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ORDER_EMAIL_DESTINO,
      subject: `Nuevo Pedido de ${customerInfo.name}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando email:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
