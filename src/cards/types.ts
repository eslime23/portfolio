export type CardSection = 'design' | 'fun'

export type CardStatus = 'draft' | 'published'

export interface CardAssetPlacement {
  x: number
  y: number
  width: number
  height: number
}

export interface CardAsset {
  src: string
  alt: string
  kind?: 'image' | 'video'
  placement?: CardAssetPlacement
  fit?: 'contain' | 'cover' | 'fill'
}

export interface CardSource {
  type: 'figma' | 'file'
  nodeId?: string
  url?: string
}

export interface PortfolioCard {
  id: string
  title: string
  section: CardSection
  status: CardStatus
  order: number
  width: number
  height: number
  radius: number
  background: string
  asset?: CardAsset
  source: CardSource
}
