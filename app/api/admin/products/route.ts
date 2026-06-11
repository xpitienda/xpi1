import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// Inicializar base de datos ANTES de cualquier operación
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

// Llamar una vez al cargar el módulo
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
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await ensureDatabase();
    const body = await request.json();

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

    await turso.execute(
      `INSERT INTO catalog (id, name, description, price, image_url, category, stock, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, description, price, image_url, category, stock, is_active]
    );

    return NextResponse.json({ message: 'Producto creado exitosamente', id }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await ensureDatabase();
    const params = await context.params;
    const body = await request.json();

    await turso.execute(
      `UPDATE catalog SET 
       name = ?, 
       description = ?, 
       price = ?, 
       image_url = ?, 
       category = ?, 
       stock = ?, 
       is_active = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        body.name,
        body.description,
        body.price,
        body.image_url,
        body.category,
        body.stock,
        body.is_active !== undefined ? body.is_active : 1,
        params.id
      ]
    );

    return NextResponse.json({ message: 'Producto actualizado' });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await ensureDatabase();
    const params = await context.params;
    
    await turso.execute('DELETE FROM catalog WHERE id = ?', [params.id]);
    
    return NextResponse.json({ message: 'Producto eliminado' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}