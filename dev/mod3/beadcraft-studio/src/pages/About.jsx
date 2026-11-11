import { Link } from 'react-router-dom'

function About() {
  return (
    <div className="about-page">
      <section className="about-hero page-shell">
        <div className="about-hero__copy">
          <p className="eyebrow">A note from our little studio</p>
          <h1>Made slowly.<br /><em>Meant to mean something.</em></h1>
          <p>
            Beadcraft began with a box of beads, a curious pair of hands, and
            the belief that everyday things deserve a little magic.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85"
          alt="A maker's notebook and creative tools on a sunlit desk"
        />
      </section>

      <section className="about-story page-section page-shell">
        <div className="about-story__label">
          <span className="about-story__flower" aria-hidden="true">✳</span>
          <p className="eyebrow">The heart of beadcraft</p>
        </div>
        <div className="about-story__copy">
          <h2>Not just made.<br /><em>Made with intention.</em></h2>
          <p>
            We believe the best things carry a bit of their maker with them.
            Each piece is designed, beaded, and finished by hand in our small
            studio, with room for happy imperfections and unexpected color.
          </p>
          <p>
            We make in thoughtful batches, choose materials for their feel as
            much as their finish, and hope each parcel brings a little delight
            to your day. Thank you for making space for handmade.
          </p>
          <Link className="button button--dark" to="/projects">Find your piece <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="about-values">
        <div className="page-shell about-values__grid">
          <article><span aria-hidden="true">01</span><h3>Made by hand</h3><p>Every bead is placed with care, not churned out on a line.</p></article>
          <article><span aria-hidden="true">02</span><h3>Made to be loved</h3><p>Small details, considered colors, and pieces you’ll reach for again.</p></article>
          <article><span aria-hidden="true">03</span><h3>Made in small batches</h3><p>Less rush, more intention—and a little individuality in every piece.</p></article>
        </div>
      </section>
    </div>
  )
}

export default About