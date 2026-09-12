"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight, Search, TrendingUp, DollarSign, Images } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

interface Product {
  id: string; name: string; description: string; price: number; costPrice: number;
  image: string; images: string; category: string; sizes: string; stock: number; active: boolean;
}

const emptyForm = {
  name: "", description: "", price: "", costPrice: "",
  category: "Vestidos", sizes: "", stock: "", active: true,
};

const categoryOptions = ["Vestidos", "Pantalones", "Blusas", "Chaquetas", "Faldas", "Accesorios", "Calzado"];
const SIZES_PRESETS: Record<string, string> = {
  Ropa: "XS, S, M, L, XL", Pantalones: "28, 30, 32, 34, 36", Calzado: "36, 37, 38, 39, 40, 41",
};

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = () =>
    fetch("/api/admin/products").then((r) => r.json()).then((d) => { setProducts(d); setLoading(false); });

  useEffect(() => { load(); }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalInventoryValue = products.reduce((s, p) => s + p.costPrice * p.stock, 0);
  const avgMargin = products.length
    ? products.reduce((s, p) => s + (p.costPrice > 0 ? ((p.price - p.costPrice) / p.price) * 100 : 0), 0) / products.length
    : 0;

  const parseImages = (p: Product): string[] => {
    try { return JSON.parse(p.images); } catch { return p.image ? [p.image] : []; }
  };

  const openCreate = () => { setForm(emptyForm); setFormImages([]); setErrors({}); setModal("create"); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, description: p.description, price: String(p.price), costPrice: String(p.costPrice),
      category: p.category, sizes: JSON.parse(p.sizes).join(", "), stock: String(p.stock), active: p.active,
    });
    setFormImages(parseImages(p));
    setEditId(p.id);
    setErrors({});
    setModal("edit");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nombre requerido";
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) e.price = "Precio inválido";
    if (!form.stock || isNaN(parseInt(form.stock))) e.stock = "Stock inválido";
    if (formImages.length === 0) e.images = "Agrega al menos una imagen";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      costPrice: form.costPrice ? parseFloat(form.costPrice) : 0,
      image: formImages[0] ?? "",
      images: JSON.stringify(formImages),
      category: form.category,
      sizes: JSON.stringify(form.sizes.split(",").map((s) => s.trim()).filter(Boolean)),
      stock: parseInt(form.stock),
      active: form.active,
    };
    if (modal === "create") {
      await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch(`/api/admin/products/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    await load();
    setModal(null);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleteId(null);
    await load();
  };

  const toggleActive = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
    await load();
  };

  const getMargin = (p: Product) => {
    if (!p.costPrice) return null;
    return ((p.price - p.costPrice) / p.price * 100).toFixed(1);
  };

  return (
    <div className="p-6 lg:p-8 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Productos</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} productos en catálogo</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-5 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-violet-900/40 transition-all">
          <Plus size={18} /> Nuevo producto
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Productos", value: products.length, icon: "📦", color: "text-violet-400" },
          { label: "Stock total", value: totalStock, icon: "🗃️", color: "text-blue-400" },
          { label: "Valor inventario", value: `S/ ${totalInventoryValue.toFixed(0)}`, icon: "💰", color: "text-yellow-400" },
          { label: "Margen promedio", value: `${avgMargin.toFixed(1)}%`, icon: "📈", color: "text-green-400" },
        ].map((m) => (
          <div key={m.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-lg mb-1">{m.icon}</p>
            <p className={`text-xl font-black ${m.color}`}>{m.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          className="w-full sm:w-80 bg-gray-900 border border-gray-800 text-white placeholder-gray-500 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Producto</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Cat.</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase"><div className="flex items-center gap-1"><DollarSign size={12} />Costo</div></th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Venta</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase"><div className="flex items-center gap-1"><TrendingUp size={12} />Margen</div></th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Stock</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Estado</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td colSpan={8} className="px-4 py-4"><div className="h-8 shimmer rounded-lg" /></td>
                    </tr>
                  ))
                : filtered.map((p) => {
                    const margin = getMargin(p);
                    const imgs = parseImages(p);
                    return (
                      <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {/* Thumbnails stack */}
                            <div className="flex -space-x-2 shrink-0">
                              {imgs.slice(0, 3).map((img, i) => (
                                <div key={i} className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-800 border-2 border-gray-900" style={{ zIndex: 3 - i }}>
                                  <Image src={img} alt="" fill sizes="40px" className="object-cover" />
                                </div>
                              ))}
                              {imgs.length === 0 && (
                                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-600">📷</div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-white truncate max-w-[130px]">{p.name}</p>
                              {imgs.length > 1 && (
                                <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Images size={9} />{imgs.length} fotos
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-violet-900/30 text-violet-400 border border-violet-800 px-2 py-0.5 rounded-full">{p.category}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">{p.costPrice > 0 ? `S/ ${p.costPrice.toFixed(2)}` : <span className="text-gray-600">—</span>}</td>
                        <td className="px-4 py-3 text-sm font-bold text-white">S/ {p.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          {margin !== null ? (
                            <span className={`text-sm font-bold ${parseFloat(margin) >= 30 ? "text-green-400" : parseFloat(margin) >= 15 ? "text-yellow-400" : "text-red-400"}`}>
                              {margin}%
                            </span>
                          ) : <span className="text-gray-600 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-semibold ${p.stock < 5 ? "text-red-400" : p.stock < 15 ? "text-yellow-400" : "text-green-400"}`}>
                            {p.stock}{p.stock < 5 && " ⚠️"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleActive(p)} className="flex items-center gap-1.5 text-xs">
                            {p.active
                              ? <><ToggleRight size={18} className="text-green-400" /><span className="text-green-400">Activo</span></>
                              : <><ToggleLeft size={18} className="text-gray-500" /><span className="text-gray-500">Inactivo</span></>}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-violet-900/40 hover:text-violet-400 flex items-center justify-center transition-colors">
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-red-900/40 hover:text-red-400 flex items-center justify-center transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL CREAR/EDITAR ── */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

              <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
                <h2 className="font-bold text-white text-lg">{modal === "create" ? "Nuevo producto" : "Editar producto"}</h2>
                <button onClick={() => setModal(null)} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-5">

                {/* ── IMÁGENES ── */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
                    <Images size={12} /> Fotos del producto *
                    <span className="text-gray-600 font-normal">(primera = foto principal)</span>
                  </label>
                  <ImageUploader images={formImages} onChange={setFormImages} maxImages={6} />
                  {errors.images && <p className="text-red-400 text-xs mt-1">{errors.images}</p>}
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Nombre del producto *</label>
                  <input type="text" placeholder="Ej: Vestido Floral Primavera"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full bg-gray-800 border text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm ${errors.name ? "border-red-500" : "border-gray-700"}`} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Descripción</label>
                  <textarea rows={2} placeholder="Describe el producto brevemente..."
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none" />
                </div>

                {/* Precios */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Precio costo (S/)</label>
                    <input type="number" placeholder="0.00" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Precio venta (S/) *</label>
                    <input type="number" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className={`w-full bg-gray-800 border text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm ${errors.price ? "border-red-500" : "border-gray-700"}`} />
                    {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                  </div>
                </div>

                {/* Margen en tiempo real */}
                {form.price && form.costPrice && parseFloat(form.price) > 0 && parseFloat(form.costPrice) > 0 && (
                  <div className="bg-gray-800 rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div><p className="text-gray-400">Utilidad</p><p className="text-green-400 font-bold">S/ {(parseFloat(form.price) - parseFloat(form.costPrice)).toFixed(2)}</p></div>
                    <div><p className="text-gray-400">Margen</p><p className="text-violet-400 font-bold">{(((parseFloat(form.price) - parseFloat(form.costPrice)) / parseFloat(form.price)) * 100).toFixed(1)}%</p></div>
                    <div><p className="text-gray-400">Markup</p><p className="text-pink-400 font-bold">{(((parseFloat(form.price) - parseFloat(form.costPrice)) / parseFloat(form.costPrice)) * 100).toFixed(1)}%</p></div>
                  </div>
                )}

                {/* Categoría + Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Categoría</label>
                    <select value={form.category} onChange={(e) => {
                      const cat = e.target.value;
                      const preset = cat === "Pantalones" ? SIZES_PRESETS.Pantalones : cat === "Calzado" ? SIZES_PRESETS.Calzado : SIZES_PRESETS.Ropa;
                      setForm({ ...form, category: cat, sizes: preset });
                    }} className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm">
                      {categoryOptions.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Stock *</label>
                    <input type="number" placeholder="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className={`w-full bg-gray-800 border text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm ${errors.stock ? "border-red-500" : "border-gray-700"}`} />
                    {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock}</p>}
                  </div>
                </div>

                {/* Tallas */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Tallas (separadas por coma)</label>
                  <input type="text" placeholder="XS, S, M, L, XL" value={form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  {form.sizes && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.sizes.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                        <span key={s} className="bg-violet-900/40 text-violet-300 border border-violet-700 text-xs px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Toggle activo */}
                <div className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-300">Mostrar en tienda</span>
                  <button onClick={() => setForm({ ...form, active: !form.active })}
                    className={`flex items-center gap-1.5 text-sm font-medium ${form.active ? "text-green-400" : "text-gray-500"}`}>
                    {form.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    {form.active ? "Activo" : "Inactivo"}
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-gray-800 flex gap-3 sticky bottom-0 bg-gray-900">
                <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition-colors text-sm">Cancelar</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold hover:shadow-xl transition-all text-sm disabled:opacity-60">
                  <Check size={16} />
                  {saving ? "Guardando..." : "Guardar producto"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm delete */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="w-14 h-14 mx-auto bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="font-bold text-white mb-2">¿Eliminar producto?</h3>
              <p className="text-gray-400 text-sm mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition-colors text-sm">Cancelar</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors text-sm">Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
