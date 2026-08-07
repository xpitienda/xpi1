import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const PROCESSED_DIR = path.join(UPLOADS_DIR, 'processed');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(PROCESSED_DIR)) fs.mkdirSync(PROCESSED_DIR, { recursive: true });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const watermarkText = (formData.get('watermark') as string) || 'XPI Tienda';
    const targetSize = parseInt((formData.get('size') as string) || '800', 10);

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se enviaron imágenes' },
        { status: 400 }
      );
    }

    const processed = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let image = sharp(buffer);
        
        image = image.resize(targetSize, targetSize, {
          fit: 'inside',
          withoutEnlargement: true
        });

        const svgWatermark = `
          <svg width="200" height="40">
            <rect width="200" height="40" fill="rgba(0,0,0,0.6)" rx="4"/>
            <text x="100" y="26" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="bold">
              ${watermarkText}
            </text>
          </svg>
        `;
        
        image = image.composite([
          {
            input: Buffer.from(svgWatermark),
            gravity: 'southeast'
          }
        ]);

        const outputBuffer = await image
          .jpeg({ quality: 85, mozjpeg: true })
          .toBuffer();

        // ✅ CAMBIO: Conservar nombre original
        const originalName = file.name.replace(/\.[^/.]+$/, '');
        const filename = `${originalName}.jpg`;
        const outputPath = path.join(PROCESSED_DIR, filename);

        fs.writeFileSync(outputPath, outputBuffer);

        processed.push({
          original: file.name,
          processed: filename,
          size: outputBuffer.length,
          originalSize: buffer.length,
          compression: Math.round((1 - outputBuffer.length / buffer.length) * 100)
        });

      } catch (err) {
        errors.push({ file: file.name, error: (err as Error).message });
      }
    }

    return NextResponse.json({
      success: true,
      total: files.length,
      processed: processed.length,
      errors: errors.length,
      data: processed,
      errorDetails: errors
    });

  } catch (error) {
    console.error('Error procesando imágenes:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}