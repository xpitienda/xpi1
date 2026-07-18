import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { items, customer } = await request.json();

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
        failure: `${appUrl}/catalog`,  // CAMBIADO: Ahora va al catálogo, no al carrito
        pending: `${appUrl}/catalog`,   // CAMBIADO
      },
      auto_return: 'approved',
      external_reference: `XPI-ORDER-${Date.now()}`,
      payment_methods: {
        excluded_payment_types: [],
        installments: 1,
      },
      additional_info: {
        ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
        items: items.map((item: any) => ({
          id: item.id || `item-${Date.now()}`,
          name: item.name,
          description: item.name,
          picture_url: item.image,
          quantity: Number(item.quantity),
          unit_price: Number(item.price),
        })),
      },
      payer: {
        name: customer.name?.split(' ')[0] || 'Cliente',
        surname: customer.name?.split(' ').slice(1).join(' ') || 'XPI',
        email: customer.email || 'cliente@ejemplo.com',
        phone: {
          area_code: '57',
          number: customer.phone?.replace(/\D/g, '') || '3000000000',
        },
        identification: {
          type: 'CC',
          number: '12345678',
        },
        address: {
          street_name: customer.address || 'Calle Principal',
          street_number: '123',
          zip_code: '110111',
        },
      },
    };

    const preference = new Preference(client);
    const response = await preference.create({ body });

    return NextResponse.json({ 
      init_point: response.init_point 
    });

  } catch (error: any) {
    console.error('Error creando preferencia MP:', error);
    return NextResponse.json({ 
      error: 'Error al crear preferencia de pago',
      details: error.message 
    }, { status: 500 });
  }
}