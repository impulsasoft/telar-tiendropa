"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Package, Truck, CheckCircle, Clock, XCircle,
  ArrowLeft, Mail, Hash, User, Phone, CreditCard,
  ShoppingBag, ChevronRight, Loader2, MapPin, MessageCircle,
} from "lucide-react";

/* ── Tipos ── */
interface OrderItem {
  id: string; quantity: number; price: number; size: string;
  product: { name: string; image: string; category: string };
}
interface OrderData {
  id: string; total: number; status: string; createdAt: string;
  customer: { name: string; email: string; phone: string };
  items: OrderItem[];
  payments: { method: string; status: string }[];
}

const STATUS_STEPS = [
  { key:"Pendiente",  label:"Pago recibido",   desc:"Verificando tu comprobante",  icon:Clock,        color:"yellow" },
  { key:"Procesando", label:"Preparando pedido",desc:"Empacando tus prendas",       icon:Package,      color:"blue"   },
  { key:"Enviado",    label:"En camino",        desc:"Tu pedido está en ruta",      icon:Truck,        color:"violet" },
  { key:"Entregado",  label:"Entregado",        desc:"¡Disfruta tu compra!",        icon:CheckCircle,  color:"green"  },
];
const STATUS_ORDER = ["Pendiente","Procesando","Enviado","Entregado"];

const colorMap: Record<string, { bg:string; text:string; border:string; ring:string; dot:string }> = {
  yellow: { bg:"bg-yellow-50", text:"text-yellow-700", border:"border-yellow-200", ring:"ring-yellow-400",  dot:"bg-yellow-400" },
  blue:   { bg:"bg-blue-50",   text:"text-blue-700",   border:"border-blue-200",   ring:"ring-blue-400",    dot:"bg-blue-400"   },
  violet: { bg:"bg-brand-50", text:"text-brand-700", border:"border-brand-200", ring:"ring-brand-400",  dot:"bg-brand-500" },
  green:  { bg:"bg-green-50",  text:"text-green-700",  border:"border-green-200",  ring:"ring-green-400",   dot:"bg-green-500"  },
};

function TrackingContent() {
  const params   = useSearchParams();
  const [email,    setEmail]   = useState(params.get("email")   ?? "");
  const [orderId,  setOrderId] = useState(params.get("orderId") ?? "");
  const [loading,  setLoading] = useState(false);
  const [order,    setOrder]   = useState<OrderData | null>(null);
  const [error,    setError]   = useState("");

  useEffect(() => {
    if (params.get("email") && params.get("orderId")) {
      handleSearch(new Event("submit") as unknown as React.FormEvent);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !orderId.trim()) return;
    setLoading(true); setError(""); setOrder(null);
    try {
      const res = await fetch(`/api/seguimiento?email=${encodeURIComponent(email.trim())}&orderId=${orderId.trim()}`);
      if (res.ok) setOrder(await res.json());
      else { const d = await res.json(); setError(d.error ?? "No encontramos tu pedido. Verifica el email y el ID."); }
    } catch { setError("Error de conexión. Intenta de nuevo."); }
    setLoading(false);
  };

  const currentStepIdx = order ? STATUS_ORDER.indexOf(order.status) : -1;
  const isCancelled    = order?.status === "Cancelado";

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#faf5ff,#fff 300px)" }}>

      {/* ── PAGE HEADER ── */}
      <div className="border-b border-brand-100/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex items-center gap-4">
          <Link href="/"
            className="w-10 h-10 rounded-2xl border border-gray-200 flex items-center justify-center hover:border-brand-400 hover:text-brand-700 transition-all shrink-0">
            <ArrowLeft size={17} />
          </Link>
          <div>
            <h1 className="font-black text-gray-900 text-xl">Seguimiento de pedido</h1>
            <p className="text-sm text-gray-400 mt-0.5">Consulta el estado de tu compra en tiempo real</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10 lg:py-14">

        {/* ── LAYOUT: columna izquierda (formulario + info) + derecha (resultado) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 lg:gap-12 items-start">

          {/* ── COLUMNA IZQUIERDA ── */}
          <div className="space-y-6 lg:sticky lg:top-24">

            {/* Formulario */}
            <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-brand-50 overflow-hidden">

              {/* Header del card */}
              <div className="px-8 pt-8 pb-6 border-b border-gray-50"
                style={{ background:"linear-gradient(135deg,#faf5ff,#fff5f8)" }}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background:"linear-gradient(135deg,#7C2D9E,#C9267A)" }}>
                    <Search size={18} className="text-white" />
                  </div>
                  <h2 className="font-black text-gray-900 text-lg">Busca tu pedido</h2>
                </div>
                <p className="text-sm text-gray-400 mt-1 pl-[52px]">Ingresa tu email y el ID del pedido</p>
              </div>

              <form onSubmit={handleSearch} className="px-8 py-7 space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                    <Mail size={11} className="text-brand-500" /> Correo electrónico
                  </label>
                  <input type="email" placeholder="tucorreo@gmail.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100 transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                    <Hash size={11} className="text-brand-500" /> ID de pedido
                  </label>
                  <input type="text" placeholder="Ej: 58RTAP82" value={orderId}
                    onChange={e => setOrderId(e.target.value.replace(/^#/, "").trim())}
                    className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-4 text-sm text-gray-800 placeholder:text-gray-400 font-mono focus:outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100 transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Lo encontrarás en el email de confirmación</p>
                </div>

                <motion.button whileTap={{ scale:0.98 }} type="submit"
                  disabled={loading || !email || !orderId}
                  className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-0.5 transition-all hover:shadow-lg hover:shadow-brand-200"
                  style={{ background:"linear-gradient(135deg,#7C2D9E,#C9267A)" }}>
                  {loading
                    ? <><Loader2 size={18} className="animate-spin" /> Buscando...</>
                    : <><Search size={18} /> Buscar pedido</>
                  }
                </motion.button>
              </form>
            </motion.div>

            {/* Info de ayuda */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 space-y-5">
              <h3 className="font-black text-gray-900">¿Necesitas ayuda?</h3>
              <div className="space-y-3">
                {[
                  { Icon:Phone, label:"WhatsApp", value:"+51 987 654 321", href:"https://wa.me/51987654321", color:"text-green-600 bg-green-50" },
                  { Icon:Mail,  label:"Email",    value:"hola@telar.pe",   href:"mailto:hola@telar.pe",      color:"text-brand-600 bg-brand-50" },
                  { Icon:MapPin,label:"Tienda",   value:"Jr. La Moda 456, Miraflores",                        color:"text-accent-600 bg-accent-50" },
                ].map(({ Icon, label, value, href, color }) => (
                  <div key={label} className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                      {href
                        ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-brand-700 transition-colors font-medium">{value}</a>
                        : <p className="text-sm text-gray-700">{value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
              <a href="https://wa.me/51987654321"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all hover:shadow-md text-sm">
                <MessageCircle size={16} /> Chatear por WhatsApp
              </a>
            </div>
          </div>

          {/* ── COLUMNA DERECHA — resultado ── */}
          <div className="space-y-5 min-h-[300px]">

            {/* Estado vacío */}
            <AnimatePresence>
              {!order && !error && !loading && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                    style={{ background:"linear-gradient(135deg,#f5f0ff,#fff0f7)" }}>
                    <Package size={36} style={{ color:"#7C2D9E" }} />
                  </div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">Ingresa los datos de tu pedido</h3>
                  <p className="text-gray-400 text-sm max-w-xs">Busca tu pedido con el email de compra y el ID que te enviamos por correo.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                  className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-3xl p-7">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                    <XCircle size={24} className="text-red-500" />
                  </div>
                  <div>
                    <p className="font-black text-red-700 text-base">Pedido no encontrado</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                    <p className="text-red-500 text-xs mt-2">¿Necesitas ayuda? Escríbenos al <strong>987 654 321</strong></p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resultado */}
            <AnimatePresence>
              {order && (
                <motion.div initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} className="space-y-5">

                  {/* Banner de estado */}
                  {isCancelled ? (
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-7 flex items-center gap-5">
                      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                        <XCircle size={28} className="text-red-500" />
                      </div>
                      <div>
                        <p className="font-black text-red-700 text-xl">Pedido cancelado</p>
                        <p className="text-red-600 text-sm mt-1">Si tienes dudas, contáctanos al 987 654 321</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                      {/* Cabecera del pedido */}
                      <div className="px-8 py-6 flex items-center justify-between"
                        style={{ background:"linear-gradient(135deg,#2D0845,#7C2D9E 60%,#C9267A)" }}>
                        <div>
                          <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Pedido</p>
                          <p className="text-white font-black text-2xl font-mono mt-0.5">#{order.id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/70 text-xs uppercase tracking-wider">Fecha</p>
                          <p className="text-white font-semibold mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("es-PE",{day:"numeric",month:"long",year:"numeric"})}
                          </p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="px-8 py-8">
                        <div className="relative">
                          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 z-0" />
                          <div className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 z-0 transition-all duration-700"
                            style={{ width:`${Math.max(0,(currentStepIdx/(STATUS_STEPS.length-1))*100)}%` }} />
                          <div className="relative z-10 flex justify-between">
                            {STATUS_STEPS.map((step,i) => {
                              const isDone   = i < currentStepIdx;
                              const isActive = i === currentStepIdx;
                              const c = colorMap[step.color];
                              return (
                                <div key={step.key} className="flex flex-col items-center gap-3 w-1/4">
                                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                    isDone   ? "bg-gradient-to-br from-brand-500 to-accent-500 shadow-md shadow-brand-200" :
                                    isActive ? `${c.bg} border-2 ${c.border} shadow-md ring-2 ${c.ring} ring-offset-1` :
                                    "bg-gray-100 border border-gray-200"
                                  }`}>
                                    <step.icon size={16} className={isDone?"text-white":isActive?c.text:"text-gray-300"} />
                                  </div>
                                  <div className="text-center">
                                    <p className={`text-xs font-bold leading-tight ${isDone||isActive?"text-gray-900":"text-gray-400"}`}>
                                      {step.label}
                                    </p>
                                    {isActive && (
                                      <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">{step.desc}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {currentStepIdx >= 0 && (
                          <div className={`mt-7 rounded-2xl px-5 py-4 border flex items-center gap-3 ${colorMap[STATUS_STEPS[currentStepIdx].color].bg} ${colorMap[STATUS_STEPS[currentStepIdx].color].border}`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${colorMap[STATUS_STEPS[currentStepIdx].color].dot} animate-pulse shrink-0`} />
                            <p className={`text-sm font-semibold ${colorMap[STATUS_STEPS[currentStepIdx].color].text}`}>
                              {STATUS_STEPS[currentStepIdx].desc}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Datos del cliente */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-gray-50 flex items-center gap-2">
                      <User size={15} className="text-brand-500" />
                      <h3 className="font-black text-gray-900 text-sm">Datos de entrega</h3>
                    </div>
                    <div className="p-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon:User,       value:order.customer.name  },
                        { icon:Mail,       value:order.customer.email },
                        { icon:Phone,      value:order.customer.phone || "—" },
                        ...(order.payments[0] ? [{ icon:CreditCard, value:`${order.payments[0].method} · ${order.payments[0].status}` }] : []),
                      ].map(({ icon:Icon, value }) => (
                        <div key={value} className="flex items-center gap-3 text-sm bg-gray-50 rounded-2xl px-4 py-3">
                          <Icon size={14} className="text-gray-400 shrink-0" />
                          <span className="text-gray-700 truncate">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Productos */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                        <ShoppingBag size={15} className="text-brand-500" /> Productos ({order.items.length})
                      </h3>
                      <span className="font-black text-gray-900 text-lg">S/ {order.total.toFixed(2)}</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 px-7 py-5">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                            <Image src={item.product.image} alt={item.product.name} fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{item.product.name}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{item.product.category}</span>
                              {item.size && <span className="text-xs text-gray-400">Talla: {item.size}</span>}
                              <span className="text-xs text-gray-400">x{item.quantity}</span>
                            </div>
                          </div>
                          <p className="text-base font-black text-gray-900 shrink-0">S/ {(item.price*item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ayuda */}
                  <div className="rounded-3xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                    style={{ background:"linear-gradient(135deg,#faf5ff,#fff0f7)", border:"1px solid rgba(124,45,158,0.15)" }}>
                    <div>
                      <p className="font-black text-brand-900 text-base">¿Tienes alguna duda sobre tu pedido?</p>
                      <p className="text-brand-600 text-sm mt-1">Nuestro equipo está disponible Lun-Sáb 9am-7pm</p>
                    </div>
                    <a href="https://wa.me/51987654321" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-2xl shrink-0 transition-all hover:shadow-lg hover:shadow-brand-200 hover:-translate-y-0.5"
                      style={{ background:"linear-gradient(135deg,#7C2D9E,#C9267A)" }}>
                      WhatsApp <ChevronRight size={14} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeguimientoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
