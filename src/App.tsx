import { CardFeed } from './cards/CardFeed'
import { getPublishedCards } from './cards/registry'

const designCards = getPublishedCards('design')

export function App() {
  return (
    <main className="portfolio-shell">
      <header className="portfolio-header">
        <div className="identity">
          <p>Nikitin Anton</p>
          <p>Design engineer at&nbsp;GigaChat</p>
        </div>

        <p className="telegram-label">Telegram</p>
      </header>

      <CardFeed cards={designCards} label="Design projects" />

      <nav className="section-toggle" aria-label="Portfolio sections">
        <button className="is-active" type="button" aria-pressed="true">
          Design
        </button>
        <button type="button" aria-pressed="false">
          Fun
        </button>
      </nav>
    </main>
  )
}
