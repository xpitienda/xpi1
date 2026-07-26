import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se recibieron archivos' }, { status: 400 });
    }

    const uploadedUrls = [];

    for (const file of files) {
      if (!(file instanceof File) || file.size === 0) continue;

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `${randomUUID()}-${cleanName}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type,
      }));

      const baseUrl = process.env.R2_PUBLIC_URL!.startsWith('http')
        ? process.env.R2_PUBLIC_URL
        : `https://${process.env.R2_PUBLIC_URL}`;
      
      const publicUrl = `${baseUrl}/${fileName}`;

      uploadedUrls.push({
        url: publicUrl,
        originalName: file.name
      });
    }

    return NextResponse.json({ 
      success: true, 
      urls: uploadedUrls,
      count: uploadedUrls.length 
    });

  } catch (error: any) {
    console.error('Error en batch upload:', error);
    return NextResponse.json({ error: 'Error al subir: ' + error.message }, { status: 500 });
  }
}