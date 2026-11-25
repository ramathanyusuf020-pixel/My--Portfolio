export default function SiteFooter({ onNavigate }) {
  return (
    <footer className="site-footer">
      <a className="wordmark footer-mark" href="/" onClick={(event) => onNavigate(event, 'home')}>
        <img className="wordmark-icon" src="/halluamatt-chocolate-logo.svg" alt="" />
        <span className="brand-copy"><strong>HALLUAMATT</strong><small>- SWEET-TOOTH</small></span>
      </a>
      <span>Small batch, big joy. © 2025 HALLUAMATT - SWEET-TOOTH</span>
      <div>
        <a href="/shop" onClick={(event) => onNavigate(event, 'shop')}>Shop</a>
        <a href="/about" onClick={(event) => onNavigate(event, 'about')}>Our story</a>
        <a href="/contact" onClick={(event) => onNavigate(event, 'contact')}>Contact</a>
        <a href="/reviews" onClick={(event) => onNavigate(event, 'reviews')}>Reviews</a>
      </div>
    </footer>
  )
}