import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await turso.execute({
      sql: `SELECT * FROM advanced_banners 
            WHERE is_active = 1 
            AND (start_date IS NULL OR start_date <= ?) 
            AND (end_date IS NULL OR end_date >= ?)
            ORDER BY display_order ASC, created_at DESC`,
      args: [today, today]
    });

    return NextResponse.json(Array.from(result.rows));
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al cargar banners' }, { status: 500 });
  }
}
