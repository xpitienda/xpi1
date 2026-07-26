import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { randomUUID } from 'crypto';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'No se recibieron productos válidos' }, { status: 400 });
    }

    let successCount = 0;
    for (const p of products) {
      const newId = randomUUID();
      await turso.execute({
        sql: "INSERT INTO catalog (id, name, description, price, stock, category, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        args: [
          newId,
          p.name || 'Sin nombre',
          p.description || null,
          Number(p.price) || 0,
          Number(p.stock) || 0,
          p.category || 'General',
          p.image_url || null,
          1
        ]
      });
      successCount++;
    }

    return NextResponse.json({ success: true, count: successCount, message: successCount + ' productos guardados' });
  } catch (error: any) {
    console.error('Error guardando lote:', error);
    return NextResponse.json({ error: 'Error al guardar productos: ' + error.message }, { status: 500 });
  }
}