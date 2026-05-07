import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  User, Briefcase, Code2, Camera, FlaskConical, Inbox, ArrowUpRight,
} from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { profileService } from '@/services/profile.service'
import { experiencesService } from '@/services/experiences.service'
import { skillsService } from '@/services/skills.service'
import { galleryService } from '@/services/gallery.service'
import { researchService } from '@/services/research.service'
import { messagesService } from '@/services/messages.service'

function StatCard({ icon: Icon, label, value, hint, to }) {
  return (
    <Link
      to={to}
      className="group block rounded-2xl bg-[#161616] border border-white/[0.06] hover:border-white/15 hover:bg-[#1c1c1c] transition p-5"
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] border border-white/10 text-white/85">
          <Icon className="h-4 w-4" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-white transition" />
      </div>
      <div className="mt-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-semibold">
          {label}
        </p>
        <p className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-white">
          {value ?? '—'}
        </p>
        {hint && <p className="mt-1.5 text-xs text-white/45">{hint}</p>}
      </div>
    </Link>
  )
}

export default function AdminDashboardPage() {
  const profile = useQuery({ queryKey: ['profile'], queryFn: profileService.getProfile })
  const exps = useQuery({ queryKey: ['experiences'], queryFn: () => experiencesService.list() })
  const skills = useQuery({ queryKey: ['skills'], queryFn: skillsService.list })
  const gallery = useQuery({ queryKey: ['gallery'], queryFn: () => galleryService.list() })
  const research = useQuery({ queryKey: ['research'], queryFn: () => researchService.list() })
  const msgs = useQuery({ queryKey: ['messages'], queryFn: () => messagesService.list() })

  const unread = (msgs.data ?? []).filter((m) => !m.read).length

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of all content. Click a card to manage that section."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          icon={User}
          label="Profile"
          value={profile.data ? '✓' : '0'}
          hint={profile.data ? profile.data.full_name : 'Not set up yet'}
          to="/admin/profile"
        />
        <StatCard
          icon={Briefcase}
          label="Experiences"
          value={exps.data?.length}
          to="/admin/experiences"
        />
        <StatCard
          icon={Code2}
          label="Skills"
          value={skills.data?.length}
          to="/admin/skills"
        />
        <StatCard
          icon={Camera}
          label="Gallery"
          value={gallery.data?.length}
          to="/admin/gallery"
        />
        <StatCard
          icon={FlaskConical}
          label="Research"
          value={research.data?.length}
          to="/admin/research"
        />
        <StatCard
          icon={Inbox}
          label="Messages"
          value={msgs.data?.length}
          hint={unread > 0 ? `${unread} unread` : 'All read'}
          to="/admin/messages"
        />
      </div>

      <div className="mt-12">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55 mb-4">
          Quick links
        </h2>
        <div className="rounded-2xl bg-[#161616] border border-white/[0.06] divide-y divide-white/[0.06]">
          <Link to="/admin/profile" className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition">
            <span className="text-sm text-white/85">Edit your hero / bio</span>
            <ArrowUpRight className="h-4 w-4 text-white/30" />
          </Link>
          <Link to="/admin/gallery" className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition">
            <span className="text-sm text-white/85">Add a new gallery photo</span>
            <ArrowUpRight className="h-4 w-4 text-white/30" />
          </Link>
          <Link to="/admin/research" className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition">
            <span className="text-sm text-white/85">Publish a research project</span>
            <ArrowUpRight className="h-4 w-4 text-white/30" />
          </Link>
          <Link to="/admin/messages" className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition">
            <span className="text-sm text-white/85">
              Read inbox{unread > 0 && <span className="ml-2 inline-flex h-5 px-1.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">{unread}</span>}
            </span>
            <ArrowUpRight className="h-4 w-4 text-white/30" />
          </Link>
        </div>
      </div>
    </>
  )
}
