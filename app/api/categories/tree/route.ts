import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
  try {
    // ✅ Usamos SELECT * para incluir image_url
    const result = await turso.execute('SELECT * FROM categories ORDER BY parent_id, name');
    const allCategories = result.rows || [];
    
    const categoryMap = new Map();
    const rootCategories: any[] = [];
    
    allCategories.forEach((cat: any) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });
    
    allCategories.forEach((cat: any) => {
      const categoryNode = categoryMap.get(cat.id);
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        categoryMap.get(cat.parent_id).children.push(categoryNode);
      } else {
        rootCategories.push(categoryNode);
      }
    });
    
    return NextResponse.json(rootCategories);
  } catch (error) {
    console.error('Error cargando árbol de categorías:', error);
    return NextResponse.json([], { status: 500 });
  }
}