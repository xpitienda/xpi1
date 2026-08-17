// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-aa262763875e4dc4ab1d8c212bad2fa0.r2.dev';
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderParam = formData.get('folder');
    
    const folder = folderParam !== null && folderParam !== undefined 
      ? folderParam.toString() 
      : 'products';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop();
    const key = folder ? `${folder}/${uuidv4()}.${ext}` : `${uuidv4()}.${ext}`;

    // Crear cliente S3 para R2
    const client = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID!,
        secretAccessKey: R2_SECRET_ACCESS_KEY!,
      },
    });

    // Subir archivo
    await client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));

    const url = `${R2_PUBLIC_URL}/${key}`;
    console.log(`✅ Imagen subida exitosamente a: ${url}`);
    
    return NextResponse.json({ success: true, url });

  } catch (error: any) {
    console.error("🔴 ERROR al subir imagen:", error.message);
    console.error('Error details:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}