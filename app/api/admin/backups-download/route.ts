// app/api/admin/backups-download/route.ts
import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import JSZip from 'jszip';
import { Readable } from 'stream';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';

export async function POST() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const zipName = `xpitienda-backup-${timestamp}.zip`;

    // Crear instancia de JSZip
    const zip = new JSZip();

    // 1. Exportar base de datos Turso
    const tables = await turso.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);

    let sqlDump = `-- Xpitienda Database Backup\n-- Generated: ${new Date().toISOString()}\n\n`;

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

    // Agregar SQL al ZIP
    zip.file('database-backup.sql', sqlDump);

    // 2. Descargar imágenes de R2
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const listed = await R2.send(listCommand);
    const objects = listed.Contents || [];

    let downloaded = 0;
    const folder = zip.folder('r2-images')!;
    
    for (const obj of objects) {
      try {
        const key = obj.Key!;
        const getObject = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        });

        const response = await R2.send(getObject);
        const body = response.Body as Readable;
        
        const bufferChunks: Uint8Array[] = [];
        for await (const chunk of body) {
          bufferChunks.push(new Uint8Array(chunk));
        }
        
        // Concatenar chunks
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

    // 3. Agregar archivo de instrucciones
    const instructions = `# Instrucciones de Restauración

## Contenido del Backup:
- database-backup.sql: Base de datos completa
- r2-images/: Todas las imágenes de Cloudflare R2
- backup-info.json: Metadatos del backup

## Pasos para Restaurar:

### 1. Base de Datos
1. Instala Turso CLI
2. Autentícate: turso auth login
3. Restaura: turso db shell xptiendacatalog < database-backup.sql

### 2. Imágenes
1. Sube la carpeta r2-images/ al bucket xpitienda-images

## Fecha del Backup:
${new Date().toISOString()}
`;

    zip.file('RESTAURAR.md', instructions);

    // 4. Agregar metadatos
    const metadata = {
      date: new Date().toISOString(),
      type: 'manual-download',
      database: 'Turso - xpitiendacatalog',
      r2Bucket: BUCKET_NAME,
      tables: tables.rows.length,
      imagesDownloaded: downloaded,
      version: '1.0',
    };

    zip.file('backup-info.json', JSON.stringify(metadata, null, 2));

    // Generar el ZIP como buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    // Devolver el ZIP como descarga
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipName}"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error('Error creando backup ZIP:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}