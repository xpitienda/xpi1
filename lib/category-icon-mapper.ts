// lib/category-icon-mapper.ts

// Mapeo de palabras clave a iconos 3D
const categoryIconMap: Record<string, string> = {
  // Categorías principales
  'ropa': '/icons/categories/ropa.png',
  'calzado': '/icons/categories/calzado.png',
  'zapatos': '/icons/categories/calzado.png',
  'accesorios': '/icons/categories/accesorios.png',
  'electronica': '/icons/categories/electronica.png',
  'tecnologia': '/icons/categories/electronica.png',
  'computacion': '/icons/categories/electronica.png',
  'celulares': '/icons/categories/electronica.png',
  'hogar': '/icons/categories/hogar.png',
  'decoracion': '/icons/categories/hogar.png',
  'muebles': '/icons/categories/hogar.png',
  'deportes': '/icons/categories/deportes.png',
  'fitness': '/icons/categories/deportes.png',
  'belleza': '/icons/categories/belleza.png',
  'cosmeticos': '/icons/categories/belleza.png',
  'perfumes': '/icons/categories/belleza.png',
  'juguetes': '/icons/categories/juguetes.png',
  'libros': '/icons/categories/libros.png',
  'cocina': '/icons/categories/cocina.png',
  'mascotas': '/icons/categories/mascotas.png',
  'jardin': '/icons/categories/jardin.png',
  'exterior': '/icons/categories/jardin.png',
  'oficina': '/icons/categories/oficina.png',
  'papeleria': '/icons/categories/oficina.png',
  'bebe': '/icons/categories/bebe.png',
  'infantil': '/icons/categories/bebe.png',
  
  // ✅ Joyería y Bisutería (separadas)
  'bisuteria': '/icons/categories/bisuteria.png',
  'bisutería': '/icons/categories/bisuteria.png',
  'joyeria': '/icons/categories/joyeria.png',
  'joyería': '/icons/categories/joyeria.png',
  'relojes': '/icons/categories/joyeria.png',
  
  'musica': '/icons/categories/musica.png',
  'instrumentos': '/icons/categories/musica.png',
  'videojuegos': '/icons/categories/videojuegos.png',
  'gaming': '/icons/categories/videojuegos.png',
  'automotriz': '/icons/categories/automotriz.png',
  'autos': '/icons/categories/automotriz.png',
  'repuestos': '/icons/categories/automotriz.png',
  'salud': '/icons/categories/salud.png',
  'vitaminas': '/icons/categories/salud.png',
  'suplementos': '/icons/categories/salud.png',
  'comida': '/icons/categories/comida.png',
  'alimentos': '/icons/categories/comida.png',
  'restaurantes': '/icons/categories/comida.png',
  
  // ✅ Categorías personalizadas de XpiTienda
  'vicenzo': '/icons/categories/vicenzo.png',
  'cuero': '/icons/categories/vicenzo.png',
  'maletines': '/icons/categories/vicenzo.png',
  'billeteras': '/icons/categories/vicenzo.png',
  'productosj9': '/icons/categories/productosj9.png',
  'electrodomesticos': '/icons/categories/productosj9.png',
  'televisores': '/icons/categories/productosj9.png',
  'neveras': '/icons/categories/productosj9.png',
  'camas': '/icons/categories/productosj9.png',
};

// Función inteligente para encontrar el mejor icono
export function getCategoryIcon(categoryName: string): string {
  if (!categoryName) return '';
  
  const normalizedName = categoryName.toLowerCase().trim();
  
  // Buscar coincidencia exacta
  if (categoryIconMap[normalizedName]) {
    return categoryIconMap[normalizedName];
  }
  
  // Buscar por palabras clave parciales
  for (const [key, value] of Object.entries(categoryIconMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }
  
  // Si no encuentra, retorna string vacío (usar emoji como fallback)
  return '';
}

// Función para obtener el emoji de fallback
export function getCategoryEmoji(categoryName: string): string {
  const icon = getCategoryIcon(categoryName);
  if (icon) return ''; // Hay icono 3D, no necesita emoji
  
  // Emojis de respaldo por categoría
  const emojiMap: Record<string, string> = {
    'ropa': '👕',
    'calzado': '👟',
    'accesorios': '👜',
    'electronica': '',
    'hogar': '🏠',
    'deportes': '⚽',
    'belleza': '💄',
    'juguetes': '🧸',
    'libros': '📚',
    'cocina': '🍳',
    'mascotas': '🐾',
    'jardin': '🌱',
    'oficina': '💼',
    'bebe': '🍼',
    'joyeria': '💍',
    'bisuteria': '💎',
    'musica': '🎸',
    'videojuegos': '🎮',
    'automotriz': '🚗',
    'salud': '💊',
    'comida': '🍕',
  };
  
  const normalizedName = categoryName.toLowerCase().trim();
  return emojiMap[normalizedName] || '';
}