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

    console.log('[my-sales] Seller ID recibido:', sellerId);

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID requerido' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: `SELECT * FROM sales WHERE seller_id = ? ORDER BY created_at DESC LIMIT 50`,
      args: [sellerId],
    });

    console.log('[my-sales] Ventas encontradas:', result.rows.length);

    const sales = Array.from(result.rows);
    
    return NextResponse.json(sales);
  } catch (error: any) {
    console.error('[my-sales] Error completo:', error);
    
    return NextResponse.json({ 
      error: 'Error al obtener ventas',
      details: error.message
    }, { status: 500 });
  }
}