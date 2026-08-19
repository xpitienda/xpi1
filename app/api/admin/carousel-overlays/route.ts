import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      text, font_size = 72, font_color = '#FFFFFF', font_weight = 'bold', 
      background_color = 'transparent',
      animation_speed = 30, direction = 'left', pause_on_hover = 1,
      starts_at, ends_at, is_active = 1 
    } = body;

    // Convertir formato de fecha: 2026-08-18T15:30 → 2026-08-18 15:30:00
    const formatDateTime = (dateStr: string) => {
      if (!dateStr) return null;
      return dateStr.replace('T', ' ') + ':00';
    };

    const formattedStartsAt = formatDateTime(starts_at);
    const formattedEndsAt = formatDateTime(ends_at);

    const res = await db.execute({
      sql: `INSERT INTO carousel_overlays 
        (text, font_size, font_color, font_weight, background_color, animation_speed, direction, pause_on_hover, starts_at, ends_at, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [text, font_size, font_color, font_weight, background_color, animation_speed, direction, pause_on_hover, formattedStartsAt, formattedEndsAt, is_active]
    });

    return NextResponse.json({ 
      success: true, 
      id: Number(res.lastInsertRowid)  // ✅ FIX: Convierte BigInt a Number
    });
  } catch (error: any) {
    console.error('❌ Error creating overlay:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const res = await db.execute('SELECT * FROM carousel_overlays ORDER BY created_at DESC');
    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error('❌ Error getting overlays:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}