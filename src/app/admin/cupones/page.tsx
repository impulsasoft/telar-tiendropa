"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Trash2, ToggleLeft, ToggleRight, Tag, Percent, DollarSign } from "lucide-react";

interface Coupon {
  id: string; code: string; type: string; discount: number; minOrder: number;
  maxUses: number; usedCount: number; active: boolean; expiresAt: string | null; createdAt: string;
}

const empty = { code: "", type: "percent", discount: "", minOrder: "", maxUses: "", expiresAt: "" };

export default function AdminCupones() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => fetch("/api/admin/cupones").then((r) => r.json()).then((d) => { setCoupons(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.code || !form.discount) { setError("Código y descuento son requeridos"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/admin/cupones", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, discount: parseFloat(form.discount), minOrder: parseFloat(form.minOrder || "0"), maxUses: parseInt(form.maxUses || "0") }),
    });
    if (res.ok) { await load(); setModal(false); setForm(empty); }
    else { const d = await res.json(); setError(d.error ?? "Error al crear"); }
    setSaving(false);
  };

  const toggleActive = async (c: Coupon) => {
    await fetch(`/api/admin/cupones/${c.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !c.active }) });
    await load();
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("¿Eliminar este cupón?")) return;
    await fetch(`/api/admin/cupones/${id}`, { method: "DELETE" });
    await load();
  };

  const isExpired = (c: Coupon) => c.expiresAt && new Date() > new Date(c.expiresAt);

  return (
    <div className="p-6 lg:p-8 text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Cupones</h1>
          <p className="text-gray-400 text-sm mt-1">{coupons.filter((c) => c.active).length} cupones activos</p>
        </div>
        <button onClick={() => { setModal(true); setForm(empty); setError(""); }}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-5 py-3 rounded-xl font-bold hover:shadow-xl transition-all">
          <Plus size={18} /> Nuevo cupón
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total cupones", value: coupons.length, icon: "🎟️" },
          { label: "Activos", value: coupons.filter((c) => c.active).length, icon: "✅" },
          { label: "Usos totales", value: coupons.reduce((a, c) => a + c.usedCount, 0), icon: "🔢" },
          { label: "Expirados", value: coupons.filter(isExpired).length, icon: "⏰" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-lg mb-1">{s.icon}</p>
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                {["Código", "Tipo", "Descuento", "Mín. pedido", "Usos", "Expira", "Estado", ""].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800"><td colSpan={8} className="px-5 py-4"><div className="h-7 shimmer rounded-lg" /></td></tr>
                  ))
                : coupons.map((c) => (
                    <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                            <Tag size={13} className="text-white" />
                          </div>
                          <span className="font-black text-white font-mono tracking-wider">{c.code}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${c.type === "percent" ? "bg-violet-900/30 text-violet-400 border-violet-800" : "bg-green-900/30 text-green-400 border-green-800"}`}>
                          {c.type === "percent" ? <span className="flex items-center gap-1"><Percent size={10} />Porcentaje</span> : <span className="flex items-center gap-1"><DollarSign size={10} />Monto fijo</span>}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-black text-white">
                        {c.type === "percent" ? `${c.discount}%` : `S/ ${c.discount}`}
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-sm">
                        {c.minOrder > 0 ? `S/ ${c.minOrder}` : <span className="text-gray-600">Sin mínimo</span>}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span className={c.maxUses > 0 && c.usedCount >= c.maxUses ? "text-red-400" : "text-gray-300"}>
                          {c.usedCount}{c.maxUses > 0 ? `/${c.maxUses}` : " usos"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {c.expiresAt
                          ? <span className={isExpired(c) ? "text-red-400" : "text-gray-300"}>{new Date(c.expiresAt).toLocaleDateString("es-PE")}</span>
                          : <span className="text-gray-600">Sin fecha</span>}
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => toggleActive(c)} className="flex items-center gap-1.5 text-xs">
                          {c.active && !isExpired(c)
                            ? <><ToggleRight size={18} className="text-green-400" /><span className="text-green-400">Activo</span></>
                            : <><ToggleLeft size={18} className="text-gray-500" /><span className="text-gray-500">{isExpired(c) ? "Expirado" : "Inactivo"}</span></>}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => deleteCoupon(c.id)} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-red-900/40 hover:text-red-400 flex items-center justify-center transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
          {!loading && coupons.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Tag size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No hay cupones aún</p>
              <p className="text-sm mt-1">Crea tu primer cupón para campañas de marketing</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal crear */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="font-bold text-white text-lg">Nuevo cupón</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4">
                {/* Código */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Código *</label>
                  <input type="text" placeholder="VERANO20" value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-mono tracking-wider" />
                </div>

                {/* Tipo + Descuento */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Tipo</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm">
                      <option value="percent">Porcentaje (%)</option>
                      <option value="fixed">Monto fijo (S/)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Descuento *</label>
                    <div className="relative">
                      <input type="number" placeholder={form.type === "percent" ? "20" : "15"} value={form.discount}
                        onChange={(e) => setForm({ ...form, discount: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm pr-10" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                        {form.type === "percent" ? "%" : "S/"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mín + Máx usos */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Pedido mínimo (S/)</label>
                    <input type="number" placeholder="0" value={form.minOrder}
                      onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Máx. usos (0=ilimitado)</label>
                    <input type="number" placeholder="0" value={form.maxUses}
                      onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                </div>

                {/* Fecha expiración */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Fecha de expiración (opcional)</label>
                  <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                </div>

                {error && <p className="text-red-400 text-xs bg-red-900/20 border border-red-800 rounded-xl px-3 py-2">{error}</p>}

                {/* Preview */}
                {form.code && form.discount && (
                  <div className="bg-gradient-to-r from-violet-900/40 to-pink-900/40 border border-violet-700 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Vista previa</p>
                    <p className="text-2xl font-black text-white font-mono tracking-widest">{form.code}</p>
                    <p className="text-violet-300 text-sm mt-1">
                      {form.type === "percent" ? `${form.discount}% de descuento` : `S/ ${form.discount} de descuento`}
                      {parseFloat(form.minOrder || "0") > 0 && ` · Mín. S/ ${form.minOrder}`}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-800 flex gap-3">
                <button onClick={() => setModal(false)} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition-colors text-sm">Cancelar</button>
                <button onClick={handleCreate} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold hover:shadow-xl transition-all text-sm disabled:opacity-60">
                  <Check size={16} />{saving ? "Creando..." : "Crear cupón"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
