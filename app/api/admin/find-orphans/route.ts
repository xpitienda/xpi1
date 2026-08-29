import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`;
  return authHeader === expectedToken;
}

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // ✅ CORREGIDO: Usar comillas simples '' en lugar de dobles ""
    const catalogResult = await turso.execute({
      sql: "SELECT image_url FROM catalog WHERE image_url IS NOT NULL AND image_url != ''"
    });

    const productImagesResult = await turso.execute({
      sql: "SELECT image_url FROM product_images WHERE image_url IS NOT NULL AND image_url != ''"
    });

    const dbKeys = new Set<string>();
    
    const extractKey = (url: string) => {
      try {
        const parsed = new URL(url);
        const key = parsed.pathname.substring(1);
        if (key) dbKeys.add(key);
      } catch {
        if (url) dbKeys.add(url);
      }
    };

    catalogResult.rows.forEach(row => extractKey(row.image_url as string));
    productImagesResult.rows.forEach(row => extractKey(row.image_url as string));

    console.log(` Imágenes en BD: ${dbKeys.size}`);

    const r2Keys: string[] = [];
    let continuationToken: string | undefined;

    do {
      const response = await R2.send(new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        ContinuationToken: continuationToken,
      }));

      if (response.Contents) {
        response.Contents.forEach(obj => {
          if (obj.Key) r2Keys.push(obj.Key);
        });
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    console.log(`📦 Archivos en R2: ${r2Keys.length}`);

    const orphans = r2Keys.filter(key => !dbKeys.has(key));

    console.log(`🗑️ Imágenes huérfanas: ${orphans.length}`);

    return NextResponse.json({
      success: true,
      orphans,
      totalR2: r2Keys.length,
      totalDB: dbKeys.size,
      totalOrphans: orphans.length
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}