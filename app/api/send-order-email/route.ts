import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customerInfo = body.customerInfo;
    const cart = body.cart;
    const total = body.total;

    console.log('Enviando email...');
    console.log('Cliente:', customerInfo.name);
    console.log('Total:', total);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construir filas de productos
    let productosFilas = '';
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const sub = item.price * item.quantity;
      productosFilas += '<tr>';
      productosFilas += '<td style="padding:10px;border-bottom:1px solid #eee;color:#333;">';
      productosFilas += item.name + '</td>';
      productosFilas += '<td style="padding:10px;border-bottom:1px solid #eee;text-align:center;color:#666;">';
      productosFilas += item.quantity + '</td>';
      productosFilas += '<td style="padding:10px;border-bottom:1px solid #eee;text-align:right;color:#4B0082;">';
      productosFilas += '$' + item.price.toLocaleString('es-CO') + '</td>';
      productosFilas += '<td style="padding:10px;border-bottom:1px solid #eee;text-align:right;color:#2E7D32;font-weight:bold;">';
      productosFilas += '$' + sub.toLocaleString('es-CO') + '</td>';
      productosFilas += '</tr>';
    }

    const fecha = new Date().toLocaleString('es-CO', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
    const totalTxt = total.toLocaleString('es-CO');
    const ciudadTxt = customerInfo.city ? customerInfo.city : '';

    // HTML del email con diseño profesional
    const html = '<!DOCTYPE html>' +
      '<html><head><meta charset="UTF-8"></head>' +
      '<body style="margin:0;padding:20px;font-family:Arial,sans-serif;background:#f5f5f5;">' +
      '<div style="max-width:600px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.1);">' +
      
      // Header
      '<div style="background:linear-gradient(135deg,#4B0082 0%,#2E7D32 100%);padding:30px;text-align:center;">' +
      '<h1 style="color:white;margin:0;font-size:28px;">🛒 Nuevo Pedido</h1>' +
      '<p style="color:#e9d5ff;margin:5px 0 0 0;font-size:14px;">XPI Tienda</p>' +
      '</div>' +

      '<div style="padding:30px;">' +
      
      // Fecha
      '<div style="background:#f9fafb;padding:15px;border-radius:8px;margin-bottom:20px;border-left:4px solid #2E7D32;">' +
      '<p style="margin:0;color:#6b7280;font-size:12px;">Fecha del pedido:</p>' +
      '<p style="margin:5px 0 0 0;color:#1f2937;font-weight:600;">' + fecha + '</p>' +
      '</div>' +

      // Cliente
      '<div style="background:#f9fafb;padding:15px;border-radius:8px;margin-bottom:25px;border-left:4px solid #4B0082;">' +
      '<p style="margin:0;color:#6b7280;font-size:12px;">Cliente:</p>' +
      '<p style="margin:5px 0 0 0;color:#1f2937;font-weight:600;">' + customerInfo.name + '</p>' +
      '<p style="margin:5px 0 0 0;color:#6b7280;font-size:14px;">📱 ' + customerInfo.phone + '</p>' +
      '<p style="margin:5px 0 0 0;color:#6b7280;font-size:14px;">📍 ' + customerInfo.address + '</p>' +
      (ciudadTxt ? '<p style="margin:5px 0 0 0;color:#6b7280;font-size:14px;">🏙️ ' + ciudadTxt + '</p>' : '') +
      '</div>' +

      // Productos
      '<h2 style="color:#1f2937;margin:0 0 15px 0;font-size:20px;">🛍️ Productos:</h2>' +
      '<table style="width:100%;border-collapse:collapse;margin-bottom:25px;">' +
      '<thead>' +
      '<tr style="background:linear-gradient(135deg,#4B0082 0%,#2E7D32 100%);">' +
      '<th style="padding:12px;text-align:left;color:white;font-size:13px;">Producto</th>' +
      '<th style="padding:12px;text-align:center;color:white;font-size:13px;">Cant.</th>' +
      '<th style="padding:12px;text-align:right;color:white;font-size:13px;">P. Unit.</th>' +
      '<th style="padding:12px;text-align:right;color:white;font-size:13px;">Subtotal</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' + productosFilas + '</tbody>' +
      '</table>' +

      // Total
      '<div style="background:linear-gradient(135deg,#4B0082 0%,#2E7D32 100%);padding:25px;border-radius:10px;text-align:center;border:3px solid #00FF41;">' +
      '<p style="color:white;margin:0 0 10px 0;font-size:16px;font-weight:600;">Total a pagar:</p>' +
      '<p style="color:#00FF41;margin:0;font-size:32px;font-weight:bold;text-shadow:0 0 10px rgba(0,255,65,0.5);">$' + totalTxt + '</p>' +
      '</div>' +

      '</div>' +

      // Footer
      '<div style="background:#f9fafb;padding:20px;text-align:center;border-top:2px solid #e5e7eb;">' +
      '<p style="color:#6b7280;margin:0;font-size:13px;">Pedido generado desde <strong style="color:#4B0082;">XPI Tienda</strong></p>' +
      '<p style="color:#9ca3af;margin:10px 0 0 0;font-size:11px;">Lleva Alternativas Inteligentes</p>' +
      '</div>' +

      '</div></body></html>';

    const subject = '🛒 Nuevo Pedido - ' + customerInfo.name + ' - $' + totalTxt;
    const to = process.env.ORDER_EMAIL_DESTINO || 'xpitienda@gmail.com';

    const info = await transporter.sendMail({
      from: '"XPI Tienda" <' + process.env.EMAIL_USER + '>',
      to: to,
      subject: subject,
      html: html,
    });

    console.log('Email enviado:', info.messageId);
    return NextResponse.json({ 
      success: true, 
      message: 'OK', 
      id: info.messageId 
    });

  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}