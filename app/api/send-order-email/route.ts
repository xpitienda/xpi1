import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerInfo, cart, total } = body;

    if (!customerInfo || !cart || !total) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // --- GENERACIÓN DE FACTURA SECUENCIAL SEGURA ---
    let invoiceNumber = 'SIN-SERIE';
    let seriesId = null;
    
    try {
      const counterResult = await turso.execute(
        'SELECT id, prefix_letter, city_letter, current_number FROM invoice_counters WHERE is_active = TRUE LIMIT 1'
      );
      
      if (counterResult.rows.length > 0) {
        const counter = counterResult.rows[0] as any;
        seriesId = counter.id;
        const newNumber = Number(counter.current_number) + 1;
        
        await turso.execute({
          sql: 'UPDATE invoice_counters SET current_number = ? WHERE id = ?',
          args: [newNumber, counter.id],
        });
        
        invoiceNumber = `${counter.prefix_letter}-${counter.city_letter}-${String(newNumber).padStart(5, '0')}`;
      } else {
        console.warn('⚠️ No hay serie activa configurada en DB');
        invoiceNumber = 'PENDIENTE-CONFIG';
      }
    } catch (dbError) {
      console.error('❌ Error DB generando factura:', dbError);
      invoiceNumber = `TEMP-${new Date().toISOString().slice(0,10).replace(/-/g,'')}`;
    }
    // ----------------------------------------------------

    // --- NUEVO: DESCONTAR INVENTARIO DEL CARRITO ---
    try {
      for (const item of cart) {
        if (item.id) {
          const productResult = await turso.execute({
            sql: 'SELECT stock, name FROM products WHERE id = ? LIMIT 1',
            args: [item.id]
          });
          
          if (productResult.rows.length > 0) {
            // Descontar stock directamente (si queda en 0 o negativo, el admin lo ajusta)
            await turso.execute({
              sql: 'UPDATE products SET stock = stock - ? WHERE id = ?',
              args: [item.quantity, item.id]
            });
          }
        }
      }
    } catch (stockErr) {
      console.error('❌ Error descontando inventario del carrito:', stockErr);
      // No bloqueamos el pedido para no interrumpir la experiencia del cliente, solo registramos el error
    }
    // ----------------------------------------------------

    // --- GUARDAR VENTA DEL CARRITO EN LA BASE DE DATOS ---
    try {
      await turso.execute({
        sql: `INSERT INTO sales (
          invoice_number, series_id, seller_id, seller_name, 
          customer_name, customer_phone, items, total_amount, sale_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          invoiceNumber,
          seriesId,
          null,
          'Carrito/Web',
          customerInfo.name,
          customerInfo.phone || '',
          JSON.stringify(cart),
          Number(total),
          'cart'
        ],
      });
    } catch (saveError) {
      console.error('❌ Error guardando venta del carrito en DB:', saveError);
    }
    // ----------------------------------------------------

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
        <h1 style="margin: 0; color: white; font-size: 28px;">🛒 Nuevo Pedido</h1>
        <p style="margin: 5px 0 0; color: rgba(255,255,255,0.9);">XPI Tienda</p>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
        <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
          <div>
            <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Fecha del pedido:</p>
            <p style="margin: 5px 0 0; font-weight: bold;">${date}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Factura N°:</p>
            <p style="margin: 5px 0 0; font-weight: bold; color: #4B0082; font-size: 18px;">${invoiceNumber}</p>
          </div>
        </div>
        <div style="margin-bottom: 25px;">
          <p style="margin: 0 0 10px; color: #666; font-size: 12px; text-transform: uppercase;">Cliente:</p>
          <h3 style="margin: 0;">${customerInfo.name}</h3>
          <p style="margin: 5px 0;">📱 ${customerInfo.phone}</p>
          ${customerInfo.address ? `<p style="margin: 5px 0;">📍 ${customerInfo.address}</p>` : ''}
          ${customerInfo.city ? `<p style="margin: 5px 0;">🏙️ ${customerInfo.city}</p>` : ''}
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
        <p style="text-align: center; font-size: 11px; color: #999; margin-top: 30px;">Pedido generado desde <strong>XPI Tienda</strong><br/>Línea Alternativas Inteligentes</p>
      </div>
    </div>`;

    await transporter.sendMail({
      from: `"XPI Tienda" <${process.env.EMAIL_USER}>`,
      to: process.env.ORDER_EMAIL_DESTINO,
      subject: `🧾 Factura ${invoiceNumber} - Nuevo Pedido de ${customerInfo.name}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, invoice: invoiceNumber });

  } catch (error: any) {
    console.error('❌ ERROR EMAIL GENERAL:', error.message);
    return NextResponse.json({ error: 'Error interno', details: error.message }, { status: 500 });
  }
}