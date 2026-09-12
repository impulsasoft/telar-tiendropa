import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalOrders, totalCustomers, orders, products] = await Promise.all([
    prisma.order.count(),
    prisma.customer.count(),
    prisma.order.findMany({ select: { total: true, createdAt: true, status: true } }),
    prisma.product.count(),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelado")
    .reduce((sum, o) => sum + o.total, 0);

  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Sales last 7 days
  const today = new Date();
  const salesByDay = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const label = date.toLocaleDateString("es-PE", { weekday: "short" });
    const dayOrders = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d.toDateString() === date.toDateString() && o.status !== "Cancelado";
    });
    const sales = dayOrders.reduce((sum, o) => sum + o.total, 0);
    return { day: label, ventas: Math.round(sales) };
  });

  return NextResponse.json({ totalRevenue, totalOrders, totalCustomers, avgTicket, products, salesByDay });
}
