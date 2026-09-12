"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import TelarLogo from "@/components/TelarLogo";
import { inputCls, btnPrimaryCls } from "@/components/ui/FormField";

export default function AdminLogin() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
    } else {
      router.push("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background:"linear-gradient(135deg,#0F0717 0%,#2D0845 50%,#0F0717 100%)" }}>

      {/* Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-30"
        style={{ background:"radial-gradient(circle,#7C2D9E,transparent)" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[80px] pointer-events-none opacity-25"
        style={{ background:"radial-gradient(circle,#C9267A,transparent)" }} />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage:"radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize:"32px 32px" }} />

      <motion.div
        initial={{ opacity:0, y:30, scale:0.96 }}
        animate={{ opacity:1, y:0,  scale:1   }}
        transition={{ duration:0.5 }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", backdropFilter:"blur(20px)" }}>

          {/* Top strip */}
          <div className="h-1 w-full"
            style={{ background:"linear-gradient(90deg,#7C2D9E,#C9267A)" }} />

          <div className="px-8 py-10 space-y-7">

            {/* Logo + título */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <TelarLogo size={38} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Panel de Administración</h1>
                <p className="text-purple-300 text-sm mt-1">Accede con tus credenciales</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@telar.pe"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-white placeholder-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ background:"rgba(255,255,255,0.08)", border:"1.5px solid rgba(255,255,255,0.12)" }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(124,45,158,0.8)"}
                    onBlur={e  => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input type={showPass ? "text" : "password"} required value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm text-white placeholder-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ background:"rgba(255,255,255,0.08)", border:"1.5px solid rgba(255,255,255,0.12)" }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(124,45,158,0.8)"}
                    onBlur={e  => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
                  className="flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm text-red-300"
                  style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)" }}>
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <motion.button whileTap={{ scale:0.97 }} type="submit" disabled={loading}
                className={`${btnPrimaryCls} mt-2`}
                style={{ background:"linear-gradient(135deg,#7C2D9E,#C9267A)", boxShadow:"0 8px 24px rgba(124,45,158,0.4)" }}>
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Accediendo…</>
                  : <><ShieldCheck size={17} /> Entrar al panel</>
                }
              </motion.button>
            </form>

            {/* Demo hint */}
            <p className="text-center text-gray-600 text-xs pt-2 border-t border-white/5">
              Demo: admin@telar.pe / Admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
