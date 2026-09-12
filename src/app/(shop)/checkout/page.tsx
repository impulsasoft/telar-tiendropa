"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, Copy, ArrowLeft, Smartphone, Building2, CreditCard,
  Lock, Loader2, User, Mail, Phone, MapPin, Upload, ImageIcon,
  X, Truck, ShoppingBag, Check, ChevronDown, Tag,
} from "lucide-react";
import { useCartStore } from "@/lib/store";

/* ─────────────── Métodos de pago ─────────────── */
const PAYMENT_METHODS = [
  {
    id: "yape",
    name: "Yape",
    desc: "Pago instantáneo",
    Icon: Smartphone,
    gradient: "from-brand-600 to-brand-700",
    light: "bg-brand-50 border-brand-200 text-brand-700",
    ring: "ring-brand-400",
    details: {
      label: "Número Yape",
      number: "987 654 321",
      holder: "TELAR S.A.C.",
    },
  },
  {
    id: "plin",
    name: "Plin",
    desc: "Pago rápido",
    Icon: Smartphone,
    gradient: "from-blue-500 to-cyan-600",
    light: "bg-blue-50 border-blue-200 text-blue-700",
    ring: "ring-blue-400",
    details: {
      label: "Número Plin",
      number: "976 543 210",
      holder: "TELAR S.A.C.",
    },
  },
  {
    id: "transfer",
    name: "Transferencia",
    desc: "BCP, BBVA, Scotiabank",
    Icon: Building2,
    gradient: "from-emerald-500 to-green-600",
    light: "bg-emerald-50 border-emerald-200 text-emerald-700",
    ring: "ring-emerald-400",
    details: {
      label: "Cuenta BCP",
      number: "194-12345678-0-12",
      holder: "TELAR S.A.C.",
      cci: "00219400123456780120",
    },
  },
  {
    id: "card",
    name: "Tarjeta",
    desc: "Visa / Mastercard",
    Icon: CreditCard,
    gradient: "from-rose-500 to-accent-600",
    light: "bg-rose-50 border-rose-200 text-rose-700",
    ring: "ring-rose-400",
    details: null,
  },
];

type Step = "datos" | "pago" | "confirmar" | "exito";

const STEPS: { id: Step; label: string }[] = [
  { id: "datos", label: "Mis datos" },
  { id: "pago", label: "Pago" },
  { id: "confirmar", label: "Confirmar" },
];

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-xs bg-white border border-gray-200 hover:border-brand-400 hover:text-brand-600 text-gray-500 px-2.5 py-1.5 rounded-lg transition-all font-medium"
    >
      {done ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
      {done ? "¡Listo!" : "Copiar"}
    </button>
  );
}

function Field({
  icon: Icon, label, required, error, children,
}: {
  icon: React.ElementType; label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
        <Icon size={12} className="text-brand-500" />
        {label} {required && <span className="text-accent-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><X size={10} />{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("datos");
  const [methodId, setMethodId] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);
  const [voucher, setVoucher] = useState({ number: "", image: "" });
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; type: string; discount: number } | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", district: "",
  });

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const subtotal = total();
  const shipping = subtotal >= 150 ? 0 : 10;
  const finalTotal = Math.max(0, subtotal + shipping - couponDiscount);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true); setCouponError("");
    const res = await fetch("/api/cupones/validar", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal }),
    });
    const data = await res.json();
    if (res.ok) { setCoupon(data.coupon); setCouponDiscount(data.discountAmount); }
    else { setCouponError(data.error); setCoupon(null); setCouponDiscount(0); }
    setCouponLoading(false);
  };

  const removeCoupon = () => { setCoupon(null); setCouponDiscount(0); setCouponCode(""); setCouponError(""); };
  const method = PAYMENT_METHODS.find((m) => m.id === methodId);

  /* ── Validaciones ── */
  const validateDatos = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Ingresa tu nombre completo";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "Email inválido";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 9) e.phone = "Teléfono inválido (9 dígitos)";
    if (!form.address.trim()) e.address = "Ingresa tu dirección";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePago = () => {
    const e: Record<string, string> = {};
    if (!methodId) e.method = "Selecciona un método de pago";
    if (method?.details && !voucher.number.trim()) e.voucher = "Ingresa el número de operación";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Upload de voucher ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: "Archivo muy grande. Máximo 5 MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      setVoucherPreview(dataUrl);
      setVoucher((v) => ({ ...v, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  /* ── Confirmar pedido ── */
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: `${form.address}${form.district ? ", " + form.district : ""}`,
          },
          items: items.map((i) => ({
            id: i.id, price: i.price, quantity: i.quantity, selectedSize: i.selectedSize,
          })),
          payment: {
            method: method?.name,
            reference: JSON.stringify({ number: voucher.number, image: voucher.image }),
          },
          total: subtotal,
          shipping,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrderId(data.orderId ?? null);
      }
    } catch { /* mostrar éxito igual */ }
    clearCart();
    setStep("exito");
    setLoading(false);
  };

  /* ── Copy helper ── */
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  /* ── Carrito vacío ── */
  if (items.length === 0 && step !== "exito") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
          <ShoppingBag size={32} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-400 text-sm mb-6">Agrega productos antes de continuar al pago.</p>
        <Link href="/productos" className="bg-gradient-to-r from-brand-700 to-accent-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-xl transition-all">
          Ir a la tienda →
        </Link>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          {/* Back */}
          {step === "datos" && (
            <Link href="/carrito" className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:border-brand-400 hover:text-brand-600 transition-colors shrink-0">
              <ArrowLeft size={16} />
            </Link>
          )}
          {(step === "pago" || step === "confirmar") && (
            <button
              onClick={() => setStep(step === "pago" ? "datos" : "pago")}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:border-brand-400 hover:text-brand-600 transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          {step !== "exito" ? (
            <div className="flex-1">
              {/* Steps indicator */}
              <div className="flex items-center gap-0">
                {STEPS.map((s, i) => {
                  const isDone = stepIndex > i;
                  const isActive = s.id === step;
                  return (
                    <div key={s.id} className="flex items-center">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                        isActive ? "bg-brand-100" : ""
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          isDone ? "bg-green-500 text-white" :
                          isActive ? "bg-gradient-to-br from-brand-700 to-accent-600 text-white shadow-md" :
                          "bg-gray-200 text-gray-400"
                        }`}>
                          {isDone ? <Check size={12} /> : i + 1}
                        </div>
                        <span className={`text-xs font-semibold hidden sm:block ${
                          isActive ? "text-brand-700" : isDone ? "text-green-600" : "text-gray-400"
                        }`}>
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`h-px w-8 transition-colors ${isDone ? "bg-green-300" : "bg-gray-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <h1 className="font-black text-gray-900 text-lg">¡Pedido confirmado!</h1>
          )}

          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full shrink-0 ml-auto">
            <Lock size={11} className="text-brand-500" /> Pago seguro
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">

              {/* ─── STEP 1: DATOS ─── */}
              {step === "datos" && (
                <motion.div key="datos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-brand-50 to-accent-50">
                      <h2 className="font-black text-gray-900 flex items-center gap-2">
                        <User size={18} className="text-brand-600" /> Datos de entrega
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">Completa tus datos para recibir tu pedido</p>
                    </div>

                    <div className="p-6 space-y-4">
                      <Field icon={User} label="Nombre completo" required error={errors.name}>
                        <input
                          type="text"
                          placeholder="Ej: Ana García López"
                          value={form.name}
                          onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors((p) => ({ ...p, name: "" })); }}
                          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-brand-400"}`}
                        />
                      </Field>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field icon={Mail} label="Correo electrónico" required error={errors.email}>
                          <input
                            type="email"
                            placeholder="ana@gmail.com"
                            value={form.email}
                            onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors((p) => ({ ...p, email: "" })); }}
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-brand-400"}`}
                          />
                        </Field>

                        <Field icon={Phone} label="Teléfono / WhatsApp" required error={errors.phone}>
                          <div className="flex">
                            <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-500 font-medium">🇵🇪 +51</span>
                            <input
                              type="tel"
                              placeholder="987 654 321"
                              value={form.phone}
                              onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors((p) => ({ ...p, phone: "" })); }}
                              className={`flex-1 border rounded-r-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-brand-400"}`}
                            />
                          </div>
                        </Field>
                      </div>

                      <Field icon={MapPin} label="Dirección de entrega" required error={errors.address}>
                        <input
                          type="text"
                          placeholder="Jr. Las Flores 123, Dpto 4B"
                          value={form.address}
                          onChange={(e) => { setForm({ ...form, address: e.target.value }); setErrors((p) => ({ ...p, address: "" })); }}
                          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all ${errors.address ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-brand-400"}`}
                        />
                      </Field>

                      <div className="relative">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
                          <MapPin size={12} className="text-brand-500" /> Distrito
                        </label>
                        <div className="relative">
                          <select
                            value={form.district}
                            onChange={(e) => setForm({ ...form, district: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 appearance-none bg-white pr-10"
                          >
                            <option value="">Selecciona tu distrito</option>
                            {["Miraflores", "San Isidro", "Surco", "La Molina", "Barranco", "San Borja", "Magdalena", "Jesús María", "Lince", "San Miguel", "Pueblo Libre", "Ate", "San Juan de Lurigancho", "Villa El Salvador", "Villa María del Triunfo", "Callao", "Otro distrito"].map((d) => (
                              <option key={d}>{d}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Envío gratis indicator */}
                  {subtotal < 150 && (
                    <div className="mt-3 flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3">
                      <Truck size={16} className="text-brand-500 shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-brand-700 font-medium">
                          Agrega S/ {(150 - subtotal).toFixed(2)} más para envío gratis
                        </p>
                        <div className="h-1.5 bg-brand-200 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all" style={{ width: `${Math.min((subtotal / 150) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => validateDatos() && setStep("pago")}
                    className="mt-4 w-full bg-gradient-to-r from-brand-700 to-accent-600 text-white py-4 rounded-2xl font-black text-base hover:shadow-2xl hover:shadow-brand-200 transition-all flex items-center justify-center gap-2"
                  >
                    Continuar al pago →
                  </motion.button>
                </motion.div>
              )}

              {/* ─── STEP 2: PAGO ─── */}
              {step === "pago" && (
                <motion.div key="pago" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">

                  {/* Método de pago */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-brand-50 to-accent-50">
                      <h2 className="font-black text-gray-900 flex items-center gap-2">
                        <CreditCard size={18} className="text-brand-600" /> Método de pago
                      </h2>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-2.5">
                      {PAYMENT_METHODS.map((m) => {
                        const active = methodId === m.id;
                        return (
                          <motion.button
                            key={m.id}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => { setMethodId(m.id); setErrors((p) => ({ ...p, method: "" })); }}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                              active
                                ? "border-brand-500 bg-brand-50 shadow-md shadow-brand-100"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center shadow-md`}>
                              <m.Icon size={22} className="text-white" />
                            </div>
                            <div>
                              <p className={`font-bold text-sm ${active ? "text-brand-700" : "text-gray-800"}`}>{m.name}</p>
                              <p className="text-xs text-gray-400">{m.desc}</p>
                            </div>
                            {active && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center">
                                <Check size={11} className="text-white" />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    {errors.method && <p className="text-red-500 text-xs px-5 pb-4 flex items-center gap-1"><X size={10} />{errors.method}</p>}
                  </div>

                  {/* Instrucciones de pago */}
                  <AnimatePresence mode="wait">
                    {method?.details && (
                      <motion.div
                        key={method.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                      >
                        <div className={`px-6 py-3 flex items-center gap-3 bg-gradient-to-r ${method.gradient}`}>
                          <method.Icon size={18} className="text-white" />
                          <h3 className="font-bold text-white text-sm">Datos para {method.name}</h3>
                        </div>
                        <div className="p-5 space-y-3">
                          {/* Número / cuenta */}
                          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{method.details.label}</p>
                              <p className="font-black text-gray-900 text-lg tracking-widest">{method.details.number}</p>
                            </div>
                            <button onClick={() => copy(method.details!.number, "num")} className="text-xs bg-white border border-gray-200 hover:border-brand-400 hover:text-brand-600 text-gray-500 px-3 py-2 rounded-xl transition-all font-semibold flex items-center gap-1.5">
                              {copied === "num" ? <><Check size={11} className="text-green-500" />¡Listo!</> : <><Copy size={11} />Copiar</>}
                            </button>
                          </div>

                          {/* Titular */}
                          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">A nombre de</p>
                              <p className="font-bold text-gray-900">{method.details.holder}</p>
                            </div>
                            <CopyBtn text={method.details.holder} />
                          </div>

                          {/* CCI si aplica */}
                          {"cci" in method.details && method.details.cci && (
                            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">CCI interbancario</p>
                                <p className="font-mono font-bold text-gray-900 text-sm">{(method.details as { cci: string }).cci}</p>
                              </div>
                              <CopyBtn text={(method.details as { cci: string }).cci} />
                            </div>
                          )}

                          {/* Monto a pagar */}
                          <div className={`flex items-center justify-between rounded-xl px-4 py-3 bg-gradient-to-r ${method.gradient}`}>
                            <p className="text-white/80 text-sm font-medium">Monto exacto a pagar</p>
                            <div className="text-right">
                              <p className="text-white font-black text-xl">S/ {finalTotal.toFixed(2)}</p>
                              {shipping === 0 && <p className="text-white/70 text-xs">Envío incluido gratis ✓</p>}
                            </div>
                          </div>
                        </div>

                        {/* Voucher section */}
                        <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
                          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                            <Upload size={14} className="text-brand-500" />
                            Sube tu comprobante de pago
                          </h4>

                          {/* Número de operación */}
                          <div>
                            <label className="text-xs text-gray-500 font-medium mb-1 block">Número de operación *</label>
                            <input
                              type="text"
                              placeholder="Ej: 12345678"
                              value={voucher.number}
                              onChange={(e) => { setVoucher((v) => ({ ...v, number: e.target.value })); setErrors((p) => ({ ...p, voucher: "" })); }}
                              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all ${errors.voucher ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                            />
                            {errors.voucher && <p className="text-red-500 text-xs mt-1">{errors.voucher}</p>}
                          </div>

                          {/* Upload imagen */}
                          <div>
                            <label className="text-xs text-gray-500 font-medium mb-1 block">Foto del voucher / captura de pantalla</label>
                            <input
                              ref={fileRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />

                            {voucherPreview ? (
                              <div className="relative rounded-xl overflow-hidden border-2 border-brand-300 shadow-md">
                                <div className="relative h-48 bg-gray-100">
                                  <Image src={voucherPreview} alt="Voucher" fill className="object-contain" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3 gap-2">
                                  <button
                                    onClick={() => fileRef.current?.click()}
                                    className="flex items-center gap-1.5 bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                                  >
                                    <Upload size={12} /> Cambiar
                                  </button>
                                  <button
                                    onClick={() => { setVoucherPreview(null); setVoucher((v) => ({ ...v, image: "" })); }}
                                    className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                                  >
                                    <X size={12} /> Quitar
                                  </button>
                                </div>
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                  <Check size={10} /> Subido
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => fileRef.current?.click()}
                                className="w-full border-2 border-dashed border-gray-300 hover:border-brand-400 hover:bg-brand-50 rounded-xl py-8 flex flex-col items-center gap-2 transition-all group"
                              >
                                <div className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                                  <ImageIcon size={22} className="text-gray-400 group-hover:text-brand-500 transition-colors" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-semibold text-gray-600 group-hover:text-brand-700 transition-colors">
                                    Clic para subir imagen
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG o captura de pantalla · Máx. 5 MB</p>
                                </div>
                              </button>
                            )}
                            {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Tarjeta: instrucción manual */}
                    {methodId === "card" && (
                      <motion.div
                        key="card-info"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-50 border border-rose-200 rounded-2xl p-5"
                      >
                        <p className="font-bold text-rose-800 text-sm mb-2 flex items-center gap-2">
                          <CreditCard size={15} /> Pago con tarjeta
                        </p>
                        <p className="text-rose-700 text-sm leading-relaxed">
                          Tras confirmar tu pedido te enviaremos un link de pago seguro a tu correo o WhatsApp. Aceptamos Visa, Mastercard y American Express.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => validatePago() && setStep("confirmar")}
                    disabled={!methodId}
                    className="w-full bg-gradient-to-r from-brand-700 to-accent-600 text-white py-4 rounded-2xl font-black text-base hover:shadow-2xl hover:shadow-brand-200 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    Revisar pedido →
                  </motion.button>
                </motion.div>
              )}

              {/* ─── STEP 3: CONFIRMAR ─── */}
              {step === "confirmar" && (
                <motion.div key="confirmar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-brand-50 to-accent-50">
                      <h2 className="font-black text-gray-900">Resumen de tu pedido</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Revisa todo antes de confirmar</p>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Productos */}
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                              <Image src={item.image || ""} alt={item.name} fill sizes="56px" className="object-cover" />
                              <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] w-4.5 h-4.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-black px-1">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {item.selectedSize && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">T: {item.selectedSize}</span>}
                                <span className="text-xs text-gray-400">x{item.quantity}</span>
                              </div>
                            </div>
                            <p className="text-sm font-black text-gray-900 shrink-0">S/ {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Totales */}
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-500">
                          <span className="flex items-center gap-1"><Truck size={12} />Envío</span>
                          <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>{shipping === 0 ? "¡Gratis! 🎉" : `S/ ${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                          <span className="font-black text-gray-900">Total a pagar</span>
                          <span className="text-xl font-black gradient-text">S/ {finalTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Datos de entrega */}
                      <div className="border border-gray-100 rounded-xl divide-y divide-gray-50">
                        {[
                          { icon: User, label: "Nombre", value: form.name },
                          { icon: Mail, label: "Email", value: form.email },
                          { icon: Phone, label: "Teléfono", value: `+51 ${form.phone}` },
                          { icon: MapPin, label: "Dirección", value: `${form.address}${form.district ? ", " + form.district : ""}` },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-center gap-3 px-4 py-3">
                            <Icon size={14} className="text-brand-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                              <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pago */}
                      <div className={`flex items-center gap-3 rounded-xl px-4 py-3 bg-gradient-to-r ${method?.gradient ?? "from-brand-700 to-accent-600"}`}>
                        {method && <method.Icon size={16} className="text-white shrink-0" />}
                        <div className="flex-1">
                          <p className="text-white/80 text-xs">Método de pago</p>
                          <p className="text-white font-bold text-sm">{method?.name}</p>
                        </div>
                        {voucher.number && <div className="text-right"><p className="text-white/70 text-xs">Op. N°</p><p className="text-white font-mono font-bold text-sm">{voucher.number}</p></div>}
                      </div>

                      {/* Voucher preview */}
                      {voucherPreview && (
                        <div className="rounded-xl overflow-hidden border border-gray-100">
                          <p className="text-xs text-gray-400 font-medium px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5">
                            <ImageIcon size={11} /> Voucher adjunto
                          </p>
                          <div className="relative h-32 bg-gray-50">
                            <Image src={voucherPreview} alt="Voucher" fill className="object-contain p-2" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-brand-700 to-accent-600 text-white py-4 rounded-2xl font-black text-base hover:shadow-2xl hover:shadow-brand-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading
                      ? <><Loader2 size={20} className="animate-spin" /> Procesando tu pedido...</>
                      : <>Confirmar pedido · S/ {finalTotal.toFixed(2)} <CheckCircle size={20} /></>
                    }
                  </motion.button>
                  <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5 mt-2">
                    <Lock size={10} className="text-brand-400" /> Tu información está 100% protegida y segura
                  </p>
                </motion.div>
              )}

              {/* ─── STEP 4: ÉXITO ─── */}
              {step === "exito" && (
                <motion.div key="exito" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-24 h-24 mx-auto mb-6 relative"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-200">
                      <CheckCircle size={48} className="text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-green-400 rounded-full"
                    />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">¡Pedido confirmado!</h2>
                    {orderId && <p className="text-xs text-gray-400 mb-2 font-mono">ID: {orderId.slice(-8).toUpperCase()}</p>}
                    <p className="text-gray-500 mb-1.5">
                      Te confirmamos a <span className="font-bold text-gray-800">{form.email}</span>
                    </p>
                    <p className="text-gray-400 text-sm mb-2">
                      Pago con <span className="font-semibold text-brand-600">{method?.name}</span>.
                      Verificaremos tu voucher y te contactamos pronto.
                    </p>

                    {/* Timeline */}
                    <div className="mt-6 bg-gray-50 rounded-2xl p-4 text-left space-y-3 max-w-sm mx-auto">
                      {[
                        { step: "Verificación de pago", time: "En las próximas 2 horas", done: true },
                        { step: "Preparación del pedido", time: "24 horas", done: false },
                        { step: "Envío y seguimiento", time: "24-48 horas", done: false },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${s.done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                            {s.done ? <Check size={12} /> : i + 1}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${s.done ? "text-gray-900" : "text-gray-500"}`}>{s.step}</p>
                            <p className="text-xs text-gray-400">{s.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Seguimiento */}
                    {orderId && (
                      <div className="mt-6 bg-brand-50 border border-brand-200 rounded-2xl p-4 text-center">
                        <p className="text-xs text-brand-600 font-semibold mb-2">Guarda tu número de pedido</p>
                        <p className="font-mono font-black text-brand-800 text-lg tracking-widest">#{orderId.slice(-8).toUpperCase()}</p>
                        <Link
                          href={`/seguimiento?email=${encodeURIComponent(form.email)}&orderId=${orderId}`}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
                        >
                          Seguir mi pedido →
                        </Link>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                      <Link href="/" className="bg-gradient-to-r from-brand-700 to-accent-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-xl transition-all">
                        Volver al inicio
                      </Link>
                      <Link href="/productos" className="border-2 border-brand-200 text-brand-700 px-8 py-3.5 rounded-2xl font-bold hover:bg-brand-50 transition-all">
                        Seguir comprando
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RESUMEN LATERAL ── */}
          {step !== "exito" && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-gray-900 text-sm">Tu pedido</h3>
                  <Link href="/carrito" className="text-xs text-brand-600 hover:underline">Editar</Link>
                </div>

                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-2.5">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image src={item.image || ""} alt={item.name} fill sizes="44px" className="object-cover" />
                        <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[9px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-black px-1">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                        {item.selectedSize && <p className="text-[10px] text-gray-400">Talla: {item.selectedSize}</p>}
                      </div>
                      <p className="text-xs font-black text-gray-900 shrink-0">S/ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Cupón */}
                <div className="border-t border-dashed border-gray-100 mt-4 pt-4">
                  {coupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <Tag size={13} className="text-green-600" />
                        <div>
                          <p className="text-xs font-bold text-green-700 font-mono">{coupon.code}</p>
                          <p className="text-[10px] text-green-600">-S/ {couponDiscount.toFixed(2)} aplicado</p>
                        </div>
                      </div>
                      <button onClick={removeCoupon} className="text-green-500 hover:text-red-500 transition-colors"><X size={14} /></button>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <div className="flex gap-2">
                        <input type="text" placeholder="Código de cupón" value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-300 uppercase" />
                        <button onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()}
                          className="bg-brand-100 text-brand-700 text-xs font-bold px-3 py-2 rounded-xl hover:bg-brand-200 transition-colors disabled:opacity-50 flex items-center gap-1">
                          {couponLoading ? <Loader2 size={12} className="animate-spin" /> : <Tag size={12} />}
                          Aplicar
                        </button>
                      </div>
                      {couponError && <p className="text-red-500 text-[10px] mt-1">{couponError}</p>}
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-500">
                      <span className="flex items-center gap-1"><Truck size={12} />Envío</span>
                      <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>{shipping === 0 ? "¡Gratis!" : `S/ ${shipping.toFixed(2)}`}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span className="flex items-center gap-1"><Tag size={12} />Descuento</span>
                        <span>-S/ {couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                      <span className="font-black text-gray-900">Total</span>
                      <span className="text-lg font-black gradient-text">S/ {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Seguridad */}
                <div className="mt-4 pt-4 border-t border-gray-50 space-y-1.5">
                  {[
                    { icon: Lock, text: "Pago 100% seguro y encriptado" },
                    { icon: Truck, text: "Seguimiento en tiempo real" },
                    { icon: CheckCircle, text: "Garantía de satisfacción" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                      <Icon size={11} className="text-green-500 shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
