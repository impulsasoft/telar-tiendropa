import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      {/* Número animado */}
      <div className="relative mb-8">
        <p className="text-[160px] sm:text-[200px] font-black leading-none select-none"
          style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl animate-bounce" style={{ animationDelay: "0.1s" }}>👗</div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
        ¡Ups! Esta página no existe
      </h1>
      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
        Parece que la prenda que buscas no está en nuestra colección — o quizás el enlace está desactualizado.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/productos"
          className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-200 transition-all">
          Ver toda la colección →
        </Link>
        <Link href="/"
          className="border-2 border-brand-200 text-brand-700 px-8 py-3.5 rounded-2xl font-bold hover:bg-brand-50 transition-all">
          Ir al inicio
        </Link>
      </div>

      {/* Links rápidos */}
      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        {[
          { href: "/productos?cat=Vestidos", label: "👗 Vestidos" },
          { href: "/productos?cat=Accesorios", label: "👜 Accesorios" },
          { href: "/productos?cat=Calzado", label: "👟 Calzado" },
          { href: "/seguimiento", label: "📦 Mi pedido" },
        ].map(({ href, label }) => (
          <Link key={href} href={href}
            className="text-sm text-gray-500 hover:text-brand-600 bg-white border border-gray-200 hover:border-brand-300 px-4 py-2 rounded-xl transition-all">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
