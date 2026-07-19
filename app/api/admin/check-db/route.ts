import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    // Listar tablas
    const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table'");
    
    // Contar productos en cada tabla
    const catalogCount = await turso.execute('SELECT COUNT(*) FROM catalog');
    const productsCount = await turso.execute('SELECT COUNT(*) FROM products');
    
    // Ver estructura de catalog
    const catalogSample = await turso.execute('SELECT * FROM catalog LIMIT 1');
    
    // Ver estructura de products
    let productsSample;
    try {
      productsSample = await turso.execute('SELECT * FROM products LIMIT 1');
    } catch (e) {
      productsSample = null;
    }
    
    return NextResponse.json({
      tables: tables.rows,
      catalog: {
        count: catalogCount.rows[0]?.['COUNT(*)'],
        fields: catalogSample.rows[0] ? Object.keys(catalogSample.rows[0]) : []
      },
      products: productsCount ? {
        count: productsCount.rows[0]?.['COUNT(*)'],
        fields: productsSample?.rows[0] ? Object.keys(productsSample.rows[0]) : []
      } : null
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}