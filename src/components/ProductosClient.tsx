"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, Search, X, Package } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/store";

interface Props {
  products: Product[];
  categories: string[];
}

function ProductosContent({ products, categories }: Props) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") ?? "Todos";
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    setActiveCategory(searchParams.get("cat") ?? "Todos");
  }, [searchParams]);

  let filtered = products.filter((p) => {
    const matchCat = activeCategory === "Todos" || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-black text-gray-900"
        >
          Catálogo de <span className="gradient-text">productos</span>
        </motion.h1>
        <p className="text-gray-400 mt-1">{filtered.length} productos encontrados</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-7">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 bg-white rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 shadow-sm">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="py-2.5 text-sm text-gray-600 bg-transparent focus:outline-none pr-1">
            <option value="default">Relevancia</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
          </select>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all whitespace-nowrap ${
              activeCategory === cat
                ? "bg-gradient-to-r from-brand-600 to-accent-600 border-transparent text-white shadow-md"
                : "border-gray-200 text-gray-500 hover:border-brand-400 hover:text-brand-600 bg-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg">No se encontraron productos.</p>
          <p className="text-gray-400 text-sm mt-1">Prueba con otras palabras o categorías.</p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("Todos"); }}
            className="mt-4 text-brand-600 font-semibold hover:underline text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductosClient({ products, categories }: Props) {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-10 w-64 shimmer rounded-xl mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] shimmer rounded-2xl" />
          ))}
        </div>
      </div>
    }>
      <ProductosContent products={products} categories={categories} />
    </Suspense>
  );
}
