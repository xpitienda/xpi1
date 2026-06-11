import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const adminPass = process.env.ADMIN_PASSWORD;
  return adminPass && authHeader === `Bearer ${adminPass}`;
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  
  try {
    const params = await props.params;
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

    await turso.execute(
      'UPDATE catalog SET name=?, description=?, price=?, image_url=?, category=?, stock=?, is_active=? WHERE id=?',
      [name, description, price, image_url, category, stock, is_active, params.id]
    );

    return NextResponse.json({ message: 'Producto actualizado correctamente' });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  
  try {
    const params = await props.params;
    
    await turso.execute('UPDATE catalog SET is_active=0 WHERE id=?', [params.id]);
    return NextResponse.json({ message: 'Producto eliminado correctamente' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}