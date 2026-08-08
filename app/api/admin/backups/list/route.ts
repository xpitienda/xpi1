// app/api/admin/backups/list/route.ts
import { NextResponse } from 'next/server';
import { readdirSync, statSync, existsSync } from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

export async function GET() {
  try {
    if (!existsSync(BACKUP_DIR)) {
      return NextResponse.json({ backups: [], total: 0 });
    }

    const folders = readdirSync(BACKUP_DIR)
      .filter(name => name.startsWith('backup-'))
      .map(name => {
        const folderPath = path.join(BACKUP_DIR, name);
        const stats = statSync(folderPath);
        
        // Leer metadatos si existe
        const metadataPath = path.join(folderPath, 'backup-info.json');
        let metadata: any = null;
        
        if (existsSync(metadataPath)) {
          const { readFileSync } = require('fs');
          metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
        }

        // Calcular tamaño total
        let totalSize = 0;
        let fileCount = 0;
        
        function walkDir(dir: string) {
          const items = readdirSync(dir);
          for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = statSync(fullPath);
            if (stat.isDirectory()) {
              walkDir(fullPath);
            } else {
              totalSize += stat.size;
              fileCount++;
            }
          }
        }
        
        walkDir(folderPath);

        return {
          name,
          date: stats.birthtime,
          size: totalSize,
          sizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
          files: fileCount,
          metadata,
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return NextResponse.json({
      backups: folders,
      total: folders.length,
    });

  } catch (error: any) {
    console.error('Error listando backups:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}