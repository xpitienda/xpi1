import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Falta filename o contentType' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}_${filename.replace(/\.[^/.]+$/, '')}.jpg`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFilename,
      ContentType: 'image/jpeg',
    });

    const signedUrl = await getSignedUrl(R2, command, { expiresIn: 300 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      uploadUrl: signedUrl,
      publicUrl: publicUrl,
      filename: uniqueFilename
    });

  } catch (error) {
    console.error('Error generando presigned URL:', error);
    return NextResponse.json(
      { error: 'Error generando URL de subida' },
      { status: 500 }
    );
  }
}