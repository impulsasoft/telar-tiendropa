import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId requerido" }, { status: 400 });
  const reviews = await prisma.review.findMany({
    where: { productId, approved: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const { productId, customerName, customerEmail, rating, comment } = await req.json();
  if (!productId || !customerName || !rating || !comment)
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  if (rating < 1 || rating > 5)
    return NextResponse.json({ error: "Rating debe ser 1-5" }, { status: 400 });
  const review = await prisma.review.create({
    data: { productId, customerName, customerEmail: customerEmail ?? "", rating: Number(rating), comment, approved: false },
  });
  return NextResponse.json(review);
}
