/**
 * PageLoader
 *
 * TEMA FIX: Spinner sebelumnya menggunakan `border-t-cyan-400` (warna cyan/biru).
 * Diganti ke `border-t-white/70` agar konsisten dengan tema monokrom.
 * Teks "Loading" juga disamakan menggunakan `text-white/40` (CSS var --c-text-subtle)
 * daripada `text-slate-500` (Tailwind built-in yang berbeda tone).
 */
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          {/* Track */}
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.08]" />
          {/* Spinner — pure white, tema monokrom */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/70 animate-spin" />
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-white/40">Loading</p>
      </div>
    </div>
  )
}
