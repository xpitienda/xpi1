require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');
const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');

// Configurar clientes
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const s3Client = new S3Client({
  region: 'auto',
  endpoint: 'https://' + process.env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function resetEverything() {
  console.log('🗑️  INICIANDO RESET COMPLETO...\n');

  try {
    // 1. Borrar todas las imágenes de R2
    console.log('1️  Borrando imágenes de Cloudflare R2...');
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
    });
    
    const listed = await s3Client.send(listCommand);
    const objects = listed.Contents || [];
    
    if (objects.length > 0) {
      await s3Client.send(new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Delete: {
          Objects: objects.map(obj => ({ Key: obj.Key })),
        },
      }));
      console.log('   ✅ Borradas ' + objects.length + ' imágenes de R2');
    } else {
      console.log('   ℹ️  No hay imágenes en R2');
    }

    // 2. Limpiar tablas de la base de datos
    console.log('\n2️  Limpiando tablas de Turso...');
    
    const tables = [
      'catalog',
      'categories',
      'sales',
      'sale_items',
      'sellers',
      'invoices'
    ];

    for (const table of tables) {
      try {
        const result = await turso.execute('DELETE FROM ' + table);
        console.log('   ✅ Tabla ' + table + ': ' + result.rowsAffected + ' registros eliminados');
      } catch (err) {
        console.log('   ⚠️  Tabla ' + table + ': No existe o error: ' + err.message);
      }
    }

    // 3. Resetear autoincrement (si aplica)
    console.log('\n3️⃣  Reseteando secuencias...');
    try {
      await turso.execute("DELETE FROM sqlite_sequence WHERE name IN ('catalog', 'categories', 'sales')");
      console.log('   ✅ Secuencias reseteadas');
    } catch (err) {
      console.log('   ℹ️  No hay secuencias que resetear');
    }

    console.log('\n✅ RESET COMPLETADO EXITOSAMENTE');
    console.log('\n📊 Estado final:');
    
    // Verificar que las tablas estén vacías
    for (const table of tables) {
      try {
        const result = await turso.execute('SELECT COUNT(*) as count FROM ' + table);
        const count = result.rows[0]?.count || 0;
        console.log('   - ' + table + ': ' + count + ' registros');
      } catch (err) {
        console.log('   - ' + table + ': Tabla no existe');
      }
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  } finally {
    await turso.close();
  }
}

resetEverything();
