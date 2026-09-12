const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Admin user — email actualizado a telar
  const hashedPassword = await bcrypt.hash("Admin123", 10);
  await prisma.user.upsert({
    where:  { email: "admin@telar.pe" },
    update: { password: hashedPassword, name: "Administrador TELAR" },
    create: { email: "admin@telar.pe", password: hashedPassword, name: "Administrador TELAR" },
  });
  console.log("✅ Admin creado: admin@telar.pe / Admin123");

  const productData = [
    { name: "Vestido Floral Verano",     description: "Vestido ligero con estampado floral, perfecto para el verano.",      price: 89.9,  costPrice: 42.0, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80", category: "Vestidos",   sizes: '["XS","S","M","L","XL"]',     stock: 25 },
    { name: "Jeans Skinny Clásico",      description: "Jean de corte skinny, tela stretch de alta calidad.",                price: 119.9, costPrice: 55.0, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80", category: "Pantalones", sizes: '["28","30","32","34","36"]',      stock: 30 },
    { name: "Blusa Elegante Blanca",     description: "Blusa de manga larga ideal para ocasiones formales.",                price: 65.0,  costPrice: 28.0, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&q=80", category: "Blusas",     sizes: '["XS","S","M","L"]',          stock: 20 },
    { name: "Bolso Cuero Marrón",        description: "Bolso de cuero genuino con múltiples compartimentos.",               price: 149.9, costPrice: 75.0, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", category: "Accesorios", sizes: "[]",                          stock: 15 },
    { name: "Chaqueta Denim Vintage",    description: "Chaqueta denim estilo vintage con detalles desgastados.",            price: 135.0, costPrice: 62.0, image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&q=80", category: "Chaquetas",  sizes: '["S","M","L","XL"]',          stock: 18 },
    { name: "Collar Dorado Minimalista", description: "Collar delicado chapado en oro de 18k.",                            price: 45.0,  costPrice: 12.0, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80", category: "Accesorios", sizes: "[]",                          stock: 50 },
    { name: "Falda Midi Plisada",        description: "Falda midi plisada de tela satinada, muy elegante.",                price: 79.9,  costPrice: 35.0, image: "https://images.unsplash.com/photo-1551163943-3f7353e8dbd2?w=500&q=80", category: "Faldas",     sizes: '["XS","S","M","L","XL"]',    stock: 22 },
    { name: "Zapatillas Blancas Urbanas",description: "Zapatillas urbanas blancas, cómodas y versátiles.",                price: 99.9,  costPrice: 48.0, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", category: "Calzado",    sizes: '["36","37","38","39","40","41"]', stock: 35 },
    { name: "Vestido Negro Noche",       description: "Vestido negro elegante con escote en V, perfecto para eventos.",    price: 159.9, costPrice: 78.0, image: "https://images.unsplash.com/photo-1566479179817-c0b5a9ca1c64?w=500&q=80", category: "Vestidos",   sizes: '["XS","S","M","L","XL"]',    stock: 12 },
    { name: "Blusa Floral Primavera",    description: "Blusa con estampado floral, ligera y fresca para el día a día.",    price: 55.0,  costPrice: 22.0, image: "https://images.unsplash.com/photo-1485462537746-965f33f898f3?w=500&q=80", category: "Blusas",     sizes: '["XS","S","M","L","XL"]',    stock: 28 },
    { name: "Falda Plisada Rosa",        description: "Falda corta plisada en tono rosa pastel, muy versátil.",            price: 69.9,  costPrice: 30.0, image: "https://images.unsplash.com/photo-1583846717393-dc2412c95ed7?w=500&q=80", category: "Faldas",     sizes: '["XS","S","M","L"]',         stock: 20 },
    { name: "Cartera Pequeña Dorada",    description: "Cartera clutch dorada ideal para salidas nocturnas.",               price: 89.9,  costPrice: 38.0, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80", category: "Accesorios", sizes: "[]",                         stock: 18 },
  ];

  // Limpiar tablas en orden correcto (FK constraints)
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  console.log("🗑  Tablas limpiadas");

  const products = await Promise.all(
    productData.map((p) => prisma.product.create({ data: p }))
  );
  console.log(`📦  ${products.length} productos creados`);

  // Clientes demo
  const customers = await Promise.all([
    prisma.customer.create({ data: { name: "Ana García",    email: "ana@gmail.com",    phone: "987654321" } }),
    prisma.customer.create({ data: { name: "Lucía Martínez",email: "lucia@gmail.com",  phone: "998877665" } }),
    prisma.customer.create({ data: { name: "Sofía Torres",  email: "sofia@gmail.com",  phone: "912345678" } }),
    prisma.customer.create({ data: { name: "María López",   email: "maria@gmail.com",  phone: "945123456" } }),
    prisma.customer.create({ data: { name: "Carmen Ruiz",   email: "carmen@gmail.com", phone: "976543210" } }),
  ]);
  console.log(`👥  ${customers.length} clientes creados`);

  // Pedidos demo
  const statuses = ["Pendiente", "Procesando", "Enviado", "Entregado", "Entregado"];
  const days     = [0, 1, 3, 5, 8];
  const methods  = ["Yape", "Plin", "Visa", "Yape", "Mastercard"];

  for (let i = 0; i < customers.length; i++) {
    const prod1 = products[i % products.length];
    const prod2 = products[(i + 3) % products.length];
    const date  = new Date();
    date.setDate(date.getDate() - days[i]);
    const total = prod1.price + prod2.price * 2;

    const order = await prisma.order.create({
      data: {
        customerId: customers[i].id,
        status:     statuses[i],
        total,
        createdAt:  date,
        items: {
          create: [
            { productId: prod1.id, quantity: 1, price: prod1.price, size: "M" },
            { productId: prod2.id, quantity: 2, price: prod2.price, size: "S" },
          ],
        },
      },
    });

    await prisma.payment.create({
      data: {
        orderId:   order.id,
        method:    methods[i],
        amount:    total,
        reference: `REF-${Date.now()}-${i}`,
        status:    statuses[i] === "Pendiente" ? "Pendiente" : "Aprobado",
      },
    });
  }
  console.log(`🛒  ${customers.length} pedidos creados`);

  // Reseñas demo
  await Promise.all([
    prisma.review.create({ data: { productId: products[0].id, customerName: "Ana G.",   customerEmail: "ana@gmail.com",   rating: 5, comment: "¡Me encantó! La tela es suave y el color es precioso.", approved: true } }),
    prisma.review.create({ data: { productId: products[0].id, customerName: "Lucía M.", customerEmail: "lucia@gmail.com", rating: 4, comment: "Muy bonito vestido, llega justo a la talla.", approved: true } }),
    prisma.review.create({ data: { productId: products[2].id, customerName: "Sofía T.", customerEmail: "sofia@gmail.com", rating: 5, comment: "La blusa es exactamente como en la foto, excelente calidad.", approved: true } }),
    prisma.review.create({ data: { productId: products[4].id, customerName: "María L.", customerEmail: "maria@gmail.com", rating: 5, comment: "Perfecta para el invierno, muy abrigadora.", approved: true } }),
  ]);
  console.log("⭐  Reseñas creadas");

  console.log("\n✅ Seed completo — TELAR lista para usar");
  console.log("   Admin: admin@telar.pe / Admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
