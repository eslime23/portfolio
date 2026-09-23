import { useMemo, type CSSProperties } from 'react'

type LensPosition = 'top' | 'bottom'

interface LensRefractionProps {
  position: LensPosition
  height?: string
  strength?: number
  zIndex?: number
}

type LensLayerStyle = CSSProperties & {
  '--lens-layer-start': string
  '--lens-layer-size': string
  '--lens-blur': string
  '--lens-scale': string
  '--lens-shift': string
  '--lens-opacity': string
}

const layerCount = 5

/**
 * A stack of masked backdrop-filter layers. Each layer samples the scrolling
 * feed with a slightly different scale and offset, creating a soft convex
 * glass edge without touching the scroll container or card transforms.
 */
export function LensRefraction({
  position,
  height = '7.5rem',
  strength = 1,
  zIndex = 2,
}: LensRefractionProps) {
  const layers = useMemo(() => {
    return Array.from({ length: layerCount }, (_, index) => {
      const progress = (index + 1) / layerCount
      const eased = progress * progress * (3 - 2 * progress)
      const start = (index / layerCount) * 100
      const size = 100 / layerCount + 18
      const direction = position === 'top' ? 1 : -1

      return {
        '--lens-layer-start': `${start}%`,
        '--lens-layer-size': `${size}%`,
        '--lens-blur': `${(eased * 7 * strength).toFixed(2)}px`,
        '--lens-scale': `${(1 + eased * 0.035 * strength).toFixed(4)}`,
        '--lens-shift': `${(direction * eased * 5 * strength).toFixed(2)}px`,
        '--lens-opacity': `${(0.18 + eased * 0.72).toFixed(3)}`,
      } satisfies LensLayerStyle
    })
  }, [position, strength])

  return (
    <div
      className={`lens-refraction lens-refraction--${position}`}
      style={{ [position]: 0, height, zIndex }}
      aria-hidden="true"
    >
      {layers.map((style, index) => (
        <div
          className="lens-refraction__layer"
          style={style as CSSProperties}
          key={index}
        />
      ))}
    </div>
  )
}
