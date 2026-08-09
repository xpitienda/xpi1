// app/api/admin/backup-schedule/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM backup_schedule LIMIT 1');
    
    if (result.rows.length === 0) {
      return NextResponse.json({
        frequency: 'weekly',
        day_of_week: 'sunday',
        day_of_month: 1,
        hour: 2,
        enabled: 1,
        last_backup_at: null,
        next_backup_at: null
      });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error leyendo backup schedule:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { frequency, day_of_week, day_of_month, hour, enabled } = body;

    // Calcular próximo backup
    const nextBackup = calculateNextBackup(frequency, day_of_week, day_of_month, hour);

    await turso.execute({
      sql: `UPDATE backup_schedule 
            SET frequency = ?, day_of_week = ?, day_of_month = ?, 
                hour = ?, enabled = ?, next_backup_at = ?, updated_at = datetime('now')
            WHERE id = (SELECT id FROM backup_schedule LIMIT 1)`,
      args: [frequency, day_of_week, day_of_month, hour, enabled, nextBackup],
    });

    return NextResponse.json({
      success: true,
      message: 'Configuración de backup actualizada',
      nextBackup
    });
  } catch (error: any) {
    console.error('Error actualizando backup schedule:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function calculateNextBackup(frequency: string, dayOfWeek: string, dayOfMonth: number, hour: number): string {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, 0, 0, 0);

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetDay = days.indexOf(dayOfWeek);

  if (frequency === 'weekly') {
    const currentDay = now.getDay();
    let daysUntil = targetDay - currentDay;
    if (daysUntil <= 0) daysUntil += 7;
    next.setDate(now.getDate() + daysUntil);
  } else if (frequency === 'biweekly') {
    const currentDay = now.getDay();
    let daysUntil = targetDay - currentDay;
    if (daysUntil <= 0) daysUntil += 7;
    next.setDate(now.getDate() + daysUntil + 7);
  } else if (frequency === 'monthly') {
    next.setDate(dayOfMonth);
    if (next <= now) {
      next.setMonth(next.getMonth() + 1);
    }
  }

  return next.toISOString();
}