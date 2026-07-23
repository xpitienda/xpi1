import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// GET: Obtener productos destacados y ofertas
export async function GET() {
  try {
    // ✅ CORRECCIÓN: Usar 'category' en lugar de 'category_id'
    const result = await turso.execute({
      sql: 'SELECT id, name, price, image_url, category, is_featured, offer_type, offer_price FROM catalog WHERE is_active = 1 ORDER BY category, name',
      args: []
    });

    return NextResponse.json(JSON.parse(JSON.stringify(result.rows || [])));
  } catch (error: any) {
    console.error('❌ Error en GET:', error);
    // Degradar con elegancia: devolver lista vacía en lugar de romper la página
    return NextResponse.json([], { status: 200 });
  }
}

// PUT: Actualizar destacado/oferta de un producto
export async function PUT(request: Request) {
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
