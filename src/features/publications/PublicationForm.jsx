import { useState, useEffect } from 'react'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const DEFAULT_FORM = {
  title: '', authors: '', journal: '', year: new Date().getFullYear(),
  volume: '', issue: '', pages: '', doi: '', link: '',
  abstract: '', citation_count: 0, publication_type: 'journal',
}

/**
 * Publication form (create & edit)
 * @param {{ initial?: Object, onSubmit: function, onCancel: function, isLoading?: boolean }} props
 */
export function PublicationForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(DEFAULT_FORM)

  useEffect(() => {
    if (initial) setForm({ ...DEFAULT_FORM, ...initial })
  }, [initial])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      year: Number(form.year),
      citation_count: Number(form.citation_count),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Textarea id="title" name="title" label="Title *" rows={2} value={form.title} onChange={handleChange} required />
      <Input id="authors" name="authors" label="Authors *" placeholder="Chen S, Martinez R, Patel A" value={form.authors} onChange={handleChange} required />
      <div className="grid sm:grid-cols-2 gap-5">
        <Input id="journal" name="journal" label="Journal / Venue *" value={form.journal} onChange={handleChange} required />
        <Input id="year" name="year" type="number" label="Year *" min="1990" max="2099" value={form.year} onChange={handleChange} required />
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        <Input id="volume" name="volume" label="Volume" value={form.volume} onChange={handleChange} />
        <Input id="issue" name="issue" label="Issue" value={form.issue} onChange={handleChange} />
        <Input id="pages" name="pages" label="Pages" placeholder="1-12" value={form.pages} onChange={handleChange} />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Input id="doi" name="doi" label="DOI" placeholder="10.xxxx/xxxxx" value={form.doi} onChange={handleChange} />
        <Input id="link" name="link" type="url" label="URL" placeholder="https://doi.org/..." value={form.link} onChange={handleChange} />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Select id="publication_type" name="publication_type" label="Type" value={form.publication_type} onChange={handleChange}>
          <option value="journal">Journal Article</option>
          <option value="conference">Conference Paper</option>
          <option value="book_chapter">Book Chapter</option>
          <option value="report">Technical Report</option>
        </Select>
        <Input id="citation_count" name="citation_count" type="number" label="Citations" min="0" value={form.citation_count} onChange={handleChange} />
      </div>
      <Textarea id="abstract" name="abstract" label="Abstract (optional)" rows={3} value={form.abstract} onChange={handleChange} />
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {initial ? 'Save Changes' : 'Add Publication'}
        </Button>
      </div>
    </form>
  )
}
