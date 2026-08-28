import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { constrainPlacementToCardWidth } from './layout'
import type { PortfolioCard } from './types'

interface CardFeedProps {
  cards: PortfolioCard[]
  label: string
}

type CardStyle = CSSProperties & {
  '--card-background': string
  '--card-height': string
  '--card-radius': string
  '--card-width': string
}

function getCardStyle(card: PortfolioCard): CardStyle {
  return {
    '--card-background': card.background,
    '--card-height': `${card.height}px`,
    '--card-radius': `${card.radius}px`,
    '--card-width': `${card.width}px`,
  }
}

function getAssetStyle(card: PortfolioCard): CSSProperties {
  const sourcePlacement = card.asset?.placement ?? {
    x: 0,
    y: 0,
    width: card.width,
    height: card.height,
  }
  const placement = constrainPlacementToCardWidth(
    card.width,
    sourcePlacement,
  )
  const verticalAlign = card.asset?.verticalAlign
  const top =
    verticalAlign === 'top'
      ? 0
      : verticalAlign === 'bottom'
        ? card.height - placement.height
        : placement.y

  return {
    top,
    left: placement.x,
    width: placement.width,
    height: placement.height,
    objectFit: card.asset?.fit ?? 'cover',
  }
}

export function CardFeed({ cards, label }: CardFeedProps) {
  const feedRef = useRef<HTMLElement>(null)
  const cardRefs = useRef(new Map<string, HTMLElement>())
  const scrollFrame = useRef<number | null>(null)
  const [activeCardId, setActiveCardId] = useState(cards[0]?.id)

  const updateActiveCard = useCallback(() => {
    const feed = feedRef.current

    if (!feed) return

    const feedCenter = feed.getBoundingClientRect().top + feed.clientHeight / 2
    let closestId = cards[0]?.id
    let closestDistance = Number.POSITIVE_INFINITY

    for (const card of cards) {
      const element = cardRefs.current.get(card.id)

      if (!element) continue

      const bounds = element.getBoundingClientRect()
      const distance = Math.abs(bounds.top + bounds.height / 2 - feedCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestId = card.id
      }
    }

    if (closestId) setActiveCardId(closestId)
  }, [cards])

  const handleScroll = useCallback(() => {
    if (scrollFrame.current !== null) return

    scrollFrame.current = requestAnimationFrame(() => {
      updateActiveCard()
      scrollFrame.current = null
    })
  }, [updateActiveCard])

  const scrollToCard = useCallback(
    (index: number) => {
      const card = cards[Math.max(0, Math.min(index, cards.length - 1))]

      if (!card) return

      cardRefs.current.get(card.id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    },
    [cards],
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const currentIndex = Math.max(
      0,
      cards.findIndex((card) => card.id === activeCardId),
    )

    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault()
      scrollToCard(currentIndex + 1)
    }

    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault()
      scrollToCard(currentIndex - 1)
    }

    if (event.key === 'Home') {
      event.preventDefault()
      scrollToCard(0)
    }

    if (event.key === 'End') {
      event.preventDefault()
      scrollToCard(cards.length - 1)
    }
  }

  if (cards.length === 0) return null

  const firstCard = cards[0]
  const lastCard = cards[cards.length - 1]

  return (
    <section
      ref={feedRef}
      className="project-feed"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onScroll={handleScroll}
    >
      <div className="project-rail">
        <div
          className="project-feed__spacer"
          style={{
            height: `max(0px, calc((100dvh - ${firstCard.height}px) / 2))`,
          }}
          aria-hidden="true"
        />

        {cards.map((card, index) => {
          const isActive = activeCardId === card.id

          return (
            <div
              ref={(element) => {
                if (element) cardRefs.current.set(card.id, element)
                else cardRefs.current.delete(card.id)
              }}
              className="project-card-snap"
              style={{
                ...getCardStyle(card),
                marginBottom: index === cards.length - 1 ? 0 : 16,
              }}
              key={card.id}
              data-card-id={card.id}
            >
              <article
                className="project-card"
                aria-current={isActive ? 'true' : undefined}
                aria-label={`${index + 1} of ${cards.length}: ${card.title}`}
              >
                {card.asset?.kind === 'video' ? (
                  <video
                    src={card.asset.src}
                    aria-label={card.asset.alt}
                    style={getAssetStyle(card)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload={index < 2 ? 'auto' : 'metadata'}
                  />
                ) : card.asset ? (
                  <img
                    src={card.asset.src}
                    alt={card.asset.alt}
                    style={getAssetStyle(card)}
                    draggable="false"
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                ) : null}
              </article>
            </div>
          )
        })}

        <div
          className="project-feed__spacer"
          style={{
            height: `max(0px, calc((100dvh - ${lastCard.height}px) / 2))`,
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
