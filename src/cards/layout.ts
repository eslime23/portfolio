import type { CardAssetPlacement } from './types'

export const cardHorizontalPadding = 40

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
