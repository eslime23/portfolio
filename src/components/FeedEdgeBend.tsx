import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type RefObject,
} from 'react'

export interface FeedEdgeBendHandle {
  redraw: () => void
}

interface FeedEdgeBendProps {
  feedRef: RefObject<HTMLElement | null>
  cardRefs: RefObject<Map<string, HTMLElement>>
}

type Edge = 'top' | 'bottom'

interface CardSnapshot {
  bounds: DOMRect
  background: string
  radius: number
  media?: HTMLImageElement | HTMLVideoElement
  mediaBounds?: DOMRect
}

const edgeDepth = 260
const stripHeight = 2

function isRenderableMedia(element: HTMLImageElement | HTMLVideoElement) {
  return element instanceof HTMLImageElement
    ? element.complete && element.naturalWidth > 0
    : element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
}

function getCardSnapshot(card: HTMLElement): CardSnapshot {
  const media = card.querySelector('img, video')
  const renderableMedia =
    media instanceof HTMLImageElement || media instanceof HTMLVideoElement
      ? media
      : undefined
  const cardStyle = getComputedStyle(card)

  return {
    bounds: card.getBoundingClientRect(),
    background: cardStyle.backgroundColor,
    radius: Number.parseFloat(cardStyle.borderTopLeftRadius) || 0,
    media: renderableMedia,
    mediaBounds: renderableMedia?.getBoundingClientRect(),
  }
}

function drawCardStrip(
  context: CanvasRenderingContext2D,
  card: CardSnapshot,
  edge: Edge,
  y: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  const edgeStart = edge === 'top' ? 0 : viewportHeight - edgeDepth
  const progress =
    edge === 'top'
      ? Math.min(1, Math.max(0, (y - edgeStart) / edgeDepth))
      : Math.min(1, Math.max(0, (edgeStart + edgeDepth - y) / edgeDepth))
  const strength = Math.pow(1 - progress, 1.6)

  if (strength <= 0) return

  const scaleX = 1 + strength * 0.16
  const offsetY = (edge === 'top' ? -1 : 1) * strength * 4
  const centerX = viewportWidth / 2
  const cardX = centerX + (card.bounds.left - centerX) * scaleX
  const cardY = card.bounds.top + offsetY
  const cardWidth = card.bounds.width * scaleX

  context.save()
  context.beginPath()
  context.rect(0, y, viewportWidth, height)
  context.clip()
  context.beginPath()
  context.roundRect(
    cardX,
    cardY,
    cardWidth,
    card.bounds.height,
    card.radius * scaleX,
  )
  context.clip()
  context.globalAlpha = Math.min(1, strength * 1.65)

  // The canvas is transparent outside the transformed card fragment. The DOM
  // below remains visible, so the refraction never acts as a clipping mask.
  context.fillStyle = card.background
  context.fillRect(cardX, cardY, cardWidth, card.bounds.height)

  if (
    card.media &&
    card.mediaBounds &&
    isRenderableMedia(card.media)
  ) {
    const mediaX = centerX + (card.mediaBounds.left - centerX) * scaleX
    const mediaY = card.mediaBounds.top + offsetY
    const mediaWidth = card.mediaBounds.width * scaleX

    context.drawImage(
      card.media,
      mediaX,
      mediaY,
      mediaWidth,
      card.mediaBounds.height,
    )
  }

  context.restore()
}

/**
 * Transparent canvas overlay that subtly widens card content at the feed
 * boundaries. It redraws fragments only; no opaque backdrop is painted.
 */
export const FeedEdgeBend = forwardRef<FeedEdgeBendHandle, FeedEdgeBendProps>(
  function FeedEdgeBend({ feedRef, cardRefs }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const frameRef = useRef<number | null>(null)
    const paint = useCallback(() => {
      const canvas = canvasRef.current
      const feed = feedRef.current

      if (!canvas || !feed) return

      const bounds = feed.getBoundingClientRect()
      const width = Math.round(bounds.width)
      const height = Math.round(bounds.height)
      const pixelRatio = window.devicePixelRatio || 1

      if (
        canvas.width !== width * pixelRatio ||
        canvas.height !== height * pixelRatio
      ) {
        canvas.width = width * pixelRatio
        canvas.height = height * pixelRatio
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }

      const context = canvas.getContext('2d')

      if (!context) return

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      context.clearRect(0, 0, width, height)

      for (const card of cardRefs.current.values()) {
        const snapshot = getCardSnapshot(card)

        for (let y = 0; y < edgeDepth; y += stripHeight) {
          drawCardStrip(context, snapshot, 'top', y, stripHeight, width, height)
        }

        for (let y = height - edgeDepth; y < height; y += stripHeight) {
          drawCardStrip(
            context,
            snapshot,
            'bottom',
            y,
            stripHeight,
            width,
            height,
          )
        }
      }
    }, [cardRefs, feedRef])

    const redraw = useCallback(() => {
      if (frameRef.current !== null) return

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null
        paint()
      })
    }, [paint])

    useImperativeHandle(ref, () => ({ redraw }), [redraw])

    useLayoutEffect(() => {
      paint()
    }, [paint])

    useEffect(() => {
      const feed = feedRef.current
      const observer = new ResizeObserver(redraw)
      const media = Array.from(
        feed?.querySelectorAll('img, video') ?? [],
      ) as Array<HTMLImageElement | HTMLVideoElement>

      if (feed) observer.observe(feed)
      media.forEach((element) => {
        element.addEventListener('load', redraw)
        element.addEventListener('loadeddata', redraw)

        if (isRenderableMedia(element)) redraw()
      })
      const delayedRedraw = window.setTimeout(redraw, 250)
      redraw()

      return () => {
        observer.disconnect()
        window.clearTimeout(delayedRedraw)
        media.forEach((element) => {
          element.removeEventListener('load', redraw)
          element.removeEventListener('loadeddata', redraw)
        })
      }
    }, [feedRef, redraw])

    useEffect(() => {
      return () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      }
    }, [])

    return <canvas ref={canvasRef} className="feed-edge-bend" aria-hidden="true" />
  },
)
