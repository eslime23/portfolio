import { CardFeed } from './cards/CardFeed'
import { getPublishedCards } from './cards/registry'

const designCards = getPublishedCards('design')

export function App() {
  return (
    <main className="portfolio-shell">
      <div className="feed-stage">
        <CardFeed cards={designCards} label="Design projects" />
      </div>

      <div className="portfolio-ui">
        <header className="portfolio-header">
          <div className="identity">
            <p className="intro-text intro-text--1">Nikitin Anton</p>
            <p className="intro-text intro-text--2">
              Design engineer at&nbsp;GigaChat
            </p>
          </div>

          <p className="telegram-label intro-text intro-text--3">Telegram</p>
        </header>

        <nav className="section-toggle" aria-label="Portfolio sections">
          <button className="is-active" type="button" aria-pressed="true">
            Design
          </button>
          <button type="button" aria-pressed="false">
            Fun
          </button>
        </nav>
      </div>
    </main>
  )
}
