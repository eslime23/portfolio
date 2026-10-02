import { useMemo, type CSSProperties } from 'react'

// Component added by Ansh — github.com/ansh-dhanani
type BlurPosition = 'top' | 'bottom' | 'left' | 'right'
type BlurCurve = 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out'

export interface GradualBlurProps {
  position?: BlurPosition
  strength?: number
  height?: string
  width?: string
  divCount?: number
  exponential?: boolean
  opacity?: number
  curve?: BlurCurve
  target?: 'parent' | 'page'
  zIndex?: number
  className?: string
  style?: CSSProperties
}

const curveFunctions: Record<BlurCurve, (progress: number) => number> = {
  linear: (progress) => progress,
  bezier: (progress) => progress * progress * (3 - 2 * progress),
  'ease-in': (progress) => progress * progress,
  'ease-out': (progress) => 1 - Math.pow(1 - progress, 2),
  'ease-in-out': (progress) =>
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2,
}

const gradientDirections: Record<BlurPosition, string> = {
  top: 'to top',
  bottom: 'to bottom',
  left: 'to left',
  right: 'to right',
}

export function GradualBlur({
  position = 'bottom',
  strength = 2,
  height = '6rem',
  width,
  divCount = 5,
  exponential = false,
  opacity = 1,
  curve = 'linear',
  target = 'parent',
  zIndex = 2,
  className = '',
  style,
}: GradualBlurProps) {
  const layerCount = Math.max(1, Math.round(divCount))

  const blurLayers = useMemo(() => {
    const increment = 100 / layerCount
    const curveFunction = curveFunctions[curve]

    return Array.from({ length: layerCount }, (_, index) => {
      const layer = index + 1
      const progress = curveFunction(layer / layerCount)
      const blurValue = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * layerCount + 1) * strength
      const p1 = Math.round((increment * layer - increment) * 10) / 10
      const p2 = Math.round(increment * layer * 10) / 10
      const p3 = Math.round((increment * layer + increment) * 10) / 10
      const p4 =
        Math.round((increment * layer + increment * 2) * 10) / 10
      let gradient = `transparent ${p1}%, black ${p2}%`

      if (p3 <= 100) gradient += `, black ${p3}%`
      if (p4 <= 100) gradient += `, transparent ${p4}%`

      const mask = `linear-gradient(${gradientDirections[position]}, ${gradient})`
      const layerStyle: CSSProperties = {
        position: 'absolute',
        inset: 0,
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity,
      }

      return <div key={layer} style={layerStyle} />
    })
  }, [curve, exponential, layerCount, opacity, position, strength])

  const isVertical = position === 'top' || position === 'bottom'
  const containerStyle: CSSProperties = {
    position: target === 'page' ? 'fixed' : 'absolute',
    zIndex,
    pointerEvents: 'none',
    ...(isVertical
      ? {
          [position]: 0,
          right: 0,
          left: 0,
          width: width ?? '100%',
          height,
        }
      : {
          [position]: 0,
          top: 0,
          bottom: 0,
          width: width ?? height,
          height: '100%',
        }),
    ...style,
  }

  return (
    <div
      className={`gradual-blur ${className}`.trim()}
      data-position={position}
      style={containerStyle}
      aria-hidden="true"
    >
      {blurLayers}
    </div>
  )
}
