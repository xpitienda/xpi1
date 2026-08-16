import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, code, logo_url, api_endpoint, api_key, api_secret, is_active } = body;

    await turso.execute({
      sql: `UPDATE courier_companies SET name = ?, code = ?, logo_url = ?, api_endpoint = ?, api_key = ?, api_secret = ?, is_active = ? WHERE id = ?`,
      args: [name, code, logo_url || '', api_endpoint || '', api_key || '', api_secret || '', is_active || 1, id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error actualizando empresa:', error);
    return NextResponse.json({ error: 'Error al actualizar empresa' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    await turso.execute({ sql: 'DELETE FROM courier_companies WHERE id = ?', args: [id] });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando empresa:', error);
    return NextResponse.json({ error: 'Error al eliminar empresa' }, { status: 500 });
  }
}