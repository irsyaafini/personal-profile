# Portfolio + Admin Panel

Folder ini berisi:
- `src/` — kode lengkap (homepage tema monokrom + admin panel)
- `supabase-setup.sql` — script untuk Supabase (RLS policies + Storage policies)

## Cara Pasang

### 1. Replace folder `src`
Hapus folder `src` lama di root project Anda, lalu copy folder `src` di sini menggantikannya.

### 1a. Install dependency baru: `gsap`
Untuk animasi staggered menu di mobile/tablet, project butuh `gsap`:

```bash
npm install gsap
```

Dependency lain (`@supabase/supabase-js`, `@tanstack/react-query`, `zustand`, `react-router-dom`, `lucide-react`, `@use-gesture/react`) sudah ada di project Anda sebelumnya.

### 2. Setup Supabase

Buka **Supabase Dashboard → SQL Editor**, lalu jalankan **dua file SQL** secara berurutan:

1. **`supabase-schema.sql`** — membuat semua tabel + kolom yang dibutuhkan (`profile`, `experiences`, `skills`, `gallery`, `research`, `messages`). File ini **idempotent** — aman dijalankan berkali-kali, tidak akan menghapus data yang sudah ada. Hanya menambah kolom yang belum ada.
2. **`supabase-setup.sql`** — meng-enable RLS dan menambah policies (public read, authenticated write).

Lalu buat **Storage bucket** bernama `portfolio` (Storage → New bucket → public ON).

> **Catatan:** Kalau Anda dapat error `Could not find the 'xxx' column of 'yyy' in the schema cache` saat upload/save di admin panel, itu berarti schema belum lengkap — jalankan `supabase-schema.sql` lagi untuk menyinkronkan.

### 3. Buat akun admin

**Authentication → Users → Add user → Create new user** dengan email + password pilihan Anda. Tidak ada signup publik — admin panel hanya menerima login user yang sudah dibuat manual.

### 4. Jalankan

```bash
npm run dev
```

Buka:
- `http://localhost:5173/` — homepage publik
- `http://localhost:5173/admin/login` — login admin
- `http://localhost:5173/admin` — dashboard (otomatis redirect ke login kalau belum sign in)

## Struktur Admin

| Route | Fungsi |
|---|---|
| `/admin/login` | Sign in dengan Supabase Auth |
| `/admin` | Dashboard — overview jumlah konten setiap section |
| `/admin/profile` | Edit hero/bio (nama, headline, avatar, email, social, dst.) |
| `/admin/experiences` | CRUD timeline (work, education, certification, award) |
| `/admin/skills` | CRUD skills + level 0–5 |
| `/admin/gallery` | CRUD foto + upload langsung ke Supabase Storage |
| `/admin/research` | CRUD research projects + cover image |
| `/admin/messages` | Inbox pesan dari contact form, mark as read/unread, delete |

Semua perubahan di admin panel langsung tercermin di homepage publik (lewat React Query — invalidate otomatis setelah save).

## Catatan Keamanan

RLS policy di `supabase-setup.sql` membatasi:
- **Public** hanya bisa **read** semua tabel (kecuali `messages` — public hanya bisa **insert**)
- **Authenticated user** (admin) bisa **read + write semua**

Jika kemudian Anda mau membatasi admin ke email tertentu saja, edit policy `_write_authenticated` jadi `using (auth.email() = 'you@example.com')`.

## File yang TIDAK Perlu Diubah Lagi

`tailwind.config.js`, `vite.config.js`, `package.json`, `index.html`, `.env` — semua tetap.
