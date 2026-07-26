import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+: params es una promesa
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, stock, category, image_url, is_active } = body;

    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({ error: 'Nombre, precio y stock son requeridos' }, { status: 400 });
    }

    // Usamos comillas dobles para la consulta SQL para evitar problemas con backticks
    await turso.execute({
      sql: "UPDATE catalog SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [
        name,
        description || null,
        Number(price),
        Number(stock), // Esto permite que el stock 0 se guarde correctamente
        category || null,
        image_url || null,
        is_active !== undefined ? Number(is_active) : 1,
        id
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Producto actualizado',
      id,
      name,
      price: Number(price),
      stock: Number(stock),
      image_url: image_url || null
    });

  } catch (error: any) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json({ error: 'Error al actualizar: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    await turso.execute({
      sql: 'DELETE FROM catalog WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true, message: 'Producto eliminado' });
  } catch (error: any) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json({ error: 'Error al eliminar: ' + error.message }, { status: 500 });
  }
}