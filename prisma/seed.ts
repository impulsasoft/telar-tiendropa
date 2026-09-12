import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash("Admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@tiendropa.com" },
    update: {},
    create: { email: "admin@tiendropa.com", password: hashedPassword, name: "Administrador" },
  });

  // Products con costPrice
  const productData = [
    { name: "Vestido Floral Verano", description: "Vestido ligero con estampado floral, perfecto para el verano.", price: 89.9, costPrice: 42.0, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80", category: "Vestidos", sizes: '["XS","S","M","L","XL"]', stock: 25 },
    { name: "Jeans Skinny Clásico", description: "Jean de corte skinny, tela stretch de alta calidad.", price: 119.9, costPrice: 55.0, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80", category: "Pantalones", sizes: '["28","30","32","34","36"]', stock: 30 },
    { name: "Blusa Elegante Blanca", description: "Blusa de manga larga ideal para ocasiones formales.", price: 65.0, costPrice: 28.0, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&q=80", category: "Blusas", sizes: '["XS","S","M","L"]', stock: 20 },
    { name: "Bolso Cuero Marrón", description: "Bolso de cuero genuino con múltiples compartimentos.", price: 149.9, costPrice: 75.0, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", category: "Accesorios", sizes: "[]", stock: 15 },
    { name: "Chaqueta Denim Vintage", description: "Chaqueta denim estilo vintage con detalles desgastados.", price: 135.0, costPrice: 62.0, image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&q=80", category: "Chaquetas", sizes: '["S","M","L","XL"]', stock: 18 },
    { name: "Collar Dorado Minimalista", description: "Collar delicado chapado en oro de 18k.", price: 45.0, costPrice: 12.0, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80", category: "Accesorios", sizes: "[]", stock: 50 },
    { name: "Falda Midi Plisada", description: "Falda midi plisada de tela satinada, muy elegante.", price: 79.9, costPrice: 35.0, image: "https://images.unsplash.com/photo-1551163943-3f7353e8dbd2?w=500&q=80", category: "Faldas", sizes: '["XS","S","M","L","XL"]', stock: 22 },
    { name: "Zapatillas Blancas Urbanas", description: "Zapatillas urbanas blancas, cómodas y versátiles.", price: 99.9, costPrice: 48.0, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", category: "Calzado", sizes: '["36","37","38","39","40","41"]', stock: 35 },
  ];

  // Limpiar y reinsertar productos
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();

  const products = await Promise.all(
    productData.map((p) => prisma.product.create({ data: p }))
  );

  // Customers
  const customers = await Promise.all([
    prisma.customer.create({ data: { name: "Ana García", email: "ana@gmail.com", phone: "987654321" } }),
    prisma.customer.create({ data: { name: "Lucía Martínez", email: "lucia@gmail.com", phone: "998877665" } }),
    prisma.customer.create({ data: { name: "Sofía Torres", email: "sofia@gmail.com", phone: "912345678" } }),
    prisma.customer.create({ data: { name: "María López", email: "maria@gmail.com", phone: "945123456" } }),
    prisma.customer.create({ data: { name: "Carmen Ruiz", email: "carmen@gmail.com", phone: "976543210" } }),
  ]);

  // Orders con items
  const statuses = ["Pendiente", "Enviado", "Entregado", "Entregado", "Entregado"];
  const days = [0, 1, 2, 3, 5];

  for (let i = 0; i < customers.length; i++) {
    const prod1 = products[i % products.length];
    const prod2 = products[(i + 2) % products.length];
    const date = new Date();
    date.setDate(date.getDate() - days[i]);

    await prisma.order.create({
      data: {
        customerId: customers[i].id,
        status: statuses[i],
        total: prod1.price + prod2.price * 2,
        createdAt: date,
        items: {
          create: [
            { productId: prod1.id, quantity: 1, price: prod1.price, size: "M" },
            { productId: prod2.id, quantity: 2, price: prod2.price, size: "S" },
          ],
        },
      },
    });
  }

  console.log("✅ Seed completado: admin, 8 productos con costPrice, 5 clientes, 5 pedidos");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
