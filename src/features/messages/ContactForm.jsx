import { useState } from 'react'
import { useSendMessage } from '@/hooks/useMessages'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' }

/**
 * Contact form feature component.
 * Validates locally and delegates send logic to useSendMessage hook.
 *
 * @param {{ onSuccess?: function }} props
 */
export function ContactForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const { mutate: sendMessage, isPending, isSuccess } = useSendMessage()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim())    errs.name = 'Name is required'
    if (!form.email.trim())   errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    sendMessage(form, {
      onSuccess: () => {
        setForm(INITIAL_FORM)
        onSuccess?.()
      },
    })
  }

  if (isSuccess) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Message Sent!</h3>
        <p className="text-slate-500 text-sm">Thank you for reaching out. I'll respond within 2–3 business days.</p>
        <Button variant="secondary" className="mt-6" onClick={() => setForm(INITIAL_FORM)}>
          Send Another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <Input id="name" name="name" label="Full Name" placeholder="Dr. Jane Smith"
          value={form.name} onChange={handleChange} error={errors.name} />
        <Input id="email" name="email" type="email" label="Email Address"
          placeholder="jane@example.com"
          value={form.email} onChange={handleChange} error={errors.email} />
      </div>
      <Input id="subject" name="subject" label="Subject (optional)"
        placeholder="Research collaboration inquiry"
        value={form.subject} onChange={handleChange} />
      <Textarea id="message" name="message" label="Message" rows={5}
        placeholder="Tell me about your research or collaboration idea..."
        value={form.message} onChange={handleChange} error={errors.message} />
      <Button type="submit" isLoading={isPending} className="w-full justify-center">
        Send Message
      </Button>
    </form>
  )
}
