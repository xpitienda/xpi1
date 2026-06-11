import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST() {
  try {
    // Agregar campo is_featured (0 o 1)
    await turso.execute(`
      ALTER TABLE catalog ADD COLUMN is_featured INTEGER DEFAULT 0
    `).catch(() => console.log('Campo is_featured ya existe'));

    // Agregar campo offer_type ('day', 'week', o null)
    await turso.execute(`
      ALTER TABLE catalog ADD COLUMN offer_type TEXT
    `).catch(() => console.log('Campo offer_type ya existe'));

    // Agregar campo offer_price (precio con descuento)
    await turso.execute(`
      ALTER TABLE catalog ADD COLUMN offer_price REAL
    `).catch(() => console.log('Campo offer_price ya existe'));

    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos actualizada correctamente' 
    });
  } catch (error: any) {
    console.error('Error en migración:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}