import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
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

const edgeDepth = 88
const stripHeight = 2

function isRenderableMedia(element: HTMLImageElement | HTMLVideoElement) {
  return element instanceof HTMLImageElement
    ? element.complete && element.naturalWidth > 0
    : element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
}

function drawCardStrip(
  context: CanvasRenderingContext2D,
  card: HTMLElement,
  edge: Edge,
  y: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  const cardBounds = card.getBoundingClientRect()
  const edgeStart = edge === 'top' ? 0 : viewportHeight - edgeDepth
  const progress =
    edge === 'top'
      ? Math.min(1, Math.max(0, (y - edgeStart) / edgeDepth))
      : Math.min(1, Math.max(0, (edgeStart + edgeDepth - y) / edgeDepth))
  const strength = Math.pow(1 - progress, 3)
  const scaleX = 1 + strength * 0.045
  const offsetY = (edge === 'top' ? -1 : 1) * strength * 2.5
  const centerX = viewportWidth / 2
  const cardX = centerX + (cardBounds.left - centerX) * scaleX
  const cardY = cardBounds.top + offsetY
  const cardWidth = cardBounds.width * scaleX
  const cardHeight = cardBounds.height
  const cardStyle = getComputedStyle(card)
  const radius = Number.parseFloat(cardStyle.borderTopLeftRadius) || 0
  const media = card.querySelector('img, video')
  const mediaBounds = media?.getBoundingClientRect()

  context.save()
  context.beginPath()
  context.rect(0, y, viewportWidth, height)
  context.clip()
  context.beginPath()
  context.roundRect(cardX, cardY, cardWidth, cardHeight, radius * scaleX)
  context.clip()
  context.fillStyle = cardStyle.backgroundColor
  context.fillRect(cardX, cardY, cardWidth, cardHeight)

  if (
    media instanceof HTMLImageElement ||
    media instanceof HTMLVideoElement
  ) {
    if (mediaBounds && isRenderableMedia(media)) {
      const mediaX = centerX + (mediaBounds.left - centerX) * scaleX
      const mediaY = mediaBounds.top + offsetY
      const mediaWidth = mediaBounds.width * scaleX

      context.drawImage(media, mediaX, mediaY, mediaWidth, mediaBounds.height)
    }
  }

  context.restore()
}

/**
 * Canvas bend derived from the reference: the untouched DOM remains
 * interactive while a canvas redraws only the top and bottom edge strips
 * with a non-linear horizontal expansion.
 */
export const FeedEdgeBend = forwardRef<FeedEdgeBendHandle, FeedEdgeBendProps>(
  function FeedEdgeBend({ feedRef, cardRefs }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const frameRef = useRef<number | null>(null)
    const [enabled, setEnabled] = useState(false)

    const redraw = useCallback(() => {
      if (frameRef.current !== null) return

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null

        const canvas = canvasRef.current
        const feed = feedRef.current

        if (!canvas || !feed) return

        const bounds = feed.getBoundingClientRect()
        const width = Math.round(bounds.width)
        const height = Math.round(bounds.height)
        const pixelRatio = window.devicePixelRatio || 1

        if (canvas.width !== width * pixelRatio || canvas.height !== height * pixelRatio) {
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
          for (let y = 0; y < edgeDepth; y += stripHeight) {
            drawCardStrip(context, card, 'top', y, stripHeight, width, height)
          }

          for (
            let y = height - edgeDepth;
            y < height;
            y += stripHeight
          ) {
            drawCardStrip(context, card, 'bottom', y, stripHeight, width, height)
          }
        }
      })
    }, [cardRefs, feedRef])

    useImperativeHandle(ref, () => ({ redraw }), [redraw])

    useEffect(() => {
      const finePointer = window.matchMedia('(pointer: fine)')
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      const updateEnabled = () => {
        setEnabled(finePointer.matches && !reducedMotion.matches)
      }

      updateEnabled()
      finePointer.addEventListener('change', updateEnabled)
      reducedMotion.addEventListener('change', updateEnabled)

      return () => {
        finePointer.removeEventListener('change', updateEnabled)
        reducedMotion.removeEventListener('change', updateEnabled)
      }
    }, [])

    useEffect(() => {
      if (!enabled) return

      const feed = feedRef.current
      const observer = new ResizeObserver(redraw)
      const media = Array.from(
        feed?.querySelectorAll('img, video') ?? [],
      ) as Array<HTMLImageElement | HTMLVideoElement>

      if (feed) observer.observe(feed)
      media.forEach((element) => {
        element.addEventListener('load', redraw)
        element.addEventListener('loadeddata', redraw)
      })
      redraw()

      return () => {
        observer.disconnect()
        media.forEach((element) => {
          element.removeEventListener('load', redraw)
          element.removeEventListener('loadeddata', redraw)
        })
      }
    }, [enabled, feedRef, redraw])

    useEffect(() => {
      return () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      }
    }, [])

    if (!enabled) return null

    return <canvas ref={canvasRef} className="feed-edge-bend" aria-hidden="true" />
  },
)
