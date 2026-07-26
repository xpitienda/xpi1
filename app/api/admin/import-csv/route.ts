import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'El CSV está vacío o no tiene formato válido' }, { status: 400 });
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
      const cleanValues = values.map(v => v.trim().replace(/^"|"$/g, ''));
      
      const product: any = {};
      headers.forEach((header, index) => {
        let val = cleanValues[index] || '';
        if (header === 'price' || header === 'stock') {
          product[header] = parseFloat(val) || 0;
        } else {
          product[header] = val;
        }
      });

      products.push({
        filename: product.filename || '',
        name: product.name || 'Sin nombre',
        price: product.price || 0,
        stock: product.stock || 0,
        description: product.description || '',
        category: product.category || 'General',
        image_url: product.image_url || product.url || ''
      });
    }

    return NextResponse.json({ success: true, products, count: products.length });
  } catch (error: any) {
    console.error('Error leyendo CSV:', error);
    return NextResponse.json({ error: 'Error al procesar el CSV: ' + error.message }, { status: 500 });
  }
}