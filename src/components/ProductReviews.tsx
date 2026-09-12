"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, CheckCircle, Loader2 } from "lucide-react";

interface Review {
  id: string; customerName: string; rating: number; comment: string; createdAt: string;
}

function Stars({ value, onChange, size = 20 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const filled = n <= (onChange ? (hover || value) : value);
        return (
          <button key={i} type="button"
            onClick={() => onChange?.(n)}
            onMouseEnter={() => onChange && setHover(n)}
            onMouseLeave={() => onChange && setHover(0)}
            disabled={!onChange}
            className={`transition-transform ${onChange ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}>
            <Star size={size} className={filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
          </button>
        );
      })}
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/resenas?productId=${productId}`)
      .then((r) => r.json()).then(setReviews).finally(() => setLoading(false));
  }, [productId]);

  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.rating || !form.comment) { setError("Completa todos los campos requeridos"); return; }
    setSubmitting(true); setError("");
    const res = await fetch("/api/resenas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...form }),
    });
    if (res.ok) setSubmitted(true);
    else setError("Error al enviar. Intenta de nuevo.");
    setSubmitting(false);
  };

  const ratingDist = [5, 4, 3, 2, 1].map((n) => ({
    n, count: reviews.filter((r) => r.rating === n).length,
    pct: reviews.length ? (reviews.filter((r) => r.rating === n).length / reviews.length) * 100 : 0,
  }));

  return (
    <section className="mt-16 border-t border-gray-100 pt-12">
      <h2 className="text-2xl font-black text-gray-900 mb-8">
        Reseñas de clientes{reviews.length > 0 && <span className="text-gray-400 font-normal text-lg ml-2">({reviews.length})</span>}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Resumen + distribución */}
        <div className="space-y-5">
          {reviews.length > 0 ? (
            <>
              <div className="text-center bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-100 rounded-2xl p-6">
                <p className="text-6xl font-black text-gray-900">{avg.toFixed(1)}</p>
                <Stars value={Math.round(avg)} size={22} />
                <p className="text-sm text-gray-400 mt-2">{reviews.length} reseña{reviews.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="space-y-2">
                {ratingDist.map(({ n, count, pct }) => (
                  <div key={n} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 w-4 text-right">{n}</span>
                    <Star size={12} className="fill-yellow-400 text-yellow-400 shrink-0" />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-gray-400 w-4 text-xs">{count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
              <Star size={32} className="mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-sm">Sin reseñas aún</p>
              <p className="text-xs mt-1">¡Sé el primero en opinar!</p>
            </div>
          )}
        </div>

        {/* Lista + formulario */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reviews */}
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {reviews.map((r) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm">
                            {r.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{r.customerName}</p>
                            <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}</p>
                          </div>
                        </div>
                      </div>
                      <Stars value={r.rating} size={14} />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Formulario */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Deja tu reseña</h3>
            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                <p className="font-bold text-gray-900">¡Gracias por tu reseña!</p>
                <p className="text-sm text-gray-500 mt-1">Será publicada después de revisión (usualmente en 24h).</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">Tu calificación *</label>
                  <Stars value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} size={28} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nombre *</label>
                    <input type="text" placeholder="Tu nombre" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email (opcional)</label>
                    <input type="email" placeholder="Para verificar tu compra" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Tu opinión *</label>
                  <textarea rows={3} placeholder="¿Cómo te quedó? ¿Qué tal la calidad y el envío?" value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button type="submit" disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white py-3 rounded-2xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-60">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {submitting ? "Enviando..." : "Publicar reseña"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
