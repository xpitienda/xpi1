import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
  try {
    console.log('🔍 Buscando productos destacados y ofertas...');

    // Productos destacados
    const featuredResult = await turso.execute({
      sql: 'SELECT id, name, description, price, image_url, category, is_featured, offer_type, offer_price FROM catalog WHERE is_active = 1 AND is_featured = 1 ORDER BY category, created_at DESC',
      args: []
    });
    console.log('⭐ Destacados encontrados:', featuredResult.rows.length);

    // Ofertas del día (USAR COMILLAS SIMPLES)
    const dayOffersResult = await turso.execute({
      sql: "SELECT id, name, description, price, image_url, category, offer_type, offer_price FROM catalog WHERE is_active = 1 AND offer_type = 'day' ORDER BY created_at DESC",
      args: []
    });
    console.log('🔥 Ofertas del día encontradas:', dayOffersResult.rows.length);

    // Ofertas de la semana (USAR COMILLAS SIMPLES)
    const weekOffersResult = await turso.execute({
      sql: "SELECT id, name, description, price, image_url, category, offer_type, offer_price FROM catalog WHERE is_active = 1 AND offer_type = 'week' ORDER BY created_at DESC",
      args: []
    });
    console.log('📅 Ofertas de la semana encontradas:', weekOffersResult.rows.length);

    const response = {
      featured: JSON.parse(JSON.stringify(featuredResult.rows || [])),
      dayOffers: JSON.parse(JSON.stringify(dayOffersResult.rows || [])),
      weekOffers: JSON.parse(JSON.stringify(weekOffersResult.rows || []))
    };

    console.log('📤 Respuesta enviada:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('❌ Error en featured-products:', error.message);
    return NextResponse.json({ 
      featured: [], 
      dayOffers: [], 
      weekOffers: [],
      error: error.message 
    }, { status: 200 });
  }
}

export const dynamic = 'force-dynamic';