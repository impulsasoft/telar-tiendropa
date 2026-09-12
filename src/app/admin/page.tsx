"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  DollarSign, ShoppingCart, Users, TrendingUp, Package, Clock,
  ArrowRight, RefreshCw, AlertTriangle,
} from "lucide-react";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgTicket: number;
  products: number;
  salesByDay: { day: string; ventas: number }[];
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  customer: { name: string };
}

const statusColors: Record<string, string> = {
  Pendiente: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
  Enviado: "bg-blue-900/30 text-blue-400 border-blue-800",
  Entregado: "bg-green-900/30 text-green-400 border-green-800",
  Cancelado: "bg-red-900/30 text-red-400 border-red-800",
};

function Counter({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const step = value / 40;
    let cur = 0;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(cur));
    }, 25);
    return () => clearInterval(timer);
  }, [value]);
  return <>{prefix}{display.toLocaleString("es-PE")}</>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadData = useCallback(async () => {
    setRefreshing(true);
    const [statsRes, ordersRes] = await Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ]);
    setStats(statsRes);
    setOrders(Array.isArray(ordersRes) ? ordersRes.slice(0, 5) : []);
    setLastUpdated(new Date());
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh cada 60 segundos
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  const kpis = stats
    ? [
        { label: "Ingresos totales", value: stats.totalRevenue, prefix: "S/ ", icon: DollarSign, color: "from-violet-600 to-violet-500", shadow: "shadow-violet-900/40", href: "/admin/pedidos" },
        { label: "Total pedidos", value: stats.totalOrders, prefix: "", icon: ShoppingCart, color: "from-pink-600 to-rose-500", shadow: "shadow-pink-900/40", href: "/admin/pedidos" },
        { label: "Clientes", value: stats.totalCustomers, prefix: "", icon: Users, color: "from-blue-600 to-cyan-500", shadow: "shadow-blue-900/40", href: "/admin/clientes" },
        { label: "Ticket promedio", value: Math.round(stats.avgTicket), prefix: "S/ ", icon: TrendingUp, color: "from-emerald-600 to-green-500", shadow: "shadow-emerald-900/40", href: "/admin" },
      ]
    : [];

  // Pedidos pendientes para alerta
  const pendingOrders = orders.filter((o) => o.status === "Pendiente").length;

  return (
    <div className="p-6 lg:p-8 text-white">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm" suppressHydrationWarning>
            Actualizado {lastUpdated.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={refreshing}
          className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-violet-500 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Actualizar
        </button>
      </motion.div>

      {/* Alerta pedidos pendientes */}
      {pendingOrders > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 bg-yellow-900/20 border border-yellow-800/50 text-yellow-400 px-5 py-3.5 rounded-xl"
        >
          <AlertTriangle size={16} className="shrink-0" />
          <p className="text-sm font-medium">
            Tienes <strong>{pendingOrders}</strong> pedido{pendingOrders !== 1 ? "s" : ""} pendiente{pendingOrders !== 1 ? "s" : ""} de procesar.
          </p>
          <Link href="/admin/pedidos" className="ml-auto flex items-center gap-1 text-xs font-bold text-yellow-300 hover:text-white transition-colors whitespace-nowrap">
            Ver pedidos <ArrowRight size={13} />
          </Link>
        </motion.div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats
          ? kpis.map(({ label, value, prefix, icon: Icon, color, shadow, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 relative overflow-hidden hover:border-gray-700 transition-colors cursor-pointer"
                onClick={() => { if (href !== "/admin") window.location.href = href; }}
              >
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-full -translate-y-6 translate-x-6`} />
                <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 shadow-lg ${shadow}`}>
                  <Icon size={18} className="text-white" />
                </div>
                <p className="text-2xl font-black text-white">
                  <Counter value={value} prefix={prefix} />
                </p>
                <p className="text-gray-400 text-xs mt-1">{label}</p>
              </motion.div>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 h-28 shimmer" />
            ))}
      </div>

      {/* Chart + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-white">Ventas últimos 7 días</h2>
            <span className="text-xs bg-violet-900/40 text-violet-400 px-3 py-1 rounded-full border border-violet-800">Esta semana</span>
          </div>
          {stats ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.salesByDay} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "12px", color: "#fff" }}
                  formatter={(v) => [`S/ ${v}`, "Ventas"]}
                />
                <Bar dataKey="ventas" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C63FF" />
                    <stop offset="100%" stopColor="#FF6B9D" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 shimmer rounded-xl" />
          )}
        </motion.div>

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <h2 className="font-bold text-white">Últimos pedidos</h2>
            </div>
            <Link href="/admin/pedidos" className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.length > 0
              ? orders.map((o) => (
                  <Link key={o.id} href="/admin/pedidos" className="flex items-center justify-between hover:bg-gray-800/50 -mx-2 px-2 py-1.5 rounded-lg transition-colors group">
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[120px] group-hover:text-violet-300 transition-colors">{o.customer.name}</p>
                      <p className="text-xs text-gray-500">
                        S/ {o.total.toFixed(2)} · {new Date(o.createdAt).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-lg border ${statusColors[o.status] ?? "bg-gray-800 text-gray-400 border-gray-700"}`}>
                      {o.status}
                    </span>
                  </Link>
                ))
              : (
                <div className="text-center py-6">
                  <ShoppingCart size={32} className="mx-auto text-gray-700 mb-2" />
                  <p className="text-gray-500 text-sm">Sin pedidos aún</p>
                  <p className="text-gray-600 text-xs mt-1">Los pedidos del checkout aparecerán aquí</p>
                </div>
              )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Package size={12} /> {stats?.products ?? "..."} productos activos
            </span>
            <Link href="/admin/productos" className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
              Gestionar <ArrowRight size={11} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
