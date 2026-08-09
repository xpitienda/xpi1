import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function updateTable() {
  try {
    console.log('📊 Agregando campos a backup_schedule...');
    
    await client.execute(`
      ALTER TABLE backup_schedule ADD COLUMN last_backup_status TEXT DEFAULT 'pending'
    `);
    console.log('✅ Campo last_backup_status agregado');
    
    await client.execute(`
      ALTER TABLE backup_schedule ADD COLUMN last_backup_size INTEGER DEFAULT 0
    `);
    console.log('✅ Campo last_backup_size agregado');
    
    await client.execute(`
      ALTER TABLE backup_schedule ADD COLUMN last_backup_error TEXT
    `);
    console.log('✅ Campo last_backup_error agregado');
    
    const result = await client.execute('SELECT * FROM backup_schedule');
    console.log('📋 Tabla actualizada:', result.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

updateTable();
