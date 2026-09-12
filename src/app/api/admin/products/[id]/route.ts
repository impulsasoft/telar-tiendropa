import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  // Partial update: solo actualizamos los campos que vienen en el body
  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = String(body.name);
  if (body.description !== undefined) updateData.description = String(body.description);
  if (body.price !== undefined) updateData.price = Number(body.price);
  if (body.costPrice !== undefined) updateData.costPrice = Number(body.costPrice);
  if (body.image !== undefined) updateData.image = String(body.image);
  if (body.images !== undefined) {
    updateData.images = typeof body.images === "string" ? body.images : JSON.stringify(body.images ?? []);
  }
  if (body.category !== undefined) updateData.category = String(body.category);
  if (body.sizes !== undefined) {
    updateData.sizes = typeof body.sizes === "string" ? body.sizes : JSON.stringify(body.sizes ?? []);
  }
  if (body.stock !== undefined) updateData.stock = Number(body.stock);
  if (body.active !== undefined) updateData.active = Boolean(body.active);

  const product = await prisma.product.update({ where: { id }, data: updateData });
  return NextResponse.json(product);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.orderItem.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
