const navigationItems = [
  ['home', 'Home', '/'],
  ['shop', 'Shop', '/shop'],
  ['celebrations', 'Celebrations', '/celebrations'],
  ['about', 'Our story', '/about'],
  ['stock', 'Stock', '/stock'],
  ['contact', 'Contact', '/contact'],
  ['reviews', 'Reviews', '/reviews'],
  ['support', 'Support', '/support'],
]

export default function SiteHeader({ currentPage, onNavigate, onNext, itemCount, onOpenCart }) {
  const nextIndex = (navigationItems.findIndex(([page]) => page === currentPage) + 1) % navigationItems.length
  const [nextPage, nextLabel] = navigationItems[nextIndex]

  return (
    <header className="site-header">
      <a className="wordmark" href="/" onClick={(event) => onNavigate(event, 'home')} aria-label="HALLUAMATT - SWEET-TOOTH home">
        <img className="wordmark-icon" src="/halluamatt-chocolate-logo.svg" alt="" />
        <span className="brand-copy"><strong>HALLUAMATT</strong><small>- SWEET-TOOTH</small></span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        {navigationItems.map(([page, label, href]) => (
          <a className={currentPage === page ? 'active' : ''} href={href} key={page} aria-current={currentPage === page ? 'page' : undefined} onClick={(event) => onNavigate(event, page)}>{label}</a>
        ))}
      </nav>
      <div className="header-actions">
        <button className="next-page-button" type="button" onClick={() => onNext(nextPage)} aria-label={`Next page: ${nextLabel}`} title={`Next page: ${nextLabel}`}>
          <span>Next</span><span className="next-page-arrow" aria-hidden="true">→</span>
        </button>
        <button className="cart-trigger" type="button" onClick={onOpenCart} aria-label={`Open cart, ${itemCount} items`}>
          <span className="bag-icon" aria-hidden="true">♧</span><span className="cart-trigger-label">Your bag</span><span className="cart-count">{itemCount}</span>
        </button>
      </div>
    </header>
  )
}