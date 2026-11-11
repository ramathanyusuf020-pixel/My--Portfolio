import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function Navbar({ cartCount, onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <nav className="navbar page-shell" aria-label="Main navigation">
        <Link className="brand" to="/" onClick={closeMenu} aria-label="Beadcraft Studio home">
          <span className="brand__mark" aria-hidden="true">b.</span>
          <span className="brand__name">beadcraft<span>studio</span></span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span />
          <span />
        </button>
        <div className={`navbar__links${menuOpen ? ' is-open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/projects" onClick={closeMenu}>The collection</NavLink>
          <NavLink to="/about" onClick={closeMenu}>Our story</NavLink>
        </div>
        <button className="bag-button" type="button" onClick={onCartClick}>
          <span>Bag</span>
          <span className="bag-button__count" aria-label={`${cartCount} items in bag`}>
            {cartCount}
          </span>
        </button>
      </nav>
    </header>
  )
}

export default Navbar