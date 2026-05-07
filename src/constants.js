// src/constants.js

// Supabase Storage bucket name — sesuaikan dengan nama bucket di Supabase dashboard kamu
export const STORAGE_BUCKET = 'portfolio'

export const QUERY_KEYS = {
  // Messages
  MESSAGES: ['messages'],
  MESSAGE_DETAIL: (id) => ['messages', id],

  // Dashboard Stats
  STATS: ['stats'],

  // Research
  RESEARCH: ['research'],
  RESEARCH_DETAIL: (id) => ['research', id],

  // Profile
  PROFILE: ['profile'],

  // Gallery
  GALLERY: ['gallery'],
  GALLERY_DETAIL: (id) => ['gallery', id],

  // Experience / Timeline
  EXPERIENCES: ['experiences'],

  // Skills
  SKILLS: ['skills'],
}

// Public-site navigation
export const NAV_ITEMS = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'gallery', label: 'Gallery', href: '#gallery' },
  { id: 'portfolio', label: 'Portfolio', href: '#portfolio' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

// Admin navigation
export const ADMIN_NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    to: '/admin' },
  { id: 'profile',      label: 'Profile',      to: '/admin/profile' },
  { id: 'experiences',  label: 'Experiences',  to: '/admin/experiences' },
  { id: 'skills',       label: 'Skills',       to: '/admin/skills' },
  { id: 'gallery',      label: 'Gallery',      to: '/admin/gallery' },
  { id: 'research',     label: 'Research',     to: '/admin/research' },
  { id: 'messages',     label: 'Messages',     to: '/admin/messages' },
]

// Vocabulary
export const EXPERIENCE_TYPES = [
  { value: 'work', label: 'Work' },
  { value: 'education', label: 'Education' },
  { value: 'certification', label: 'Certification' },
  { value: 'award', label: 'Award' },
]

export const RESEARCH_STATUSES = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'published', label: 'Published' },
]
