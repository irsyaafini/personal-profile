import { cn } from '@/utils'
import GlassSurface from '@/components/reactbits/GlassSurface'

/**
 * Card — menggunakan GlassSurface untuk efek kaca premium.
 * GlassSurface handles: backdrop blur, chromatic aberration (Chrome),
 * rim-light fallback (Safari/Firefox).
 */
export function Card({
  as: Tag = 'div',
  className = '',
  children,
  glassProps = {},
  ...props
}) {
  const {
    borderRadius = 16,
    brightness = 48,
    opacity = 0.92,
    blur = 10,
    backgroundOpacity = 0.03,
    distortionScale = -120,
    redOffset = 0,
    greenOffset = 8,
    blueOffset = 16,
    ...restGlass
  } = glassProps

  return (
    <Tag
      className={cn('relative overflow-hidden rounded-2xl', className)}
      {...props}
    >
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={borderRadius}
        brightness={brightness}
        opacity={opacity}
        blur={blur}
        backgroundOpacity={backgroundOpacity}
        distortionScale={distortionScale}
        redOffset={redOffset}
        greenOffset={greenOffset}
        blueOffset={blueOffset}
        className="!absolute inset-0"
        style={{ position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%', borderRadius: 'inherit' }}
        {...restGlass}
      />
      <div className="relative z-10">
        {children}
      </div>
    </Tag>
  )
}

export function CardBody({ className = '', children, ...props }) {
  return (
    <div className={cn('p-6 sm:p-7', className)} {...props}>
      {children}
    </div>
  )
}
