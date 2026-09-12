import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number; size?: string }[];
  total: number;
  shipping: number;
  paymentMethod: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const { orderId, customerName, customerEmail, items, total, shipping, paymentMethod } = data;
  const finalTotal = total + shipping;
  const shortId = orderId.slice(-8).toUpperCase();

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
          <strong style="color:#1a1a2e;">${item.name}</strong>
          ${item.size ? `<span style="color:#888;font-size:12px;"> · Talla ${item.size}</span>` : ""}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;color:#666;">x${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:bold;color:#1a1a2e;">S/ ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f8fc;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:580px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);border-radius:20px;padding:32px;text-align:center;margin-bottom:20px;">
      <h1 style="color:white;margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px;">TIENDROPA</h1>
      <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">Moda & Accesorios</p>
    </div>

    <!-- Mensaje principal -->
    <div style="background:white;border-radius:16px;padding:32px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:28px;">✓</span>
        </div>
        <h2 style="margin:0;color:#1a1a2e;font-size:22px;">¡Pedido confirmado, ${customerName.split(" ")[0]}!</h2>
        <p style="color:#888;margin:8px 0 0;font-size:14px;">Recibimos tu pedido y lo estamos verificando.</p>
      </div>

      <div style="background:#f8f4ff;border:1px solid #ede9fe;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
        <p style="margin:0;color:#7c3aed;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Número de pedido</p>
        <p style="margin:6px 0 0;color:#1a1a2e;font-size:24px;font-weight:900;font-family:monospace;">#${shortId}</p>
        <p style="margin:6px 0 0;color:#999;font-size:11px;">Guarda este número para hacer seguimiento</p>
      </div>

      <!-- Productos -->
      <h3 style="color:#1a1a2e;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px;">Productos</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${itemsHtml}
      </table>

      <!-- Totales -->
      <div style="margin-top:16px;padding-top:16px;">
        <div style="display:flex;justify-content:space-between;color:#666;font-size:14px;margin-bottom:6px;">
          <span>Subtotal</span><span>S/ ${total.toFixed(2)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;color:#666;font-size:14px;margin-bottom:12px;">
          <span>Envío</span><span style="color:${shipping === 0 ? "#10b981" : "#666"}">${shipping === 0 ? "¡Gratis!" : `S/ ${shipping.toFixed(2)}`}</span>
        </div>
        <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);border-radius:10px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;">
          <span style="color:white;font-weight:700;">Total pagado</span>
          <span style="color:white;font-size:20px;font-weight:900;">S/ ${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <!-- Pago -->
      <div style="margin-top:16px;padding:12px 16px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
        <p style="margin:0;color:#888;font-size:12px;">Método de pago</p>
        <p style="margin:4px 0 0;color:#1a1a2e;font-weight:700;">${paymentMethod}</p>
      </div>
    </div>

    <!-- Pasos siguientes -->
    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <h3 style="margin:0 0 16px;color:#1a1a2e;font-size:15px;font-weight:700;">¿Qué sigue?</h3>
      ${[
        ["🔍", "Verificación de pago", "Revisaremos tu voucher en las próximas 2 horas"],
        ["📦", "Preparación", "Preparamos tu pedido con mucho cuidado"],
        ["🚚", "Envío", "Te enviamos el código de seguimiento por WhatsApp"],
      ]
        .map(
          ([emoji, title, desc]) => `
        <div style="display:flex;gap:12px;margin-bottom:14px;align-items:flex-start;">
          <div style="width:36px;height:36px;background:#f8f4ff;border-radius:10px;display:flex;align-items:center;justify-content:center;shrink:0;font-size:18px;flex-shrink:0;">${emoji}</div>
          <div>
            <p style="margin:0;font-weight:700;color:#1a1a2e;font-size:14px;">${title}</p>
            <p style="margin:2px 0 0;color:#888;font-size:13px;">${desc}</p>
          </div>
        </div>`
        )
        .join("")}

      <div style="text-align:center;margin-top:20px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/seguimiento?email=${encodeURIComponent(customerEmail)}&orderId=${orderId}"
           style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);color:white;padding:12px 28px;border-radius:50px;font-weight:700;text-decoration:none;font-size:14px;">
          Seguir mi pedido →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:16px;">
      <p style="color:#aaa;font-size:12px;margin:0;">¿Preguntas? Escríbenos al <strong>987 654 321</strong></p>
      <p style="color:#aaa;font-size:11px;margin:6px 0 0;">© 2026 TIENDROPA · Lima, Perú</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"TIENDROPA" <${process.env.EMAIL_FROM}>`,
    to: customerEmail,
    subject: `✅ Pedido #${shortId} confirmado — TIENDROPA`,
    html,
  });
}

export async function sendNewOrderAdminEmail(data: OrderEmailData) {
  const shortId = data.orderId.slice(-8).toUpperCase();
  await transporter.sendMail({
    from: `"TIENDROPA Sistema" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL ?? process.env.EMAIL_FROM ?? "",
    subject: `🛒 Nuevo pedido #${shortId} de ${data.customerName}`,
    html: `<p>Nuevo pedido <strong>#${shortId}</strong> de <strong>${data.customerName}</strong> (${data.customerEmail}).</p>
           <p>Total: <strong>S/ ${(data.total + data.shipping).toFixed(2)}</strong> · Pago: ${data.paymentMethod}</p>
           <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/pedidos">Ver en el panel admin →</a>`,
  });
}
