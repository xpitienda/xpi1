// app/api/admin/backups/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

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
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Key requerida' }, { status: 400 });
    }

    const response = await R2.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));

    const body = response.Body;
    if (!body) {
      return NextResponse.json({ error: 'No se pudo leer el archivo' }, { status: 500 });
    }

    const stream = body as any;
    const chunks: Uint8Array[] = [];
    
    for await (const chunk of stream) {
      chunks.push(new Uint8Array(chunk));
    }
    
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));

    const fileName = key.split('/').pop() || 'backup.zip';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error descargando backup:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}