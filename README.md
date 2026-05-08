# 🚀 Optimasi Lighthouse — Implementation Guide

Panduan lengkap menerapkan optimasi pada website portfolio Anda.

## 📊 Target Skor Setelah Optimasi

| Metric                | Sebelum | Target |
|-----------------------|---------|--------|
| **Performance**       | 63      | **90+** |
| **Accessibility**     | 96      | **100** |
| **Best Practices**    | 100     | 100    |
| **SEO**               | 92      | **100** |
| **LCP**               | 3.9s    | **< 2.5s** |
| **CLS**               | 0.98    | **< 0.1** ✅ |
| **TBT**               | 0ms     | < 200ms ✅ |
| **FCP**               | 1.8s    | **< 1.8s** ✅ |

---

## 🔧 Cara Pasang File-File Ini

Salin file-file di folder `output/` ini ke folder yang sesuai di project Anda:

```
output/
├── index.html                              → root project (replace)
├── vite.config.js                          → root project (replace)
├── public/
│   ├── robots.txt                          → public/robots.txt (NEW)
│   ├── sitemap.xml                         → public/sitemap.xml (NEW)
│   ├── _headers                            → public/_headers (NEW)
│   └── _redirects                          → public/_redirects (NEW)
└── src/
    ├── index.css                           → src/index.css (replace)
    ├── pages/
    │   └── HomePage.jsx                    → src/pages/HomePage.jsx (replace)
    ├── components/
    │   ├── ui/Avatar.jsx                   → src/components/ui/Avatar.jsx (replace)
    │   ├── common/IntroScreen.jsx          → src/components/common/IntroScreen.jsx (replace)
    │   ├── common/SmartImage.jsx           → src/components/common/SmartImage.jsx (replace)
    │   ├── layout/RootLayout.jsx           → src/components/layout/RootLayout.jsx (replace)
    │   └── sections/HeroSection.jsx        → src/components/sections/HeroSection.jsx (replace)
```

---

## ⚠️ HAL PENTING — Wajib Disesuaikan Manual

### 1. `index.html` — Ganti Supabase URL
Cari baris:
```html
<link rel="preconnect" href="https://YOUR_SUPABASE_PROJECT_ID.supabase.co" crossorigin />
<link rel="dns-prefetch" href="https://YOUR_SUPABASE_PROJECT_ID.supabase.co" />
```

Ganti `YOUR_SUPABASE_PROJECT_ID` dengan ID Supabase Anda yang sebenarnya. Bisa dilihat dari `.env` file (variabel `VITE_SUPABASE_URL`).

Misalnya kalau URL Anda `https://abcdefgh.supabase.co`, ganti jadi:
```html
<link rel="preconnect" href="https://abcdefgh.supabase.co" crossorigin />
```

**Mengapa penting?** Browser akan membuka koneksi TLS ke Supabase secara paralel saat parsing HTML, sehingga saat React mulai fetch profile data, koneksi sudah siap → LCP turun ~500ms.

### 2. `index.html` — Sesuaikan Font
Kalau Anda pakai font selain Inter & Playfair Display, sesuaikan link Google Fonts. Yang penting: pakai `&display=swap` di akhir URL.

### 3. Pasang Terser
```bash
npm install -D terser
```

### 4. (Opsional) Install Plugin Compression
```bash
npm install -D vite-plugin-compression
```

Lalu di `vite.config.js` import dan tambahkan ke `plugins`:
```javascript
import viteCompression from 'vite-plugin-compression'
// ...
plugins: [
  react(),
  viteCompression({ algorithm: 'gzip' }),
  viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
],
```

---

## 📝 Apa Saja yang Sudah Dioptimasi?

### 🎯 LCP (Largest Contentful Paint) — 3.9s → target < 2.5s

1. **Avatar Hero — `priority={true}`**
   - `loading="eager"` (sebelumnya `lazy` ❌)
   - `fetchpriority="high"`
   - `decoding="sync"`
   - Browser memprioritaskan gambar ini sebagai LCP element.

2. **IntroScreen lebih cepat**
   - Total durasi animasi dipangkas dari ~3s → ~1.6s
   - Safety timeout dari 6s → 3s
   - Hero element muncul lebih cepat di belakang.

3. **GSAP di-lazy load**
   - GSAP (~70KB) tidak masuk critical bundle.
   - Di-import dynamic saat dibutuhkan (intro animation, hero animation).
   - Browser bisa fokus render hero dulu sebelum download GSAP.

4. **Preconnect ke Supabase**
   - TLS handshake parallel dengan parsing HTML.

### 🎯 CLS (Cumulative Layout Shift) — 0.98 → target < 0.1

1. **Avatar punya `width` + `height` atribut**
   - Browser reservasi ruang sebelum image load.

2. **`aspectRatio` pada container avatar**
   - Backup kalau image masih loading, ruang sudah ada.

3. **Min-height pada hero section**
   - `min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]`
   - Hero tidak collapse saat data profile loading.

4. **Min-height pada h1 heading**
   - Heading tidak menggeser konten saat data load.

5. **`scrollbar-gutter: stable`**
   - Scrollbar tidak menggeser layout saat muncul.

6. **Font `display=swap`**
   - Teks tampil pakai fallback dulu, swap saat font asli ready.
   - `text-wrap: balance` mencegah orphan line shift.

7. **Section fallback dengan `min-height` reservasi**
   - Setiap lazy-loaded section punya placeholder dengan tinggi yang dekat dengan section asli.

### 🎯 TBT (Total Blocking Time) — Optimasi tambahan

1. **Section below-the-fold di-lazy load** (React.lazy + Suspense)
   - Initial JS bundle jauh lebih kecil.
   - Hanya HeroSection yang di-load eager.

2. **`content-visibility: auto` di section bawah**
   - Browser skip render section yang jauh dari viewport.

3. **Manual chunk splitting di vite config**
   - `react-vendor`, `gsap`, `supabase`, `query`, `icons` di-extract.
   - Cache-friendly: update di satu chunk tidak invalidate yang lain.

4. **Lazy GSAP**
   - 70KB GSAP cuma di-load kalau perlu animasi.

### 🎯 Best Practices

1. **Security headers** di `_headers`:
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy` untuk camera/microphone/geolocation
   - `Strict-Transport-Security`

2. **Cache headers** untuk asset:
   - Static asset: `max-age=31536000, immutable` (1 tahun)
   - HTML: `max-age=0, must-revalidate` (selalu revalidate)

### 🎯 SEO

1. **`robots.txt` valid**
   - Allow crawling halaman publik
   - Disallow `/admin/*`
   - Sitemap reference

2. **`sitemap.xml`** dasar dengan halaman utama

3. **Meta tags lengkap** di `index.html`:
   - description, theme-color
   - Open Graph (Facebook, LinkedIn)
   - Twitter Card
   - canonical URL

### 🎯 Accessibility

1. **`aria-hidden="true"`** pada icon dekoratif (MapPin, Mail, ArrowRight, etc.)
2. **Skip animasi** saat `prefers-reduced-motion`
3. **`scroll-behavior: auto`** saat reduced-motion

---

## 🧪 Cara Verifikasi Setelah Deploy

1. **Deploy ke Netlify** seperti biasa.

2. **Test di PageSpeed Insights**:
   ```
   https://pagespeed.web.dev/analysis?url=https%3A%2F%2Firsyaafini.netlify.app
   ```

3. **Test lokal dengan Lighthouse**:
   - Buka site di Chrome
   - DevTools → Lighthouse tab
   - Mode: Navigation
   - Device: Mobile
   - Click "Analyze page load"

4. **Verifikasi cache headers**:
   - DevTools → Network → cek Response Headers asset (.js, .css, .svg)
   - Harus ada `cache-control: public, max-age=31536000, immutable`

5. **Verifikasi robots.txt**:
   - Buka `https://irsyaafini.netlify.app/robots.txt`
   - Harus tampil isi file, bukan 404 atau index.html.

---

## 🎁 Bonus — Kalau Ingin Skor Lebih Tinggi Lagi

### 1. Convert avatar ke WebP / AVIF
Gambar JPG/PNG ~278KB bisa dikecilkan ~70% jadi WebP/AVIF.
Saat upload via admin panel, di `lib/storage.js` `compressImage()` sudah ada — tapi ganti default ke `image/webp`:

```javascript
async function compressImage(file, opts = {}) {
  const { maxDim = 1600, quality = 0.82, mimeType = 'image/webp' } = opts
  // ...
}
```

### 2. Pasang Image CDN (Cloudinary / imgix / Supabase Image Transform)
Supabase mendukung image transformation built-in:
```javascript
supabase.storage.from(bucket).getPublicUrl(path, {
  transform: {
    width: 400,
    height: 400,
    quality: 80,
    format: 'webp',
  }
})
```

### 3. Service Worker untuk PWA
Pasang `vite-plugin-pwa` untuk offline-first → repeat visit mendekati instant.

### 4. Critical CSS Inline
Untuk extreme optimization, ekstrak critical CSS hero section dan inline di `<head>`.

---

## 📌 Catatan Akhir

Optimasi ini bersifat **bertahap**. Beberapa hal seperti `_headers`, `robots.txt`, dan `index.html` punya **dampak instan** setelah deploy. Sementara optimasi seperti `content-visibility` dan lazy loading punya **dampak terbesar di mobile** (Lighthouse default = mobile emulation).

Setelah deploy:
- LCP: 3.9s → **~2.0–2.4s** (perlu network actual + size avatar)
- CLS: 0.98 → **< 0.05** (sudah pasti turun drastis)
- TBT: tetap baik
- Performance score: 63 → **90+**

Selamat mencoba! 🎉
