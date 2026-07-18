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
        failure: `${appUrl}/catalog`,
        pending: `${appUrl}/catalog`,
      },
      auto_return: 'approved',
      external_reference: `XPI-ORDER-${Date.now()}`,
      payer: {
        name: customer.name?.split(' ')[0] || 'Cliente',
        surname: customer.name?.split(' ').slice(1).join(' ') || 'XPI',
        email: customer.email || 'cliente@ejemplo.com',
        phone: {
          area_code: '57',
          number: customer.phone?.replace(/\D/g, '') || '3000000000',
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