import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { customerInfo, cart, total } = await request.json();

    // Configuración robusta para Vercel/Gmail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true para puerto 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s/g, ''), // Elimina espacios si los hay
      },
    });

    // Verificar conexión antes de enviar (opcional pero útil para debug)
    await transporter.verify();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3D1A78;">️ Nuevo Pedido - XPI Tienda</h2>
        <hr style="border: 1px solid #eee;" />
        
        <h3 style="color: #2E7D32;">👤 Datos del Cliente:</h3>
        <p><strong>Nombre:</strong> ${customerInfo.name}</p>
        <p><strong>Teléfono:</strong> ${customerInfo.phone}</p>
        <p><strong>Dirección:</strong> ${customerInfo.address}</p>
        ${customerInfo.city ? `<p><strong>Ciudad:</strong> ${customerInfo.city}</p>` : ''}
        
        <h3 style="color: #2E7D32;"> Productos:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background-color: #f9f9f9;">
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Producto</th>
            <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">Cant.</th>
            <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Subtotal</th>
          </tr>
          ${cart.map((item: any) => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
              <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toLocaleString('es-CO')}</td>
            </tr>
          `).join('')}
        </table>
        
        <h3 style="text-align: right; color: #00FF41; margin-top: 20px;">
          TOTAL: $${total.toLocaleString('es-CO')}
        </h3>
      </div>
    `;

    await transporter.sendMail({
      from: `"XPI Tienda" <${process.env.EMAIL_USER}>`,
      to: process.env.ORDER_EMAIL_DESTINO,
      subject: `🛒 Nuevo Pedido de ${customerInfo.name} - $${total.toLocaleString('es-CO')}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Log detallado para ver en Vercel Runtime Logs
    console.error('❌ ERROR EMAIL DETALLADO:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    
    return NextResponse.json({ 
      error: 'Error al procesar el correo', 
      details: error.message 
    }, { status: 500 });
  }
}