require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');
const { randomUUID } = require('crypto');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function createTestBanner() {
  try {
    console.log('Creando banner de prueba...');
    await turso.execute({
      sql: 'INSERT INTO banners (id, text, type, background_color, text_color, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [
        randomUUID(),
        '🎉 ¡Bienvenidos! Oferta especial en tenis seleccionados. ¡Envío gratis!',
        'rolling',
        '#3D1A78',
        '#ffffff',
        0,
        1
      ]
    });
    console.log('✅ Banner de prueba creado exitosamente.');
  } catch (error) {
    console.log('ℹ️ El banner ya existe o hubo un error:', error.message);
  }
  await turso.close();
}

createTestBanner();
