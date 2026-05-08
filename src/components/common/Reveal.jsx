/**
 * Reveal — Wrapper component untuk animasi scroll reveal yang halus
 *
 * Pemakaian dasar:
 *   <Reveal>
 *     <YourContent />
 *   </Reveal>
 *
 * Pemakaian dengan opsi:
 *   <Reveal direction="up" delay={120}>...</Reveal>
 *   <Reveal direction="left" delay={200}>...</Reveal>
 *
 * Untuk grup (stagger anak-anak):
 *   <RevealGroup stagger={80}>
 *     <Card />
 *     <Card />
 *     <Card />
 *   </RevealGroup>
 *
 * Karakter animasi: HALUS & SUBTLE — fade + translate ~24px,
 * durasi 0.7s, ease cubic-bezier(0.22, 1, 0.36, 1) (smooth ease-out).
 * Mode REPLAY: animasi jalan tiap kali elemen masuk viewport lagi.
 *
 * State CSS:
 *   .reveal-init        — state awal (opacity 0, translated)
 *   .reveal-in          — state akhir (opacity 1, no translate)
 *   .reveal-up/down/...  — varian arah translate awal
 *
 * Semua transisi didefinisikan di src/index.css.
 */
import { Children, cloneElement, isValidElement } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/utils'

/**
 * <Reveal>
 *
 * Props:
 *   - direction: 'up' | 'down' | 'left' | 'right' | 'none'  (default 'up')
 *   - delay:     number (ms)                                (default 0)
 *   - duration:  number (ms)                                (default 700)
 *   - as:        string | Component                         (default 'div')
 *   - threshold: number 0..1                                (default 0.15)
 *   - once:      boolean                                    (default false)
 *   - className: string — class tambahan
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  as: Tag = 'div',
  threshold,
  once,
  className = '',
  style = {},
  ...rest
}) {
  const { ref, inView } = useScrollReveal({ threshold, once })

  const stateClass = inView ? 'reveal-in' : 'reveal-init'
  const directionClass = direction === 'none' ? '' : `reveal-${direction}`

  return (
    <Tag
      ref={ref}
      className={cn('reveal', stateClass, directionClass, className)}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        transitionDuration: duration !== 700 ? `${duration}ms` : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * <RevealGroup>
 *
 * Membungkus banyak anak dan otomatis memberikan stagger delay.
 * Anak akan dibungkus <Reveal> kalau belum (atau di-clone dengan delay).
 *
 * Props:
 *   - stagger:   number (ms) — jeda antar anak       (default 80)
 *   - direction: same as Reveal                       (default 'up')
 *   - baseDelay: number (ms) — delay awal sebelum anak pertama (default 0)
 *   - as:        wrapper tag                          (default 'div')
 *   - className: class untuk wrapper
 *
 * Tip: pakai untuk grid items, list cards, dsb.
 *      Setiap anak akan punya delay = baseDelay + (index * stagger).
 */
export function RevealGroup({
  children,
  stagger = 80,
  direction = 'up',
  baseDelay = 0,
  duration = 700,
  threshold,
  once,
  as: Tag = 'div',
  className = '',
  itemClassName = '',
  ...rest
}) {
  const items = Children.toArray(children).filter(Boolean)

  return (
    <Tag className={className} {...rest}>
      {items.map((child, i) => {
        const delay = baseDelay + i * stagger
        // Kalau anak sudah berupa <Reveal>, gabungkan delay
        if (isValidElement(child) && child.type === Reveal) {
          return cloneElement(child, {
            key: child.key ?? i,
            delay: (child.props.delay ?? 0) + delay,
          })
        }
        // Kalau bukan, bungkus dengan <Reveal>
        return (
          <Reveal
            key={i}
            direction={direction}
            delay={delay}
            duration={duration}
            threshold={threshold}
            once={once}
            className={itemClassName}
          >
            {child}
          </Reveal>
        )
      })}
    </Tag>
  )
}
