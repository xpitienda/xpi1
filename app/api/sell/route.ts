import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { name, description, price, category, stock, image_url, seller_name, seller_phone } = body;

    // Validaciones básicas
    if (!name || !price) {
      return NextResponse.json({ error: 'Nombre y precio son obligatorios' }, { status: 400 });
    }

    // Generar ID único
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);

    // Insertar en la base de datos
    // NOTA: is_active = 1 para que aparezca inmediatamente. 
    // Si prefieres aprobarlos primero, cambia el 1 por 0.
    await turso.execute(
      `INSERT INTO catalog (id, name, description, price, image_url, category, stock, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        id, 
        name, 
        description || '', 
        parseFloat(price), 
        image_url || '', 
        category || 'General', 
        parseInt(stock) || 0
      ]
    );

    return NextResponse.json({ 
      success: true, 
      message: '¡Producto publicado exitosamente!' 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error publicando producto:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}