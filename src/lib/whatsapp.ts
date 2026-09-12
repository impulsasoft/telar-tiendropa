// Notificación WhatsApp al admin via CallMeBot (gratis, sin cuenta business)
// Setup: el admin debe enviar "I allow callmebot to send me messages" al +34 644 59 78 09
// y recibirá su apikey. Luego poner WHATSAPP_ADMIN_NUMBER y WHATSAPP_APIKEY en .env.local

export async function sendWhatsAppAdminNotification({
  orderId,
  customerName,
  total,
  paymentMethod,
}: {
  orderId: string;
  customerName: string;
  total: number;
  paymentMethod: string;
}) {
  const phone = process.env.WHATSAPP_ADMIN_NUMBER;
  const apikey = process.env.WHATSAPP_APIKEY;

  if (!phone || !apikey) return; // sin config, omitir silenciosamente

  const shortId = orderId.slice(-8).toUpperCase();
  const msg = encodeURIComponent(
    `🛒 *NUEVO PEDIDO* #${shortId}\n👤 Cliente: ${customerName}\n💰 Total: S/ ${total.toFixed(2)}\n💳 Pago: ${paymentMethod}\n\n👉 Revisa el panel: ${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/pedidos`
  );

  try {
    await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${msg}&apikey=${apikey}`
    );
  } catch {
    // No bloquear el pedido si falla la notificación
  }
}
