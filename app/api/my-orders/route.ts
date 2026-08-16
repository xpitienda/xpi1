import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone') || '';
    const invoice = searchParams.get('invoice') || '';

    if (!phone && !invoice) {
      return NextResponse.json(
        { error: 'Debes proporcionar teléfono o número de factura' }, 
        { status: 400 }
      );
    }

    // Usamos DISTINCT y subconsulta para evitar duplicados
    let sql = `
      SELECT DISTINCT
        s.id as sale_id,
        s.invoice_number,
        s.customer_name,
        s.customer_phone,
        s.total_amount,
        s.status,
        s.created_at,
        (SELECT sh.id FROM shipments sh WHERE sh.sale_id = s.id LIMIT 1) as shipment_id,
        (SELECT sh.tracking_number FROM shipments sh WHERE sh.sale_id = s.id LIMIT 1) as tracking_number,
        (SELECT cc.name FROM shipments sh LEFT JOIN courier_companies cc ON sh.courier_company_id = cc.id WHERE sh.sale_id = s.id LIMIT 1) as courier_name,
        (SELECT cc.id FROM shipments sh LEFT JOIN courier_companies cc ON sh.courier_company_id = cc.id WHERE sh.sale_id = s.id LIMIT 1) as courier_company_id,
        (SELECT cc.api_endpoint FROM shipments sh LEFT JOIN courier_companies cc ON sh.courier_company_id = cc.id WHERE sh.sale_id = s.id LIMIT 1) as api_endpoint
      FROM sales s
      WHERE 1=1
    `;

    const args: (string | number)[] = [];

    if (phone) {
      sql += ' AND (s.customer_phone = ? OR s.customer_phone LIKE ?)';
      args.push(phone, `%${phone}%`);
    }

    if (invoice) {
      sql += ' AND (s.invoice_number = ? OR s.invoice_number LIKE ?)';
      args.push(invoice, `%${invoice}%`);
    }

    sql += ' ORDER BY s.created_at DESC';

    const result = await turso.execute({ sql, args });

    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error('Error cargando pedidos:', error);
    return NextResponse.json({ error: 'Error al cargar pedidos' }, { status: 500 });
  }
}