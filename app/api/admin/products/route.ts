import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: Request) {
  try {
    // Verificar autenticación (opcional - puedes quitarlo si quieres que sea público)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // Si no hay token, permitir acceso igual (para el admin local)
    // O quitar esta validación si prefieres
    
    const result = await turso.execute('SELECT * FROM products ORDER BY name ASC');
    
    // Asegurar que siempre retorne un array
    const products = result.rows || [];
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error cargando productos:', error);
    return NextResponse.json({ error: 'Error al cargar productos', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, category_id, image } = body;

    if (!name || !price || stock === undefined) {
      return NextResponse.json({ error: 'Nombre, precio y stock son requeridos' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: 'INSERT INTO products (name, description, price, stock, category_id, image) VALUES (?, ?, ?, ?, ?, ?)',
      args: [name, description || null, price, stock, category_id || null, image || null]
    });

    return NextResponse.json({ 
      id: result.lastInsertRowid,
      name,
      description: description || null,
      price,
      stock,
      category_id: category_id || null,
      image: image || null
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

    await turso.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json({ error: 'Error al eliminar producto', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}