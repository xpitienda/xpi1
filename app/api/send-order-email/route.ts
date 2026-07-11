import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerInfo, cart, total } = body;

    // Validación básica para evitar errores si faltan datos
    if (!customerInfo || !cart || !total) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Configuración de transporte (IGUAL QUE ANTES PARA NO ROMPER NADA)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s/g, ''), // Limpia espacios si los hay
      },
    });

    const date = new Date().toLocaleDateString('es-CO', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    // NUEVO DISEÑO VISUAL PROFESIONAL (Solo cambia esto)
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
        
        <!-- ENCABEZADO DEGRADADO MORADO/VERDE -->
        <div style="background: linear-gradient(135deg, #4B0082 0%, #2E7D32 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">🛒 Nuevo Pedido</h1>
          <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">XPI Tienda</p>
        </div>

        <!-- CUERPO BLANCO -->
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- FECHA DEL PEDIDO -->
          <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
            <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Fecha del pedido:</p>
            <p style="margin: 5px 0 0 0; color: #111827; font-weight: 600; font-size: 15px;">${date}</p>
          </div>

          <!-- DATOS DEL CLIENTE -->
          <div style="margin-bottom: 25px;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Cliente:</p>
            <h3 style="margin: 0; color: #111827; font-size: 20px;">${customerInfo.name}</h3>
            <p style="margin: 5px 0; color: #4b5563;">📱 ${customerInfo.phone}</p>
            ${customerInfo.address ? `<p style="margin: 5px 0; color: #4b5563;">📍 ${customerInfo.address}</p>` : ''}
            ${customerInfo.city ? `<p style="margin: 5px 0; color: #4b5563;">🏙️ ${customerInfo.city}</p>` : ''}
          </div>

          <!-- TABLA DE PRODUCTOS (ESTILO VERDE) -->
          <div style="margin-bottom: 25px;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Productos:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background-color: #2E7D32; color: white;">
                  <th style="padding: 12px 15px; text-align: left; font-weight: 600;">Producto</th>
                  <th style="padding: 12px 15px; text-align: center; font-weight: 600;">Cant.</th>
                  <th style="padding: 12px 15px; text-align: right; font-weight: 600;">P. Unit.</th>
                  <th style="padding: 12px 15px; text-align: right; font-weight: 600;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${cart.map((item: any) => `
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 12px 15px; color: #374151;">${item.name}</td>
                    <td style="padding: 12px 15px; text-align: center; color: #6b7280;">${item.quantity}</td>
                    <td style="padding: 12px 15px; text-align: right; color: #6b7280;">$${Number(item.price).toLocaleString('es-CO')}</td>
                    <td style="padding: 12px 15px; text-align: right; font-weight: bold; color: #111827;">$${Number(item.price * item.quantity).toLocaleString('es-CO')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- TOTAL A PAGAR (DESTACADO) -->
          <div style="background: linear-gradient(135deg, #4B0082 0%, #2E7D32 100%); padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px;">
            <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px; text-transform: uppercase;">Total a pagar:</p>
            <p style="margin: 5px 0 0 0; font-size: 36px; font-weight: bold; color: #00FF41; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              $${Number(total).toLocaleString('es-CO')}
            </p>
          </div>

          <!-- PIE DE PÁGINA -->
          <p style="text-align: center; font-size: 11px;