import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const adminPass = process.env.ADMIN_PASSWORD;
  return adminPass && authHeader === `Bearer ${adminPass}`;
}

// GET: Obtener productos destacados y ofertas
export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const result = await turso.execute({
      sql: 'SELECT id, name, price, image_url, category, is_featured, offer_type, offer_price FROM catalog WHERE is_active = 1 ORDER BY category, name',
      args: []
    });

    return NextResponse.json(JSON.parse(JSON.stringify(result.rows || [])));
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Actualizar destacado/oferta de un producto
export async function PUT(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id, is_featured, offer_type, offer_price } = await request.json();

    await turso.execute({
      sql: `UPDATE catalog SET 
        is_featured = ?, 
        offer_type = ?, 
        offer_price = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
      args: [
        is_featured ? 1 : 0,
        offer_type || null,
        offer_price || null,
        id
      ]
    });

    return NextResponse.json({ success: true, message: 'Producto actualizado' });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}