import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    const result = await client.execute({
      sql: `
        SELECT 
          s.id,
          s.tracking_number,
          s.courier_company_id,
          s.status,
          c.name as courier_name,
          c.api_endpoint
        FROM shipments s
        LEFT JOIN courier_companies c ON s.courier_company_id = c.id
        WHERE s.id = ?
      `,
      args: [id]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    const shipment = result.rows[0] as any;

    return NextResponse.json({
      id: shipment.id,
      tracking_number: shipment.tracking_number,
      courier_company_id: shipment.courier_company_id,
      courier_name: shipment.courier_name,
      api_endpoint: shipment.api_endpoint,
      status: shipment.status,
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}