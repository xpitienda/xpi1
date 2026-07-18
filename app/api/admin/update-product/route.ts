import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function PUT(request: Request) {
  try {
    const { id, category_id } = await request.json();

    if (!id || !category_id) {
      return NextResponse.json({ error: 'ID y category_id son requeridos' }, { status: 400 });
    }

    await turso.execute({
      sql: 'UPDATE products SET category_id = ? WHERE id = ?',
      args: [category_id, id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 });
  }
}