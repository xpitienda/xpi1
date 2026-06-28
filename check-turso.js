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
    console.log('🔍 Verificando estructura de tabla en Turso...\n');
    
    // Ver si existe la tabla
    const tables = await prodDb.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='catalog';");
    console.log('Tabla catalog existe:', tables.rows.length > 0 ? '✅ SÍ' : '❌ NO');
    
    if (tables.rows.length > 0) {
      const info = await prodDb.execute("PRAGMA table_info(catalog);");
      console.log('\nColumnas actuales en Turso:');
      info.rows.forEach(col => console.log(`  - ${col.name} (${col.type})`));
      
      const count = await prodDb.execute("SELECT COUNT(*) as total FROM catalog;");
      console.log(`\nProductos actuales en Turso: ${count.rows[0].total}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prodDb.close();
  }
}

check();
