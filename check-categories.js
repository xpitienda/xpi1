const { createClient } = require('@libsql/client');
const fs = require('fs');

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

async function check() {
  const prodDb = createClient({
    url: envVars.TURSO_DATABASE_URL,
    authToken: envVars.TURSO_AUTH_TOKEN
  });

  try {
    console.log('📋 Categorías en Turso:\n');
    const categories = await prodDb.execute('SELECT * FROM categories ORDER BY name');
    categories.rows.forEach(cat => {
      console.log(`  - ${cat.name} (ID: ${cat.id})`);
    });
    
    console.log('\n📦 Productos por categoría:\n');
    const productsByCategory = await prodDb.execute(`
      SELECT category, COUNT(*) as count 
      FROM catalog 
      GROUP BY category 
      ORDER BY count DESC
    `);
    productsByCategory.rows.forEach(row => {
      console.log(`  ${row.category}: ${row.count} productos`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prodDb.close();
  }
}

check();
