import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const [prods, orders, customers, first] = await Promise.all([
  p.product.count(),
  p.order.count(),
  p.customer.count(),
  p.product.findFirst({ select: { name: true, price: true, costPrice: true } })
]);
console.log(`✅ Productos: ${prods}, Pedidos: ${orders}, Clientes: ${customers}`);
console.log(`✅ Ejemplo: ${first?.name} → costo S/${first?.costPrice}, venta S/${first?.price}`);
await p.$disconnect();
