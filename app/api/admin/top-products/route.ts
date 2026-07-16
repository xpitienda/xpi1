import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    // Obtener todas las ventas
    const result = await turso.execute('SELECT items FROM sales');
    
    // Acumular cantidades vendidas por producto
    const productSales: Record<string, { name: string; totalQuantity: number; totalRevenue: number }> = {};
    
    result.rows.forEach((row: any) => {
      try {
        const items = JSON.parse(row.items || '[]');
        items.forEach((item: any) => {
          const productName = item.name || 'Producto sin nombre';
          const quantity = Number(item.quantity) || 0;
          const revenue = Number(item.price || 0) * quantity;
          
          if (!productSales[productName]) {
            productSales[productName] = { name: productName, totalQuantity: 0, totalRevenue: 0 };
          }
          
          productSales[productName].totalQuantity += quantity;
          productSales[productName].totalRevenue += revenue;
        });
      } catch (e) {
        // Ignorar errores de parseo
      }
    });
    
    // Convertir a array y ordenar por cantidad vendida (de mayor a menor)
    const sortedProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10); // Top 10
    
    return NextResponse.json(sortedProducts);
  } catch (error: any) {
    console.error('Error calculando top productos:', error);
    return NextResponse.json({ error: 'Error al calcular top productos' }, { status: 500 });
  }
}
// Forzar redeploy
