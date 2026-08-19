// app/api/admin/carousel-overlays/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { is_active } = await request.json();
    
    await db.execute({ 
      sql: 'UPDATE carousel_overlays SET is_active = ? WHERE id = ?', 
      args: [is_active, id] 
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.execute({ sql: 'DELETE FROM carousel_overlays WHERE id = ?', args: [id] });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}