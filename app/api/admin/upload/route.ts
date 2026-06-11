import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Generar nombre único
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${randomStr}.${extension}`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }));

    // URL PÚBLICA desde .env
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
    
    console.log('✅ Imagen subida:', publicUrl);
    console.log('📦 Nombre del archivo:', fileName);
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      message: 'Imagen subida correctamente' 
    });
  } catch (error: any) {
    console.error('❌ Error al subir:', error);
    return NextResponse.json({ 
      error: 'Error al subir archivo: ' + error.message 
    }, { status: 500 });
  }
}