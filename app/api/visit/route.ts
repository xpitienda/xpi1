import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST() {
  try {
    // Incrementar el contador
    await turso.execute('UPDATE page_views SET view_count = view_count + 1 WHERE id = 1');
    
    // Obtener el nuevo valor
    const result = await turso.execute('SELECT view_count FROM page_views WHERE id = 1');
    const newCount = result.rows[0]?.view_count || 1;
    
    return NextResponse.json({ success: true, count: newCount });
  } catch (error) {
    console.error('Error updating visit count:', error);
    return NextResponse.json({ success: false, error: 'Failed to update count' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await turso.execute('SELECT view_count FROM page_views WHERE id = 1');
    const count = result.rows[0]?.view_count || 0;
    
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Error getting visit count:', error);
    return NextResponse.json({ success: false, error: 'Failed to get count' }, { status: 500 });
  }
}