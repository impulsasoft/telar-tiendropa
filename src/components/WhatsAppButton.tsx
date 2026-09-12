"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const phone = "51987654321"; // Cambia por tu número real
  const message = encodeURIComponent("¡Hola! Quiero consultar sobre sus productos 😊");
  const waUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <MessageCircle size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">TIENDROPA</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" /> En línea
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                ¡Hola! 👋 Estamos aquí para ayudarte. ¿Tienes dudas sobre tallas, envíos o pagos?
              </p>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Chatear por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.93 }}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl flex items-center justify-center transition-colors relative"
        aria-label="Contactar por WhatsApp"
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
        {!open && (
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </motion.button>
    </div>
  );
}
