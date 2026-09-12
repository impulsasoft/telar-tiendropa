import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/email";
import { sendWhatsAppAdminNotification } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer, items, payment, total, shipping } = body;

  if (!customer?.name || !customer?.email || !items?.length) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Upsert customer
  const dbCustomer = await prisma.customer.upsert({
    where: { email: customer.email },
    update: {
      name: customer.name,
      phone: customer.phone ?? "",
      address: customer.address ?? "",
    },
    create: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? "",
      address: customer.address ?? "",
    },
  });

  // Crear el pedido con items
  const order = await prisma.order.create({
    data: {
      customerId: dbCustomer.id,
      total: Number(total) + Number(shipping ?? 0),
      status: "Pendiente",
      items: {
        create: items.map((item: { id: string; price: number; quantity: number; selectedSize?: string }) => ({
          productId: item.id,
          price: Number(item.price),
          quantity: Number(item.quantity),
          size: item.selectedSize ?? "",
        })),
      },
    },
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
  });

  // Crear registro de pago
  try {
    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: payment?.method ?? "No especificado",
        amount: order.total,
        reference: payment?.reference ?? "",
        status: "Pendiente verificación",
      },
    });
  } catch { /* no bloquear si falla */ }

  // Descontar stock
  await Promise.allSettled(
    items.map((item: { id: string; quantity: number }) =>
      prisma.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } },
      })
    )
  );

  // Notificaciones (sin bloquear la respuesta)
  const emailItems = order.items.map((i) => ({
    name: i.product.name,
    quantity: i.quantity,
    price: i.price,
    size: i.size || undefined,
  }));

  const notifData = {
    orderId: order.id,
    customerName: customer.name,
    customerEmail: customer.email,
    items: emailItems,
    total: Number(total),
    shipping: Number(shipping ?? 0),
    paymentMethod: payment?.method ?? "No especificado",
  };

  // Email al cliente + email admin + WhatsApp admin (en paralelo, sin await que bloquee)
  Promise.allSettled([
    sendOrderConfirmationEmail(notifData),
    sendNewOrderAdminEmail(notifData),
    sendWhatsAppAdminNotification({
      orderId: order.id,
      customerName: customer.name,
      total: Number(total) + Number(shipping ?? 0),
      paymentMethod: payment?.method ?? "No especificado",
    }),
  ]).catch(() => {});

  return NextResponse.json({ orderId: order.id, success: true });
}
