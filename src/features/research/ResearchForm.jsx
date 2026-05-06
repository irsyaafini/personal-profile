import { useState, useEffect } from 'react'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const DEFAULT_FORM = {
  title: '',
  description: '',
  dataset_info: '',
  findings: '',
  visualization_data: '',
  tags: '',
  status: 'ongoing',
  year: new Date().getFullYear(),
}

/**
 * Research project form (create & edit)
 * @param {{
 *   initial?: Object,
 *   onSubmit: function,
 *   onCancel: function,
 *   isLoading?: boolean
 * }} props
 */
export function ResearchForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [jsonError, setJsonError] = useState('')

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title ?? '',
        description: initial.description ?? '',
        dataset_info: initial.dataset_info ?? '',
        findings: initial.findings ?? '',
        visualization_data: initial.visualization_data
          ? JSON.stringify(initial.visualization_data, null, 2)
          : '',
        tags: initial.tags?.join(', ') ?? '',
        status: initial.status ?? 'ongoing',
        year: initial.year ?? new Date().getFullYear(),
      })
    }
  }, [initial])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'visualization_data') setJsonError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    let vizData = null
    if (form.visualization_data.trim()) {
      try {
        vizData = JSON.parse(form.visualization_data)
      } catch {
        setJsonError('Invalid JSON — check your visualization data.')
        return
      }
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      dataset_info: form.dataset_info.trim(),
      findings: form.findings.trim(),
      visualization_data: vizData,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: form.status,
      year: Number(form.year),
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input id="title" name="title" label="Project Title *" value={form.title} onChange={handleChange} required />
      <Textarea id="description" name="description" label="Description *" rows={3} value={form.description} onChange={handleChange} required />
      <Input id="dataset_info" name="dataset_info" label="Dataset Info" placeholder="e.g. WHO SEARO, n=2.4M, 2020-2023" value={form.dataset_info} onChange={handleChange} />
      <Textarea id="findings" name="findings" label="Key Findings" rows={3} value={form.findings} onChange={handleChange} />

      <div>
        <Textarea
          id="visualization_data"
          name="visualization_data"
          label="Visualization Data (JSON array)"
          rows={6}
          placeholder={'[\n  {"name":"Jan","cases":1200},\n  {"name":"Feb","cases":980}\n]'}
          value={form.visualization_data}
          onChange={handleChange}
          className="font-mono text-sm"
        />
        {jsonError && <p className="text-sm text-red-500 mt-1">{jsonError}</p>}
      </div>

      <Input id="tags" name="tags" label="Tags (comma-separated)" placeholder="COVID-19, Surveillance, Urban Health" value={form.tags} onChange={handleChange} />

      <div className="grid grid-cols-2 gap-5">
        <Select id="status" name="status" label="Status" value={form.status} onChange={handleChange}>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="published">Published</option>
        </Select>
        <Input id="year" name="year" type="number" label="Year" min="2000" max="2099" value={form.year} onChange={handleChange} />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {initial ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
