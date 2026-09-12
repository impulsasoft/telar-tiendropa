"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Check, Truck, RotateCcw, Shield, Star, Package, ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import SizeGuideModal from "@/components/SizeGuideModal";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, Product } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";

interface Props {
  product: Product & { stock?: number; costPrice?: number; images?: string[] };
  related: (Product & { stock?: number })[];
}

export default function ProductoDetalleClient({ product, related }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  // Construir lista de imágenes (galería o imagen principal)
  const allImages = (product.images && product.images.length > 0)
    ? product.images
    : [product.image].filter(Boolean) as string[];

  const fallback = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80";

  const handleAdd = () => {
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const prevImg = () => setActiveImg((i) => (i - 1 + allImages.length) % allImages.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % allImages.length);

  const stockStatus = () => {
    const s = product.stock ?? 0;
    if (s === 0) return { text: "Agotado", color: "text-red-500", bg: "bg-red-50 border-red-200" };
    if (s <= 5) return { text: `¡Solo ${s} disponibles!`, color: "text-orange-500", bg: "bg-orange-50 border-orange-200" };
    return { text: "En stock", color: "text-green-600", bg: "bg-green-50 border-green-200" };
  };
  const stock = stockStatus();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
          <Link href="/" className="hover:text-brand-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-brand-600 transition-colors">Productos</Link>
          <span>/</span>
          <Link href={`/productos?cat=${product.category}`} className="hover:text-brand-600 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── GALERÍA ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>

            {/* Imagen principal */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-brand-100 bg-gray-100 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={allImages[activeImg] || fallback}
                    alt={`${product.name} - foto ${activeImg + 1}`}
                    fill sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover" priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Degradado */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                <span className="bg-gradient-to-r from-brand-600 to-accent-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {product.category}
                </span>
                {(product.stock ?? 0) <= 5 && (product.stock ?? 0) > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                    ¡Últimas!
                  </span>
                )}
              </div>

              {/* Zoom button */}
              <button
                onClick={() => setZoomed(true)}
                className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ZoomIn size={16} className="text-gray-700" />
              </button>

              {/* Flechas nav (solo si hay múltiples imágenes) */}
              {allImages.length > 1 && (
                <>
                  <button onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                    <ChevronLeft size={18} className="text-gray-700" />
                  </button>
                  <button onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                    <ChevronRight size={18} className="text-gray-700" />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`transition-all rounded-full ${i === activeImg ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
                    ))}
                  </div>
                </>
              )}

              {/* Contador */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {activeImg + 1}/{allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`relative w-16 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-brand-500 shadow-md shadow-brand-100" : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"}`}>
                    <Image src={img} alt={`Foto ${i + 1}`} fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── INFO ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-center">

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-gray-400 ml-1">(128 reseñas)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
            <p className="mt-4 text-gray-500 leading-relaxed">{product.description}</p>

            {/* Price */}
            <div className="mt-6 flex items-end gap-3">
              <span className="text-4xl font-black bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                S/ {product.price.toFixed(2)}
              </span>
            </div>

            {/* Stock badge */}
            <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium w-fit ${stock.bg} ${stock.color}`}>
              <Package size={13} />
              {stock.text}
            </div>

            {/* Tallas */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-700">Selecciona tu talla</p>
                  <SizeGuideModal category={product.category} sizes={product.sizes} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        selectedSize === s
                          ? "border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-200"
                          : "border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botón agregar */}
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleAdd}
              disabled={(product.stock ?? 1) === 0}
              className={`mt-8 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                added
                  ? "bg-green-500 text-white shadow-xl shadow-green-200"
                  : "bg-gradient-to-r from-brand-600 to-accent-600 text-white hover:shadow-2xl hover:shadow-brand-200 hover:-translate-y-0.5"
              }`}>
              {added ? <Check size={22} /> : <ShoppingBag size={22} />}
              {(product.stock ?? 1) === 0 ? "Sin stock" : added ? "¡Añadido al carrito!" : "Agregar al carrito"}
            </motion.button>

            <Link href="/productos" className="mt-4 flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-600 transition-colors">
              <ArrowLeft size={14} /> Volver al catálogo
            </Link>

            {/* Beneficios */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: "Envío gratis +S/150" },
                { icon: RotateCcw, text: "30 días cambios" },
                { icon: Shield, text: "Pago seguro" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Icon size={16} className="text-brand-600 mb-1" />
                  <span className="text-xs text-gray-500 leading-tight">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reseñas */}
        <ProductReviews productId={product.id} />

        {/* Productos relacionados */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              También te puede <span className="gradient-text">gustar</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>

      {/* ── MODAL ZOOM ── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setZoomed(false)}>
            <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
              <X size={20} />
            </button>
            {allImages.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImg(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
                  <ChevronLeft size={22} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImg(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
                  <ChevronRight size={22} />
                </button>
              </>
            )}
            <motion.div key={activeImg} initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="relative w-full max-w-2xl aspect-[3/4]" onClick={(e) => e.stopPropagation()}>
              <Image src={allImages[activeImg] || fallback} alt={product.name} fill className="object-contain" sizes="800px" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
