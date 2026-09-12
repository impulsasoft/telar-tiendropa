import Link from "next/link";
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Clock, Phone } from "lucide-react";

export const metadata = { title: "Política de Cambios y Devoluciones — TIENDROPA" };

export default function PoliticaCambios() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-600 transition-colors mb-8">
        <ArrowLeft size={14} /> Volver al inicio
      </Link>

      <div className="mb-10">
        <div className="w-14 h-14 bg-gradient-to-br from-brand-100 to-accent-100 rounded-2xl flex items-center justify-center mb-4">
          <RotateCcw size={24} className="text-brand-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Política de Cambios y Devoluciones</h1>
        <p className="text-gray-400 mt-2 text-sm">Última actualización: Junio 2026</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8">

        {/* Plazo */}
        <section className="bg-brand-50 border border-brand-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock size={20} className="text-brand-600" />
            <h2 className="text-lg font-black text-gray-900 m-0">Plazo para solicitar cambio</h2>
          </div>
          <p className="text-gray-700">Tienes <strong>30 días calendario</strong> desde la fecha de entrega para solicitar un cambio o devolución. Pasado este plazo, no podremos aceptar cambios.</p>
        </section>

        {/* Aceptamos */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={20} className="text-green-500" />
            <h2 className="text-xl font-black text-gray-900 m-0">Aceptamos cambios cuando:</h2>
          </div>
          <ul className="space-y-3">
            {[
              "El producto llegó defectuoso o dañado durante el envío",
              "Recibiste un producto diferente al que pediste",
              "La talla no es la correcta (según nuestra guía de tallas)",
              "El producto presenta fallas de fabricación",
              "El pedido llegó incompleto",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* No aceptamos */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={20} className="text-red-400" />
            <h2 className="text-xl font-black text-gray-900 m-0">No aceptamos cambios cuando:</h2>
          </div>
          <ul className="space-y-3">
            {[
              "El producto fue usado, lavado o alterado",
              "Han pasado más de 30 días desde la entrega",
              "El producto no tiene sus etiquetas originales",
              "El producto fue comprado en promoción o descuento especial (salvo defecto de fabricación)",
              "La solicitud no viene acompañada del comprobante de compra",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Proceso */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">¿Cómo solicitar un cambio?</h2>
          <div className="space-y-3">
            {[
              { step: "1", title: "Contáctanos", desc: "Escríbenos por WhatsApp al 987 654 321 o al correo hola@tiendropa.com dentro de los 30 días." },
              { step: "2", title: "Adjunta fotos", desc: "Envíanos fotos del producto con el problema y tu número de pedido." },
              { step: "3", title: "Aprobación", desc: "En un plazo de 24-48 horas te confirmamos si el cambio procede." },
              { step: "4", title: "Envío", desc: "Coordinaremos el recojo del producto o te indicaremos cómo enviarlo. El costo de envío de cambio es cubierto por TIENDROPA si fue nuestro error." },
              { step: "5", title: "Entrega del cambio", desc: "Una vez recibido y verificado el producto, enviamos el cambio en 3-5 días hábiles." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 text-white font-black text-sm flex items-center justify-center shrink-0">{step}</div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex-1">
                  <p className="font-bold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contacto */}
        <section className="bg-gradient-to-r from-brand-50 to-accent-50 border border-brand-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Phone size={18} className="text-brand-600" />
            <h2 className="text-lg font-black text-gray-900 m-0">¿Tienes dudas?</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">Nuestro equipo está disponible de Lunes a Sábado de 9am a 7pm para ayudarte.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="https://wa.me/51987654321" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors">
              WhatsApp: 987 654 321
            </a>
            <a href="mailto:hola@tiendropa.com"
              className="flex items-center justify-center gap-2 border border-brand-200 text-brand-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-50 transition-colors">
              hola@tiendropa.com
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
