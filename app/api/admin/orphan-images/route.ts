// app/api/admin/orphan-images/route.ts
import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';

export async function GET() {
  try {
    // 1. Obtener todas las imágenes de productos en la BD
    const result = await turso.execute({
      sql: 'SELECT image_url FROM catalog WHERE image_url IS NOT NULL AND image_url != ""',
      args: [],
    });

    const productImageKeys = new Set<string>();
    for (const row of result.rows) {
      const imageUrl = row.image_url as string;
      try {
        const url = new URL(imageUrl);
        const key = url.pathname.substring(1);
        if (key) {
          productImageKeys.add(key);
        }
      } catch (err) {
        console.warn(`No se pudo parsear URL: ${imageUrl}`);
      }
    }

    // 2. Listar todos los objetos en R2
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const listed = await R2.send(listCommand);
    const r2Objects = listed.Contents || [];

    // 3. Filtrar los que NO están en la BD (huérfanos)
    const orphans = r2Objects
      .map(obj => obj.Key!)
      .filter(key => !productImageKeys.has(key));

    return NextResponse.json({
      orphans,
      totalR2: r2Objects.length,
      totalProducts: productImageKeys.size,
      orphanCount: orphans.length
    });

  } catch (error: any) {
    console.error('Error listando imágenes huérfanas:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}