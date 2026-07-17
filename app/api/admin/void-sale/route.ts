import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { saleId, reason } = await request.json();

    if (!saleId) {
      return NextResponse.json({ error: 'ID de venta requerido' }, { status: 400 });
    }

    // 1. Obtener la venta
    const saleResult = await turso.execute({
      sql: 'SELECT items FROM sales WHERE id = ? LIMIT 1',
      args: [saleId]
    });

    if (saleResult.rows.length === 0) {
      return NextResponse.json({ error: 'Venta no encontrada' }, { status: 404 });
    }

    const sale = saleResult.rows[0] as any;
    const items = JSON.parse(sale.items || '[]');

    // 2. Verificar si ya fue anulada
    const voidCheck = await turso.execute({
      sql: 'SELECT id FROM voided_sales WHERE sale_id = ? LIMIT 1',
      args: [saleId]
    });

    if (voidCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Esta venta ya fue anulada' }, { status: 400 });
    }

    // 3. Devolver stock de cada producto
    for (const item of items) {
      if (item.id) {
        await turso.execute({
          sql: 'UPDATE catalog SET stock = stock + ? WHERE id = ?',
          args: [Number(item.quantity) || 1, item.id]
        });
      }
    }

    // 4. Registrar en voided_sales
    await turso.execute({
      sql: 'INSERT INTO voided_sales (sale_id, reason) VALUES (?, ?)',
      args: [saleId, reason || 'Anulada por administrador']
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Venta anulada y stock devuelto correctamente' 
    });

  } catch (error: any) {
    console.error('Error anulando venta:', error);
    return NextResponse.json({ 
      error: 'Error al anular venta: ' + error.message 
    }, { status: 500 });
  }
}