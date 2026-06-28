import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM categories ORDER BY parent_id, name');
    return NextResponse.json(result.rows || []);
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
