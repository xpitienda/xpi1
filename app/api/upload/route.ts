// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { v4 as uuidv4 } from 'uuid';
import * as https from 'https';

export const maxDuration = 30; // 30 segundos por imagen

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// 1. OBLIGAMOS A QUE LAS VARIABLES EXISTAN
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // <-- CORREGIDO: Usar variable de entorno

export async function POST(request: Request) {
  try {
    // 2. VALIDACIÓN: Si faltan credenciales, fallamos antes de intentar subir
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
      console.error("🔴 FALTAN VARIABLES DE ENTORNO DE R2 EN VERCEL");
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta (Faltan credenciales R2)' }, 
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop();
    const key = `products/${uuidv4()}.${ext}`;

    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
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

    // 3. URL CORREGIDA: Usa la variable de entorno, no una fija
    const url = `${R2_PUBLIC_URL}/${key}`;

    console.log(`✅ Imagen subida exitosamente: ${url}`);
    return NextResponse.json({ success: true, url });

  } catch (error: any) {
    console.error("🔴 ERROR UPLOAD R2:", error.message);
    return NextResponse.json(
      { error: error.message || 'Error subiendo la imagen a R2' }, 
      { status: 500 }
    );
  }
}