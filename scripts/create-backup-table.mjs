import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function createTable() {
  try {
    console.log('📊 Creando tabla backup_schedule...');
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS backup_schedule (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        frequency TEXT NOT NULL DEFAULT 'weekly',
        day_of_week TEXT,
        day_of_month INTEGER,
        hour INTEGER NOT NULL DEFAULT 2,
        enabled INTEGER NOT NULL DEFAULT 1,
        last_backup_at TEXT,
        next_backup_at TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
    
    console.log('✅ Tabla creada');
    
    await client.execute(`
      INSERT INTO backup_schedule (frequency, day_of_week, hour, enabled)
      VALUES ('weekly', 'sunday', 2, 1)
    `);
    
    console.log('✅ Configuración insertada');
    
    const result = await client.execute('SELECT * FROM backup_schedule');
    console.log('📋 Datos:', result.rows);
    
  } catch (error) {
    console.error(' Error:', error.message);
  } finally {
    await client.close();
  }
}

createTable();
