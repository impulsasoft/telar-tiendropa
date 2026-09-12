import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const { name, description, price, costPrice, image, images, category, sizes, stock, active } = body;

  if (!name || price === undefined || price === null || price === "") {
    return NextResponse.json({ error: "Nombre y precio son requeridos" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name: String(name),
      description: String(description ?? ""),
      price: Number(price),
      costPrice: Number(costPrice ?? 0),
      image: String(image ?? ""),
      images: typeof images === "string" ? images : JSON.stringify(images ?? []),
      category: String(category ?? ""),
      sizes: typeof sizes === "string" ? sizes : JSON.stringify(sizes ?? []),
      stock: Number(stock ?? 0),
      active: active !== false,
    },
  });
  return NextResponse.json(product);
}
