import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { imageUrl, productName } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Se requiere una imagen' },
        { status: 400 }
      );
    }

    console.log(' Generando variaciones para:', productName);

    // Generar 5 prompts diferentes para crear variaciones
    const prompts = [
      `professional product photography of ${productName}, front view, studio lighting, white background, high quality, commercial photography, 4k`,
      `professional product photography of ${productName}, side angle view, soft lighting, clean background, detailed, e-commerce photo`,
      `professional product photography of ${productName}, top down view, overhead shot, studio setup, premium quality`,
      `lifestyle photo of ${productName}, in use, natural lighting, elegant setting, professional photography`,
      `close-up detail shot of ${productName}, macro photography, sharp focus, studio lighting, premium quality`
    ];

    // Generar las 5 imágenes usando Pollinations.ai (100% gratis)
    const images = [];
    
    for (let i = 0; i < prompts.length; i++) {
      const seed = Math.floor(Math.random() * 10000);
      const encodedPrompt = encodeURIComponent(prompts[i]);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`;
      images.push(imageUrl);
    }

    console.log('✅ Imágenes generadas:', images.length);

    return NextResponse.json({ 
      success: true, 
      images: images,
      count: images.length
    });

  } catch (error) {
    console.error('❌ Error generando imágenes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al generar imágenes' 
      },
      { status: 500 }
    );
  }
}
