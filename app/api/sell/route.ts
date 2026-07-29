import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import nodemailer from 'nodemailer';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { sellerId, seriesId, customer, items } = await request.json();

    if (!seriesId) {
      return NextResponse.json({ error: 'Serie de facturaciÃ³n no asignada' }, { status: 400 });
    }

    // 1. Generar NÃºmero de Factura Secuencial
    let invoiceNumber = 'ERR-000';
    let sellerName = 'Vendedor';
    try {
      const counterResult = await turso.execute(
        'SELECT id, prefix_letter, city_letter, current_number FROM invoice_counters WHERE id = ? LIMIT 1',
        [seriesId]
      );
      
      if (counterResult.rows.length > 0) {
        const counter = counterResult.rows[0] as any;
        const newNumber = Number(counter.current_number) + 1;
        
        await turso.execute({
          sql: 'UPDATE invoice_counters SET current_number = ? WHERE id = ?',
          args: [newNumber, counter.id],
        });
        
        invoiceNumber = `${counter.prefix_letter}-${counter.city_letter}-${String(newNumber).padStart(5, '0')}`;
      }

      if (sellerId) {
        const sellerResult = await turso.execute({
          sql: 'SELECT full_name FROM sellers WHERE id = ? LIMIT 1',
          args: [sellerId]
        });
        if (sellerResult.rows.length > 0) {
          sellerName = (sellerResult.rows[0] as any).full_name;
        }
      }
    } catch (dbErr) {
      console.error('Error DB factura:', dbErr);
      return NextResponse.json({ error: 'Error generando factura' }, { status: 500 });
    }

    // 2. Calcular Total
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // 2.5 VERIFICAR Y DESCONTAR INVENTARIO (USANDO TABLA catalog)
    for (const item of items) {
      if (item.id) {
        const productResult = await turso.execute({
          sql: 'SELECT stock, name FROM catalog WHERE id = ? LIMIT 1',
          args: [item.id]
        });
        
        if (productResult.rows.length > 0) {
          const currentStock = Number((productResult.rows[0] as any).stock);
          const productName = (productResult.rows[0] as any).name;
          
          if (currentStock < item.quantity) {
            return NextResponse.json({ 
              error: `Stock insuficiente para "${productName}". Stock actual: ${currentStock}, solicitado: ${item.quantity}` 
            }, { status: 400 });
          }
          
          // Descontar stock
          await turso.execute({
            sql: 'UPDATE catalog SET stock = stock - ? WHERE id = ?',
            args: [item.quantity, item.id]
          });
        }
      }
    }

    // 3. Guardar venta en la base de datos
    try {
      await turso.execute({
        sql: `INSERT INTO sales (
          invoice_number, series_id, seller_id, seller_name, 
          customer_name, customer_phone, items, total_amount, sale_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'seller')`,
        args: [
          invoiceNumber,
          seriesId,
          sellerId,
          sellerName,
          customer.name,
          customer.phone,
          JSON.stringify(items),
          total,
        ],
      });
    } catch (saveErr) {
      console.error('Error guardando venta:', saveErr);
    }

    // 4. Enviar Correo (OPCIONAL - si falla, no bloquea la venta)
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS?.replace(/\s/g, ''),
        },
      });

      const dateStr = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

      const htmlContent = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #1e40af, #7c3aed); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; color: white; font-size: 28px;">ðŸ§¾ Factura de Venta</h1>
          <p style="margin: 5px 0 0; color: rgba(255,255,255,0.9);">XPI Tienda - ${sellerName}</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            <div><p style="margin:0; color:#666; font-size:12px">FECHA</p><p style="margin:5px 0 0; font-weight:bold">${dateStr}</p></div>
            <div style="text-align:right"><p style="margin:0; color:#666; font-size:12px">FACTURA NÂ°</p><p style="margin:5px 0 0; font-weight:bold; color:#1e40af; font-size:18px">${invoiceNumber}</p></div>
          </div>
          <div style="margin-bottom: 25px">
            <p style="margin:0 0 10px; color:#666; font-size:12px">CLIENTE</p>
            <h3 style="margin:0">${customer.name}</h3>
            <p style="margin:5px 0">ðŸ“± ${customer.phone}</p>
          </div>
          <table style="width:100%; border-collapse:collapse; margin-bottom:25px">
            <thead><tr style="background:#7c3aed; color:white"><th style="padding:12px; text-align:left">Producto</th><th style="padding:12px; text-align:center">Cant.</th><th style="padding:12px; text-align:right">P. Unit.</th><th style="padding:12px; text-align:right">Subtotal</th></tr></thead>
            <tbody>
              ${items.map((item: any) => `<tr style="border-bottom:1px solid #eee">
                <td style="padding:12px">${item.name}</td>
                <td style="padding:12px; text-align:center">${item.quantity}</td>
                <td style="padding:12px; text-align:right">$${Number(item.price).toLocaleString('es-CO')}</td>
                <td style="padding:12px; text-align:right; font-weight:bold">$${Number(item.price * item.quantity).toLocaleString('es-CO')}</td>
              </tr>`).join('')}
            </tbody>
          </table>
          <div style="background: linear-gradient(135deg, #1e40af, #7c3aed); padding: 20px; border-radius: 8px; text-align: center;">
            <p style="margin:0; color:rgba(255,255,255,0.9); font-size:14px">TOTAL A PAGAR</p>
            <p style="margin:5px 0 0; font-size:36px; font-weight:bold; color:#fff">$${Number(total).toLocaleString('es-CO')}</p>
          </div>
        </div>
      </div>`;

      await transporter.sendMail({
        from: `"XPI Tienda" <${process.env.EMAIL_USER}>`,
        to: process.env.ORDER_EMAIL_DESTINO,
        subject: `ðŸ§¾ Factura ${invoiceNumber} - Venta de ${customer.name}`,
        html: htmlContent,
      });
    } catch (emailError: any) {
      console.error('âŒ Error enviando email (pero la venta se guardÃ³):', emailError.message);
      // No lanzamos error para no bloquear la venta
    }

    return NextResponse.json({ success: true, invoice: invoiceNumber });

  } catch (error: any) {
    console.error('ERROR SELL:', error.message);
    console.error('ERROR SELL STACK:', error.stack);
    return NextResponse.json({ error: 'Error interno: ' + error.message }, { status: 500 });
  }
}
