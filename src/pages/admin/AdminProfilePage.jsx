import { useState, useEffect } from 'react'
import { useProfile, useUpdateProfile, useUploadPhoto } from '@/hooks/useProfile'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { getInitials } from '@/utils'

/**
 * Admin Profile management page
 */
export default function AdminProfilePage() {
  const { data: profile, isLoading } = useProfile()
  const { mutate: update, isPending: saving } = useUpdateProfile()
  const { mutate: uploadPhoto, isPending: uploading } = useUploadPhoto()

  const [form, setForm] = useState({
    name: '', title: '', subtitle: '', bio: '',
    email: '', location: '', linkedin_url: '', orcid_id: '', years_experience: '',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? '',
        title: profile.title ?? '',
        subtitle: profile.subtitle ?? '',
        bio: profile.bio ?? '',
        email: profile.email ?? '',
        location: profile.location ?? '',
        linkedin_url: profile.linkedin_url ?? '',
        orcid_id: profile.orcid_id ?? '',
        years_experience: profile.years_experience ?? '',
      })
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    update({ id: profile.id, updates: { ...form, years_experience: Number(form.years_experience) } })
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadPhoto(file, {
      onSuccess: (url) => update({ id: profile.id, updates: { photo_url: url } }),
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Update your public portfolio profile.</p>
      </div>

      {/* Avatar */}
      <div className="card-base p-6 flex items-center gap-6">
        <div className="relative">
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt={profile.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary-100" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-emerald-100 flex items-center justify-center">
              <span className="text-2xl font-bold gradient-text">{getInitials(profile?.name)}</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Profile Photo</p>
          <label className="btn-secondary text-sm py-2 cursor-pointer">
            {uploading ? 'Uploading…' : 'Upload Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
          </label>
          <p className="text-xs text-slate-400 mt-1.5">JPG, PNG, WebP. Max 2MB.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Input id="name" name="name" label="Full Name *" value={form.name} onChange={handleChange} required />
          <Input id="years_experience" name="years_experience" type="number" label="Years of Experience" min="0" value={form.years_experience} onChange={handleChange} />
        </div>
        <Input id="title" name="title" label="Title *" placeholder="Epidemiologist & Public Health Researcher" value={form.title} onChange={handleChange} required />
        <Input id="subtitle" name="subtitle" label="Subtitle" placeholder="MPH, PhD Candidate | Infectious Disease" value={form.subtitle} onChange={handleChange} />
        <Textarea id="bio" name="bio" label="Bio" rows={4} value={form.bio} onChange={handleChange} />
        <div className="grid sm:grid-cols-2 gap-5">
          <Input id="email" name="email" type="email" label="Email" value={form.email} onChange={handleChange} />
          <Input id="location" name="location" label="Location" placeholder="Geneva, Switzerland" value={form.location} onChange={handleChange} />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Input id="linkedin_url" name="linkedin_url" type="url" label="LinkedIn URL" value={form.linkedin_url} onChange={handleChange} />
          <Input id="orcid_id" name="orcid_id" label="ORCID ID" placeholder="0000-0000-0000-0000" value={form.orcid_id} onChange={handleChange} />
        </div>
        <div className="flex justify-end">
          <Button type="submit" isLoading={saving} size="lg">Save Changes</Button>
        </div>
      </form>
    </div>
  )
}
