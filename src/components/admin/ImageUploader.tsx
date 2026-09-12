"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Star, Loader2, ImageIcon, GripVertical } from "lucide-react";

interface ImageUploaderProps {
  images: string[];         // URLs actuales (Cloudinary o cualquier URL)
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 6 }: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const processFiles = async (files: FileList) => {
    const remaining = maxImages - images.length;
    const toProcess = Array.from(files).slice(0, remaining);
    if (!toProcess.length) return;

    setUploading(true);
    setError("");

    const newUrls: string[] = [];
    for (const file of toProcess) {
      if (file.size > 8 * 1024 * 1024) { setError("Máximo 8 MB por imagen"); continue; }
      const dataUrl = await readFileAsDataUrl(file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl }),
        });
        if (res.ok) {
          const { url } = await res.json();
          newUrls.push(url);
        }
      } catch {
        setError("Error al subir imagen. Intenta de nuevo.");
      }
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
  };

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const remove = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  const setMain = (idx: number) => {
    if (idx === 0) return;
    const next = [...images];
    [next[0], next[idx]] = [next[idx], next[0]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {/* Grid de imágenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((url, i) => (
            <div key={url} className={`relative group rounded-xl overflow-hidden border-2 transition-all ${i === 0 ? "border-violet-500 shadow-md shadow-violet-100" : "border-gray-200 hover:border-gray-300"}`}>
              <div className="relative aspect-[3/4] bg-gray-100">
                <Image src={url} alt={`Imagen ${i + 1}`} fill sizes="150px" className="object-cover" />
              </div>

              {/* Overlay de acciones */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => setMain(i)}
                    title="Hacer principal"
                    className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center hover:bg-yellow-300 transition-colors"
                  >
                    <Star size={12} className="text-yellow-900 fill-yellow-900" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-400 transition-colors"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>

              {/* Badge principal */}
              {i === 0 && (
                <div className="absolute top-1.5 left-1.5 bg-violet-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Star size={8} className="fill-white" /> Principal
                </div>
              )}

              {/* Número */}
              <div className="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {i + 1}
              </div>
            </div>
          ))}

          {/* Botón agregar más (en el grid) */}
          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="aspect-[3/4] border-2 border-dashed border-gray-300 hover:border-violet-400 hover:bg-violet-50 rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-gray-400 hover:text-violet-500 disabled:opacity-50"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              <span className="text-[10px] font-medium">{uploading ? "Subiendo..." : "Agregar"}</span>
            </button>
          )}
        </div>
      )}

      {/* Zona de drop (cuando no hay imágenes) */}
      {images.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl py-12 flex flex-col items-center gap-3 cursor-pointer transition-all ${
            dragOver ? "border-violet-500 bg-violet-50" : "border-gray-300 hover:border-violet-400 hover:bg-gray-50"
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? "bg-violet-100" : "bg-gray-100"}`}>
            {uploading ? <Loader2 size={24} className="animate-spin text-violet-500" /> : <ImageIcon size={24} className={dragOver ? "text-violet-500" : "text-gray-400"} />}
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm text-gray-700">
              {uploading ? "Subiendo imágenes..." : "Arrastra fotos aquí o haz clic"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP · Máx. 8 MB · Hasta {maxImages} fotos</p>
          </div>
        </div>
      )}

      {/* Info */}
      {images.length > 0 && (
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <GripVertical size={11} />
          Pasa el cursor sobre una imagen para acciones · La primera es la foto principal
          <span className="ml-auto">{images.length}/{maxImages}</span>
        </p>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />
    </div>
  );
}
