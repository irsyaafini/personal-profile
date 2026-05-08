/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useId, useCallback } from 'react'

const useDarkMode = () => {
  // Site selalu dark theme
  return true
}

/**
 * Liquid Glass Fallback CSS — diinject sekali ke <head>.
 *
 * Dipakai saat path SVG filter tidak tersedia (Safari, iOS, Firefox).
 * Tujuan: bikin efek "kaca tipis dengan rim light" yang terasa premium,
 * mirip notification panel iOS / Apple Vision Pro UI.
 *
 * Layering:
 *   - .liquid-glass-fallback        → wrapper utama (background + blur)
 *   - ::before                      → rim light atas (paling terang)
 *   - ::after                       → highlight diagonal halus (specular)
 *
 * Pseudo-elements absolute-positioned di dalam wrapper, tidak ganggu
 * konten anak (children tetap z-10 di atas).
 */
const LIQUID_GLASS_STYLE_ID = 'liquid-glass-fallback-styles'
if (typeof document !== 'undefined' && !document.getElementById(LIQUID_GLASS_STYLE_ID)) {
  const styleEl = document.createElement('style')
  styleEl.id = LIQUID_GLASS_STYLE_ID
  styleEl.textContent = `
    .liquid-glass-fallback {
      position: relative;
      isolation: isolate;
    }

    /* Rim light atas — yang bikin terasa kaca yang terkena cahaya dari atas.
       Gradient putih semi-transparent yang hanya terlihat di tepi atas. */
    .liquid-glass-fallback::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.35) 0%,
        rgba(255, 255, 255, 0.08) 35%,
        rgba(255, 255, 255, 0.02) 60%,
        rgba(255, 255, 255, 0.10) 100%
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
              mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
              mask-composite: exclude;
      pointer-events: none;
      z-index: 1;
    }

    /* Specular highlight — subtle diagonal sweep yang bikin permukaan
       terasa seperti kaca yang merefleksikan cahaya dari satu sisi. */
    .liquid-glass-fallback::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(
        125deg,
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 255, 255, 0.02) 25%,
        transparent 50%,
        transparent 75%,
        rgba(255, 255, 255, 0.04) 100%
      );
      pointer-events: none;
      z-index: 0;
      mix-blend-mode: overlay;
    }

    /* Saat container tidak punya backdrop-filter (browser sangat lawas),
       jangan tampilkan rim/highlight karena tanpa blur background nanti
       terlihat "datar" dan rim malah aneh. */
    @supports not (backdrop-filter: blur(10px)) {
      @supports not (-webkit-backdrop-filter: blur(10px)) {
        .liquid-glass-fallback::before,
        .liquid-glass-fallback::after {
          display: none;
        }
      }
    }
  `
  document.head.appendChild(styleEl)
}

const GlassSurface = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  className = '',
  style = {},
}) => {
  const uniqueId = useId().replace(/:/g, '-')
  const filterId = `glass-filter-${uniqueId}`
  const redGradId = `red-grad-${uniqueId}`
  const blueGradId = `blue-grad-${uniqueId}`

  const [svgSupported, setSvgSupported] = useState(false)

  const containerRef = useRef(null)
  const feImageRef = useRef(null)
  const redChannelRef = useRef(null)
  const greenChannelRef = useRef(null)
  const blueChannelRef = useRef(null)
  const gaussianBlurRef = useRef(null)

  // Simpan props terbaru di ref agar generateDisplacementMap selalu pakai nilai fresh
  const propsRef = useRef({})
  propsRef.current = {
    borderWidth, brightness, opacity, blur, borderRadius,
    distortionScale, redOffset, greenOffset, blueOffset,
    xChannel, yChannel, mixBlendMode, displace,
  }

  const isDarkMode = useDarkMode()

  const generateDisplacementMap = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    // FIX: Jika rect masih 0 (belum layout), batalkan — jangan generate dengan ukuran salah
    if (!rect || rect.width === 0 || rect.height === 0) return

    const {
      borderWidth: bw, brightness: br, opacity: op, blur: bl,
      borderRadius: brad, distortionScale: ds, redOffset: ro,
      greenOffset: go, blueOffset: bo, xChannel: xc, yChannel: yc,
      mixBlendMode: mBM,
    } = propsRef.current

    const actualWidth = rect.width
    const actualHeight = rect.height
    const edgeSize = Math.min(actualWidth, actualHeight) * (bw * 0.5)

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${brad}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${brad}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mBM}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${brad}" fill="hsl(0 0% ${br}% / ${op})" style="filter:blur(${bl}px)" />
      </svg>
    `

    const dataUrl = `data:image/svg+xml,${encodeURIComponent(svgContent)}`
    feImageRef.current?.setAttribute('href', dataUrl)

    // Update displacement scales
    ;[
      { ref: redChannelRef, offset: ro },
      { ref: greenChannelRef, offset: go },
      { ref: blueChannelRef, offset: bo },
    ].forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute('scale', (ds + offset).toString())
        ref.current.setAttribute('xChannelSelector', xc)
        ref.current.setAttribute('yChannelSelector', yc)
      }
    })

    gaussianBlurRef.current?.setAttribute('stdDeviation', propsRef.current.displace.toString())
  }, [redGradId, blueGradId])

  // FIX: Cek SVG support SETELAH mount dengan requestAnimationFrame
  // agar DOM sudah siap dan dimensi sudah tersedia
  const supportsSVGFilters = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false
    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    const isFirefox = /Firefox/.test(navigator.userAgent)
    if (isWebkit || isFirefox) return false
    const div = document.createElement('div')
    div.style.backdropFilter = `url(#${filterId})`
    return div.style.backdropFilter !== ''
  }, [filterId])

  const supportsBackdropFilter = () => {
    if (typeof window === 'undefined') return false
    return CSS.supports('backdrop-filter', 'blur(10px)')
  }

  // FIX: Inisialisasi utama — pakai rAF bertingkat agar layout sudah selesai
  // sebelum kita ukur dimensi dan generate displacement map
  useEffect(() => {
    const supported = supportsSVGFilters()
    setSvgSupported(supported)

    if (!supported) return

    // rAF pertama: setelah paint pertama
    // rAF kedua: setelah browser selesai layout & composite — dimensi sudah akurat
    let raf1, raf2
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        generateDisplacementMap()
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [])

  // FIX: ResizeObserver — pakai rAF agar tidak update saat layout masih berjalan
  useEffect(() => {
    if (!containerRef.current) return

    let raf
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        generateDisplacementMap()
      })
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
    }
  }, [generateDisplacementMap])

  // Update saat props berubah (brightness, blur, dll) — pakai rAF juga
  useEffect(() => {
    if (!svgSupported) return
    let raf = requestAnimationFrame(() => {
      generateDisplacementMap()
    })
    return () => cancelAnimationFrame(raf)
  }, [
    svgSupported,
    width, height, borderRadius, borderWidth,
    brightness, opacity, blur, displace,
    distortionScale, redOffset, greenOffset, blueOffset,
    xChannel, yChannel, mixBlendMode,
    generateDisplacementMap,
  ])

  const getContainerStyles = () => {
    const baseStyles = {
      ...style,
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius: `${borderRadius}px`,
      '--glass-frost': backgroundOpacity,
      '--glass-saturation': saturation,
    }

    const backdropFilterSupported = supportsBackdropFilter()

    if (svgSupported) {
      return {
        ...baseStyles,
        background: isDarkMode
          ? `hsl(0 0% 0% / ${backgroundOpacity})`
          : `hsl(0 0% 100% / ${backgroundOpacity})`,
        backdropFilter: `url(#${filterId}) saturate(${saturation})`,
        boxShadow: isDarkMode
          ? `0 0 2px 1px color-mix(in oklch, white, transparent 65%) inset,
             0 0 10px 4px color-mix(in oklch, white, transparent 85%) inset,
             0px 4px 16px rgba(17, 17, 26, 0.05),
             0px 8px 24px rgba(17, 17, 26, 0.05),
             0px 16px 56px rgba(17, 17, 26, 0.05),
             0px 4px 16px rgba(17, 17, 26, 0.05) inset,
             0px 8px 24px rgba(17, 17, 26, 0.05) inset,
             0px 16px 56px rgba(17, 17, 26, 0.05) inset`
          : `0 0 2px 1px color-mix(in oklch, black, transparent 85%) inset,
             0 0 10px 4px color-mix(in oklch, black, transparent 90%) inset,
             0px 4px 16px rgba(17, 17, 26, 0.05),
             0px 8px 24px rgba(17, 17, 26, 0.05),
             0px 16px 56px rgba(17, 17, 26, 0.05),
             0px 4px 16px rgba(17, 17, 26, 0.05) inset,
             0px 8px 24px rgba(17, 17, 26, 0.05) inset,
             0px 16px 56px rgba(17, 17, 26, 0.05) inset`,
      }
    } else {
      if (isDarkMode) {
        if (!backdropFilterSupported) {
          return {
            ...baseStyles,
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)`,
          }
        } else {
          // REVISI: Liquid glass fallback untuk Safari/iOS/Firefox.
          // Tidak bisa pakai SVG chromatic aberration di engine ini, jadi
          // kita simulasi efek "kaca tipis" yang terasa premium dengan:
          //   1. Background SANGAT transparan (rgba 0.04) — supaya konten
          //      di belakang benar-benar terlihat tembus, ciri khas glass.
          //   2. backdrop-filter: blur(24px) saturate(1.8) brightness(1.05)
          //      — blur kuat tapi warna konten tetap hidup, sedikit lebih
          //      terang seperti kaca tipis yang konsentrasi cahaya.
          //   3. Border halus white/12% — frame kaca.
          //   4. boxShadow ringan — depth tanpa berlebihan.
          //
          // Rim light atas + specular highlight diagonal di-handle oleh
          // pseudo-elements ::before dan ::after via class
          // .liquid-glass-fallback (lihat CSS di module top).
          return {
            ...baseStyles,
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(24px) saturate(1.8) brightness(1.05)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.8) brightness(1.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: `
              0 4px 16px rgba(0, 0, 0, 0.20),
              0 8px 32px rgba(0, 0, 0, 0.12)
            `,
          }
        }
      } else {
        if (!backdropFilterSupported) {
          return {
            ...baseStyles,
            background: 'rgba(255, 255, 255, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
                        inset 0 -1px 0 0 rgba(255, 255, 255, 0.3)`,
          }
        } else {
          return {
            ...baseStyles,
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(12px) saturate(1.8) brightness(1.1)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.8) brightness(1.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.2),
                        0 2px 16px 0 rgba(31, 38, 135, 0.1),
                        inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
                        inset 0 -1px 0 0 rgba(255, 255, 255, 0.2)`,
          }
        }
      }
    }
  }

  const glassSurfaceClasses =
    'relative flex items-center justify-center overflow-hidden transition-opacity duration-[260ms] ease-out'

  // REVISI: Tambah class .liquid-glass-fallback saat path SVG TIDAK aktif
  // (Safari, iOS, Firefox). Class ini mengaktifkan rim light atas + specular
  // highlight diagonal lewat pseudo-elements (lihat CSS di module top).
  const fallbackClass = !svgSupported ? 'liquid-glass-fallback' : ''

  const focusVisibleClasses = isDarkMode
    ? 'focus-visible:outline-2 focus-visible:outline-[#0A84FF] focus-visible:outline-offset-2'
    : 'focus-visible:outline-2 focus-visible:outline-[#007AFF] focus-visible:outline-offset-2'

  return (
    <div
      ref={containerRef}
      className={`${glassSurfaceClasses} ${fallbackClass} ${focusVisibleClasses} ${className}`}
      style={getContainerStyles()}
    >
      <svg
        className="w-full h-full pointer-events-none absolute inset-0 opacity-0 -z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

            <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" id="redchannel" result="dispRed" />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />

            <feDisplacementMap
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              id="greenchannel"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />

            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" id="bluechannel" result="dispBlue" />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      <div className="w-full h-full flex items-center justify-center p-2 rounded-[inherit] relative z-10">
        {children}
      </div>
    </div>
  )
}

export default GlassSurface