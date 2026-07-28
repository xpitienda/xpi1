import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { randomUUID } from 'crypto';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM banners ORDER BY display_order ASC, created_at DESC');
    return NextResponse.json(Array.from(result.rows));
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al cargar banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, type, background_color, text_color, link_url, display_order } = body;

    if (!text) return NextResponse.json({ error: 'El texto es obligatorio' }, { status: 400 });

    const newId = randomUUID();
    await turso.execute({
      sql: `INSERT INTO banners (id, text, type, background_color, text_color, link_url, display_order, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [newId, text, type || 'rolling', background_color || '#3D1A78', text_color || '#ffffff', link_url || null, Number(display_order) || 0, 1]
    });

    return NextResponse.json({ success: true, message: 'Banner creado', id: newId });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al crear: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, text, type, background_color, text_color, link_url, display_order, is_active } = body;
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    await turso.execute({
      sql: `UPDATE banners SET text = ?, type = ?, background_color = ?, text_color = ?, link_url = ?, display_order = ?, is_active = ? WHERE id = ?`,
      args: [text, type, background_color, text_color, link_url, Number(display_order), is_active, id]
    });

    return NextResponse.json({ success: true, message: 'Banner actualizado' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al actualizar: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    await turso.execute({ sql: 'DELETE FROM banners WHERE id = ?', args: [id] });
    return NextResponse.json({ success: true, message: 'Banner eliminado' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al eliminar: ' + error.message }, { status: 500 });
  }
}