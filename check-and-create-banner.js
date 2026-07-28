require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');
const { randomUUID } = require('crypto');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkBanners() {
  try {
    const all = await turso.execute('SELECT * FROM banners');
    const active = await turso.execute('SELECT * FROM banners WHERE is_active = 1');
    
    console.log('📊 Total de banners:', all.rows.length);
    console.log('✅ Banners activos:', active.rows.length);
    
    if (active.rows.length > 0) {
      console.log('\nBanners activos encontrados:');
      active.rows.forEach((b) => {
        console.log('  - [' + b.type + '] ' + b.text.substring(0, 50) + '...');
      });
    } else {
      console.log('\n⚠️ No hay banners activos. Creando uno de prueba...');
      
      await turso.execute({
        sql: 'INSERT INTO banners (id, text, type, background_color, text_color, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [
          randomUUID(),
          '🎉 ¡Bienvenidos a nuestra tienda! Oferta especial en tenis seleccionados',
          'rolling',
          '#3D1A78',
          '#ffffff',
          0,
          1
        ]
      });
      
      console.log('✅ Banner de prueba creado. Recarga la página del catálogo.');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await turso.close();
}

checkBanners();
