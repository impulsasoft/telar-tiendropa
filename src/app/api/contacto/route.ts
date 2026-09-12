import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_FROM, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"TIENDROPA Contacto" <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `[Contacto] ${subject} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 24px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 20px;">📬 Nuevo mensaje de contacto</h1>
          </div>
          <div style="background: white; padding: 24px; border-radius: 10px; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 100px;">Nombre</td>
                <td style="padding: 8px 0; color: #111827; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #7c3aed;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Asunto</td>
                <td style="padding: 8px 0; color: #111827; font-weight: bold;">${subject}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 16px 0;" />
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px;">Mensaje:</p>
            <p style="color: #111827; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #9ca3af; font-size: 11px; text-align: center; margin-top: 16px;">
            Responde directamente a este correo para contactar a ${name} (${email})
          </p>
        </div>
      `,
    });

    // Auto-reply to customer
    await transporter.sendMail({
      from: `"TIENDROPA" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Recibimos tu mensaje — TIENDROPA",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 24px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">✨ TIENDROPA</h1>
          </div>
          <div style="background: white; padding: 24px; border-radius: 10px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin: 0 0 12px;">Hola, ${name} 👋</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              Recibimos tu mensaje sobre <strong>${subject}</strong>. Te responderemos en menos de 24 horas a este correo electrónico.
            </p>
            <p style="color: #6b7280; line-height: 1.6;">
              Si tu consulta es urgente, puedes contactarnos directamente por WhatsApp:
            </p>
            <a href="https://wa.me/51987654321" style="display: inline-block; background: #22c55e; color: white; font-weight: bold; padding: 12px 24px; border-radius: 10px; text-decoration: none; margin-top: 8px;">
              💬 WhatsApp: 987 654 321
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 11px; text-align: center; margin-top: 16px;">
            TIENDROPA — Moda & Accesorios · Lima, Perú
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en contacto:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
