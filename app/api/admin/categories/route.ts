import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM categories ORDER BY name ASC');
    
    // Asegurarnos de retornar siempre un array
    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error('Error cargando categorías:', error);
    return NextResponse.json({ error: 'Error al cargar categorías', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, parent_id } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: 'INSERT INTO categories (name, parent_id) VALUES (?, ?)',
      args: [name, parent_id || null]
    });

    return NextResponse.json({ 
      id: result.lastInsertRowid,
      name,
      parent_id: parent_id || null
    });
  } catch (error) {
    console.error('Error creando categoría:', error);
    return NextResponse.json({ error: 'Error al crear categoría', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    await turso.execute({
      sql: 'DELETE FROM categories WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    return NextResponse.json({ error: 'Error al eliminar categoría', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}