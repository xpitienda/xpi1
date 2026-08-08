// app/api/admin/delete-by-category/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';

// Cliente R2
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
    const { category } = await request.json();

    if (!category) {
      return NextResponse.json(
        { error: 'Falta la categoría' },
        { status: 400 }
      );
    }

    // 1️ Obtener todos los productos de esa categoría
    const result = await turso.execute({
      sql: 'SELECT id, image_url FROM catalog WHERE category = ?',
      args: [category],
    });

    const productsToDelete = result.rows;

    if (productsToDelete.length === 0) {
      return NextResponse.json({
        message: 'No hay productos en esta categoría',
        productsDeleted: 0,
        imagesDeleted: 0
      });
    }

    // 2️⃣ Extraer las claves de las imágenes de R2
    const keysToDelete: { Key: string }[] = [];
    
    for (const product of productsToDelete) {
      const imageUrl = product.image_url as string;
      if (imageUrl) {
        try {
          const url = new URL(imageUrl);
          const key = url.pathname.substring(1); // quitar el / inicial
          if (key) {
            keysToDelete.push({ Key: key });
          }
        } catch (err) {
          console.warn(`⚠️ No se pudo parsear URL: ${imageUrl}`);
        }
      }
    }

    // 3️⃣ Borrar las imágenes de R2 (en lotes de 1000)
    let imagesDeleted = 0;
    if (keysToDelete.length > 0) {
      const batchSize = 1000;
      for (let i = 0; i < keysToDelete.length; i += batchSize) {
        const batch = keysToDelete.slice(i, i + batchSize);
        await R2.send(new DeleteObjectsCommand({
          Bucket: BUCKET_NAME,
          Delete: { Objects: batch },
        }));
        imagesDeleted += batch.length;
      }
      console.log(`✅ Eliminadas ${imagesDeleted} imágenes de R2`);
    }

    // 4️⃣ Borrar los productos de la base de datos
    await turso.execute({
      sql: 'DELETE FROM catalog WHERE category = ?',
      args: [category],
    });

    return NextResponse.json({
      message: `Eliminados ${productsToDelete.length} productos de "${category}"`,
      productsDeleted: productsToDelete.length,
      imagesDeleted: imagesDeleted
    });

  } catch (error: any) {
    console.error('❌ Error eliminando por categoría:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}