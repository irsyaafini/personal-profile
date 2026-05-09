import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Phone } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/common/Reveal'
import { useSendMessage } from '@/features/messages/useSendMessage'
import { useProfile } from '@/features/profile/useProfile'
import { useTranslation } from '@/features/i18n/useTranslation'
import GlassSurface from '@/components/reactbits/GlassSurface'

function ContactInfoItem({ icon: Icon, label, value, href }) {
  const inner = (
    <>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white/[0.05] border border-white/10 text-white/85 transition group-hover:bg-white/[0.09] group-hover:border-white/20 backdrop-blur-sm">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold">{label}</p>
        <p className="text-sm text-white/85 group-hover:text-white transition">{value}</p>
      </div>
    </>
  )
  if (href) {
    return (
      <a href={href} className="flex items-center gap-3.5 group">
        {inner}
      </a>
    )
  }
  return <div className="flex items-center gap-3.5">{inner}</div>
}

export function ContactSection() {
  const { t } = useTranslation()
  const { data: profile } = useProfile()
  const sendMessage = useSendMessage()

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = true
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) next.email = true
    if (!form.message.trim()) next.message = true
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await sendMessage.mutateAsync(form)
      setSubmitted(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <section id="contact" className="section-gap">
      <Container size="lg">
        <Reveal direction="up">
          <SectionHeader
            eyebrow={t('contact.eyebrow', 'Contact')}
            title={t('sections.contact', 'Get in Touch')}
            description={t('contact.description', 'Have a question, collaboration idea, or just want to say hi? Drop a message below.')}
          />
        </Reveal>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Info cards */}
          <Reveal direction="left" delay={120} className="lg:col-span-2">
            <div className="space-y-4">
              <Card>
                <div className="p-7 sm:p-8">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 mb-4 flex items-center gap-2.5">
                    <span className="h-px w-6 bg-white/30" />
                    {t('contact.reach_me_at', 'Reach me at')}
                  </h3>
                  <div className="space-y-5">
                    {profile?.email && (
                      <ContactInfoItem
                        icon={Mail}
                        label={t('about.email', 'Email')}
                        value={profile.email}
                        href={`mailto:${profile.email}`}
                      />
                    )}
                    {profile?.phone && (
                      <ContactInfoItem
                        icon={Phone}
                        label={t('about.phone', 'Phone')}
                        value={profile.phone}
                        href={`tel:${profile.phone}`}
                      />
                    )}
                    {profile?.location && (
                      <ContactInfoItem
                        icon={MapPin}
                        label={t('about.location', 'Location')}
                        value={profile.location}
                      />
                    )}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-7 sm:p-8">
                  <p className="text-sm text-white/55 leading-relaxed">
                    {t('contact.reply_note', 'I usually reply within')}{' '}
                    <span className="text-white font-medium">{t('contact.reply_time', '1–2 business days')}</span>
                    {t('contact.reply_note2', '. For urgent matters, email is the fastest way.')}
                  </p>
                </div>
              </Card>
            </div>
          </Reveal>

          {/* Form card */}
          <Reveal direction="right" delay={220} className="lg:col-span-3">
            <Card>
              <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">{t('contact.name_label', 'Name')}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('contact.name', 'Your name')}
                      value={form.name}
                      onChange={handleChange('name')}
                      error={errors.name}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('contact.email_label', 'Email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('contact.email', 'Your email')}
                      value={form.email}
                      onChange={handleChange('email')}
                      error={errors.email}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">{t('contact.subject_label', 'Subject')}</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder={t('contact.subject', 'Subject')}
                    value={form.subject}
                    onChange={handleChange('subject')}
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t('contact.message_label', 'Message')}</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder={t('contact.message', 'Your message')}
                    value={form.message}
                    onChange={handleChange('message')}
                    error={errors.message}
                  />
                </div>

                {submitted && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur text-sm text-white/85">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{t('contact.success', 'Thanks! Your message has been sent.')}</span>
                  </div>
                )}

                {sendMessage.isError && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur text-sm text-white/60">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{t('contact.error', 'Something went wrong. Please try again.')}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="solid" disabled={sendMessage.isPending}>
                    {sendMessage.isPending
                      ? t('contact.sending', 'Sending…')
                      : t('contact.send', 'Send Message')}
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
