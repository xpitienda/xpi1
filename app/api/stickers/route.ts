import { turso } from '@/lib/turso';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await turso.execute({
      sql: `SELECT * FROM stickers 
            WHERE is_active = 1 
            AND start_date <= ? 
            AND end_date >= ?`,
      args: [today, today]
    });
    return NextResponse.json(result.rows || []);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener pegatinas' }, { status: 500 });
  }
}
