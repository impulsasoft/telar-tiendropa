import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const take = searchParams.get("take");

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
    ...(take ? { take: parseInt(take) } : {}),
  });

  return NextResponse.json(products);
}
