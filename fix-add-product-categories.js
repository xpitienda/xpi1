const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'add-product', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Agregar useEffect para cargar categorías
const useEffectMatch = content.match(/import.*useState.*from.*['"]react['"];?/);
if (useEffectMatch) {
  const importLine = useEffectMatch[0];
  const newImport = importLine.replace(
    "import { useState } from 'react';",
    "import { useState, useEffect } from 'react';"
  );
  content = content.replace(importLine, newImport);
}

// Agregar estado de categorías después de los otros estados
const stateMatch = content.match(/const fileInputRef = useRef<HTMLInputElement>\(null\);/);
if (stateMatch) {
  const categoriesState = `
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar categorías dinámicamente
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories', {
          headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data.map((c: any) => c.name));
        }
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    };
    fetchCategories();
  }, []);`;
  
  content = content.replace(
    'const fileInputRef = useRef<HTMLInputElement>(null);',
    categoriesState
  );
}

// Reemplazar el select de categorías fijas por uno dinámico
const categorySelect = content.match(/<select[^>]*name="category"[^>]*>[\s\S]*?<\/select>/);
if (categorySelect) {
  const dynamicSelect = `<select
                name="category"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', background: 'white' }}
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                ) : (
                  <option value="General">General</option>
                )}
              </select>`;
  
  content = content.replace(categorySelect[0], dynamicSelect);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Formulario de producto actualizado: Las categorías ahora se cargan dinámicamente desde la BD.');
