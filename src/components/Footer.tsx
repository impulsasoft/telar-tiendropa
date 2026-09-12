"use client";

import type { FC } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import TelarLogo from "@/components/TelarLogo";

const shopLinks = [
  { href: "/productos",               label: "Todos los productos" },
  { href: "/productos?cat=Vestidos",  label: "Vestidos"            },
  { href: "/productos?cat=Blusas",    label: "Blusas"              },
  { href: "/productos?cat=Faldas",    label: "Faldas"              },
  { href: "/productos?cat=Accesorios",label: "Accesorios"          },
  { href: "/productos?cat=Calzado",   label: "Calzado"             },
];

const infoLinks = [
  { href: "/nosotros",             label: "Sobre nosotros"     },
  { href: "/contacto",             label: "Contacto"           },
  { href: "/politica-de-cambios",  label: "Política de cambios"},
  { href: "/privacidad",           label: "Privacidad"         },
  { href: "/seguimiento",          label: "Seguir mi pedido"   },
];

export default function Footer() {
  return (
    <footer className="mt-20 sm:mt-16 bg-[#0A0412] text-gray-400 relative overflow-hidden">

      {/* Top gradient line — más gruesa */}
      <div className="absolute top-0 inset-x-0 h-[2px]"
        style={{ background: "linear-gradient(90deg,transparent,#7C2D9E 30%,#C9267A 70%,transparent)" }} />

      {/* Glow blobs */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle,#7C2D9E,transparent)" }} />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle,#C9267A,transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* ── NEWSLETTER STRIP ── */}
        <div className="py-10 border-b border-white/5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-black text-lg">Únete a nuestra comunidad</p>
              <p className="text-gray-500 text-sm mt-1">Recibe ofertas exclusivas y las últimas tendencias.</p>
            </div>
            <form className="flex gap-3 w-full lg:w-auto" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 lg:w-72 h-12 px-5 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
              <button type="submit"
                className="h-12 px-6 rounded-2xl font-bold text-sm text-white flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-900/30 shrink-0"
                style={{ background: "linear-gradient(135deg,#7C2D9E,#C9267A)" }}>
                Suscribirse <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* ── GRID PRINCIPAL ── */}
        {/* En desktop: brand (ancho), tienda, info, contacto */}
        <div className="pt-14 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 lg:gap-8">

          {/* ── Brand ── */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <TelarLogo size={42} />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              Moda fashion femenina con identidad. Diseños únicos para mujeres que marcan tendencia — envíos a todo el Perú.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {[
                { label:"Instagram", href:"#", icon: <span className="text-xs font-black">IG</span> },
                { label:"Facebook",  href:"#", icon: <span className="text-xs font-black">FB</span> },
                { label:"TikTok",    href:"#", icon: <span className="text-xs font-black">TK</span> },
              ].map(({ label, href, icon }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-accent-500/50 hover:bg-accent-500/10 transition-all duration-200">
                  {icon}
                </a>
              ))}
            </div>

            {/* Payment chips */}
            <div className="space-y-3">
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold">Métodos de pago</p>
              <div className="flex flex-wrap gap-2">
                {["Yape","Plin","Visa","Mastercard","BCP"].map(pm => (
                  <span key={pm}
                    className="text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    {pm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tienda ── */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="h-px w-6 shrink-0 rounded-full"
                style={{ background: "linear-gradient(90deg,#7C2D9E,#C9267A)" }} />
              Tienda
            </h4>
            <ul className="space-y-3.5">
              {shopLinks.map(l => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="text-sm text-gray-400 hover:text-accent-400 transition-colors flex items-center gap-2 group">
                    <span className="h-px w-0 group-hover:w-3 bg-accent-500 transition-all duration-200 rounded-full shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Información ── */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="h-px w-6 shrink-0 rounded-full"
                style={{ background: "linear-gradient(90deg,#7C2D9E,#C9267A)" }} />
              Información
            </h4>
            <ul className="space-y-3.5">
              {infoLinks.map(l => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="text-sm text-gray-400 hover:text-accent-400 transition-colors flex items-center gap-2 group">
                    <span className="h-px w-0 group-hover:w-3 bg-accent-500 transition-all duration-200 rounded-full shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contacto ── */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="h-px w-6 shrink-0 rounded-full"
                style={{ background: "linear-gradient(90deg,#7C2D9E,#C9267A)" }} />
              Contacto
            </h4>
            <ul className="space-y-4">
              {([
                { Icon: MapPin, label: "Dirección", value: "Jr. La Moda 456, Miraflores, Lima" },
                { Icon: Phone,  label: "Teléfono",  value: "+51 987 654 321", href: "tel:+51987654321" },
                { Icon: Mail,   label: "Email",     value: "hola@telar.pe",  href: "mailto:hola@telar.pe" },
                { Icon: Clock,  label: "Horario",   value: "Lun–Sáb  9am–7pm", extra: "Dom  10am–3pm" },
              ] as { Icon: FC<{size?:number;className?:string}>; label: string; value: string; href?: string; extra?: string }[]).map(({ Icon, label, value, href, extra }) => (
                <li key={label} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-white/5 border border-white/10">
                    <Icon size={15} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold mb-1">{label}</p>
                    {href
                      ? <a href={href} className="text-sm text-gray-400 hover:text-accent-400 transition-colors">{value}</a>
                      : <p className="text-sm text-gray-400">{value}</p>
                    }
                    {extra && <p className="text-xs text-gray-600 mt-0.5">{extra}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © 2026 <span className="text-gray-400 font-medium">TELAR</span>. Todos los derechos reservados.
            {" "}Hecho con <span className="text-accent-500">♥</span> en Perú.
          </p>
          <div className="flex items-center gap-6">
            {[
              { href: "/privacidad",          label: "Privacidad" },
              { href: "/politica-de-cambios", label: "Cambios"    },
              { href: "/nosotros",            label: "Nosotros"   },
            ].map(({ href, label }) => (
              <Link key={label} href={href} className="hover:text-gray-300 transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
