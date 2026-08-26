import type { CardSection, PortfolioCard } from './types'

const figmaFileUrl =
  'https://www.figma.com/design/fHMqMAt4880w3H3neTRiuZ/1st-text'

const baseCardWidth = 420
const minimumCardHeight = 420
const cardVerticalPadding = 40

function getCenteredCardLayout(contentWidth: number, contentHeight: number) {
  const height = Math.max(
    minimumCardHeight,
    contentHeight + cardVerticalPadding * 2,
  )

  return {
    width: baseCardWidth,
    height,
    placement: {
      x: (baseCardWidth - contentWidth) / 2,
      y: (height - contentHeight) / 2,
      width: contentWidth,
      height: contentHeight,
    },
  }
}

const phonePreviewLayout = getCenteredCardLayout(219, 439)
const videoPreviewLayout = getCenteredCardLayout(420, (174 / 620) * 420)

const cards = [
  {
    id: 'project-mark',
    title: 'Project mark',
    section: 'design',
    status: 'draft',
    order: 10,
    width: 420,
    height: 420,
    radius: 26,
    background: '#f7f7f7',
    asset: {
      src: '/cards/project-mark/preview.png',
      alt: '',
    },
    source: {
      type: 'figma',
      nodeId: '108:4502',
      url: `${figmaFileUrl}?node-id=108-4502`,
    },
  },
  {
    id: 'grok-bot',
    title: 'Grok bot',
    section: 'design',
    status: 'published',
    order: 20,
    width: 420,
    height: 420,
    radius: 26,
    background: '#f7f7f7',
    asset: {
      src: '/cards/grok-bot/preview.png',
      alt: 'Blue bot character',
      placement: { x: 0, y: 145, width: 420, height: 275 },
      fit: 'fill',
    },
    source: {
      type: 'figma',
      nodeId: '108:4504',
      url: `${figmaFileUrl}?node-id=108-4504`,
    },
  },
  {
    id: 'notifications',
    title: 'Notifications',
    section: 'design',
    status: 'published',
    order: 30,
    width: 420,
    height: 610,
    radius: 26,
    background: '#f7f7f7',
    asset: {
      src: '/cards/notifications/preview.png',
      alt: 'Mobile notifications project',
      placement: { x: 0, y: 0, width: 420, height: 509 },
      fit: 'fill',
    },
    source: {
      type: 'figma',
      nodeId: '108:4506',
      url: `${figmaFileUrl}?node-id=108-4506`,
    },
  },
  {
    id: 'iphone-frame',
    title: 'iPhone frame',
    section: 'design',
    status: 'published',
    order: 40,
    width: phonePreviewLayout.width,
    height: phonePreviewLayout.height,
    radius: 26,
    background: '#f7f7f7',
    asset: {
      src: '/cards/iphone-frame/preview.png',
      alt: 'Black iPhone frame',
      placement: phonePreviewLayout.placement,
      fit: 'fill',
    },
    source: {
      type: 'file',
    },
  },
  {
    id: 'green-map',
    title: 'Green map',
    section: 'design',
    status: 'published',
    order: 50,
    width: phonePreviewLayout.width,
    height: phonePreviewLayout.height,
    radius: 26,
    background: '#f7f7f7',
    asset: {
      src: '/cards/green-map/preview.png',
      alt: 'Green map iPhone interface',
      placement: phonePreviewLayout.placement,
      fit: 'fill',
    },
    source: {
      type: 'file',
    },
  },
  {
    id: 'bezel',
    title: 'Bezel',
    section: 'design',
    status: 'draft',
    order: 60,
    width: 420,
    height: 463,
    radius: 26,
    background: '#f7f7f7',
    asset: {
      src: '/cards/bezel/preview.png',
      alt: '',
    },
    source: {
      type: 'figma',
      nodeId: '108:4508',
      url: `${figmaFileUrl}?node-id=108-4508`,
    },
  },
  {
    id: 'video-test',
    title: 'Video test',
    section: 'design',
    status: 'published',
    order: 70,
    width: videoPreviewLayout.width,
    height: videoPreviewLayout.height,
    radius: 26,
    background: '#f7f7f7',
    asset: {
      src: '/cards/video-test/preview.mp4',
      alt: 'Video test',
      kind: 'video',
      placement: videoPreviewLayout.placement,
      fit: 'fill',
    },
    source: {
      type: 'file',
    },
  },
] satisfies PortfolioCard[]

function validateRegistry(registry: PortfolioCard[]) {
  const ids = new Set<string>()

  for (const card of registry) {
    if (ids.has(card.id)) {
      throw new Error(`Duplicate card id: ${card.id}`)
    }

    if (card.width <= 0 || card.height <= 0) {
      throw new Error(`Card ${card.id} must have positive dimensions`)
    }

    ids.add(card.id)
  }

  return registry
}

export const cardRegistry = validateRegistry(cards)

export function getPublishedCards(section: CardSection) {
  return cardRegistry
    .filter((card) => card.section === section && card.status === 'published')
    .sort((a, b) => b.order - a.order)
}
