# Card storage

Each portfolio card has two parts:

1. Files live in `public/cards/<card-id>/`.
2. Layout and source metadata live in `src/cards/registry.ts`.

To add a card:

1. Create `public/cards/<card-id>/` and place the exported asset there.
2. Add one entry to `cardRegistry` with its width, height, radius, order and section. Use `kind: 'video'` for MP4 assets; images are the default.
3. Set `status: 'published'` when the card is ready for the feed.

Cards with `status: 'draft'` stay in storage but are not rendered. Published cards are sorted by `order` from highest to lowest, so the latest card appears at the top. The feed accepts different card sizes and calculates the first and last snap offsets automatically.

## Card content bounds

The base card is 420px wide with a minimum height of 420px. Content keeps at least 40px of space on the left and right. Wider assets are scaled down proportionally and remain centered; narrower assets keep their original size.

Set `asset.verticalAlign` when adding a card:

- `center` (default): 40px top and bottom; card height is `max(420px, fitted asset height + 80px)`.
- `top`: no top offset; content is flush with the top and the height is `max(420px, fitted asset height + 40px)`. Use this when the request says `верх`.
- `bottom`: no bottom offset; content is flush with the bottom and the height is `max(420px, fitted asset height + 40px)`. Use this when the request says `низ`.

Snap animation parameters live in `src/cards/motion.ts`. While the feed moves, the closest card uses a short retargetable transition; the spring runs only after scrolling settles. Keyboard navigation and reduced-motion mode remain instant.
