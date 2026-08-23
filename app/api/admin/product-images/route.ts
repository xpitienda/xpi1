import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`;
  return authHeader === expectedToken;
}

// GET: Obtener imágenes adicionales
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');

  if (!productId) {
    return NextResponse.json({ error: 'product_id es requerido' }, { status: 400 });
  }

  try {
    const result = await turso.execute({
      sql: 'SELECT id, product_id, image_url, display_order FROM product_images WHERE product_id = ? ORDER BY display_order ASC',
      args: [productId]
    });

    const images = (result.rows || []).map(row => ({
      id: Number(row.id),
      product_id: row.product_id,
      image_url: row.image_url,
      display_order: Number(row.display_order)
    }));

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('❌ Error en GET product-images:', error);
    return NextResponse.json({ error: 'Error interno del servidor', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// POST: Guardar imagen adicional
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { product_id, image_url, display_order = 0 } = body;

    console.log('📥 Request recibido:', { product_id, image_url, display_order });

    if (!product_id || !image_url) {
      console.error('❌ Faltan campos requeridos');
      return NextResponse.json({ error: 'product_id e image_url son requeridos' }, { status: 400 });
    }

    // Verificar que la tabla existe
    console.log('️ Ejecutando INSERT...');
    const result = await turso.execute({
      sql: 'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
      args: [product_id, image_url, display_order]
    });

    console.log('✅ Result de la BD:', result);
    console.log('✅ lastInsertRowid:', result.lastInsertRowid, typeof result.lastInsertRowid);

    // Convertir BigInt a string de forma segura
    const insertId = result.lastInsertRowid 
      ? typeof result.lastInsertRowid === 'bigint' 
        ? result.lastInsertRowid.toString()
        : String(result.lastInsertRowid)
      : null;

    console.log('✅ ID convertido:', insertId);

    return NextResponse.json({ 
      success: true, 
      message: 'Imagen agregada exitosamente',
      id: insertId
    });
  } catch (error) {
    console.error('❌ ERROR FATAL en POST product-images:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// DELETE: Eliminar imagen
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 });
    }

    await turso.execute({
      sql: 'DELETE FROM product_images WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true, message: 'Imagen eliminada' });
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}