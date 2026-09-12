"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, Truck } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Fix hidratación SSR con Zustand + limpiar items con IDs legacy (numéricos)
  useEffect(() => {
    setMounted(true);
    // Si hay items con IDs numéricos (versión antigua), limpiar el carrito
    const hasLegacyIds = items.some((i) => typeof i.id === "number" || /^\d+$/.test(String(i.id)));
    if (hasLegacyIds) clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!mounted) return null;

  const subtotal = total();
  const shipping = subtotal >= 150 ? 0 : 10;
  const finalTotal = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-24 h-24 bg-gradient-to-br from-brand-100 to-accent-100 rounded-full flex items-center justify-center mb-6"
        >
          <ShoppingBag size={40} className="text-brand-400" />
        </motion.div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8 max-w-xs">Descubre nuestra colección y agrega tus prendas favoritas.</p>
        <Link
          href="/productos"
          className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-200 transition-all"
        >
          <ShoppingBag size={18} /> Explorar tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/productos" className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-brand-100 hover:text-brand-600 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Mi carrito</h1>
          <p className="text-gray-400 text-sm mt-0.5">{items.reduce((a, i) => a + i.quantity, 0)} artículos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Items */}
        <div className="lg:col-span-3 space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={`${item.id}-${item.selectedSize}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-100 transition-all"
              >
                {/* Image */}
                <Link href={`/productos/${item.id}`} className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/productos/${item.id}`}>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight hover:text-brand-600 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium border border-brand-100">
                      {item.category}
                    </span>
                    {item.selectedSize && (
                      <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
                        Talla: {item.selectedSize}
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-black bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent mt-2">
                    S/ {item.price.toFixed(2)}
                  </p>

                  {/* Quantity + Delete */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-brand-400 hover:text-brand-600 transition-all shadow-sm"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-brand-400 hover:text-brand-600 transition-all shadow-sm"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-700 hidden sm:block">
                        = S/ {(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id, item.selectedSize)}
                        className="w-8 h-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors mt-2 flex items-center gap-1"
          >
            <Trash2 size={13} /> Vaciar carrito
          </button>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-black text-gray-900 mb-5">Resumen del pedido</h2>

            {/* Envío gratis progress */}
            {subtotal < 150 && (
              <div className="mb-5 p-3 bg-brand-50 rounded-xl border border-brand-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-brand-700 font-medium flex items-center gap-1">
                    <Truck size={12} /> Faltan S/ {(150 - subtotal).toFixed(2)} para envío gratis
                  </span>
                </div>
                <div className="h-1.5 bg-brand-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all"
                    style={{ width: `${Math.min((subtotal / 150) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span className="font-semibold">S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1"><Truck size={13} /> Envío</span>
                <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                  {shipping === 0 ? "¡Gratis!" : `S/ ${shipping.toFixed(2)}`}
                </span>
              </div>
              {subtotal >= 150 && (
                <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                  <Tag size={11} /> ¡Envío gratis aplicado!
                </div>
              )}
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-black text-gray-900 text-base">Total</span>
                <span className="text-2xl font-black bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                  S/ {finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="mt-6 w-full bg-gradient-to-r from-brand-600 to-accent-600 text-white py-4 rounded-2xl font-black text-base hover:shadow-xl hover:shadow-brand-200 transition-all text-center cursor-pointer"
              >
                Proceder al pago →
              </motion.div>
            </Link>

            {/* Payment methods */}
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-400">
              <span className="bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg font-medium">Yape</span>
              <span className="bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg font-medium">Plin</span>
              <span className="bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg font-medium">Tarjeta</span>
              <span className="bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg font-medium">Efectivo</span>
            </div>

            <Link
              href="/productos"
              className="mt-4 block text-center text-sm text-gray-400 hover:text-brand-600 transition-colors"
            >
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
