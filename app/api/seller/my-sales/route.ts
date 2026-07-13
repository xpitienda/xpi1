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

    const result = await turso.execute({
      sql: `SELECT * FROM sales 
            WHERE seller_id = ? 
            ORDER BY created_at DESC 
            LIMIT 50`,
      args: [sellerId],
    });

    // Convertir rows a array normal
    const sales = Array.from(result.rows);
    
    return NextResponse.json(sales);
  } catch (error) {
    console.error('[GET] Error my-sales:', error);
    return NextResponse.json({ error: 'Error al obtener ventas', details: String(error) }, { status: 500 });
  }
}