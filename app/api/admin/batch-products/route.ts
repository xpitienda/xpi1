import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const adminPass = process.env.ADMIN_PASSWORD;
  return adminPass && authHeader === 'Bearer ' + adminPass;
}

export async function POST(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const products = body.products;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'Se requiere un array de productos' }, { status: 400 });
    }

    // Guardar cada producto en Turso
    for (const product of products) {
      const id = 'prod_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      
      await turso.execute(`
        INSERT INTO catalog (id, name, description, price, stock, image_url, category, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
      `, [
        id,
        product.name,
        product.description || '',
        parseFloat(product.price),
        parseInt(product.stock) || 0,
        product.image_url,
        product.category || 'General'
      ]);
    }

    return NextResponse.json({ 
      message: `✅ ${products.length} productos guardados exitosamente`,
      count: products.length 
    });

  } catch (error: any) {
    console.error('Error en batch:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
