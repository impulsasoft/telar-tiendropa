"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X, ChevronRight, Truck, Tag, Phone } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TelarLogo from "@/components/TelarLogo";

const links = [
  { href: "/",            label: "Inicio"    },
  { href: "/productos",   label: "Productos" },
  { href: "/seguimiento", label: "Mi pedido" },
  { href: "/nosotros",    label: "Nosotros"  },
  { href: "/contacto",    label: "Contacto"  },
];

const categories = ["Vestidos","Pantalones","Blusas","Chaquetas","Faldas","Accesorios","Calzado"];

export default function Navbar() {
  const pathname   = usePathname();
  const count      = useCartStore((s) => s.count());
  const cartTotal  = useCartStore((s) => s.total());
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled,    setScrolled]    = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim())
      window.location.href = `/productos?q=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <>
      {/* ── ANNOUNCEMENT BAR — más alto en mobile ── */}
      <div className="relative overflow-hidden text-white font-medium text-center"
        style={{ background: "linear-gradient(90deg,#4A0E6E,#7C2D9E,#C9267A,#7C2D9E,#4A0E6E)" }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,0.15) 40px,rgba(255,255,255,0.15) 41px)" }} />
        {/* Mobile: apilado vertical — Desktop: horizontal */}
        <div className="relative max-w-7xl mx-auto px-4 py-3 sm:py-2.5">
          {/* Mobile: un mensaje por línea */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-6">
            <span className="flex items-center gap-2 text-sm sm:text-xs">
              <Truck size={14} className="text-accent-300 shrink-0" />
              Envío <strong>GRATIS</strong> en compras +S/&nbsp;150
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="flex items-center gap-2 text-sm sm:text-xs">
              <Tag size={14} className="text-accent-300 shrink-0" />
              Hasta <strong>40% OFF</strong> en temporada
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:flex items-center gap-2 text-xs">
              <Phone size={12} className="text-accent-300" />
              <a href="tel:+51987654321" className="hover:text-accent-300 transition-colors">987 654 321</a>
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR — más alto en mobile ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/96 backdrop-blur-xl shadow-[0_2px_24px_rgba(124,45,158,0.12)] border-b border-brand-100/60"
            : "bg-white border-b border-brand-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: h-20 — Desktop: h-[72px]. 3 zonas: logo | nav centrado | acciones */}
          <div className="flex items-center h-20 sm:h-[72px]">

            {/* LOGO — izquierda */}
            <Link href="/" className="shrink-0 mr-6">
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
                <TelarLogo size={38} />
              </motion.div>
            </Link>

            {/* NAV LINKS — centrado, ocupa el espacio sobrante */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
              {links.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <Link key={l.href} href={l.href}
                    className={`relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      active ? "text-brand-700 bg-brand-50" : "text-gray-600 hover:text-brand-700 hover:bg-brand-50/60"
                    }`}
                  >
                    {l.label}
                    {active && (
                      <motion.div layoutId="navUnderline"
                        className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full"
                        style={{ background: "linear-gradient(90deg,#7C2D9E,#C9267A)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT ACTIONS — derecha */}
            <div className="flex items-center gap-2 ml-auto lg:ml-6">

              {/* Search */}
              <div className="relative">
                <AnimatePresence>
                  {searchOpen && (
                    <motion.form onSubmit={handleSearch}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "min(220px, 50vw)", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute right-11 top-1/2 -translate-y-1/2 overflow-hidden"
                    >
                      <input ref={searchRef} type="text" value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar..."
                        className="w-full h-11 pl-4 pr-3 bg-brand-50 border border-brand-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 text-gray-800 placeholder-gray-400"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Buscar"
                  className={`relative z-10 w-11 h-11 flex items-center justify-center rounded-2xl transition-all ${
                    searchOpen ? "bg-brand-700 text-white shadow-md" : "text-gray-500 hover:text-brand-700 hover:bg-brand-50"
                  }`}
                >
                  {searchOpen ? <X size={18} /> : <Search size={18} />}
                </button>
              </div>

              {/* Cart — más prominente en mobile */}
              <Link href="/carrito"
                className="relative flex items-center gap-2 h-11 px-4 rounded-2xl text-white font-bold hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:shadow-accent-200"
                style={{ background: "linear-gradient(135deg,#7C2D9E,#C9267A)" }}
              >
                <ShoppingBag size={18} />
                {mounted && count > 0 ? (
                  <span className="text-sm font-bold">{count} · S/{cartTotal.toFixed(0)}</span>
                ) : (
                  <span className="hidden sm:block text-sm">Carrito</span>
                )}
                {mounted && count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-[11px] font-black rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shadow">
                    {count}
                  </span>
                )}
              </Link>

              {/* Hamburger */}
              <button
                className="lg:hidden w-11 h-11 flex items-center justify-center rounded-2xl text-gray-600 hover:bg-brand-50 transition-all"
                onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú"
              >
                <motion.div animate={{ rotate: menuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── MOBILE MENU — panel completo con buen espaciado ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 lg:hidden shadow-2xl flex flex-col"
            >
              {/* Header del panel */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-brand-50">
                <TelarLogo size={34} />
                <button onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center hover:bg-brand-100 transition-colors text-brand-700">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* Buscar */}
                <form onSubmit={handleSearch} className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full h-12 pl-11 pr-4 bg-brand-50 border border-brand-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                </form>

                {/* Navegación */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Navegación</p>
                  <div className="space-y-1">
                    {links.map((l, i) => {
                      const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                      return (
                        <motion.div key={l.href}
                          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}>
                          <Link href={l.href}
                            className={`flex items-center justify-between px-4 py-4 rounded-2xl font-semibold text-base transition-colors ${
                              active ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:bg-brand-50/60 hover:text-brand-700"
                            }`}
                          >
                            {l.label}
                            <ChevronRight size={16} className="text-gray-300" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Categorías */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Categorías</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {categories.map((cat, i) => (
                      <motion.div key={cat}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.04 }}>
                        <Link href={`/productos?cat=${cat}`}
                          className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-gray-50 hover:bg-brand-50 hover:text-brand-700 text-gray-600 text-sm font-semibold transition-colors border border-gray-100">
                          {cat==="Vestidos"?"👗":cat==="Pantalones"?"👖":cat==="Accesorios"?"👜":cat==="Chaquetas"?"🧥":cat==="Blusas"?"👚":cat==="Faldas"?"🩱":"👟"}
                          <span>{cat}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer del panel */}
              <div className="p-6 border-t border-brand-50">
                <Link href="/carrito"
                  className="flex items-center justify-center gap-3 w-full text-white py-4 rounded-2xl font-bold text-base shadow-lg"
                  style={{ background: "linear-gradient(135deg,#7C2D9E,#C9267A)" }}
                >
                  <ShoppingBag size={18} />
                  {mounted && count > 0 ? `Ver carrito · ${count} items · S/${cartTotal.toFixed(2)}` : "Ver carrito"}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
