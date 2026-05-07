import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LogIn, Loader2 } from 'lucide-react'
import { Input, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/useAuth'

export default function AdminLoginPage() {
  const { signIn, session, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/admin'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Sign in — Admin'
  }, [])

  // If already signed in, bounce straight to admin
  if (!loading && session) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 py-12 bg-noise">
      {/* atmospheric glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
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
            Sign in to manage your portfolio content.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-[#161616] border border-white/[0.08] p-7 sm:p-8 space-y-5"
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
            />
          </div>

          {error && (
            <div className="px-3.5 py-2.5 rounded-lg border border-rose-500/30 bg-rose-500/5 text-sm text-rose-300">
              {error}
            </div>
          )}

          <Button
            as="button"
            type="submit"
            variant="solid"
            disabled={submitting}
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

        <p className="mt-6 text-center text-xs text-white/40">
          Admin accounts are managed in your Supabase project.
        </p>
      </div>
    </div>
  )
}
