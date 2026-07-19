import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    // Usamos SELECT * para traer todos los campos que el admin necesita mostrar
    const result = await turso.execute('SELECT * FROM catalog ORDER BY name ASC');
    return NextResponse.json(result.rows || []);
  } catch (error: any) {
    console.error('Error cargando productos en admin:', error);
    return NextResponse.json({ error: 'Error al cargar productos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, category_id, image, is_active } = body;

    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({ error: 'Nombre, precio y stock son requeridos' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: `INSERT INTO catalog (name, description, price, stock, category_id, image, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        name, 
        description || null, 
        Number(price), 
        Number(stock), 
        category_id || null, 
        image || null, 
        is_active !== undefined ? Number(is_active) : 1
      ]
    });

    return NextResponse.json({ 
      id: result.lastInsertRowid,
      name,
      description: description || null,
      price: Number(price),
      stock: Number(stock),
      category_id: category_id || null,
      image: image || null,
      is_active: is_active !== undefined ? Number(is_active) : 1
    });
  } catch (error: any) {
    console.error('Error creando producto:', error);
    return NextResponse.json({ error: 'Error al crear producto: ' + error.message }, { status: 500 });
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
      sql: 'DELETE FROM catalog WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json({ error: 'Error al eliminar producto: ' + error.message }, { status: 500 });
  }
}