import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: Request) {
  try {
    // CORRECCIÓN: Usar la tabla original 'catalog'
    const result = await turso.execute('SELECT * FROM catalog ORDER BY name ASC');
    
    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error('Error cargando productos:', error);
    return NextResponse.json({ error: 'Error al cargar productos', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, category_id, image, is_active } = body;

    if (!name || !price || stock === undefined) {
      return NextResponse.json({ error: 'Nombre, precio y stock son requeridos' }, { status: 400 });
    }

    // CORRECCIÓN: Insertar en la tabla original 'catalog'
    const result = await turso.execute({
      sql: 'INSERT INTO catalog (name, description, price, stock, category_id, image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [
        name, 
        description || null, 
        price, 
        stock, 
        category_id || null, 
        image || null, 
        is_active !== undefined ? is_active : 1
      ]
    });

    return NextResponse.json({ 
      id: result.lastInsertRowid,
      name,
      description: description || null,
      price,
      stock,
      category_id: category_id || null,
      image: image || null,
      is_active: is_active !== undefined ? is_active : 1
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    return NextResponse.json({ error: 'Error al crear producto', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    // CORRECCIÓN: Eliminar de la tabla original 'catalog'
    await turso.execute({
      sql: 'DELETE FROM catalog WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json({ error: 'Error al eliminar producto', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}