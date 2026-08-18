// app/api/process-images/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ FIX: Desempaquetar con await
    
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    // ⚠️ SOCIO: Este código consulta 'shipments'. ¿Es correcto aquí o fue un copia-pega accidental?
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
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}