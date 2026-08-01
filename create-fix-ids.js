const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'app', 'api', 'admin', 'fix-sticker-ids');
fs.mkdirSync(apiDir, { recursive: true });

const content = `import { turso } from '@/lib/turso';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Actualizar la pegatina del Nike Pegassus (de 8c1d a 8c14)
    await turso.execute({
      sql: \`UPDATE stickers SET product_id = '8f7cd84e-8c14-4ac8-b364-8523680c604d' WHERE product_id = '8f7cd84e-8c1d-4ac8-b364-8523680c604d'\`,
      args: []
    });

    // Actualizar la pegatina del Adidas Glow 1 (de be30 a be39)
    await turso.execute({
      sql: \`UPDATE stickers SET product_id = '7edf1ef3-bc70-40f4-be39-c33aec59b603' WHERE product_id = '7edf1ef3-bc70-40f4-be30-c33aec59b603'\`,
      args: []
    });

    return NextResponse.json({ success: true, message: 'IDs de pegatinas corregidos exitosamente.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
`;

fs.writeFileSync(path.join(apiDir, 'route.ts'), content, 'utf8');
console.log('✅ Endpoint de corrección creado en /api/admin/fix-sticker-ids');
