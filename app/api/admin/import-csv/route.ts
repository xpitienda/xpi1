import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim() !== '');
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'El CSV está vacío o mal formado' }, { status: 400 });
    }

    // Parsear cabeceras
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    console.log('Columnas detectadas:', headers); // DEBUG
    
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const row: any = {};
      
      headers.forEach((header, index) => {
        let val = matches[index] ? matches[index].replace(/^"|"$/g, '').trim() : '';
        row[header] = val;
      });

      if (!row.name && !row.nombre) continue;
      
      // INCLUIR image_url explícitamente
      products.push({
        name: row.name || row.nombre || 'Sin Nombre',
        price: parseFloat(row.price || row.precio || '0'),
        stock: parseInt(row.stock || row.cantidad || '0'),
        description: row.description || row.descripcion || '',
        category: row.category || row.categoria || 'General',
        filename: row.filename || row.file || row['nombre archivo'] || '',
        image_url: row.image_url || row.url || row.imagen || '', // ✅ NUEVO
      });
    }

    console.log('Primer producto parseado:', products[0]); // DEBUG

    return NextResponse.json({ 
      success: true,
      count: products.length,
      products 
    });

  } catch (error: any) {
    console.error('Error parseando CSV:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
