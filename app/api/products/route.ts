import { NextResponse } from 'next/server';
import { turso, initDatabase } from '@/lib/turso';

// Inicializar base de datos al cargar
initDatabase();

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
    // Asegurar que la tabla existe
    await initDatabase();
    
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

    // Generar ID único
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