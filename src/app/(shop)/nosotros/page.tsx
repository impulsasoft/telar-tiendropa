import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Heart, Star, Truck, Shield, Users, Sparkles, MapPin, Clock } from "lucide-react";

export const metadata = { title: "Nosotros — TELAR" };

const VALUES = [
  { icon: Heart,    title: "Pasión",      desc: "Amamos la moda y eso se refleja en cada prenda que seleccionamos para ti.",  color: "from-accent-500 to-rose-500",    bg: "bg-accent-50",    txt: "text-accent-700"    },
  { icon: Star,     title: "Calidad",     desc: "Solo ofrecemos prendas que pasaron nuestra rigurosa revisión de calidad.",   color: "from-yellow-400 to-orange-500", bg: "bg-amber-50",   txt: "text-amber-700"   },
  { icon: Truck,    title: "Compromiso",  desc: "Tu pedido llega a tiempo y en perfectas condiciones, garantizado.",          color: "from-brand-500 to-brand-600", bg: "bg-brand-50",  txt: "text-brand-700"  },
  { icon: Shield,   title: "Confianza",   desc: "Compra segura, cambios y devoluciones sin complicaciones hasta 30 días.",    color: "from-green-500 to-emerald-600", bg: "bg-green-50",   txt: "text-green-700"   },
];

const STATS = [
  { num: "5+",   label: "Años en el mercado",      sub: "Desde 2020"          },
  { num: "200+", label: "Productos disponibles",   sub: "7 categorías"        },
  { num: "5K+",  label: "Clientas satisfechas",    sub: "⭐ 4.9 promedio"      },
  { num: "30",   label: "Días de garantía",        sub: "Sin preguntas"       },
];

const TEAM = [
  { name: "Valeria Torres",    role: "Fundadora & CEO",           img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" },
  { name: "Camila Ríos",       role: "Directora de Moda",         img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
  { name: "Sofía Mendoza",     role: "Atención al cliente",       img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { name: "Andrea Vásquez",    role: "Logística & Envíos",        img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&q=80" },
];

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO — ancho completo, altura generosa ── */}
      <div className="relative overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg,#0F0717 0%,#2D0845 45%,#7C2D9E 75%,#C9267A 100%)", minHeight: "420px" }}>

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize: "28px 28px" }} />
        {/* Blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle,#C9267A,transparent)" }} />
        <div className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle,#7C2D9E,transparent)" }} />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-28">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm mb-10">
            <ArrowLeft size={14} /> Volver al inicio
          </Link>

          {/* 2 cols en desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-accent-200 text-xs font-bold px-4 py-2 rounded-full mb-6"
                style={{ background: "rgba(201,38,122,0.2)", border: "1px solid rgba(201,38,122,0.35)" }}>
                <Sparkles size={12} /> Moda con propósito — Lima, Perú
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
                Somos <span style={{ background:"linear-gradient(90deg,#E879F9,#F472B6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>TELAR</span>
              </h1>
              <p className="text-brand-100 text-xl leading-relaxed max-w-lg">
                Tu destino de moda femenina en Perú. Diseños únicos para mujeres que no pasan desapercibidas.
              </p>
            </div>

            {/* Stats flotantes */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ num, label, sub }) => (
                <div key={label}
                  className="rounded-2xl p-6 text-center"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)" }}>
                  <p className="text-4xl font-black text-white mb-1">{num}</p>
                  <p className="text-brand-100 text-sm font-semibold leading-tight">{label}</p>
                  <p className="text-brand-300 text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── HISTORIA ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Imagen */}
          <div className="relative order-2 lg:order-1">
            <div className="relative h-[420px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl"
              style={{ boxShadow: "0 30px 80px rgba(124,45,158,0.2)" }}>
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                alt="Tienda TELAR" fill sizes="600px" className="object-cover"
              />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top,rgba(45,8,69,0.5) 0%,transparent 50%)" }} />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl px-6 py-4 border border-brand-100">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Fundada</p>
              <p className="text-2xl font-black" style={{ color: "#7C2D9E" }}>2020</p>
              <p className="text-xs text-gray-500 mt-0.5">Lima, Perú</p>
            </div>
          </div>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7C2D9E" }}>Nuestra historia</span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mt-3 mb-6 leading-tight">
              Nació de una pasión por la{" "}
              <span style={{ background:"linear-gradient(135deg,#7C2D9E,#C9267A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                moda
              </span>
            </h2>
            <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
              <p>
                TELAR nació en Lima en 2020 con una misión clara: hacer que la moda de calidad sea accesible para todas las peruanas.
                Empezamos con una pequeña colección de vestidos y hoy contamos con más de 200 productos en 7 categorías.
              </p>
              <p>
                Cada prenda pasa por una cuidadosa selección de calidad. Trabajamos directamente con fabricantes locales e internacionales
                para garantizar prendas que duran y que te hacen sentir única.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-2xl px-5 py-3">
                <MapPin size={16} style={{ color: "#7C2D9E" }} />
                <span className="text-sm font-semibold text-gray-700">Miraflores, Lima</span>
              </div>
              <div className="flex items-center gap-3 bg-accent-50 border border-accent-100 rounded-2xl px-5 py-3">
                <Clock size={16} style={{ color: "#C9267A" }} />
                <span className="text-sm font-semibold text-gray-700">Lun–Sáb 9am–7pm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALORES ── */}
      <section className="py-24 lg:py-28" style={{ background: "linear-gradient(180deg,#fafafa,#fff)" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7C2D9E" }}>Lo que nos mueve</span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mt-3">Nuestros valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc, color, bg, txt }) => (
              <div key={title}
                className="group bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EQUIPO ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 lg:py-28">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#C9267A" }}>Las personas detrás</span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mt-3">Nuestro equipo</h2>
          <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
            Un equipo apasionado que trabaja cada día para que tu experiencia sea perfecta.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {TEAM.map(({ name, role, img }) => (
            <div key={name} className="group text-center">
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden mb-5 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                <Image src={img} alt={name} fill sizes="300px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top,rgba(45,8,69,0.6) 0%,transparent 60%)" }} />
              </div>
              <h3 className="font-black text-gray-900 text-base">{name}</h3>
              <p className="text-sm mt-1" style={{ color: "#7C2D9E" }}>{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BANNER CTA ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-24 lg:pb-28">
        <div className="relative rounded-3xl overflow-hidden text-white px-8 lg:px-16 py-16 lg:py-20 text-center"
          style={{ background: "linear-gradient(135deg,#2D0845,#7C2D9E 50%,#C9267A)", boxShadow: "0 20px 60px rgba(124,45,158,0.35)" }}>
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)", backgroundSize: "16px 16px" }} />
          <Users size={44} className="text-accent-300 mx-auto mb-6" />
          <h2 className="relative text-4xl lg:text-5xl font-black mb-5">Un equipo que te cuida</h2>
          <p className="relative text-brand-100 text-lg max-w-2xl mx-auto mb-10">
            Desde la selección de productos hasta el empaque de tu pedido, cada paso lo hacemos con cariño.
          </p>
          <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/productos"
              className="inline-flex items-center justify-center gap-2 bg-white px-10 py-4 rounded-2xl font-black text-base hover:-translate-y-0.5 transition-all hover:shadow-2xl"
              style={{ color: "#7C2D9E" }}>
              Ver colección <ArrowRight size={18} />
            </Link>
            <Link href="/contacto"
              className="inline-flex items-center justify-center gap-2 text-white px-10 py-4 rounded-2xl font-black text-base hover:bg-white/20 transition-all"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
