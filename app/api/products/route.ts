import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const result = await turso.execute(
      'SELECT id, name, price, stock, is_active FROM products WHERE is_active = 1 ORDER BY name'
    );

    return NextResponse.json(Array.from(result.rows));
  } catch (error: any) {
    console.error('Error cargando productos:', error);
    return NextResponse.json({ error: 'Error al cargar productos' }, { status: 500 });
  }
}