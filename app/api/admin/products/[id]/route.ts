import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Configuración de la base de datos
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Configuración de Cloudflare R2
const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, stock, category, image_url, is_active } = body;

    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({ error: 'Nombre, precio y stock son requeridos' }, { status: 400 });
    }

    await turso.execute({
      sql: "UPDATE catalog SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [
        name,
        description || null,
        Number(price),
        Number(stock),
        category || null,
        image_url || null,
        is_active !== undefined ? Number(is_active) : 1,
        id
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Producto actualizado',
      id,
      name,
      price: Number(price),
      stock: Number(stock),
      image_url: image_url || null
    });

  } catch (error: any) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json({ error: 'Error al actualizar: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    // 1️⃣ Obtener la URL de la imagen antes de borrar el producto
    const result = await turso.execute({
      sql: 'SELECT image_url FROM catalog WHERE id = ?',
      args: [id]
    });

    const product = result.rows[0];
    let r2Deleted = false;

    // 2️⃣ Si tiene imagen, extraer la clave y borrarla de R2
    if (product && product.image_url) {
      try {
        const url = new URL(product.image_url as string);
        const key = url.pathname.substring(1); // Quitar la '/' inicial del path
        
        if (key) {
          await R2.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key
          }));
          r2Deleted = true;
          console.log(`✅ Imagen eliminada de R2: ${key}`);
        }
      } catch (r2Error) {
        console.error('⚠️ Error eliminando imagen de R2 (se continuará con el borrado en DB):', r2Error);
      }
    }

    // 3️⃣ Borrar el producto de la base de datos
    await turso.execute({
      sql: 'DELETE FROM catalog WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Producto eliminado',
      imageDeletedFromR2: r2Deleted
    });

  } catch (error: any) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json({ error: 'Error al eliminar: ' + error.message }, { status: 500 });
  }
}