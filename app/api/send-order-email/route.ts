import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerInfo, cart, total } = body;

    if (!customerInfo || !cart || !total) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s/g, ''),
      },
    });

    const date = new Date().toLocaleDateString('es-CO', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    const htmlContent = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
      <div style="background: linear-gradient(135deg, #4B0082, #2E7D32); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; color: white; font-size: 28px;">?? Nuevo Pedido</h1>
        <p style="margin: 5px 0 0; color: rgba(255,255,255,0.9);">XPI Tienda</p>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
        <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
          <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Fecha del pedido:</p>
          <p style="margin: 5px 0 0; font-weight: bold;">${date}</p>
        </div>
        <div style="margin-bottom: 25px;">
          <p style="margin: 0 0 10px; color: #666; font-size: 12px; text-transform: uppercase;">Cliente:</p>
          <h3 style="margin: 0;">${customerInfo.name}</h3>
          <p style="margin: 5px 0;">?? ${customerInfo.phone}</p>
          ${customerInfo.address ? `<p style="margin: 5px 0;">?? ${customerInfo.address}</p>` : ''}
          ${customerInfo.city ? `<p style="margin: 5px 0;">??? ${customerInfo.city}</p>` : ''}
        </div>
        <div style="margin-bottom: 25px;">
          <p style="margin: 0 0 10px; color: #666; font-size: 12px; text-transform: uppercase;">Productos:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #2E7D32; color: white;">
                <th style="padding: 12px; text-align: left;">Producto</th>
                <th style="padding: 12px; text-align: center;">Cant.</th>
                <th style="padding: 12px; text-align: right;">P. Unit.</th>
                <th style="padding: 12px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map((item: any) => `<tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px;">${item.name}</td>
                <td style="padding: 12px; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right;">$${Number(item.price).toLocaleString('es-CO')}</td>
                <td style="padding: 12px; text-align: right; font-weight: bold;">$${Number(item.price * item.quantity).toLocaleString('es-CO')}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div style="background: linear-gradient(135deg, #4B0082, #2E7D32); padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px;">
          <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px; text-transform: uppercase;">Total a pagar:</p>
          <p style="margin: 5px 0 0; font-size: 36px; font-weight: bold; color: #00FF41;">$${Number(total).toLocaleString('es-CO')}</p>
        </div>
        <p style="text-align: center; font-size: 11px; color: #999; margin-top: 30px;">Pedido generado desde <strong>XPI Tienda</strong><br/>L?nea Alternativas Inteligentes</p>
      </div>
    </div>`;

    await transporter.sendMail({
      from: `"XPI Tienda" <${process.env.EMAIL_USER}>`,
      to: process.env.ORDER_EMAIL_DESTINO,
      subject: `?? Nuevo Pedido - ${customerInfo.name}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('? ERROR EMAIL:', error.message);
    return NextResponse.json({ error: 'Error interno', details: error.message }, { status: 500 });
  }
}