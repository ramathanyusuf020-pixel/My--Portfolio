import { useState } from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function subscribe(event) {
    event.preventDefault()
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="site-footer">
      <div className="footer-newsletter">
        <div className="page-shell footer-newsletter__inner">
          <div>
            <p className="eyebrow">A little note from us</p>
            <h2>Good things in your <em>inbox.</em></h2>
            <p>New pieces, studio stories, and the occasional happy surprise.</p>
          </div>
          <form className="newsletter-form" onSubmit={subscribe}>
            <label className="sr-only" htmlFor="newsletter-email">Your email address</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={subscribed}
            />
            <button type="submit" disabled={subscribed}>
              {subscribed ? 'You’re on the list ✓' : 'Count me in ↗'}
            </button>
            {subscribed && <p className="newsletter-success" role="status">Thanks for stopping by. Our newsletter signup is a demo for now.</p>}
          </form>
        </div>
      </div>
      <div className="page-shell footer-bottom">
        <Link className="brand brand--footer" to="/">
          <span className="brand__mark" aria-hidden="true">b.</span>
          <span className="brand__name">beadcraft<span>studio</span></span>
        </Link>
        <p>Handmade with love, beaded with passion.</p>
        <div className="footer-links">
          <Link to="/projects">The collection</Link>
          <Link to="/about">Our story</Link>
          <a href="mailto:hello@beadcraft.studio">Say hello</a>
        </div>
        <small>© {new Date().getFullYear()} Beadcraft Studio</small>
      </div>
    </footer>
  )
}

export default Footer