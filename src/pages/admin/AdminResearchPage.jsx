/* TEMA FIX: Delete button hover: hover:text-rose-300/border-rose-400 → hover:text-white/border-white/30 */
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Save, Loader2, X, FlaskConical } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TagInput } from '@/components/admin/forms/TagInput'
import { ImageUpload } from '@/components/admin/forms/ImageUpload'
import { useToast } from '@/hooks/useToast'
import { researchService } from '@/services/research.service'
import { resolveImage, deleteFile } from '@/lib/storage'
import { RESEARCH_STATUSES, QUERY_KEYS } from '@/constants'
import { formatDate, truncateText } from '@/utils'

const EMPTY = {
  title: '',
  summary: '',
  description: '',
  status: 'ongoing',
  tags: [],
  cover_path: '',
  repo_url: '',
  demo_url: '',
  started_at: '',
  ended_at: '',
}

export default function AdminResearchPage() {
  const qc = useQueryClient()
  const { toast, show } = useToast()
  const { data: items = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.RESEARCH,
    queryFn: () => researchService.list(),
  })

  const [editing, setEditing] = useState(null)
  const [confirmRow, setConfirmRow] = useState(null)
  const [busyDelete, setBusyDelete] = useState(false)

  const invalidate = () => qc.invalidateQueries({ queryKey: QUERY_KEYS.RESEARCH })

  const handleDelete = async () => {
    if (!confirmRow) return
    setBusyDelete(true)
    try {
      if (confirmRow.cover_path) await deleteFile(confirmRow.cover_path)
      await researchService.remove(confirmRow.id)
      invalidate()
      show('Project deleted.')
      setConfirmRow(null)
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
        title="Research"
        description="Research projects shown on the homepage and on /research."
        actions={
          <Button variant="solid" onClick={() => setEditing(EMPTY)}>
            <Plus className="h-4 w-4" />
            New project
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-white/50 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#161616] p-12 text-center">
          <FlaskConical className="h-8 w-8 text-white/30 mx-auto mb-3" />
          <p className="text-sm text-white/40">No research projects yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="rounded-2xl border border-white/[0.06] bg-[#161616] p-4 sm:p-5 flex items-start gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-black/40 shrink-0">
                {it.cover_path && (
                  <img src={resolveImage(it.cover_path)} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-white tracking-tight">{it.title}</h3>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/55 px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.03]">
                    {it.status}
                  </span>
                </div>
                {it.summary && (
                  <p className="mt-1.5 text-sm text-white/55 leading-relaxed">{truncateText(it.summary, 160)}</p>
                )}
                <p className="mt-2 text-[10px] font-mono uppercase tracking-wider text-white/40">
                  {it.started_at ? formatDate(it.started_at, { year: 'numeric', month: 'short' }) : '—'}
                  {it.ended_at && <> → {formatDate(it.ended_at, { year: 'numeric', month: 'short' })}</>}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => setEditing(it)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setConfirmRow(it)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/55 hover:text-white hover:border-white/30 transition" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ResearchForm
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
        open={!!confirmRow}
        title="Delete research project?"
        description="The cover image will also be removed from storage."
        busy={busyDelete}
        onCancel={() => setConfirmRow(null)}
        onConfirm={handleDelete}
      />
    </>
  )
}

function ResearchForm({ initial, onClose, onSaved, onError }) {
  const [form, setForm] = useState({
    ...initial,
    tags: Array.isArray(initial.tags) ? initial.tags : [],
    started_at: initial.started_at ? initial.started_at.slice(0, 10) : '',
    ended_at: initial.ended_at ? initial.ended_at.slice(0, 10) : '',
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
        started_at: form.started_at || null,
        ended_at: form.ended_at || null,
      }
      if (isEdit) {
        const { id, ...rest } = payload
        await researchService.update(id, rest)
      } else {
        delete payload.id
        await researchService.create(payload)
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
            {isEdit ? 'Edit project' : 'New project'}
          </h3>
          <button onClick={onClose} className="text-white/55 hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          <ImageUpload
            value={form.cover_path}
            onChange={(path) => setForm((f) => ({ ...f, cover_path: path }))}
            folder="research"
            label="Cover image"
          />

          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={update('title')} required />
          </div>

          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" rows={3} value={form.summary || ''} onChange={update('summary')} placeholder="One or two sentence summary shown on cards." />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={6} value={form.description || ''} onChange={update('description')} placeholder="Full description shown on the detail page." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="status">Status</Label>
              <select id="status" className="field" value={form.status} onChange={update('status')}>
                {RESEARCH_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <Label>Tags</Label>
              <TagInput value={form.tags} onChange={(next) => setForm((f) => ({ ...f, tags: next }))} />
            </div>
            <div>
              <Label htmlFor="started_at">Started at</Label>
              <Input id="started_at" type="date" value={form.started_at || ''} onChange={update('started_at')} />
            </div>
            <div>
              <Label htmlFor="ended_at">Ended at</Label>
              <Input id="ended_at" type="date" value={form.ended_at || ''} onChange={update('ended_at')} />
            </div>
            <div>
              <Label htmlFor="repo_url">Repository URL</Label>
              <Input id="repo_url" value={form.repo_url || ''} onChange={update('repo_url')} placeholder="https://github.com/…" />
            </div>
            <div>
              <Label htmlFor="demo_url">Demo URL</Label>
              <Input id="demo_url" value={form.demo_url || ''} onChange={update('demo_url')} placeholder="https://…" />
            </div>
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
