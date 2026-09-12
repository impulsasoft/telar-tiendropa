import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();
  if (!code) return NextResponse.json({ error: "Código requerido" }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({ where: { code: String(code).toUpperCase().trim() } });

  if (!coupon) return NextResponse.json({ error: "Cupón no válido" }, { status: 404 });
  if (!coupon.active) return NextResponse.json({ error: "Este cupón está inactivo" }, { status: 400 });
  if (coupon.expiresAt && new Date() > coupon.expiresAt)
    return NextResponse.json({ error: "Este cupón ha expirado" }, { status: 400 });
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses)
    return NextResponse.json({ error: "Este cupón ya alcanzó su límite de usos" }, { status: 400 });
  if (subtotal < coupon.minOrder)
    return NextResponse.json({ error: `Mínimo S/ ${coupon.minOrder.toFixed(2)} para usar este cupón` }, { status: 400 });

  const discountAmount = coupon.type === "percent"
    ? (subtotal * coupon.discount) / 100
    : Math.min(coupon.discount, subtotal);

  return NextResponse.json({
    valid: true,
    coupon: { id: coupon.id, code: coupon.code, type: coupon.type, discount: coupon.discount },
    discountAmount: Math.round(discountAmount * 100) / 100,
  });
}
