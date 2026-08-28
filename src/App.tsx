import { CardFeed } from './cards/CardFeed'
import { getPublishedCards } from './cards/registry'
import { GradualBlur } from './components/GradualBlur'

const designCards = getPublishedCards('design')
const feedBlurProps = {
  target: 'parent' as const,
  height: '6rem',
  strength: 2,
  divCount: 5,
  curve: 'bezier' as const,
  exponential: true,
  opacity: 1,
  zIndex: 2,
}

export function App() {
  return (
    <main className="portfolio-shell">
      <div className="feed-stage">
        <CardFeed cards={designCards} label="Design projects" />

        <GradualBlur {...feedBlurProps} position="top" />
        <GradualBlur {...feedBlurProps} position="bottom" />
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
            <span className="intro-text intro-text--4">Design</span>
          </button>
          <button type="button" aria-pressed="false">
            <span className="intro-text intro-text--5">Fun</span>
          </button>
        </nav>
      </div>
    </main>
  )
}
