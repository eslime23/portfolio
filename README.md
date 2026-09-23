# Nikitin Anton — Portfolio

Portfolio website implemented from the Figma source of truth.

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Design source

[Figma — 1st text, node 108:4500](https://www.figma.com/design/fHMqMAt4880w3H3neTRiuZ/1st-text?node-id=108-4500)

## Cards

The central column is a vertical snap feed. Card assets are stored in `public/cards/<card-id>/`; dimensions, order, publication state and Figma source metadata are stored in `src/cards/registry.ts`.

See [`src/cards/README.md`](src/cards/README.md) for the add-card workflow.
