import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const adminPass = process.env.ADMIN_PASSWORD;
  return adminPass && authHeader === Bearer ;
}

// GET: Obtener todas las categorías
export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const result = await turso.execute('SELECT * FROM categories ORDER BY parent_id, name');
    return NextResponse.json(result.rows || []);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Crear nueva categoría
export async function POST(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const parent_id = body.parent_id ? String(body.parent_id) : null;

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const id = 'cat_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    await turso.execute(
      'INSERT INTO categories (id, name, parent_id) VALUES (?, ?, ?)',
      [id, name, parent_id]
    );

    return NextResponse.json({ message: 'Categoría creada', id }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Actualizar categoría
export async function PUT(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body.id);
    const name = String(body.name || '').trim();
    const parent_id = body.parent_id ? String(body.parent_id) : null;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID y nombre son obligatorios' }, { status: 400 });
    }

    await turso.execute(
      'UPDATE categories SET name = ?, parent_id = ? WHERE id = ?',
      [name, parent_id, id]
    );

    return NextResponse.json({ message: 'Categoría actualizada' });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Eliminar categoría
export async function DELETE(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 });
    }

    await turso.execute('DELETE FROM categories WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Categoría eliminada' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
