import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
  try {
    // 1. Verificar estructura de la tabla
    const columnsResult = await turso.execute('PRAGMA table_info(sales)');
    
    // 2. Ver algunos registros de ejemplo
    const sampleResult = await turso.execute('SELECT * FROM sales ORDER BY created_at DESC LIMIT 5');
    
    // 3. Probar búsqueda por invoice_number
    const searchResult = await turso.execute({
      sql: 'SELECT * FROM sales WHERE invoice_number LIKE ? ORDER BY created_at DESC',
      args: ['%A-M-00035%']
    });

    return NextResponse.json({
      columns: columnsResult.rows,
      sampleRecords: sampleResult.rows,
      searchResult: searchResult.rows,
      message: 'Debug exitoso'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}