"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, User } from "lucide-react";

interface Order { id: string; total: number; status: string; createdAt: string; }
interface Customer {
  id: string; name: string; email: string; phone: string; createdAt: string;
  orders: Order[];
}

const statusColors: Record<string, string> = {
  Pendiente: "text-yellow-400", Enviado: "text-blue-400",
  Entregado: "text-green-400", Cancelado: "text-red-400",
};

export default function AdminClientes() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Customer | null>(null);

  useEffect(() => {
    fetch("/api/admin/customers").then((r) => r.json()).then((d) => { setCustomers(d); setLoading(false); });
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Clientes</h1>
        <p className="text-gray-400 text-sm mt-1">{customers.length} clientes registrados</p>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
          className="w-full sm:w-80 bg-gray-900 border border-gray-800 text-white placeholder-gray-500 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Cliente</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Teléfono</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Pedidos</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Total gastado</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Registro</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Historial</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td colSpan={6} className="px-5 py-4"><div className="h-7 shimmer rounded-lg" /></td>
                    </tr>
                  ))
                : filtered.map((c) => {
                    const totalSpent = c.orders.filter((o) => o.status !== "Cancelado").reduce((s, o) => s + o.total, 0);
                    return (
                      <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{c.name}</p>
                              <p className="text-xs text-gray-500">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-300">{c.phone || "—"}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-white">{c.orders.length}</td>
                        <td className="px-5 py-4 text-sm font-bold text-white">S/ {totalSpent.toFixed(2)}</td>
                        <td className="px-5 py-4 text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString("es-PE")}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => setDetail(c)} className="text-xs bg-gray-800 hover:bg-violet-900/40 hover:text-violet-400 px-3 py-1.5 rounded-lg transition-colors">
                            Ver pedidos
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
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
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {detail.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-white">{detail.name}</h2>
                    <p className="text-xs text-gray-400">{detail.email}</p>
                  </div>
                </div>
                <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  <User size={14} className="text-gray-400" />
                  <p className="text-xs font-semibold text-gray-400 uppercase">Historial de pedidos</p>
                </div>
                {detail.orders.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">Sin pedidos aún</p>
                ) : (
                  <div className="space-y-3">
                    {detail.orders.map((o) => (
                      <div key={o.id} className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 font-mono">{o.id.slice(0, 8)}…</p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(o.createdAt).toLocaleDateString("es-PE")}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white text-sm">S/ {o.total.toFixed(2)}</p>
                          <p className={`text-xs font-medium ${statusColors[o.status] ?? "text-gray-400"}`}>{o.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
