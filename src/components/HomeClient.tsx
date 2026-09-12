"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, RotateCcw, Shield, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/store";

const rotatingWords = ["te define", "te inspira", "te representa"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const catColors: Record<string, string> = {
  Vestidos:   "from-accent-500 to-rose-500",
  Pantalones: "from-brand-500 to-indigo-500",
  Accesorios: "from-amber-400 to-orange-500",
  Chaquetas:  "from-brand-600 to-brand-500",
  Blusas:     "from-fuchsia-500 to-accent-500",
  Faldas:     "from-rose-400 to-accent-600",
  Calzado:    "from-teal-500 to-cyan-500",
};

const catEmoji: Record<string, string> = {
  Vestidos:"👗", Pantalones:"👖", Accesorios:"👜", Chaquetas:"🧥",
  Blusas:"👚", Faldas:"🩱", Calzado:"👟",
};

interface Props { products: Product[]; categories: string[]; }

export default function HomeClient({ products, categories }: Props) {
  const featured = products.slice(0, 4);
  const reducedMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setWordIndex((i) => (i + 1) % rotatingWords.length), 2800);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <>
      {/* ── HERO — full height en mobile ── */}
      <section className="relative min-h-[100svh] sm:min-h-[90vh] flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0F0717 0%,#2D0845 50%,#0F0717 100%)" }}>

        {/* Mesh gradient blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(124,45,158,0.4) 0%,transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(201,38,122,0.35) 0%,transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(ellipse,rgba(200,80,255,0.5) 0%,transparent 70%)" }} />

        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(255,255,255,1) 50px,rgba(255,255,255,1) 51px),repeating-linear-gradient(90deg,transparent,transparent 50px,rgba(255,255,255,1) 50px,rgba(255,255,255,1) 51px)" }} />

        {/* Imagen de fondo en mobile/tablet (donde la columna de imagen aún no aparece)
            para que el hero no se vea como texto plano sobre un degradado */}
        <div className="absolute inset-0 md:hidden opacity-25 pointer-events-none">
          <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80"
            alt="" fill sizes="100vw" className="object-cover object-top" priority />
          <div className="absolute inset-0" style={{ background:"linear-gradient(180deg,#0F0717 0%,rgba(15,7,23,0.75) 40%,#0F0717 100%)" }} />
        </div>

        {/* más padding vertical en mobile: py-28, en desktop: py-20 */}
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-28 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center w-full">
          <div>
            <motion.div initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.5 }}
              className="inline-flex items-center gap-2 text-accent-200 text-xs font-semibold px-4 py-2 rounded-full mb-6"
              style={{ background:"rgba(201,38,122,0.15)", border:"1px solid rgba(201,38,122,0.35)" }}>
              <Sparkles size={12} className="text-accent-300" /> Nueva Colección 2026
            </motion.div>

            {/* Editorial: serif display font, palabra final rotativa + hover interactivo */}
            <motion.h1 initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6,delay:0.1 }}
              className="font-serif text-6xl sm:text-7xl lg:text-8xl font-medium italic text-white leading-[1.05] mb-6 tracking-tight">
              Moda que{" "}
              <span className="inline-block relative align-baseline">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -16 }}
                    transition={{ duration: 0.45 }}
                    whileHover={{ scale: 1.04 }}
                    className="inline-block cursor-default not-italic"
                    style={{ background:"linear-gradient(90deg,#E879F9,#F472B6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5,delay:0.2 }}
              className="text-brand-200 text-lg max-w-lg mb-10 leading-relaxed">
              Diseños únicos para mujeres que no pasan desapercibidas. Cada prenda es una declaración de estilo — envíos a todo el país.
            </motion.p>

            <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5,delay:0.3 }}
              className="flex flex-wrap gap-4">
              <Link href="/productos"
                className="group flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-0.5"
                style={{ background:"linear-gradient(135deg,#7C2D9E,#C9267A)", boxShadow:"0 8px 32px rgba(201,38,122,0.4)" }}>
                Ver colección <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/nosotros"
                className="flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all"
                style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.18)" }}>
                <Star size={16} className="text-yellow-300" /> Sobre nosotros
              </Link>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="flex gap-8 mt-14">
              {[["5K+","Clientas"],["200+","Diseños"],["4.9★","Valoración"]].map(([v,l]) => (
                <div key={l}>
                  <p className="text-2xl font-black text-white">{v}</p>
                  <p className="text-brand-400 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }} transition={{ duration:0.7,delay:0.2 }}
            className="relative hidden md:block">
            <div className="relative h-[420px] lg:h-[520px] rounded-3xl overflow-hidden"
              style={{ boxShadow:"0 30px 80px rgba(124,45,158,0.5)" }}>
              <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                alt="Colección TELAR" fill sizes="600px" className="object-cover" priority />
              <div className="absolute inset-0"
                style={{ background:"linear-gradient(to top,rgba(45,8,69,0.6) 0%,transparent 60%)" }} />
            </div>

            <motion.div animate={{ y:[-6,6,-6] }} transition={{ repeat:Infinity,duration:3 }}
              className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background:"linear-gradient(135deg,#7C2D9E,#C9267A)" }}>
                <Truck size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Envío gratis</p>
                <p className="text-gray-400 text-xs">Compras &gt; S/ 150</p>
              </div>
            </motion.div>

            <motion.div animate={{ y:[6,-6,6] }} transition={{ repeat:Infinity,duration:3.5,delay:0.5 }}
              className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-2xl px-4 py-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Tendencia</p>
              <p className="text-sm font-black" style={{ color:"#C9267A" }}>Verano 2026 ✨</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── BENEFICIOS — más padding en mobile ── */}
      <section className="py-10 sm:py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon:Truck,     title:"Envío gratis",    desc:"En compras mayores a S/ 150",    bg:"bg-brand-50", txt:"text-brand-700",  border:"hover:border-brand-200" },
            { icon:RotateCcw, title:"Cambios fáciles", desc:"Hasta 30 días sin preguntas",    bg:"bg-accent-50",   txt:"text-accent-700",    border:"hover:border-accent-200" },
            { icon:Shield,    title:"Pago seguro",     desc:"Yape, Plin, tarjeta o efectivo", bg:"bg-fuchsia-50",txt:"text-fuchsia-700", border:"hover:border-fuchsia-200" },
          ].map((b, i) => (
            <motion.div key={b.title} custom={i} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once:true }}
              className={`flex items-center gap-5 p-6 rounded-2xl border border-gray-100 ${b.border} hover:shadow-lg transition-all cursor-default`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${b.bg} ${b.txt}`}>
                <b.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{b.title}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CATEGORÍAS — más padding y tarjetas más altas en mobile ── */}
      <section className="py-20 sm:py-16 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color:"#7C2D9E" }}>Colecciones</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium italic text-gray-900">
            Explora por <span className="gradient-text not-italic">categoría</span>
          </h2>
        </motion.div>
        {/* tarjetas: h-36 en mobile, h-28 en sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.filter(c => c !== "Todos").slice(0,8).map((cat,i) => (
            <motion.div key={cat} custom={i} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once:true }}>
              <Link href={`/productos?cat=${cat}`}
                className={`group flex flex-col items-center justify-center h-36 sm:h-28 rounded-2xl bg-gradient-to-br ${catColors[cat] ?? "from-brand-600 to-accent-500"} text-white font-bold text-sm shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300`}>
                <span className="text-3xl sm:text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{catEmoji[cat] ?? "✨"}</span>
                <span className="text-sm sm:text-xs font-bold">{cat}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS — más padding en mobile ── */}
      <section className="py-16 sm:py-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color:"#C9267A" }}>Selección</p>
            <motion.h2 initial={{ opacity:0,x:-20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }}
              className="font-serif text-4xl sm:text-5xl font-medium italic text-gray-900">
              Lo más <span className="gradient-text not-italic">destacado</span>
            </motion.h2>
          </div>
          <Link href="/productos" className="flex items-center gap-1 font-semibold hover:gap-2 transition-all text-sm"
            style={{ color:"#7C2D9E" }}>
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>
        {/* grid-cols-2 -> lg:grid-cols-4 sin tramo intermedio de 3 columnas:
            featured siempre trae 4 productos, así que un grid de 3 columnas
            dejaría el 4to producto solo en una fila nueva con espacio vacío */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* ── BANNER CTA — mucho más prominente en mobile ── */}
      <section className="py-12 sm:py-8 px-5 sm:px-4">
        <motion.div initial={{ opacity:0,scale:0.97 }} whileInView={{ opacity:1,scale:1 }} viewport={{ once:true }}
          className="max-w-7xl mx-auto relative overflow-hidden rounded-3xl text-white py-20 sm:py-16 px-6 sm:px-8 text-center"
          style={{ background:"linear-gradient(135deg,#2D0845 0%,#7C2D9E 40%,#C9267A 100%)", boxShadow:"0 20px 60px rgba(124,45,158,0.45)" }}>

          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage:"radial-gradient(circle at 20% 50%,rgba(255,255,255,0.4) 0%,transparent 50%),radial-gradient(circle at 80% 50%,rgba(255,255,255,0.3) 0%,transparent 50%)" }} />
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage:"repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)", backgroundSize:"20px 20px" }} />

          <motion.p initial={{ opacity:0,y:10 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            className="relative text-accent-200 text-sm font-bold tracking-widest uppercase mb-4">
            Oferta de temporada
          </motion.p>
          {/* texto del banner más grande en mobile */}
          <motion.h2 initial={{ opacity:0,y:15 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            className="relative font-serif text-5xl sm:text-6xl font-medium italic mb-5 leading-tight">
            Hasta 40% de descuento
          </motion.h2>
          <p className="relative text-brand-200 text-lg mb-10 max-w-lg mx-auto">
            En nuestra selección de temporada. ¡Solo por tiempo limitado!
          </p>
          <Link href="/productos"
            className="relative inline-flex items-center gap-2 bg-white px-10 py-5 rounded-2xl font-black text-lg hover:-translate-y-0.5 transition-all hover:shadow-2xl"
            style={{ color:"#7C2D9E" }}>
            Aprovechar oferta <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      <div className="h-16 sm:h-8" />
    </>
  );
}
