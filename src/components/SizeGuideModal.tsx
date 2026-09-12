"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";

const GUIDES: Record<string, {
  headers: string[];
  rows: { size: string; measurements: string[] }[];
  tip: string;
}> = {
  Ropa: {
    headers: ["Talla", "Pecho (cm)", "Cintura (cm)", "Cadera (cm)"],
    rows: [
      { size: "XS", measurements: ["80–83", "60–63", "86–89"] },
      { size: "S",  measurements: ["84–87", "64–67", "90–93"] },
      { size: "M",  measurements: ["88–91", "68–71", "94–97"] },
      { size: "L",  measurements: ["92–95", "72–75", "98–101"] },
      { size: "XL", measurements: ["96–99", "76–79", "102–105"] },
    ],
    tip: "Mide el contorno de la parte más ancha del pecho, la cintura natural y la cadera.",
  },
  Pantalones: {
    headers: ["Talla", "Cintura (cm)", "Cadera (cm)", "Largo (cm)"],
    rows: [
      { size: "28", measurements: ["70–72", "90–92", "100"] },
      { size: "30", measurements: ["74–76", "94–96", "101"] },
      { size: "32", measurements: ["80–82", "100–102", "102"] },
      { size: "34", measurements: ["86–88", "106–108", "103"] },
      { size: "36", measurements: ["92–94", "112–114", "104"] },
    ],
    tip: "Mide la cintura natural y la cadera en la parte más ancha. El largo es desde la cintura hasta el tobillo.",
  },
  Calzado: {
    headers: ["Talla PE", "Talla EU", "cm (largo pie)"],
    rows: [
      { size: "35", measurements: ["35", "22.5"] },
      { size: "36", measurements: ["36", "23.0"] },
      { size: "37", measurements: ["37", "23.5"] },
      { size: "38", measurements: ["38", "24.5"] },
      { size: "39", measurements: ["39", "25.0"] },
      { size: "40", measurements: ["40", "25.5"] },
      { size: "41", measurements: ["41", "26.5"] },
    ],
    tip: "Mide el largo de tu pie desde el talón hasta el dedo más largo, sobre una superficie plana.",
  },
};

const HOW_TO_MEASURE = [
  { emoji: "📏", title: "Pecho", desc: "Rodea la cinta métrica alrededor de la parte más ancha del pecho, manteniendo los brazos relajados." },
  { emoji: "〰️", title: "Cintura", desc: "Mide alrededor de la parte más estrecha del torso, generalmente sobre el ombligo." },
  { emoji: "🍑", title: "Cadera", desc: "Mide alrededor de la parte más ancha de la cadera y los glúteos." },
];

interface Props {
  category?: string;
  sizes?: string[];
}

export default function SizeGuideModal({ category = "Ropa", sizes }: Props) {
  const [open, setOpen] = useState(false);

  const guideKey = category === "Pantalones" ? "Pantalones"
    : category === "Calzado" ? "Calzado"
    : "Ropa";
  const guide = GUIDES[guideKey];

  if (!sizes || sizes.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-brand-600 hover:text-brand-800 font-semibold hover:underline flex items-center gap-1 transition-colors"
      >
        <Ruler size={11} /> Guía de tallas →
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div>
                  <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
                    <Ruler size={18} className="text-brand-600" /> Guía de tallas
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">{guideKey} · Medidas en centímetros</p>
                </div>
                <button onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Tabla de tallas */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-brand-50">
                        {guide.headers.map((h, i) => (
                          <th key={h} className={`px-4 py-3 text-xs font-bold uppercase tracking-wide text-brand-700 ${i === 0 ? "rounded-l-xl text-left" : "text-center"} ${i === guide.headers.length - 1 ? "rounded-r-xl" : ""}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {guide.rows.map((row, i) => {
                        const isHighlighted = sizes?.includes(row.size);
                        return (
                          <tr key={row.size} className={`border-b border-gray-50 transition-colors ${isHighlighted ? "bg-brand-50/50" : i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className={`font-black text-sm ${isHighlighted ? "text-brand-700" : "text-gray-900"}`}>{row.size}</span>
                                {isHighlighted && (
                                  <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">Disponible</span>
                                )}
                              </div>
                            </td>
                            {row.measurements.map((m, j) => (
                              <td key={j} className={`px-4 py-3 text-center text-gray-600 ${isHighlighted ? "font-semibold text-gray-800" : ""}`}>{m}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Tip */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-amber-700 mb-1">💡 Consejo</p>
                  <p className="text-sm text-amber-700">{guide.tip}</p>
                </div>

                {/* Cómo medirse */}
                {guideKey !== "Calzado" && (
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-3">¿Cómo medirme?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {HOW_TO_MEASURE.map((item) => (
                        <div key={item.title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <p className="text-2xl mb-2">{item.emoji}</p>
                          <p className="font-bold text-gray-900 text-sm mb-1">{item.title}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA ayuda */}
                <div className="flex items-center justify-between bg-brand-50 border border-brand-100 rounded-2xl p-4">
                  <div>
                    <p className="font-bold text-brand-800 text-sm">¿Tienes dudas con tu talla?</p>
                    <p className="text-xs text-brand-600 mt-0.5">Nuestro equipo te ayuda a elegir</p>
                  </div>
                  <a href="https://wa.me/51987654321" target="_blank" rel="noopener noreferrer"
                    className="bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-brand-700 transition-colors shrink-0">
                    Consultar →
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
