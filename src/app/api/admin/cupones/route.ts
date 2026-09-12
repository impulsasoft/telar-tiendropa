import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { code, type, discount, minOrder, maxUses, expiresAt } = await req.json();
  if (!code || !discount) return NextResponse.json({ error: "Código y descuento requeridos" }, { status: 400 });
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: String(code).toUpperCase().trim(),
        type: type ?? "percent",
        discount: Number(discount),
        minOrder: Number(minOrder ?? 0),
        maxUses: Number(maxUses ?? 0),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    return NextResponse.json(coupon);
  } catch {
    return NextResponse.json({ error: "Código ya existe" }, { status: 409 });
  }
}
