// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { v4 as uuidv4 } from 'uuid';
import * as https from 'https';

// Agente HTTPS que ignora certificados autofirmados (SOLO DESARROLLO)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const ext = file.name.split('.').pop();
    const key = `products/${uuidv4()}.${ext}`;

    // Crear cliente R2 con NodeHttpHandler personalizado
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID!,
        secretAccessKey: R2_SECRET_ACCESS_KEY!,
      },
      requestHandler: new NodeHttpHandler({
        httpsAgent: httpsAgent,
      }),
    });

    await client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));

    const url = `https://pub-aa262763875e4dc4ab1d8c212bad2fa0.r2.dev/${key}`;
    
    console.log(`✅ Imagen subida: ${url}`);
    return NextResponse.json({ success: true, url });

  } catch (error: any) {
    console.error("🔴 ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}