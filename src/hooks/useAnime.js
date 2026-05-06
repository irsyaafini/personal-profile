import { useEffect, useRef } from 'react'

/**
 * Hook that runs an Anime.js animation on mount.
 * Dynamically imports anime to keep the initial bundle small.
 *
 * @param {Object} animationConfig - Anime.js configuration object
 * @param {boolean} [enabled=true] - whether to run the animation
 * @returns {React.RefObject} ref to attach to the target element
 *
 * @example
 * const ref = useAnime({ translateY: [-30, 0], opacity: [0, 1], duration: 800 })
 * return <div ref={ref}>Hello</div>
 */
export function useAnime(animationConfig, enabled = true) {
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled || !ref.current) return

    let instance = null

    import('animejs').then(({ animate }) => {
      instance = animate(ref.current, {
        ease: 'outExpo',
        ...animationConfig,
      })
    })

    return () => instance?.pause()
  }, [enabled]) // eslint-disable-line react-hooks/exhaustive-deps

  return ref
}