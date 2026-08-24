# Card storage

Each portfolio card has two parts:

1. Files live in `public/cards/<card-id>/`.
2. Layout and source metadata live in `src/cards/registry.ts`.

To add a card:

1. Create `public/cards/<card-id>/` and place the exported asset there.
2. Add one entry to `cardRegistry` with its width, height, radius, order and section.
3. Set `status: 'published'` when the card is ready for the feed.

Cards with `status: 'draft'` stay in storage but are not rendered. The feed accepts different card sizes and calculates the first and last snap offsets automatically.
