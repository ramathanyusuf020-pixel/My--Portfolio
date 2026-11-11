import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'fieldnotes-projects'

function readStoredProjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function ProjectCard({ project, index }) {
  return (
    <a className={`project-card project-card-${index + 1}`} href={`#/project/${project.id}`}>
      <div className="project-image-wrap">
        <img src={project.image} alt={project.imageAlt || `${project.title} project`} />
        <span className="project-arrow" aria-hidden="true">↗</span>
      </div>
      <div className="project-card-copy">
        <div>
          <h3>{project.title}</h3>
          <p>{project.type}</p>
        </div>
        <span className="project-year">{project.year}</span>
      </div>
    </a>
  )
}

function AddProjectDialog({ onClose, onAdd }) {
  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const project = {
      id: `project-${Date.now()}`,
      title: formData.get('title').trim(),
      type: formData.get('type').trim(),
      year: formData.get('year').trim(),
      description: formData.get('description').trim(),
      image: formData.get('image').trim(),
      imageAlt: `${formData.get('title').trim()} project image`,
      stack: formData.get('stack').split(',').map((item) => item.trim()).filter(Boolean),
      featured: false,
    }
    onAdd(project)
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">Fresh from the bar</span>
            <h2 id="dialog-title">Add a coffee feature</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close form">×</button>
        </div>
        <form className="project-form" onSubmit={handleSubmit}>
          <label>Drink or feature name<input name="title" placeholder="e.g. Honey oat cortado" required maxLength="70" /></label>
          <div className="form-row">
            <label>Category<input name="type" placeholder="Espresso bar" required maxLength="40" /></label>
            <label>Year<input name="year" placeholder="2025" required maxLength="4" /></label>
          </div>
          <label>Tasting notes<textarea name="description" placeholder="Tell us about the beans, flavor, and brew." required rows="3" maxLength="360" /></label>
          <label>Coffee photo URL<input name="image" type="url" placeholder="https://images.unsplash.com/..." required /></label>
          <label>Beans or ingredients, separated by commas<input name="stack" placeholder="Ethiopia Guji, oat milk, honey" /></label>
          <div className="form-actions">
            <button type="button" className="text-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="button button-dark">Add to the menu <span aria-hidden="true">↗</span></button>
          </div>
        </form>
      </section>
    </div>
  )
}

function ProjectDetail({ project, onBack }) {
  return (
    <main className="detail-page page-enter">
      <button className="back-link" type="button" onClick={onBack}><span aria-hidden="true">←</span> All projects</button>
      <div className="detail-heading">
        <span className="eyebrow">From the coffee bar / {project.year}</span>
        <h1>{project.title}<span className="period">.</span></h1>
        <p>{project.type}</p>
      </div>
      <img className="detail-image" src={project.image} alt={project.imageAlt || `${project.title} project`} />
      <div className="detail-description">
        <span className="eyebrow">Tasting notes</span>
        <p>{project.description}</p>
        <div className="detail-tools"><span className="eyebrow">In the cup</span><div>{project.stack?.map((tool) => <span key={tool}>{tool}</span>)}</div></div>
      </div>
    </main>
  )
}

function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Everything')
  const [showForm, setShowForm] = useState(false)
  const [route, setRoute] = useState(window.location.hash)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let active = true
    async function loadProjects() {
      try {
        const response = await fetch('/projects.json')
        if (!response.ok) throw new Error('Project data could not be loaded')
        const data = await response.json()
        if (active) setProjects([...readStoredProjects(), ...data])
      } catch {
        if (active) {
          setProjects(readStoredProjects())
          setLoadError(true)
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    loadProjects()
    return () => { active = false }
  }, [])

  useEffect(() => {
    function syncRoute() { setRoute(window.location.hash) }
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [route])

  function addProject(project) {
    const updatedProjects = [project, ...projects]
    setProjects(updatedProjects)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects.filter((item) => item.id.startsWith('project-'))))
    setActiveFilter('Everything')
    setShowForm(false)
  }

  const detailMatch = route.match(/^#\/project\/(.+)$/)
  const selectedProject = detailMatch ? projects.find((project) => project.id === detailMatch[1]) : null
  const filters = ['Everything', ...new Set(projects.map((project) => project.type))]
  const visibleProjects = activeFilter === 'Everything' ? projects : projects.filter((project) => project.type === activeFilter)

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#/" aria-label="Mara Chen, home"><span className="wordmark-mark">m<span>.</span></span><span className="wordmark-name">Mara Chen<br />Barista & coffee maker</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#work">The menu <span>({projects.length.toString().padStart(2, '0')})</span></a>
          <a href="#about">Our story</a>
        </nav>
        <a className="contact-link" href="mailto:hello@marachen.studio">Find us <span aria-hidden="true">↗</span></a>
      </header>

      {selectedProject ? <ProjectDetail project={selectedProject} onBack={() => { window.location.hash = '#/' }} /> : detailMatch ? (
        <main className="not-found"><span className="eyebrow">A little detour</span><h1>Project not found<span className="period">.</span></h1><a href="#/">Back to the work <span aria-hidden="true">↗</span></a></main>
      ) : (
        <main>
          <section className="intro" id="about">
            <div className="intro-topline"><span>SMALL BATCH / BIG HEART</span><span>BROOKLYN, NEW YORK <i className="status-dot" /></span></div>
            <div className="intro-main">
              <h1>Good coffee.<br />Kind people.<br /><em>Every day<span className="period">.</span></em></h1>
              <div className="intro-aside"><span className="asterisk" aria-hidden="true">✳</span><p>I&apos;m Mara, a neighborhood barista chasing a better cup, welcoming the regulars, and making room for one more at the counter.</p><a href="mailto:hello@marachen.studio">Come say hello <span aria-hidden="true">↗</span></a></div>
            </div>
            <div className="intro-bottom"><span>BREWED WITH CARE</span><a href="#work" aria-label="Scroll to the coffee menu">↓</a><span>TAKE A LOOK AROUND</span></div>
          </section>

          <section className="work-section" id="work">
            <div className="section-heading"><div><span className="eyebrow">On the bar this week</span><h2>Good things brewing<span className="period">.</span></h2></div><button className="button button-outline" type="button" onClick={() => setShowForm(true)}><span aria-hidden="true">+</span> Add a coffee</button></div>
            <div className="filter-bar" aria-label="Filter projects">
              <span>{loading ? 'BREWING THE MENU' : `${visibleProjects.length.toString().padStart(2, '0')} MENU ITEMS`}</span>
              <div>{filters.map((filter) => <button key={filter} type="button" className={activeFilter === filter ? 'filter-active' : ''} onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}>{filter}</button>)}</div>
            </div>
            {loadError && <p className="load-error" role="status">The menu could not be loaded. Your saved coffee features are still here.</p>}
            {loading ? <div className="loading-state">Warming up the espresso machine<span>✳</span></div> : visibleProjects.length ? <div className="project-grid">{visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div> : <div className="empty-state"><span>✳</span><p>Nothing brewing in this category just yet.</p></div>}
          </section>

          <section className="note-section"><span className="eyebrow">A note from Mara</span><p>We think the best coffee is the one shared across the counter. Come as you are, stay for a second cup, leave a little brighter.</p><a href="mailto:hello@marachen.studio">Plan your visit <span aria-hidden="true">↗</span></a></section>
        </main>
      )}

      <footer className="site-footer"><a className="footer-mark" href="#/">m<span>.</span></a><span>POURED WITH CARE · © 2025 MARA CHEN</span><a href="mailto:hello@marachen.studio">SAY HELLO <span aria-hidden="true">↗</span></a></footer>
      {showForm && <AddProjectDialog onClose={() => setShowForm(false)} onAdd={addProject} />}
    </div>
  )
}

export default App