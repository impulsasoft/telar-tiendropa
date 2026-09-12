"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import { Product, useCartStore } from "@/lib/store";
import { useState } from "react";
import { motion } from "framer-motion";

const PLACEHOLDER = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, product.sizes?.[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isLowStock = (product.stock ?? 999) > 0 && (product.stock ?? 999) <= 5;
  const isOutOfStock = (product.stock ?? 999) === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-200 transition-all duration-300 hover:shadow-xl hover:shadow-brand-100"
    >
      {/* Image */}
      <Link href={`/productos/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Image
          src={product.image || PLACEHOLDER}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? "opacity-60 grayscale" : ""}`}
          sizes="(max-width: 768px) 50vw, 25vw"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-md">
            {product.category}
          </span>
          {isLowStock && (
            <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-md">
              ¡Últimas!
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-md">
              Agotado
            </span>
          )}
        </div>

        {/* Quick view */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
            <Eye size={12} /> Ver detalle
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/productos/${product.id}`}>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight hover:text-brand-600 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-black bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
            S/ {product.price.toFixed(2)}
          </span>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full font-semibold transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
              added
                ? "bg-green-500 text-white shadow-green-200"
                : "bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:shadow-brand-200 hover:shadow-md"
            }`}
          >
            <ShoppingBag size={12} />
            {added ? "¡Listo!" : "Añadir"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
