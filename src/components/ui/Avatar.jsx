import { useState } from 'react'
import { cn, getInitials } from '@/utils'

/**
 * Avatar — komponen avatar dengan dukungan priority loading.
 *
 * OPTIMASI LIGHTHOUSE (LCP):
 *  - Prop `priority`: ketika true, avatar dimuat eager + fetchpriority="high"
 *    + decoding="sync" agar browser memprioritaskan gambar ini sebagai LCP element.
 *    PAKAI INI HANYA UNTUK AVATAR HERO (above-the-fold), tidak untuk yang lain.
 *  - Prop `width` & `height`: dimensi eksplisit pada elemen <img>.
 *    INI WAJIB untuk mencegah CLS (Cumulative Layout Shift). Browser akan
 *    mereservasi ruang sebelum gambar dimuat.
 *  - Untuk avatar non-hero: tetap loading="lazy" + decoding="async".
 */
export function Avatar({
  src,
  name = '',
  size = 'md',
  className = '',
  priority = false,            // ← NEW: untuk hero avatar (LCP element)
}) {
  const [errored, setErrored] = useState(false)

  // Mapping ukuran kelas + dimensi piksel intrinsik untuk attribute width/height.
  // Angka pakai breakpoint paling besar (sm:) supaya browser tahu intrinsic ratio.
  const sizeMap = {
    sm:    { cls: 'h-10 w-10 text-xs',                              w: 40,  h: 40 },
    md:    { cls: 'h-14 w-14 text-sm',                              w: 56,  h: 56 },
    lg:    { cls: 'h-24 w-24 text-lg',                              w: 96,  h: 96 },
    xl:    { cls: 'h-32 w-32 text-2xl',                             w: 128, h: 128 },
    '2xl': { cls: 'h-40 w-40 sm:h-48 sm:w-48 text-3xl',             w: 192, h: 192 },
  }
  const { cls, w, h } = sizeMap[size] ?? sizeMap.md

  const showImg = src && !errored

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden',
        'bg-gradient-to-br from-white/10 to-white/[0.02]',
        'border border-white/10',
        cls,
        className
      )}
      // OPTIMASI CLS: aspect-ratio fixed di container — ruang terreservasi
      // bahkan sebelum image load.
      style={{ aspectRatio: '1 / 1' }}
    >
      {showImg ? (
        <img
          src={src}
          alt={name}
          width={w}
          height={h}
          // OPTIMASI LCP: eager + high priority untuk hero avatar
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchpriority={priority ? 'high' : 'auto'}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-semibold text-white/70">{getInitials(name)}</span>
      )}
    </div>
  )
}