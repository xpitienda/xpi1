require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');
const { randomUUID } = require('crypto');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function insertMockSales() {
  try {
    console.log('Insertando ventas de prueba...');
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 2); // Hace 2 días (para probar la tendencia semanal)

    const mockSales = [
      {
        id: randomUUID(),
        invoice_number: 'F-001-WEB',
        seller_name: 'Carrito/Web',
        customer_name: 'Juan Pérez',
        customer_phone: '3001234567',
        items: JSON.stringify([{ name: 'Tenis de Marca (1)', quantity: 1, price: 150000 }]),
        total_amount: 150000,
        sale_type: 'cart',
        status: 'Entregado',
        created_at: yesterday.toISOString()
      },
      {
        id: randomUUID(),
        invoice_number: 'F-002-VEND',
        seller_name: 'Vendedor 1', // Cambia esto por el nombre real de tu vendedor si lo sabes
        customer_name: 'María Gómez',
        customer_phone: '3109876543',
        items: JSON.stringify([{ name: 'Tenis de Marca (2)', quantity: 2, price: 175000 }]),
        total_amount: 350000,
        sale_type: 'seller',
        status: 'Enviado',
        created_at: today.toISOString()
      },
      {
        id: randomUUID(),
        invoice_number: 'F-003-VEND',
        seller_name: 'Vendedor 2', // Cambia esto por el nombre real de tu segundo vendedor
        customer_name: 'Carlos López',
        customer_phone: '3205554433',
        items: JSON.stringify([{ name: 'Tenis de Marca (8)', quantity: 1, price: 175000 }]),
        total_amount: 175000,
        sale_type: 'seller',
        status: 'Pendiente',
        created_at: today.toISOString()
      }
    ];

    for (const sale of mockSales) {
      await turso.execute({
        sql: `INSERT INTO sales (id, invoice_number, seller_name, customer_name, customer_phone, items, total_amount, sale_type, status, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          sale.id, sale.invoice_number, sale.seller_name, sale.customer_name, 
          sale.customer_phone, sale.items, sale.total_amount, sale.sale_type, 
          sale.status, sale.created_at
        ]
      });
    }

    console.log('✅ 3 ventas de prueba insertadas correctamente.');
    console.log('   - 1 venta del Carrito/Web');
    console.log('   - 2 ventas de Vendedores');
    
  } catch (error) {
    console.error('❌ Error insertando datos:', error.message);
  }
  
  await turso.close();
}

insertMockSales();
