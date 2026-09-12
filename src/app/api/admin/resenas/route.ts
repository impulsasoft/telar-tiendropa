import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true, image: true } } },
  });
  return NextResponse.json(reviews);
}
