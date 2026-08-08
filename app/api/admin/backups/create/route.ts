// app/api/admin/backups/create/route.ts
import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';
const BACKUP_DIR = path.join(process.cwd(), 'backups');

export async function POST() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFolder = path.join(BACKUP_DIR, `backup-${timestamp}`);
    
    // Crear carpeta de backup
    if (!existsSync(BACKUP_DIR)) {
      mkdirSync(BACKUP_DIR);
    }
    mkdirSync(backupFolder);
    mkdirSync(path.join(backupFolder, 'r2-images'));

    // 1. Exportar base de datos Turso
    const tables = await turso.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);

    let sqlDump = `-- Xpitienda Database Backup\n-- Generated: ${new Date().toISOString()}\n\n`;

    for (const table of tables.rows) {
      const tableName = table.name as string;
      
      // Obtener estructura
      const schema = await turso.execute({
        sql: `SELECT sql FROM sqlite_master WHERE type='table' AND name=?`,
        args: [tableName],
      });
      
      sqlDump += `\n-- Table: ${tableName}\n`;
      sqlDump += `${schema.rows[0].sql};\n\n`;
      
      // Obtener datos
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

    // Guardar SQL
    const { writeFileSync } = await import('fs');
    writeFileSync(path.join(backupFolder, 'database-backup.sql'), sqlDump);

    // 2. Descargar imágenes de R2
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const listed = await R2.send(listCommand);
    const objects = listed.Contents || [];

    let downloaded = 0;
    for (const obj of objects) {
      try {
        const key = obj.Key!;
        const filePath = path.join(backupFolder, 'r2-images', key.replace(/\//g, path.sep));
        const dir = path.dirname(filePath);
        
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }

        const getObject = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        });

        const response = await R2.send(getObject);
        const fileStream = createWriteStream(filePath);
        
        await pipeline(response.Body as any, fileStream);
        downloaded++;
      } catch (err) {
        console.error(`Error descargando ${obj.Key}:`, err);
      }
    }

    // 3. Guardar metadatos
    const metadata = {
      date: new Date().toISOString(),
      type: 'manual',
      database: 'Turso - xpitiendacatalog',
      r2Bucket: BUCKET_NAME,
      tables: tables.rows.length,
      totalRecords: tables.rows.length,
      imagesDownloaded: downloaded,
    };

    writeFileSync(
      path.join(backupFolder, 'backup-info.json'),
      JSON.stringify(metadata, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: `Backup creado exitosamente`,
      folder: `backup-${timestamp}`,
      tables: tables.rows.length,
      images: downloaded,
    });

  } catch (error: any) {
    console.error('Error creando backup:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}