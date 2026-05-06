/**
 * Application-wide constants
 */

/** @type {string} Base path for admin routes */
export const ADMIN_BASE_PATH = '/admin'

/** Navigation links for public layout */
export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Research', path: '/research' },
  { label: 'Publications', path: '/publications' },
  { label: 'Contact', path: '/contact' },
]

/** Admin sidebar navigation links */
export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', path: '/admin', icon: 'dashboard' },
  { label: 'Research', path: '/admin/research', icon: 'research' },
  { label: 'Publications', path: '/admin/publications', icon: 'publications' },
  { label: 'Messages', path: '/admin/messages', icon: 'messages' },
  { label: 'Profile', path: '/admin/profile', icon: 'profile' },
]

/** Expertise areas for About page */
export const EXPERTISE_AREAS = [
  {
    id: 'epidemiology',
    title: 'Epidemiology',
    description: 'Disease surveillance, outbreak investigation, and population health assessment.',
    icon: '🔬',
    skills: ['Outbreak Investigation', 'Disease Surveillance', 'Field Epidemiology', 'Contact Tracing'],
  },
  {
    id: 'biostatistics',
    title: 'Biostatistics',
    description: 'Statistical modeling, clinical trial analysis, and health data analytics.',
    icon: '📊',
    skills: ['Regression Analysis', 'Survival Analysis', 'Meta-Analysis', 'R / STATA / SPSS'],
  },
  {
    id: 'surveillance',
    title: 'Health Surveillance',
    description: 'Public health monitoring systems and real-time disease tracking.',
    icon: '🌐',
    skills: ['GIS Mapping', 'Syndromic Surveillance', 'IHR Compliance', 'WHO Reporting'],
  },
]

/** Query keys for TanStack Query */
export const QUERY_KEYS = {
  PROFILE: ['profile'],
  RESEARCH: ['research'],
  RESEARCH_DETAIL: (id) => ['research', id],
  PUBLICATIONS: ['publications'],
  MESSAGES: ['messages'],
  STATS: ['stats'],
}

/** Toast duration in ms */
export const TOAST_DURATION = 3000

/** Pagination limit */
export const PAGE_SIZE = 10

/** Supabase storage bucket name */
export const STORAGE_BUCKET = 'portfolio-assets'

/** Chart color palette */
export const CHART_COLORS = {
  primary: '#0284c7',
  secondary: '#059669',
  accent: '#f59e0b',
  danger: '#ef4444',
  muted: '#94a3b8',
}
