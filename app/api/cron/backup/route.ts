// app/api/cron/backup/route.ts
import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import JSZip from 'jszip';
import { Readable } from 'stream';

// Cliente R2 para imágenes
const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';
const BACKUP_BUCKET_NAME = 'xpitienda-backups';

export async function POST() {
  try {
    // 1. Verificar si está habilitado
    const scheduleResult = await turso.execute('SELECT * FROM backup_schedule LIMIT 1');
    
    if (scheduleResult.rows.length === 0) {
      return NextResponse.json({ skipped: true, message: 'No hay configuración' });
    }

    const schedule = scheduleResult.rows[0] as any;
    
    if (!schedule.enabled) {
      return NextResponse.json({ skipped: true, message: 'Backups deshabilitados' });
    }

    // Verificar si ya se hizo el backup hoy
    const lastBackup = schedule.last_backup_at ? new Date(schedule.last_backup_at) : null;
    const now = new Date();
    
    if (lastBackup) {
      const hoursSinceLast = (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLast < 24) {
        return NextResponse.json({ skipped: true, message: 'Backup ya realizado hoy' });
      }
    }

    // 2. Crear el backup
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const zipName = `backup-${timestamp}.zip`;
    const zip = new JSZip();

    // Exportar base de datos
    const tables = await turso.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);

    let sqlDump = `-- Xpitienda Database Backup\n-- Generated: ${now.toISOString()}\n\n`;

    for (const table of tables.rows) {
      const tableName = table.name as string;
      
      const schema = await turso.execute({
        sql: `SELECT sql FROM sqlite_master WHERE type='table' AND name=?`,
        args: [tableName],
      });
      
      sqlDump += `\n-- Table: ${tableName}\n`;
      sqlDump += `${schema.rows[0].sql};\n\n`;
      
      const data = await turso.execute(`SELECT * FROM ${tableName}`);
      
      if (data.rows.length > 0) {
        sqlDump += `-- Datos (${data.rows.length} registros)\n`;
        for (const row of data.rows) {
          const values = Object.values(row).map(v => 
            typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v === null ? 'NULL' : v
          ).join(', ');
          const columns = Object.keys(row).join(', ');
          sqlDump += `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`;
        }
      }
    }

    zip.file('database-backup.sql', sqlDump);

    // Descargar imágenes de R2
    const listCommand = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
    const listed = await R2.send(listCommand);
    const objects = listed.Contents || [];

    let downloaded = 0;
    const folder = zip.folder('r2-images')!;
    
    for (const obj of objects) {
      try {
        const key = obj.Key!;
        const getObject = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
        const response = await R2.send(getObject);
        const body = response.Body as Readable;
        
        const bufferChunks: Uint8Array[] = [];
        for await (const chunk of body) {
          bufferChunks.push(new Uint8Array(chunk));
        }
        
        const totalLength = bufferChunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const buffer = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of bufferChunks) {
          buffer.set(chunk, offset);
          offset += chunk.length;
        }

        folder.file(key, buffer);
        downloaded++;
      } catch (err) {
        console.error(`Error descargando ${obj.Key}:`, err);
      }
    }

    // Agregar metadatos
    const metadata = {
      date: now.toISOString(),
      type: 'automatic',
      frequency: schedule.frequency,
      database: 'Turso - xpitiendacatalog',
      r2Bucket: BUCKET_NAME,
      tables: tables.rows.length,
      imagesDownloaded: downloaded,
    };

    zip.file('backup-info.json', JSON.stringify(metadata, null, 2));

    // Generar ZIP
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    // 3. SUBIR EL ZIP AL BUCKET DE BACKUPS EN R2
    try {
      await R2.send(new PutObjectCommand({
        Bucket: BACKUP_BUCKET_NAME,
        Key: zipName,
        Body: zipBuffer,
        ContentType: 'application/zip',
      }));
      console.log(`✅ Backup subido a R2: ${zipName}`);
    } catch (uploadError) {
      console.error('❌ Error subiendo backup a R2:', uploadError);
    }

    // 4. Actualizar último backup en la BD
    await turso.execute({
      sql: `UPDATE backup_schedule 
            SET last_backup_at = ?, last_backup_status = 'success', last_backup_size = ?, updated_at = datetime('now')
            WHERE id = (SELECT id FROM backup_schedule LIMIT 1)`,
      args: [now.toISOString(), zipBuffer.length],
    });

    return NextResponse.json({
      success: true,
      message: `Backup automático completado y guardado en R2`,
      timestamp,
      zipName,
      tables: tables.rows.length,
      images: downloaded,
      zipSize: zipBuffer.length,
    });

  } catch (error: any) {
    console.error('Error en backup automático:', error);
    
    // Registrar el error en la BD
    try {
      await turso.execute({
        sql: `UPDATE backup_schedule 
              SET last_backup_at = ?, last_backup_status = 'failed', last_backup_error = ?, updated_at = datetime('now')
              WHERE id = (SELECT id FROM backup_schedule LIMIT 1)`,
        args: [new Date().toISOString(), error.message],
      });
    } catch (dbError) {
      console.error('Error actualizando estado:', dbError);
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}