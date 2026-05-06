import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

/**
 * Standalone login form — used in LoginPage.
 * Keeps form state and validation local; delegates auth logic to useAuth hook.
 */
export function LoginForm() {
  const { login, isSubmitting } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    login(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input
        id="email" name="email" type="email" label="Email Address"
        placeholder="admin@epidemio.org" value={form.email}
        onChange={handleChange} error={errors.email}
        autoComplete="email"
      />
      <Input
        id="password" name="password" type="password" label="Password"
        placeholder="••••••••" value={form.password}
        onChange={handleChange} error={errors.password}
        autoComplete="current-password"
      />
      <Button type="submit" isLoading={isSubmitting} className="w-full justify-center" size="lg">
        Sign In
      </Button>
    </form>
  )
}
