import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

async function initCategoriesTable() {
  try {
    await turso.execute('CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT NOT NULL, parent_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
    
    const defaults = [
      ['cat_general', 'General', null],
      ['cat_ropa', 'Ropa', null],
      ['cat_tecnologia', 'Tecnologia', null],
      ['cat_hogar', 'Hogar', null],
      ['cat_deportes', 'Deportes', null],
      ['cat_accesorios', 'Accesorios', null]
    ];
    
    for (const [id, name, parent_id] of defaults) {
      try {
        await turso.execute('INSERT INTO categories (id, name, parent_id) VALUES (?, ?, ?)', [id, name, parent_id]);
      } catch (e) {
        // Ignorar si ya existe
      }
    }
  } catch (error) {
    console.error('Error inicializando categorías:', error);
  }
}

function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const adminPass = process.env.ADMIN_PASSWORD;
  return adminPass && authHeader === 'Bearer ' + adminPass;
}

export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await initCategoriesTable();
    const result = await turso.execute('SELECT * FROM categories ORDER BY parent_id, name');
    return NextResponse.json(result.rows || []);
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await initCategoriesTable();
    const body = await request.json();
    const name = String(body.name || '').trim();
    const parent_id = body.parent_id ? String(body.parent_id) : null;

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const id = 'cat_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    await turso.execute('INSERT INTO categories (id, name, parent_id) VALUES (?, ?, ?)', [id, name, parent_id]);

    return NextResponse.json({ message: 'Categoría creada', id }, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await initCategoriesTable();
    const body = await request.json();
    const id = String(body.id);
    const name = String(body.name || '').trim();
    const parent_id = body.parent_id ? String(body.parent_id) : null;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID y nombre son obligatorios' }, { status: 400 });
    }

    await turso.execute('UPDATE categories SET name = ?, parent_id = ? WHERE id = ?', [name, parent_id, id]);

    return NextResponse.json({ message: 'Categoría actualizada' });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await initCategoriesTable();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 });
    }

    await turso.execute('DELETE FROM categories WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Categoría eliminada' });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
