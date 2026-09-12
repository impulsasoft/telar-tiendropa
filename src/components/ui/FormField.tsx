import { ReactNode } from "react";

/* ── Clases base compartidas ── */
export const inputCls =
  "w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-4 sm:py-3.5 text-base sm:text-sm text-gray-800 " +
  "placeholder:text-gray-400 transition-all duration-200 " +
  "focus:outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100";

export const labelCls =
  "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5";

export const btnPrimaryCls =
  "w-full flex items-center justify-center gap-2 py-5 sm:py-4 px-6 rounded-2xl font-bold text-base text-white " +
  "transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed " +
  "disabled:hover:translate-y-0";

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, error, children }: FieldProps) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
