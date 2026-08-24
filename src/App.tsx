const projects = [
  {
    id: 'project-mark',
    className: 'project-card--mark',
    image: '/assets/figma/project-01.png',
    alt: '',
  },
  {
    id: 'grok-bot',
    className: 'project-card--grok',
    image: '/assets/figma/project-02.png',
    alt: 'Blue bot character',
  },
  {
    id: 'notifications',
    className: 'project-card--notifications',
    image: '/assets/figma/project-03.png',
    alt: 'Mobile notifications project',
  },
  {
    id: 'bezel',
    className: 'project-card--bezel',
    image: '/assets/figma/project-04.png',
    alt: '',
  },
]

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

      <section className="project-rail" aria-label="Design projects">
        {projects.map((project) => (
          <article className={`project-card ${project.className}`} key={project.id}>
            <img src={project.image} alt={project.alt} />
          </article>
        ))}
      </section>

      <nav className="section-toggle" aria-label="Portfolio sections">
        <button
          className="is-active"
          type="button"
          aria-pressed="true"
        >
          Design
        </button>
        <button type="button" aria-pressed="false">
          Fun
        </button>
      </nav>
    </main>
  )
}
