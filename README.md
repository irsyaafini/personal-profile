# 🔬 EpiPortfolio — Epidemiologist Portfolio Website

A full-stack, production-ready portfolio website for public health professionals, built with React + Supabase.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Styling | TailwindCSS |
| Animation | Framer Motion |
| Data Fetching | TanStack Query v5 |
| State | Zustand |
| Charts | Recharts |
| Backend | Supabase (Auth + PostgreSQL + Storage + RLS) |
| Deployment | Netlify |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── router/          # React Router config + ProtectedRoute
│   ├── providers/       # AuthProvider, QueryProvider
│   └── store/           # Zustand stores (auth, ui)
├── features/
│   ├── research/        # ResearchForm component
│   └── publications/    # PublicationForm component
├── pages/
│   ├── public/          # Home, About, Research, Publications, Contact, 404
│   └── admin/           # Login, Dashboard, Research, Publications, Messages, Profile
├── components/
│   ├── ui/              # Button, Input, Card, Badge, Modal, Skeleton, EmptyState
│   ├── layout/          # Navbar, Footer, PublicLayout, AdminLayout, AdminSidebar
│   └── common/          # SectionHeader, StatCard, ResearchChart, ConfirmDialog
├── hooks/               # useAuth, useResearch, usePublications, useMessages, useProfile
├── services/            # authService, researchService, publicationService, messageService, profileService
├── lib/                 # supabase.js
├── utils/               # formatDate, truncateText, safeJsonParse, etc.
└── constants/           # NAV_LINKS, QUERY_KEYS, CHART_COLORS, etc.
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd epidemio-portfolio
npm install
```

### 2. Setup Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Go to **Storage** → create a bucket named `portfolio-assets` (public)

### 3. Configure Environment

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Create Admin User

In Supabase Dashboard → **Authentication** → **Users** → **Invite user**, create your admin account.

### 5. Run Locally

```bash
npm run dev
```

---

## 🗄️ Database Schema

### Tables
- **`profile`** — Name, title, bio, photo, contact info
- **`research_projects`** — Research with JSON chart data, tags, status
- **`publications`** — Papers with DOI, citations, abstract
- **`messages`** — Contact form submissions

### RLS Policies
| Table | Public | Admin |
|-------|--------|-------|
| profile | READ | FULL |
| research_projects | READ | FULL |
| publications | READ | FULL |
| messages | INSERT only | FULL |

---

## 📊 Chart Data Format

Research projects accept a JSON array for visualization:

```json
[
  { "name": "Jan 2023", "cases": 1200, "deaths": 45 },
  { "name": "Feb 2023", "cases": 980, "deaths": 38 }
]
```

- The `name` field is used as the X-axis label
- All other numeric fields are rendered as chart lines/bars
- Supports both Line and Bar chart types (toggle in detail modal)

---

## 🚢 Deploy to Netlify

1. Push to GitHub
2. Connect repo in Netlify
3. Set build command: `npm run build`, publish dir: `dist`
4. Add environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. Deploy!

The `netlify.toml` handles SPA redirect rules automatically.

---

## 📐 Architecture Principles

- **Feature-based structure** — code grouped by domain, not type
- **Separation of concerns** — UI in components, logic in hooks, API in services
- **DRY** — shared UI primitives, reusable hooks
- **Clean Code** — JSDoc types, descriptive names, max ~200 lines/file
- **Performance** — lazy loaded pages, TanStack Query caching, optimistic updates

---

## 🔐 Admin Routes

| Path | Page |
|------|------|
| `/admin/login` | Login form |
| `/admin` | Dashboard overview |
| `/admin/research` | CRUD research projects |
| `/admin/publications` | CRUD publications |
| `/admin/messages` | View & manage messages |
| `/admin/profile` | Edit portfolio profile |
