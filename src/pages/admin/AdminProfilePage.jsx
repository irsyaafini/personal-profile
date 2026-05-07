import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save, Loader2 } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TagInput } from '@/components/admin/forms/TagInput'
import { ImageUpload } from '@/components/admin/forms/ImageUpload'
import { useToast } from '@/hooks/useToast'
import { profileService } from '@/services/profile.service'
import { QUERY_KEYS } from '@/constants'

const EMPTY = {
  full_name: '',
  headline: '',
  bio: '',
  avatar_url: '',
  cover_url: '',
  location: '',
  email: '',
  phone: '',
  website: '',
  birth_date: '',
  languages: [],
  interests: [],
  socials: { github: '', linkedin: '', twitter: '', instagram: '' },
}

export default function AdminProfilePage() {
  const qc = useQueryClient()
  const { toast, show } = useToast()
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: profileService.getProfile,
  })

  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) {
      setForm({
        ...EMPTY,
        ...data,
        languages: Array.isArray(data.languages) ? data.languages : [],
        interests: Array.isArray(data.interests) ? data.interests : [],
        socials: { ...EMPTY.socials, ...(data.socials || {}) },
        // Normalize date for <input type="date">
        birth_date: data.birth_date ? data.birth_date.slice(0, 10) : '',
      })
    }
  }, [data])

  const update = (k) => (e) => {
    const v = e?.target ? e.target.value : e
    setForm((f) => ({ ...f, [k]: v }))
  }

  const updateSocial = (k) => (e) => {
    const v = e.target.value
    setForm((f) => ({ ...f, socials: { ...f.socials, [k]: v } }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        // birth_date "" → null so DB doesn't choke
        birth_date: form.birth_date || null,
      }
      // Keep id if we have one, otherwise let DB assign
      if (!payload.id) delete payload.id
      await profileService.upsert(payload)
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE })
      show('Profile saved.')
    } catch (err) {
      show(err.message || 'Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-white/50 text-sm">Loading profile…</div>
    )
  }

  return (
    <>
      {toast}
      <AdminPageHeader
        title="Profile"
        description="The hero section, contact details, and bio shown on your homepage."
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar */}
        <section className="rounded-2xl bg-[#161616] border border-white/[0.06] p-6 sm:p-7">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55 mb-5">
            Avatar
          </h2>
          <ImageUpload
            value={form.avatar_url}
            onChange={(path) => setForm((f) => ({ ...f, avatar_url: path }))}
            folder="avatars"
            label=""
          />
        </section>

        {/* Identity */}
        <section className="rounded-2xl bg-[#161616] border border-white/[0.06] p-6 sm:p-7 space-y-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" value={form.full_name} onChange={update('full_name')} required />
            </div>
            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" value={form.headline} onChange={update('headline')} placeholder="Researcher · Lifelong Learner" />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={5} value={form.bio} onChange={update('bio')} />
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl bg-[#161616] border border-white/[0.06] p-6 sm:p-7 space-y-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Contact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={update('email')} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={update('phone')} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={update('location')} placeholder="City, Country" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={form.website} onChange={update('website')} placeholder="https://…" />
            </div>
            <div>
              <Label htmlFor="birth_date">Birth date</Label>
              <Input id="birth_date" type="date" value={form.birth_date || ''} onChange={update('birth_date')} />
            </div>
          </div>
        </section>

        {/* Languages & Interests */}
        <section className="rounded-2xl bg-[#161616] border border-white/[0.06] p-6 sm:p-7 space-y-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Languages & Interests
          </h2>
          <div>
            <Label>Languages</Label>
            <TagInput
              value={form.languages}
              onChange={(next) => setForm((f) => ({ ...f, languages: next }))}
              placeholder="Add a language and press Enter"
            />
          </div>
          <div>
            <Label>Interests</Label>
            <TagInput
              value={form.interests}
              onChange={(next) => setForm((f) => ({ ...f, interests: next }))}
              placeholder="Add an interest and press Enter"
            />
          </div>
        </section>

        {/* Socials */}
        <section className="rounded-2xl bg-[#161616] border border-white/[0.06] p-6 sm:p-7 space-y-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Social Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {['github', 'linkedin', 'twitter', 'instagram'].map((k) => (
              <div key={k}>
                <Label htmlFor={`social-${k}`} className="capitalize">{k}</Label>
                <Input
                  id={`social-${k}`}
                  value={form.socials[k] || ''}
                  onChange={updateSocial(k)}
                  placeholder="https://…"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Save */}
        <div className="sticky bottom-4 z-10 flex justify-end">
          <Button as="button" type="submit" variant="solid" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </>
  )
}
