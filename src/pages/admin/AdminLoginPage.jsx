import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LogIn, Loader2, ShieldAlert } from 'lucide-react'
import { Input, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/useAuth'
import GlassSurface from '@/components/reactbits/GlassSurface'

export default function AdminLoginPage() {
  const { signIn, session, isAdmin, loading } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from || '/admin'

  const [form,       setForm]       = useState({ email: '', password: '' })
  const [error,      setError]      = useState(location.state?.error || null)
  const [submitting, setSubmitting] = useState(false)
  const [failCount,  setFailCount]  = useState(0)
  const [cooldown,   setCooldown]   = useState(false)

  useEffect(() => { document.title = 'Sign in — Admin' }, [])

  useEffect(() => {
    if (failCount >= 3) {
      setCooldown(true)
      const timer = setTimeout(() => { setCooldown(false); setFailCount(0) }, 5000)
      return () => clearTimeout(timer)
    }
  }, [failCount])

  if (!loading && session && isAdmin) return <Navigate to={from} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cooldown) return
    setError(null)
    setSubmitting(true)
    try {
      await signIn(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Gagal masuk. Periksa email dan password.')
      setFailCount((c) => c + 1)
    } finally {
      setSubmitting(false)
    }
  }

  const isDisabled = submitting || cooldown

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4 py-12 bg-noise">
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black font-display text-base font-bold mb-4">
            P
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Admin Sign In
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Masuk untuk mengelola konten portfolio kamu.
          </p>
        </div>

        {/* Form with GlassSurface */}
        <div className="relative">
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={20}
            brightness={47}
            opacity={0.92}
            blur={14}
            backgroundOpacity={0.04}
            distortionScale={-130}
            redOffset={0}
            greenOffset={8}
            blueOffset={16}
            className="!absolute inset-0"
            style={{ position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%', borderRadius: 20 }}
          />
          <form
            onSubmit={handleSubmit}
            className="relative z-10 p-7 sm:p-8 space-y-5"
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                disabled={isDisabled}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                disabled={isDisabled}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border border-white/20 bg-white/[0.04] text-sm text-white/70">
                <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {cooldown && (
              <p className="text-xs text-white/50 text-center">
                Terlalu banyak percobaan. Coba lagi dalam beberapa detik…
              </p>
            )}

            <Button
              as="button"
              type="submit"
              variant="solid"
              disabled={isDisabled}
              className="w-full justify-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <LogIn className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Akun admin dikelola melalui Supabase project kamu.
        </p>
      </div>
    </div>
  )
}
