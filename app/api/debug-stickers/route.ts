import { turso } from '@/lib/turso';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    // Obtener todas las pegatinas
    const stickers = await turso.execute('SELECT * FROM stickers');
    
    // Verificar cuáles deberían estar activas
    const activeStickers = (stickers.rows || []).filter((s: any) => {
      const startDate = s.start_date;
      const endDate = s.end_date;
      const isActive = s.is_active === 1;
      const isWithinDates = startDate <= today && endDate >= today;
      
      return {
        id: s.id,
        product_id: s.product_id,
        message: s.message,
        start_date: startDate,
        end_date: endDate,
        is_active: isActive,
        isWithinDates,
        shouldShow: isActive && isWithinDates,
        today,
        comparison: `${startDate} <= ${today} <= ${endDate}`
      };
    });

    return NextResponse.json({
      today,
      now,
      totalStickers: (stickers.rows || []).length,
      activeStickers
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
