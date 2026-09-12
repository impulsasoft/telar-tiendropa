"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Phone, MapPin, Clock,
  Send, CheckCircle, MessageCircle, Loader2,
} from "lucide-react";
import { inputCls, labelCls, btnPrimaryCls } from "@/components/ui/FormField";

const SUBJECTS = [
  "Consulta sobre un producto",
  "Estado de mi pedido",
  "Cambio o devolución",
  "Problema con mi pago",
  "Guía de tallas",
  "Otro",
];

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: "WhatsApp / Teléfono",
    value: "+51 987 654 321",
    href: "https://wa.me/51987654321",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Mail,
    label: "Correo electrónico",
    value: "hola@telar.pe",
    href: "mailto:hola@telar.pe",
    color: "bg-brand-50 text-brand-600",
  },
  {
    icon: MapPin,
    label: "Dirección",
    value: "Jr. La Moda 456, Miraflores, Lima",
    href: null,
    color: "bg-accent-50 text-accent-600",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun–Sáb 9am–7pm · Dom 10am–3pm",
    href: null,
    color: "bg-amber-50 text-amber-600",
  },
];

export default function Contacto() {
  const [form, setForm]   = useState({ name:"", email:"", subject:"", message:"" });
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name:"", email:"", subject:"", message:"" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/60">

      {/* ── HERO — más alto en mobile ── */}
      <div className="relative overflow-hidden py-16 sm:py-14 px-4 text-white"
        style={{ background:"linear-gradient(135deg,#4A0E6E,#7C2D9E 50%,#C9267A)" }}>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage:"radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize:"28px 28px" }} />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-25"
          style={{ background:"radial-gradient(circle,#E879F9,transparent)" }} />
        <div className="relative max-w-2xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-6">
            <ArrowLeft size={14} /> Volver al inicio
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">Contáctanos</h1>
          <p className="text-brand-100 text-base sm:text-lg max-w-lg mx-auto">
            Estamos aquí para ayudarte. Escríbenos y te respondemos en menos de 24 horas.
          </p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-start">

          {/* ── SIDEBAR INFO ── */}
          <aside className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-black text-gray-900 mb-1">Información de contacto</h2>
            <p className="text-sm text-gray-500 mb-4">Elige la forma que más te convenga.</p>

            {CONTACT_ITEMS.map(({ icon: Icon, label, value, href, color }) => (
              <div key={label}
                className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-800 font-semibold hover:text-brand-700 transition-colors break-all">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-700">{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a href="https://wa.me/51987654321?text=Hola%2C%20tengo%20una%20consulta%20sobre%20TELAR"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-5 rounded-2xl transition-all hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5">
              <MessageCircle size={18} />
              Chatear por WhatsApp
            </a>
          </aside>

          {/* ── FORMULARIO ── */}
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div key="success"
                  initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                  className="flex flex-col items-center justify-center text-center py-16 px-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">¡Mensaje enviado!</h3>
                  <p className="text-gray-500 text-sm max-w-xs mb-6">
                    Te responderemos en menos de 24 horas a tu correo electrónico.
                  </p>
                  <button onClick={() => setStatus("idle")}
                    className="text-sm font-semibold text-brand-700 hover:underline">
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                  {/* Form header */}
                  <div className="px-6 sm:px-8 pt-8 pb-5 border-b border-gray-50">
                    <h2 className="text-xl font-black text-gray-900">Envíanos un mensaje</h2>
                    <p className="text-gray-400 text-sm mt-1">Todos los campos marcados con * son requeridos.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-8 space-y-6">

                    {/* Nombre + Email — 2 cols en sm+ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className={labelCls}>Nombre *</label>
                        <input required value={form.name} onChange={set("name")}
                          placeholder="Tu nombre completo"
                          className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Email *</label>
                        <input required type="email" value={form.email} onChange={set("email")}
                          placeholder="tu@email.com"
                          className={inputCls} />
                      </div>
                    </div>

                    {/* Asunto */}
                    <div>
                      <label className={labelCls}>Asunto *</label>
                      <select required value={form.subject} onChange={set("subject")}
                        className={`${inputCls} cursor-pointer appearance-none`}
                        style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 1rem center" }}>
                        <option value="">Selecciona un asunto…</option>
                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Mensaje */}
                    <div>
                      <label className={labelCls}>Mensaje *</label>
                      <textarea required rows={6} value={form.message} onChange={set("message")}
                        placeholder="Cuéntanos en qué podemos ayudarte…"
                        className={`${inputCls} resize-none`} />
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {status === "error" && (
                        <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                          className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                          Hubo un error al enviar. Intenta de nuevo o contáctanos por WhatsApp.
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button type="submit" disabled={status==="sending"}
                      className={btnPrimaryCls}
                      style={{ background:"linear-gradient(135deg,#7C2D9E,#C9267A)", boxShadow:"0 6px 24px rgba(124,45,158,0.25)" }}>
                      {status === "sending"
                        ? <><Loader2 size={17} className="animate-spin" /> Enviando…</>
                        : <><Send size={17} /> Enviar mensaje</>
                      }
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
