import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Save, Loader2, X, Camera } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TagInput } from '@/components/admin/forms/TagInput'
import { ImageUpload } from '@/components/admin/forms/ImageUpload'
import { useToast } from '@/hooks/useToast'
import { galleryService } from '@/services/gallery.service'
import { resolveImage, deleteFile } from '@/lib/storage'
import { QUERY_KEYS } from '@/constants'
import { formatDate } from '@/utils'

const EMPTY = {
  title: '',
  caption: '',
  image_path: '',
  taken_at: '',
  location: '',
  tags: [],
  sort_order: 0,
}

export default function AdminGalleryPage() {
  const qc = useQueryClient()
  const { toast, show } = useToast()
  const { data: items = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.GALLERY,
    queryFn: () => galleryService.list(),
  })

  const [editing, setEditing] = useState(null)
  const [confirmRow, setConfirmRow] = useState(null)
  const [busyDelete, setBusyDelete] = useState(false)

  const invalidate = () => qc.invalidateQueries({ queryKey: QUERY_KEYS.GALLERY })

  const handleDelete = async () => {
    if (!confirmRow) return
    setBusyDelete(true)
    try {
      // Best-effort delete the storage object first
      if (confirmRow.image_path) {
        await deleteFile(confirmRow.image_path)
      }
      await galleryService.remove(confirmRow.id)
      invalidate()
      show('Photo deleted.')
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
        title="Gallery"
        description="Photos shown in the dome gallery on your homepage."
        actions={
          <Button variant="solid" onClick={() => setEditing(EMPTY)}>
            <Plus className="h-4 w-4" />
            Add photo
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-white/50 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#161616] p-12 text-center">
          <Camera className="h-8 w-8 text-white/30 mx-auto mb-3" />
          <p className="text-sm text-white/40">No photos yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="group relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#161616]"
            >
              <div className="aspect-square bg-black/40">
                {it.image_path && (
                  <img
                    src={resolveImage(it.image_path)}
                    alt={it.title || ''}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-3.5">
                <p className="text-sm text-white truncate font-medium">{it.title || 'Untitled'}</p>
                <p className="text-[11px] text-white/40 mt-0.5 truncate">
                  {it.taken_at ? formatDate(it.taken_at, { year: 'numeric', month: 'short' }) : '—'}
                  {it.location && <span> · {it.location}</span>}
                </p>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => setEditing(it)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 border border-white/15 text-white/85 hover:text-white hover:bg-black"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setConfirmRow(it)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 border border-white/15 text-white/85 hover:text-rose-300 hover:bg-black"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <GalleryForm
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
        title="Delete photo?"
        description="The image file will also be removed from storage."
        busy={busyDelete}
        onCancel={() => setConfirmRow(null)}
        onConfirm={handleDelete}
      />
    </>
  )
}

function GalleryForm({ initial, onClose, onSaved, onError }) {
  const [form, setForm] = useState({
    ...initial,
    tags: Array.isArray(initial.tags) ? initial.tags : [],
    taken_at: initial.taken_at ? initial.taken_at.slice(0, 10) : '',
  })
  const [saving, setSaving] = useState(false)
  const isEdit = !!initial.id

  const update = (k) => (e) => {
    const v = e?.target ? e.target.value : e
    setForm((f) => ({ ...f, [k]: v }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.image_path) {
      onError('Please upload an image first.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        taken_at: form.taken_at || null,
        sort_order: Number(form.sort_order) || 0,
      }
      if (isEdit) {
        const { id, ...rest } = payload
        await galleryService.update(id, rest)
      } else {
        delete payload.id
        await galleryService.create(payload)
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
            {isEdit ? 'Edit photo' : 'New photo'}
          </h3>
          <button onClick={onClose} className="text-white/55 hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          <ImageUpload
            value={form.image_path}
            onChange={(path) => setForm((f) => ({ ...f, image_path: path }))}
            folder="gallery"
            label="Photo"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title || ''} onChange={update('title')} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea id="caption" rows={3} value={form.caption || ''} onChange={update('caption')} />
            </div>
            <div>
              <Label htmlFor="taken_at">Taken at</Label>
              <Input id="taken_at" type="date" value={form.taken_at || ''} onChange={update('taken_at')} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location || ''} onChange={update('location')} />
            </div>
            <div className="sm:col-span-2">
              <Label>Tags</Label>
              <TagInput value={form.tags} onChange={(next) => setForm((f) => ({ ...f, tags: next }))} placeholder="conference, fieldwork…" />
            </div>
            <div>
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" type="number" value={form.sort_order || 0} onChange={update('sort_order')} />
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
