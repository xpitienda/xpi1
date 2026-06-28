const { createClient } = require('@libsql/client');
const fs = require('fs');

// Leer .env.local manualmente
const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

async function migrate() {
  const localDb = createClient({ url: 'file:dev.db' });
  const prodDb = createClient({
    url: envVars.TURSO_DATABASE_URL,
    authToken: envVars.TURSO_AUTH_TOKEN
  });

  try {
    console.log(' Leyendo productos locales...');
    const localProducts = await localDb.execute('SELECT * FROM products');
    console.log(`✅ ${localProducts.rows.length} productos encontrados`);

    console.log('\n🚀 Migrando a Turso...\n');
    let count = 0;
    
    for (const product of localProducts.rows) {
      try {
        await prodDb.execute({
          sql: 'INSERT OR REPLACE INTO products (id, name, description, price, category, stock, image_url, seller_name, seller_phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          args: [
            product.id,
            product.name,
            product.description || '',
            product.price,
            product.category || 'General',
            product.stock || '1',
            product.image_url || '',
            product.seller_name || '',
            product.seller_phone || '',
            product.created_at || new Date().toISOString()
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
    console.error('❌ Error:', error);
  } finally {
    await localDb.close();
    await prodDb.close();
  }
}

migrate();
