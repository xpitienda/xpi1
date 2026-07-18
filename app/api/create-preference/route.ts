import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { items, customer } = await request.json();

    console.log('🔵 [MercadoPago] Creando preferencia...');
    console.log('Items:', items);
    console.log('Customer:', customer);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No hay productos en el carrito' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const body = {
      items: items.map((item: any) => ({
        title: item.name,
        quantity: Number(item.quantity),
        unit_price: Number(item.price),
        currency_id: 'COP',
      })),
      back_urls: {
        success: `${appUrl}/payment/success`,
        failure: `${appUrl}/catalog`,
        pending: `${appUrl}/catalog`,
      },
      auto_return: 'approved',
      external_reference: `XPI-ORDER-${Date.now()}`,
      notification_url: `${appUrl}/api/payment/webhook`,
      payer: {
        name: customer.name?.split(' ')[0] || 'Cliente',
        surname: customer.name?.split(' ').slice(1).join(' ') || 'XPI',
        email: customer.email || customer.phone + '@ejemplo.com',
        phone: {
          area_code: '57',
          number: customer.phone?.replace(/\D/g, '') || '3000000000',
        },
      },
    };

    console.log('🔵 [MercadoPago] Body de la preferencia:', JSON.stringify(body, null, 2));

    const preference = new Preference(client);
    const response = await preference.create({ body });

    console.log('✅ [MercadoPago] Preferencia creada:', response.id);
    console.log('🔗 [MercadoPago] URL de pago:', response.init_point);

    return NextResponse.json({ 
      init_point: response.init_point,
      preference_id: response.id
    });

  } catch (error: any) {
    console.error('❌ [MercadoPago] Error creando preferencia:', error);
    console.error('❌ Detalles:', error.message);
    console.error('❌ Response:', error.response);
    
    return NextResponse.json({ 
      error: 'Error al crear preferencia de pago',
      details: error.message,
      statusCode: error.response?.status
    }, { status: 500 });
  }
}