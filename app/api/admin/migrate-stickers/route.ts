import { turso } from '@/lib/turso';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS stickers (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        message TEXT NOT NULL,
        points INTEGER DEFAULT 6,
        color_start TEXT DEFAULT '#FF006E',
        color_end TEXT DEFAULT '#FFBE0B',
        text_color TEXT DEFAULT '#FFFFFF',
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (product_id) REFERENCES catalog(id)
      )
    `);
    return NextResponse.json({ success: true, message: 'Tabla stickers creada exitosamente.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
