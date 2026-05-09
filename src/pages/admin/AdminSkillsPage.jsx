/* TEMA FIX: Delete button hover: hover:text-rose-300/border-rose-400 → hover:text-white/border-white/30 */
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Code2, Save, Loader2, X } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Input, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import { skillsService } from '@/services/skills.service'
import { QUERY_KEYS } from '@/constants'

const EMPTY = { name: '', category: '', level: 3, sort_order: 0 }

export default function AdminSkillsPage() {
  const qc = useQueryClient()
  const { toast, show } = useToast()
  const { data: items = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.SKILLS,
    queryFn: skillsService.list,
  })

  const [editing, setEditing] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [busyDelete, setBusyDelete] = useState(false)

  const invalidate = () => qc.invalidateQueries({ queryKey: QUERY_KEYS.SKILLS })

  const grouped = items.reduce((acc, s) => {
    const cat = s.category || 'Uncategorized'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  const handleDelete = async () => {
    if (!confirmId) return
    setBusyDelete(true)
    try {
      await skillsService.remove(confirmId)
      invalidate()
      show('Skill deleted.')
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
        title="Skills"
        description="Tools and technologies, grouped by category, shown on the Skills section."
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
        <div className="rounded-2xl glass-panel p-10 text-center text-sm text-white/40">
          No skills yet.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, list]) => (
            <div key={cat} className="rounded-2xl glass-panel overflow-hidden">
              <div className="px-5 sm:px-6 py-3.5 border-b border-white/[0.06] flex items-center gap-2.5">
                <Code2 className="h-3.5 w-3.5 text-white/55" />
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">
                  {cat}
                </h3>
                <span className="ml-auto text-[10px] text-white/35 font-mono">{list.length}</span>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {list.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 px-5 sm:px-6 py-3.5">
                    <span className="text-sm text-white">{s.name}</span>
                    <div className="flex-1 max-w-xs">
                      <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-white/85 to-white/40"
                          style={{ width: `${(s.level || 0) * 20}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-white/35 font-mono w-10 text-right tabular-nums">
                      {(s.level || 0) * 20}%
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditing(s)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/65 hover:text-white hover:border-white/25 transition"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmId(s.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/55 hover:text-white hover:border-white/30 transition"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <SkillForm
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
        title="Delete skill?"
        description="This will remove the skill from the public site."
        busy={busyDelete}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />
    </>
  )
}

function SkillForm({ initial, onClose, onSaved, onError }) {
  const [form, setForm] = useState({ ...initial })
  const [saving, setSaving] = useState(false)
  const isEdit = !!initial.id

  const update = (k) => (e) => {
    const v = e.target.value
    setForm((f) => ({ ...f, [k]: v }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        level: Math.max(0, Math.min(5, Number(form.level) || 0)),
        sort_order: Number(form.sort_order) || 0,
      }
      if (isEdit) {
        const { id, ...rest } = payload
        await skillsService.update(id, rest)
      } else {
        delete payload.id
        await skillsService.create(payload)
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
      <div className="relative w-full max-w-md rounded-2xl glass-panel border border-white/10 shadow-2xl">
        <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-white">
            {isEdit ? 'Edit skill' : 'New skill'}
          </h3>
          <button onClick={onClose} className="text-white/55 hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={update('name')} required />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={form.category || ''} onChange={update('category')} placeholder="e.g. Frontend, Backend, Data" />
          </div>
          <div>
            <Label htmlFor="level">Level (0–5)</Label>
            <Input id="level" type="number" min="0" max="5" step="1" value={form.level} onChange={update('level')} />
          </div>
          <div>
            <Label htmlFor="sort_order">Sort order</Label>
            <Input id="sort_order" type="number" value={form.sort_order || 0} onChange={update('sort_order')} />
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
