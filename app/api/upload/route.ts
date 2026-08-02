// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { v4 as uuidv4 } from 'uuid';
import * as https from 'https';

export const maxDuration = 60; // 60 segundos de tiempo límite

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // CAMBIO CLAVE: Obtenemos TODOS los archivos enviados bajo la clave 'files'
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron archivos' }, { status: 400 });
    }

    console.log(`📤 Iniciando subida de ${files.length} imágenes...`);

    const results: any[] = [];
    const errors: any[] = [];
    const batchSize = 10; // Procesamos de 10 en 10 para no saturar la conexión

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      console.log(`📦 Procesando lote ${Math.floor(i / batchSize) + 1} (${batch.length} imágenes)`);

      const batchPromises = batch.map(async (file) => {
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const ext = file.name.split('.').pop();
          const key = `products/${uuidv4()}.${ext}`;

          const client = new S3Client({
            region: 'auto',
            endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
              accessKeyId: R2_ACCESS_KEY_ID!,
              secretAccessKey: R2_SECRET_ACCESS_KEY!,
            },
            requestHandler: new NodeHttpHandler({ httpsAgent }),
          });

          await client.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
          }));

          const url = `https://pub-aa262763875e4dc4ab1d8c212bad2fa0.r2.dev/${key}`;
          return { name: file.name, url, success: true };
        } catch (error: any) {
          return { name: file.name, error: error.message, success: false };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(res => res.success ? results.push(res) : errors.push(res));
      
      // Pequeña pausa de 200ms entre lotes para estabilidad
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`✅ Finalizado: ${results.length} éxitos, ${errors.length} errores.`);
    return NextResponse.json({ success: true, results, errors, total: files.length });

  } catch (error: any) {
    console.error("🔴 ERROR GENERAL:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}