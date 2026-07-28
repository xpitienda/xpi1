const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'add-product', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Agregar useEffect al import
content = content.replace(
  "import { useState, useRef } from 'react';",
  "import { useState, useRef, useEffect } from 'react';"
);

// Agregar estado y efecto para cargar categorías
const useEffectCode = `
  // Cargar categorías dinámicamente desde la BD
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
  }, []);
`;

// Insertar después de los otros estados
const stateInsertionPoint = content.indexOf('const fileInputRef = useRef<HTMLInputElement>(null);');
if (stateInsertionPoint !== -1) {
  const insertPosition = content.indexOf(';', stateInsertionPoint) + 1;
  content = content.slice(0, insertPosition) + useEffectCode + content.slice(insertPosition);
}

// Reemplazar el select de categorías fijas
const oldSelectPattern = /<select[^>]*name="category"[^>]*>[\s\S]*?<\/select>/;
const newSelect = `<select
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

content = content.replace(oldSelectPattern, newSelect);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Archivo actualizado correctamente con categorías dinámicas.');
