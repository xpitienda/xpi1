require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function cleanup() {
  console.log('Eliminando productos con ID NULL o vacío...');
  
  try {
    // Eliminar productos sin ID válido
    const result = await turso.execute('DELETE FROM catalog WHERE id IS NULL OR LENGTH(TRIM(id)) = 0');
    console.log('Eliminados ' + result.rowsAffected + ' productos corruptos');
    
    // Verificar
    const remaining = await turso.execute('SELECT COUNT(*) as count FROM catalog');
    console.log('Productos restantes: ' + remaining.rows[0].count);
    
    // Listar los que quedan
    const list = await turso.execute('SELECT id, name FROM catalog');
    console.log('\nProductos válidos restantes:');
    list.rows.forEach(r => console.log('  - ' + r.id + ' | ' + r.name));
    
  } catch (error) {
    console.error('Error: ' + error.message);
  }
  
  await turso.close();
}

cleanup();
