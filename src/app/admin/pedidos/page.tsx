"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Filter, Phone, MapPin, CreditCard, ImageIcon, Eye } from "lucide-react";

interface OrderItem {
  id: string; quantity: number; price: number; size: string;
  product: { name: string; image: string };
}
interface Payment {
  method: string; reference: string | null; status: string;
}
interface Order {
  id: string; total: number; status: string; createdAt: string;
  customer: { name: string; email: string; phone?: string; address?: string };
  items: OrderItem[];
  payments?: Payment[];
}

function VoucherData({ reference }: { reference: string | null }) {
  if (!reference) return null;
  try {
    const data = JSON.parse(reference);
    return (
      <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase">Comprobante de pago</p>
        {data.number && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">N° de operación</span>
            <span className="text-sm font-mono font-bold text-white">{data.number}</span>
          </div>
        )}
        {data.image && (
          <div className="rounded-xl overflow-hidden border border-gray-700">
            <p className="text-xs text-gray-500 px-3 py-1.5 bg-gray-900 flex items-center gap-1.5 border-b border-gray-700">
              <ImageIcon size={10} /> Voucher adjunto
            </p>
            <div className="relative h-48 bg-gray-900">
              <Image src={data.image} alt="Voucher" fill className="object-contain p-2" />
            </div>
            <a href={data.image} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs text-violet-400 py-2 hover:bg-violet-900/20 transition-colors">
              <Eye size={11} /> Ver tamaño completo
            </a>
          </div>
        )}
      </div>
    );
  } catch { return null; }
}

const statuses = ["Todos", "Pendiente", "Enviado", "Entregado", "Cancelado"];
const statusColors: Record<string, string> = {
  Pendiente: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
  Enviado: "bg-blue-900/30 text-blue-400 border-blue-800",
  Entregado: "bg-green-900/30 text-green-400 border-green-800",
  Cancelado: "bg-red-900/30 text-red-400 border-red-800",
};

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todos");
  const [detail, setDetail] = useState<Order | null>(null);

  const load = () =>
    fetch("/api/admin/orders").then((r) => r.json()).then((d) => { setOrders(d); setLoading(false); });

  useEffect(() => { load(); }, []);

  const filtered = filter === "Todos" ? orders : orders.filter((o) => o.status === filter);

  const changeStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    if (detail?.id === id) setDetail((d) => d ? { ...d, status } : null);
  };

  return (
    <div className="p-6 lg:p-8 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Pedidos</h1>
        <p className="text-gray-400 text-sm mt-1">{orders.length} pedidos en total</p>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <Filter size={14} className="text-gray-500" />
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
              filter === s ? "bg-violet-600 border-violet-600 text-white" : "border-gray-700 text-gray-400 hover:border-violet-600 hover:text-violet-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">ID</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Cliente</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Total</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Estado</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Fecha</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td colSpan={6} className="px-5 py-4"><div className="h-7 shimmer rounded-lg" /></td>
                    </tr>
                  ))
                : filtered.map((o) => (
                    <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-4 text-xs text-gray-500 font-mono">{o.id.slice(0, 8)}…</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-white">{o.customer.name}</p>
                        <p className="text-xs text-gray-500">{o.customer.email}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-white">S/ {o.total.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <select
                          value={o.status}
                          onChange={(e) => changeStatus(o.id, e.target.value)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border bg-transparent font-medium cursor-pointer ${statusColors[o.status] ?? "border-gray-700 text-gray-400"}`}
                        >
                          {["Pendiente", "Enviado", "Entregado", "Cancelado"].map((s) => <option key={s} className="bg-gray-900">{s}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("es-PE")}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => setDetail(o)} className="text-xs bg-gray-800 hover:bg-violet-900/40 hover:text-violet-400 px-3 py-1.5 rounded-lg transition-colors">
                          Ver detalle
                        </button>
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div>
                  <h2 className="font-bold text-white">Detalle del pedido</h2>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{detail.id}</p>
                </div>
                <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                {/* Customer info */}
                <div className="bg-gray-800/50 rounded-xl p-4 space-y-1.5">
                  <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">Cliente</p>
                  <p className="text-white font-medium">{detail.customer.name}</p>
                  <p className="text-gray-400 text-sm">{detail.customer.email}</p>
                  {detail.customer.phone && (
                    <p className="text-gray-400 text-sm flex items-center gap-1.5">
                      <Phone size={11} className="text-violet-400" />{detail.customer.phone}
                    </p>
                  )}
                  {detail.customer.address && (
                    <p className="text-gray-400 text-sm flex items-center gap-1.5">
                      <MapPin size={11} className="text-violet-400" />{detail.customer.address}
                    </p>
                  )}
                </div>

                {/* Payment info */}
                {detail.payments && detail.payments.length > 0 && (
                  <div className="space-y-3">
                    <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-violet-400" />
                        <div>
                          <p className="text-xs text-gray-400">Método de pago</p>
                          <p className="text-sm font-bold text-white">{detail.payments[0].method}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        detail.payments[0].status === "Aprobado" ? "bg-green-900/40 text-green-400" :
                        detail.payments[0].status === "Rechazado" ? "bg-red-900/40 text-red-400" :
                        "bg-yellow-900/40 text-yellow-400"
                      }`}>
                        {detail.payments[0].status}
                      </span>
                    </div>
                    <VoucherData reference={detail.payments[0].reference} />
                  </div>
                )}
                {/* Items */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-3 uppercase">Productos</p>
                  <div className="space-y-3">
                    {detail.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{item.product.name}</p>
                          <p className="text-xs text-gray-500">x{item.quantity} {item.size && `· Talla ${item.size}`}</p>
                        </div>
                        <p className="text-sm font-bold text-white">S/ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Total */}
                <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
                  <span className="font-bold text-white">Total</span>
                  <span className="text-xl font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">S/ {detail.total.toFixed(2)}</span>
                </div>
                {/* Change status */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">Cambiar estado</p>
                  <div className="flex gap-2 flex-wrap">
                    {["Pendiente", "Enviado", "Entregado", "Cancelado"].map((s) => (
                      <button
                        key={s}
                        onClick={() => changeStatus(detail.id, s)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${detail.status === s ? "bg-violet-600 border-violet-600 text-white" : "border-gray-700 text-gray-400 hover:border-violet-600"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
