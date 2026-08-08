// app/api/admin/delete-orphans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';

export async function DELETE(request: NextRequest) {
  try {
    const { keys } = await request.json();

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron claves para eliminar' },
        { status: 400 }
      );
    }

    // Eliminar en lotes de 1000
    let deleted = 0;
    const batchSize = 1000;
    
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize).map(key => ({ Key: key }));
      await R2.send(new DeleteObjectsCommand({
        Bucket: BUCKET_NAME,
        Delete: { Objects: batch },
      }));
      deleted += batch.length;
    }

    console.log(`✅ Eliminadas ${deleted} imágenes huérfanas de R2`);

    return NextResponse.json({
      message: `Eliminadas ${deleted} imágenes huérfanas`,
      deleted
    });

  } catch (error: any) {
    console.error('Error eliminando imágenes huérfanas:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}