const { createClient } = require('@libsql/client');
const fs = require('fs');

// Leer .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  line = line.trim();
  if (!line || line.startsWith('#')) return;
  const equalIndex = line.indexOf('=');
  if (equalIndex > 0) {
    const key = line.substring(0, equalIndex).trim();
    let value = line.substring(equalIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    envVars[key] = value;
  }
});

console.log('📋 Variables de entorno:');
console.log('  TURSO_DATABASE_URL:', envVars.TURSO_DATABASE_URL ? '✅' : '❌');
console.log('  TURSO_AUTH_TOKEN:', envVars.TURSO_AUTH_TOKEN ? '✅' : '❌');

if (!envVars.TURSO_DATABASE_URL || !envVars.TURSO_AUTH_TOKEN) {
  console.error('❌ Faltan variables de Turso en .env.local');
  process.exit(1);
}

async function migrate() {
  const localDb = createClient({ url: 'file:dev.db' });
  const prodDb = createClient({
    url: envVars.TURSO_DATABASE_URL,
    authToken: envVars.TURSO_AUTH_TOKEN
  });

  try {
    console.log('\n📦 Leyendo productos locales...');
    const localProducts = await localDb.execute('SELECT * FROM catalog');
    console.log(`✅ ${localProducts.rows.length} productos encontrados`);

    console.log('\n🔧 Creando tabla en Turso...');
    await prodDb.execute(`
      CREATE TABLE IF NOT EXISTS catalog (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL,
        image_url TEXT,
        category TEXT,
        stock INTEGER DEFAULT 1,
        is_active INTEGER DEFAULT 1,
        on_sale INTEGER DEFAULT 0,
        sale_price REAL,
        original_price REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_featured INTEGER DEFAULT 0,
        offer_type TEXT,
        offer_price REAL
      )
    `);

    console.log('\n🚀 Migrando productos a Turso...\n');
    let count = 0;
    
    for (const product of localProducts.rows) {
      try {
        await prodDb.execute({
          sql: `INSERT OR REPLACE INTO catalog 
                (id, name, description, price, image_url, category, stock, is_active, on_sale, sale_price, original_price, created_at, updated_at, is_featured, offer_type, offer_price) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            product.id,
            product.name,
            product.description || '',
            product.price,
            product.image_url || '',
            product.category || 'General',
            product.stock || 1,
            product.is_active ?? 1,
            product.on_sale ?? 0,
            product.sale_price,
            product.original_price,
            product.created_at || new Date().toISOString(),
            product.updated_at || new Date().toISOString(),
            product.is_featured ?? 0,
            product.offer_type,
            product.offer_price
          ]
        });
        count++;
        console.log(`  ✅ ${product.name}`);
      } catch (error) {
        console.error(`  ❌ ${product.name}: ${error.message}`);
      }
    }

    console.log(`\n✅ Migración completada: ${count}/${localProducts.rows.length} productos`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await localDb.close();
    await prodDb.close();
  }
}

migrate();
