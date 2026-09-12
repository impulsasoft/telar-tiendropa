import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.toLowerCase().trim();
  const orderId = searchParams.get("orderId")?.trim();

  if (!email || !orderId) {
    return NextResponse.json({ error: "Email y ID de pedido requeridos" }, { status: 400 });
  }

  // Acepta ID completo o el código corto (últimos 8 caracteres)
  const cleanId = orderId.replace(/^#/, "").toUpperCase();
  const order = await prisma.order.findFirst({
    where: {
      customer: { email },
      OR: [
        { id: orderId },
        { id: { endsWith: cleanId } },
        { id: { endsWith: cleanId.toLowerCase() } },
      ],
    },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      items: {
        include: { product: { select: { name: true, image: true, category: true } } },
      },
      payments: { select: { method: true, status: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  return NextResponse.json(order);
}
