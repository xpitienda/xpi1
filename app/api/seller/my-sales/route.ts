import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID requerido' }, { status: 400 });
    }

    // Ahora sí funcionará porque la columna seller_id existe en la BD
    const result = await turso.execute({
      sql: `SELECT id, invoice_number, seller_name, customer_name, customer_phone, items, total_amount, sale_type, status, created_at 
            FROM sales 
            WHERE seller_id = ? 
            ORDER BY created_at DESC 
            LIMIT 50`,
      args: [sellerId],
    });

    return NextResponse.json(Array.from(result.rows));
  } catch (error: any) {
    console.error('[my-sales] Error:', error);
    return NextResponse.json({
      error: 'Error al obtener ventas',
      details: error.message
    }, { status: 500 });
  }
}
