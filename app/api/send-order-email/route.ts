import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export async function POST(request: Request) {
  try {
    const { items, total, customerInfo } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const fecha = new Date().toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const productosHTML = items.map((item: OrderItem, index: number) => `
      <tr style="background-color: ${index % 2 === 0 ? '#f9fafb' : '#ffffff'};">
        <td style="padding: 1rem; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${item.name}</td>
        <td style="padding: 1rem; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">${item.quantity}</td>
        <td style="padding: 1rem; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">$${item.price.toLocaleString('es-CO')}</td>
        <td style="padding: 1rem; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #16a34a;">$${item.subtotal.toLocaleString('es-CO')}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Nuevo Pedido - XPI Tienda</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%);">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6B21A8 0%, #2E7D32 100%); padding: 2rem; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 2rem;">🛒 Nuevo Pedido</h1>
            <p style="color: #e9d5ff; margin: 0.5rem 0 0 0;">XPI Tienda</p>
          </div>

          <!-- Info del pedido -->
          <div style="padding: 2rem;">
            <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; border-left: 4px solid #2E7D32;">
              <p style="margin: 0; color: #6b7280; font-size: 0.875rem;">Fecha del pedido:</p>
              <p style="margin: 0.25rem 0 0 0; color: #1f2937; font-weight: bold; font-size: 1.1rem;">${fecha}</p>
            </div>

            ${customerInfo ? `
            <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; border-left: 4px solid #6B21A8;">
              <p style="margin: 0; color: #6b7280; font-size: 0.875rem;">Cliente:</p>
              <p style="margin: 0.25rem 0 0 0; color: #1f2937; font-weight: bold; font-size: 1.1rem;">${customerInfo}</p>
            </div>
            ` : ''}

            <!-- Tabla de productos -->
            <h2 style="color: #1f2937; margin-bottom: 1rem; font-size: 1.5rem;">Productos:</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
              <thead>
                <tr style="background: linear-gradient(135deg, #6B21A8 0%, #2E7D32 100%); color: white;">
                  <th style="padding: 1rem; text-align: left;">Producto</th>
                  <th style="padding: 1rem; text-align: center;">Cantidad</th>
                  <th style="padding: 1rem; text-align: right;">Precio Unit.</th>
                  <th style="padding: 1rem; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${productosHTML}
              </tbody>
            </table>

            <!-- Total -->
            <div style="background: linear-gradient(135deg, #6B21A8 0%, #2E7D32 100%); padding: 1.5rem; border-radius: 0.75rem; text-align: center;">
              <p style="color: white; margin: 0; font-size: 1.25rem;">Total a pagar:</p>
              <p style="color: #00FF41; margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold; text-shadow: 0 0 10px rgba(0,255,65,0.5);">
                $${total.toLocaleString('es-CO')}
              </p>
            </div>

            <!-- Footer -->
            <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; margin: 0; font-size: 0.875rem;">
                Este pedido fue generado desde <strong style="color: #6B21A8;">XPI Tienda</strong>
              </p>
              <p style="color: #9ca3af; margin: 0.5rem 0 0 0; font-size: 0.75rem;">
                Una Alternativa Inteligente
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"XPI Tienda" <${process.env.EMAIL_USER}>`,
      to: process.env.ORDER_EMAIL_DESTINO,
      subject: `🛒 Nuevo Pedido - $${total.toLocaleString('es-CO')} - ${fecha}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error: any) {
    console.error('Error enviando correo:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}