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
    console.log('📦 Productos por categoría:\n');
    
    const categories = ['Calzado', 'Tecnología', 'Tecnologia', 'Deportes', 'Accesorios'];
    
    for (const cat of categories) {
      const products = await prodDb.execute({
        sql: 'SELECT id, name, price FROM catalog WHERE category = ?',
        args: [cat]
      });
      
      if (products.rows.length > 0) {
        console.log(`\n📁 ${cat} (${products.rows.length} productos):`);
        products.rows.forEach(p => {
          console.log(`  - ${p.name} ($${p.price}) [ID: ${p.id}]`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prodDb.close();
  }
}

check();
