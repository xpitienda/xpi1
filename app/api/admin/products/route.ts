import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

async function ensureDatabase() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS catalog (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        category TEXT DEFAULT 'General',
        stock INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        on_sale INTEGER DEFAULT 0,
        sale_price REAL,
        original_price REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error('Error creando tabla:', error);
  }
}

ensureDatabase();

function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const adminPass = process.env.ADMIN_PASSWORD;
  return adminPass && authHeader === `Bearer ${adminPass}`;
}

export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await ensureDatabase();
    const result = await turso.execute('SELECT * FROM catalog ORDER BY created_at DESC');
    return NextResponse.json(result.rows || []);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await ensureDatabase();
    const body = await request.json() as Record<string, unknown>;

    const name = String(body.name || '');
    const description = String(body.description || '');
    const price = Number(body.price || 0);
    const category = String(body.category || 'General');
    const stock = Number(body.stock || 0);
    const image_url = String(body.image_url || '');
    const is_active = Number(body.is_active !== undefined ? body.is_active : 1);

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);

    await turso.execute({
      sql: `INSERT INTO catalog (id, name, description, price, image_url, category, stock, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, name, description, price, image_url, category, stock, is_active]
    });

    return NextResponse.json({ message: 'Producto creado exitosamente', id }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error creating product:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await ensureDatabase();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const body = await request.json() as Record<string, unknown>;

    await turso.execute({
      sql: `UPDATE catalog SET
       name = ?,
       description = ?,
       price = ?,
       image_url = ?,
       category = ?,
       stock = ?,
       is_active = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      args: [
        String(body.name || ''),
        String(body.description || ''),
        Number(body.price || 0),
        String(body.image_url || ''),
        String(body.category || 'General'),
        Number(body.stock || 0),
        Number(body.is_active !== undefined ? body.is_active : 1),
        id
      ]
    });

    return NextResponse.json({ message: 'Producto actualizado' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error updating product:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await ensureDatabase();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await turso.execute({
      sql: 'DELETE FROM catalog WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ message: 'Producto eliminado' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}