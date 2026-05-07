import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Briefcase, GraduationCap, Award, BadgeCheck, Save, Loader2, X } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TagInput } from '@/components/admin/forms/TagInput'
import { useToast } from '@/hooks/useToast'
import { experiencesService } from '@/services/experiences.service'
import { EXPERIENCE_TYPES, QUERY_KEYS } from '@/constants'
import { formatDateRange } from '@/utils'

const ICONS = { work: Briefcase, education: GraduationCap, certification: BadgeCheck, award: Award }

const EMPTY = {
  type: 'work',
  role: '',
  organization: '',
  location: '',
  start_date: '',
  end_date: '',
  description: '',
  highlights: [],
  sort_order: 0,
}

export default function AdminExperiencesPage() {
  const qc = useQueryClient()
  const { toast, show } = useToast()
  const { data: items = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.EXPERIENCES,
    queryFn: () => experiencesService.list(),
  })

  const [editing, setEditing] = useState(null) // null | EMPTY | row
  const [confirmId, setConfirmId] = useState(null)
  const [busyDelete, setBusyDelete] = useState(false)

  const invalidate = () => qc.invalidateQueries({ queryKey: QUERY_KEYS.EXPERIENCES })

  const handleDelete = async () => {
    if (!confirmId) return
    setBusyDelete(true)
    try {
      await experiencesService.remove(confirmId)
      invalidate()
      show('Experience deleted.')
      setConfirmId(null)
    } catch (err) {
      show(err.message || 'Failed to delete', 'error')
    } finally {
      setBusyDelete(false)
    }
  }

  return (
    <>
      {toast}
      <AdminPageHeader
        title="Experiences"
        description="Work, education, certifications, and awards shown on the timeline."
        actions={
          <Button variant="solid" onClick={() => setEditing(EMPTY)}>
            <Plus className="h-4 w-4" />
            Add new
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-white/50 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#161616] p-10 text-center text-sm text-white/40">
          No experiences yet. Click <span className="text-white">Add new</span> to create the first one.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => {
            const Icon = ICONS[it.type] ?? Briefcase
            return (
              <div
                key={it.id}
                className="rounded-2xl border border-white/[0.06] bg-[#161616] p-5 sm:p-6 flex items-start gap-4"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 text-white/85 shrink-0">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-base font-semibold text-white tracking-tight">{it.role}</h3>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.03]">
                      {it.type}
                    </span>
                  </div>
                  <p className="text-sm text-white/55 mt-0.5">
                    {it.organization}{it.location && <span className="text-white/30"> · {it.location}</span>}
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mt-1">
                    {formatDateRange(it.start_date, it.end_date)}
                  </p>
                  {it.description && (
                    <p className="mt-2 text-sm text-white/55 leading-relaxed line-clamp-2">{it.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditing(it)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(it.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/55 hover:text-rose-300 hover:border-rose-400/40 transition"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing && (
        <ExperienceForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            invalidate()
            setEditing(null)
            show('Saved.')
          }}
          onError={(msg) => show(msg, 'error')}
        />
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Delete experience?"
        description="This will permanently remove this entry from your timeline."
        busy={busyDelete}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />
    </>
  )
}

function ExperienceForm({ initial, onClose, onSaved, onError }) {
  const [form, setForm] = useState({
    ...initial,
    highlights: Array.isArray(initial.highlights) ? initial.highlights : [],
    start_date: initial.start_date ? initial.start_date.slice(0, 10) : '',
    end_date: initial.end_date ? initial.end_date.slice(0, 10) : '',
  })
  const [saving, setSaving] = useState(false)

  const isEdit = !!initial.id

  const update = (k) => (e) => {
    const v = e?.target ? e.target.value : e
    setForm((f) => ({ ...f, [k]: v }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        sort_order: Number(form.sort_order) || 0,
      }
      if (isEdit) {
        const { id, ...rest } = payload
        await experiencesService.update(id, rest)
      } else {
        delete payload.id
        await experiencesService.create(payload)
      }
      onSaved()
    } catch (err) {
      onError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center px-4 py-8 overflow-y-auto">
      <button aria-label="Close" onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#161616] border border-white/10 shadow-2xl">
        <div className="px-6 sm:px-7 py-5 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-white">
            {isEdit ? 'Edit experience' : 'New experience'}
          </h3>
          <button onClick={onClose} className="text-white/55 hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="field"
                value={form.type}
                onChange={update('type')}
              >
                {EXPERIENCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" type="number" value={form.sort_order} onChange={update('sort_order')} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="role">Role / Title</Label>
              <Input id="role" value={form.role} onChange={update('role')} required />
            </div>
            <div>
              <Label htmlFor="organization">Organization</Label>
              <Input id="organization" value={form.organization} onChange={update('organization')} required />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={update('location')} />
            </div>
            <div>
              <Label htmlFor="start_date">Start date</Label>
              <Input id="start_date" type="date" value={form.start_date || ''} onChange={update('start_date')} />
            </div>
            <div>
              <Label htmlFor="end_date">End date</Label>
              <Input id="end_date" type="date" value={form.end_date || ''} onChange={update('end_date')} />
              <p className="mt-1 text-[11px] text-white/35">Leave empty for "Present".</p>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} value={form.description || ''} onChange={update('description')} />
          </div>

          <div>
            <Label>Highlights</Label>
            <TagInput
              value={form.highlights}
              onChange={(next) => setForm((f) => ({ ...f, highlights: next }))}
              placeholder="Add a highlight and press Enter"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button as="button" type="submit" variant="solid" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
