import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    // MODIFICADO: Excluir ventas anuladas
    const result = await turso.execute(`
      SELECT * FROM sales
      WHERE id NOT IN (SELECT sale_id FROM voided_sales)
      ORDER BY created_at DESC
    `);

    const allSales = Array.from(result.rows);

    const salesBySeller: any = {};
    let totalGeneral = 0;

    allSales.forEach((sale: any) => {
      const sellerName = sale.seller_name || 'Carrito/Web';

      if (!salesBySeller[sellerName]) {
        salesBySeller[sellerName] = {
          vendedor: sellerName,
          ventas: [],
          totalVendedor: 0,
          cantidadVentas: 0
        };
      }

      salesBySeller[sellerName].ventas.push(sale);
      salesBySeller[sellerName].totalVendedor += Number(sale.total_amount);
      salesBySeller[sellerName].cantidadVentas += 1;
      totalGeneral += Number(sale.total_amount);
    });

    const sellersArray = Object.values(salesBySeller).sort((a: any, b: any) =>
      b.totalVendedor - a.totalVendedor
    );

    return NextResponse.json({
      ventas: sellersArray,
      totalGeneral,
      totalVendedores: sellersArray.length,
      totalVentas: allSales.length
    });

  } catch (error: any) {
    console.error('[Admin Sales] Error:', error);
    return NextResponse.json({
      error: 'Error al obtener ventas',
      details: error.message
    }, { status: 500 });
  }
}