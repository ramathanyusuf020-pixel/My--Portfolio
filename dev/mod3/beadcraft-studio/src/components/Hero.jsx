import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero page-shell">
      <div className="hero__copy">
        <p className="eyebrow"><span className="eyebrow__dot" />Little things, made by hand</p>
        <h1>Handmade with love,<br /><em>beaded with passion.</em></h1>
        <p className="hero__intro">
          Wearable art and thoughtful objects, made one tiny bead at a time.
          Find the piece that feels like it was made just for you.
        </p>
        <div className="hero__actions">
          <Link className="button button--dark" to="/projects">
            Explore the collection <span aria-hidden="true">↗</span>
          </Link>
          <Link className="button-link" to="/about">A little about us <span aria-hidden="true">→</span></Link>
        </div>
        <div className="hero__note">
          <span className="hero__note-stars" aria-hidden="true">★★★★★</span>
          <span>Loved by people who love the little details</span>
        </div>
      </div>
      <div className="hero__visual">
        <div className="hero__image-wrap">
          <img
            src="https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=1400&q=90"
            alt="Artisan hands carefully arranging colorful beads"
          />
        </div>
        <div className="hero__floating-card">
          <span className="hero__floating-icon" aria-hidden="true">✳</span>
          <span><strong>Thoughtfully made</strong><small>Never mass-produced</small></span>
        </div>
        <span className="hero__side-note">made slowly · worn forever</span>
      </div>
    </section>
  )
}

export default Hero