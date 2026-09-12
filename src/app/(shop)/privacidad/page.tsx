import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = { title: "Política de Privacidad — TIENDROPA" };

const sections = [
  {
    title: "1. Información que recopilamos",
    content: `Al realizar una compra en TIENDROPA, recopilamos la información necesaria para procesar tu pedido: nombre completo, correo electrónico, número de teléfono y dirección de entrega. Esta información es proporcionada directamente por ti durante el proceso de compra.`,
  },
  {
    title: "2. Uso de tu información",
    content: `Usamos tu información exclusivamente para: (a) procesar y entregar tu pedido; (b) enviarte confirmaciones y actualizaciones de tu pedido; (c) responder tus consultas; (d) mejorar nuestros servicios. No vendemos, alquilamos ni compartimos tu información con terceros para fines de marketing.`,
  },
  {
    title: "3. Seguridad de los datos",
    content: `Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, pérdida o divulgación. Toda comunicación se realiza mediante conexiones HTTPS cifradas.`,
  },
  {
    title: "4. Pagos",
    content: `Los pagos se procesan a través de transferencias bancarias (BCP), Yape o Plin. No almacenamos datos de tarjetas de crédito/débito en nuestros servidores. Los comprobantes de pago (vouchers) que compartes son usados únicamente para verificar tu transacción.`,
  },
  {
    title: "5. Cookies",
    content: `Usamos cookies esenciales para mantener tu sesión de compra y el contenido de tu carrito. No usamos cookies de rastreo de terceros para publicidad. Puedes desactivar las cookies en tu navegador, aunque esto puede afectar la funcionalidad de la tienda.`,
  },
  {
    title: "6. Tus derechos (Ley N° 29733 - LPDP Perú)",
    content: `De acuerdo con la Ley de Protección de Datos Personales del Perú, tienes derecho a: (a) acceder a tus datos personales que tenemos; (b) rectificar datos incorrectos; (c) cancelar o eliminar tus datos de nuestra base de datos; (d) oponerte al tratamiento de tus datos. Para ejercer estos derechos, contáctanos en hola@tiendropa.com.`,
  },
  {
    title: "7. Retención de datos",
    content: `Conservamos tu información de pedidos por un período de 5 años por obligaciones contables y legales. Puedes solicitar la eliminación de tus datos de marketing en cualquier momento.`,
  },
  {
    title: "8. Cambios a esta política",
    content: `Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos por correo electrónico o mediante un aviso destacado en nuestra tienda.`,
  },
  {
    title: "9. Contacto",
    content: `Para consultas sobre privacidad: hola@tiendropa.com · +51 987 654 321 · Jr. La Moda 456, Miraflores, Lima, Perú.`,
  },
];

export default function Privacidad() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-600 transition-colors mb-8">
        <ArrowLeft size={14} /> Volver al inicio
      </Link>

      <div className="mb-10">
        <div className="w-14 h-14 bg-gradient-to-br from-brand-100 to-accent-100 rounded-2xl flex items-center justify-center mb-4">
          <Shield size={24} className="text-brand-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Política de Privacidad</h1>
        <p className="text-gray-400 mt-2 text-sm">Última actualización: Junio 2026 · En cumplimiento de la Ley N° 29733 (LPDP - Perú)</p>
      </div>

      <div className="space-y-6">
        {sections.map(({ title, content }) => (
          <section key={title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-black text-gray-900 text-base mb-3">{title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
          </section>
        ))}
      </div>

      <div className="mt-8 bg-brand-50 border border-brand-100 rounded-2xl p-5 text-center">
        <p className="text-sm text-brand-700 font-medium">¿Tienes preguntas sobre tu privacidad?</p>
        <a href="mailto:hola@tiendropa.com" className="text-brand-600 font-bold text-sm hover:underline">hola@tiendropa.com</a>
      </div>
    </div>
  );
}
