"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Check, X, Trash2, Eye, EyeOff } from "lucide-react";

interface Review {
  id: string; rating: number; customerName: string; customerEmail: string;
  comment: string; approved: boolean; createdAt: string;
  product: { name: string; image: string };
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < n ? "fill-yellow-400 text-yellow-400" : "text-gray-600"} />
      ))}
    </div>
  );
}

export default function AdminResenas() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const load = () => fetch("/api/admin/resenas").then((r) => r.json()).then((d) => { setReviews(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const toggle = async (r: Review) => {
    await fetch(`/api/admin/resenas/${r.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved: !r.approved }) });
    await load();
  };

  const del = async (id: string) => {
    if (!confirm("¿Eliminar esta reseña?")) return;
    await fetch(`/api/admin/resenas/${id}`, { method: "DELETE" });
    await load();
  };

  const filtered = reviews.filter((r) =>
    filter === "all" ? true : filter === "pending" ? !r.approved : r.approved
  );

  const pending = reviews.filter((r) => !r.approved).length;

  return (
    <div className="p-6 lg:p-8 text-white">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Reseñas</h1>
          <p className="text-gray-400 text-sm mt-1">{reviews.length} reseñas · {pending} pendientes de aprobación</p>
        </div>
        {pending > 0 && (
          <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-400 px-4 py-2 rounded-xl text-sm font-semibold">
            ⚠️ {pending} pendiente{pending > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: reviews.length, icon: "⭐" },
          { label: "Aprobadas", value: reviews.filter((r) => r.approved).length, icon: "✅" },
          { label: "Pendientes", value: pending, icon: "⏳" },
          { label: "Promedio", value: reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) + " ★" : "—", icon: "📊" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-lg mb-1">{s.icon}</p>
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-5">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-4 py-2 rounded-full border font-medium transition-all ${filter === f ? "bg-violet-600 border-violet-600 text-white" : "border-gray-700 text-gray-400 hover:border-violet-600 hover:text-violet-400"}`}>
            {f === "all" ? "Todas" : f === "pending" ? "Pendientes" : "Aprobadas"}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 shimmer rounded-2xl" />)
          : filtered.map((r) => (
              <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`bg-gray-900 border rounded-2xl p-5 flex gap-4 items-start ${r.approved ? "border-gray-800" : "border-yellow-800/50 bg-yellow-900/5"}`}>
                {/* Producto */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                  <Image src={r.product.image} alt={r.product.name} fill sizes="48px" className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-xs text-gray-500 truncate">{r.product.name}</p>
                      <p className="font-bold text-white text-sm">{r.customerName}</p>
                      <p className="text-xs text-gray-500">{r.customerEmail}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Stars n={r.rating} />
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.approved ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-yellow-900/30 text-yellow-400 border border-yellow-800"}`}>
                        {r.approved ? "Publicada" : "Pendiente"}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mt-2 leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                  <p className="text-gray-600 text-xs mt-2">{new Date(r.createdAt).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button onClick={() => toggle(r)} title={r.approved ? "Ocultar" : "Aprobar"}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${r.approved ? "bg-gray-800 hover:bg-yellow-900/40 hover:text-yellow-400" : "bg-green-900/30 text-green-400 hover:bg-green-900/60"}`}>
                    {r.approved ? <EyeOff size={14} /> : <Check size={14} />}
                  </button>
                  <button onClick={() => del(r.id)} className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-red-900/40 hover:text-red-400 flex items-center justify-center transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Star size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No hay reseñas {filter !== "all" ? "en esta categoría" : "aún"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
