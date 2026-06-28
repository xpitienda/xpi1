import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM categories ORDER BY parent_id, name');
    const allCategories = result.rows || [];

    // Construir árbol jerárquico
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // Primera pasada: crear mapa de categorías
    allCategories.forEach((cat: any) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Segunda pasada: construir árbol
    allCategories.forEach((cat: any) => {
      const categoryNode = categoryMap.get(cat.id);
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        const parent = categoryMap.get(cat.parent_id);
        parent.children.push(categoryNode);
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return NextResponse.json(rootCategories);
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
