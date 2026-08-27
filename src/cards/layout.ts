import type { CardAssetPlacement, CardVerticalAlign } from './types'

export const cardHorizontalPadding = 40
export const cardVerticalPadding = 40

interface CardContentLayoutOptions {
  cardWidth: number
  minimumCardHeight: number
  contentWidth: number
  contentHeight: number
  verticalAlign?: CardVerticalAlign
}

export function fitContentToCardWidth(
  cardWidth: number,
  contentWidth: number,
  contentHeight: number,
) {
  const maximumContentWidth = Math.max(
    0,
    cardWidth - cardHorizontalPadding * 2,
  )
  const scale =
    contentWidth > maximumContentWidth
      ? maximumContentWidth / contentWidth
      : 1

  return {
    width: contentWidth * scale,
    height: contentHeight * scale,
  }
}

export function getCardContentLayout({
  cardWidth,
  minimumCardHeight,
  contentWidth,
  contentHeight,
  verticalAlign = 'center',
}: CardContentLayoutOptions) {
  const fittedContent = fitContentToCardWidth(
    cardWidth,
    contentWidth,
    contentHeight,
  )
  const verticalPadding =
    verticalAlign === 'center'
      ? cardVerticalPadding * 2
      : cardVerticalPadding
  const height = Math.max(minimumCardHeight, fittedContent.height + verticalPadding)
  const y =
    verticalAlign === 'top'
      ? 0
      : verticalAlign === 'bottom'
        ? height - fittedContent.height
        : (height - fittedContent.height) / 2

  return {
    width: cardWidth,
    height,
    placement: {
      x: (cardWidth - fittedContent.width) / 2,
      y,
      width: fittedContent.width,
      height: fittedContent.height,
    },
  }
}

export function constrainPlacementToCardWidth(
  cardWidth: number,
  placement: CardAssetPlacement,
): CardAssetPlacement {
  const fitted = fitContentToCardWidth(
    cardWidth,
    placement.width,
    placement.height,
  )

  if (fitted.width === placement.width) return placement

  const centerX = placement.x + placement.width / 2
  const centerY = placement.y + placement.height / 2
  const minimumX = cardHorizontalPadding
  const maximumX = cardWidth - cardHorizontalPadding - fitted.width

  return {
    x: Math.min(Math.max(centerX - fitted.width / 2, minimumX), maximumX),
    y: centerY - fitted.height / 2,
    width: fitted.width,
    height: fitted.height,
  }
}
