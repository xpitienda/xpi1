import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { imageUrl, productName } = await request.json();

    console.log('🎨 Generando variaciones con Pollinations (Modo Temporal) para:', productName);

    if (!imageUrl) {
      return NextResponse.json({ error: 'Se requiere una imagen' }, { status: 400 });
    }

    // Pollinations.ai - 100% gratis, sin token, sin errores de DNS
    const seeds = [42, 123, 456, 789, 101112];
    const prompts = [
      `professional product photography of ${productName}, black color variant, white background, studio lighting, high quality`,
      `professional product photography of ${productName}, brown leather variant, clean background, commercial photo`,
      `professional product photography of ${productName}, red burgundy variant, neutral background`,
      `professional product photography of ${productName}, side angle view, white background`,
      `lifestyle photo of ${productName}, natural lighting, urban setting`
    ];

    const images = [];
    
    for (let i = 0; i < seeds.length; i++) {
      console.log(`\n🔄 Generando variación ${i + 1}/5...`);
      
      try {
        const encodedPrompt = encodeURIComponent(prompts[i]);
        const pollinationUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seeds[i]}&model=flux&nologo=true`;
        
        const response = await fetch(pollinationUrl);
        
        if (!response.ok) {
          console.error(`❌ Error descargando variación ${i + 1}`);
          continue;
        }
        
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUrl = `data:image/png;base64,${base64}`;
        
        images.push(dataUrl);
        console.log(`✅ Variación ${i + 1} generada`);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (err) {
        console.error(`❌ Error en variación ${i + 1}:`, err);
        continue;
      }
    }

    if (images.length === 0) {
      return NextResponse.json({ error: 'No se pudieron generar imágenes.' }, { status: 500 });
    }

    console.log(`\n✅ Éxito: ${images.length} variaciones generadas`);

    return NextResponse.json({ 
      success: true, 
      images: images,
      count: images.length
    });

  } catch (error) {
    console.error('❌ Error general:', error);
    // ✅ CORRECCIÓN: Verificar si es instancia de Error
    const errorMessage = error instanceof Error ? error.message : 'Error al generar imágenes';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
