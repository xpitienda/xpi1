import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization') || '';
  const expectedPass = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '15321767';
  
  let token = authHeader.replace('Bearer', '').trim();
  
  return token === expectedPass;
}

// GET: Obtener productos destacados y ofertas
export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    console.error('❌ No autorizado. Header recibido:', request.headers.get('Authorization'));
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // ✅ CORRECCIÓN: Usar 'category' en lugar de 'category_id'
    const result = await turso.execute({
      sql: 'SELECT id, name, price, image_url, category, is_featured, offer_type, offer_price FROM catalog WHERE is_active = 1 ORDER BY category, name',
      args: []
    });

    return NextResponse.json(JSON.parse(JSON.stringify(result.rows || [])));
  } catch (error: any) {
    console.error('❌ Error en GET:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Actualizar destacado/oferta de un producto
export async function PUT(request: Request) {
  if (!verifyAdmin(request)) {
    console.error(' No autorizado en PUT');
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
    console.error('❌ Error en PUT:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}