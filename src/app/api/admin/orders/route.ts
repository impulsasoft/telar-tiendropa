import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true, phone: true, address: true } },
      items: { include: { product: { select: { name: true, image: true } } } },
      payments: { select: { method: true, reference: true, status: true } },
    },
  });
  return NextResponse.json(orders);
}
