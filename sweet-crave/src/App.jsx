import { useEffect, useMemo, useRef, useState } from 'react'
import { categories, defaultStock, deliveryOptions, products, socialPlatforms } from './data/catalog.js'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import ReviewsPage from './components/ReviewsPage.jsx'
import ProductCard from './components/ProductCard.jsx'
import ProductDetailsDialog from './components/ProductDetailsDialog.jsx'
import PageCorners from './components/PageCorners.jsx'
import { createReview, fetchStoreData, saveStockQuantity } from './data/api.js'
import './App.css'

const pageRoutes = ['home', 'shop', 'celebrations', 'about', 'stock', 'contact', 'reviews', 'support']
const currentRoute = () => {
  const route = window.location.pathname.replace(/^\/+|\/+$/g, '')
  return pageRoutes.includes(route) ? route : 'home'
}
const money = (amount) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount)

function App() {
  const [activeCategory, setActiveCategory] = useState('All treats')
  const [currentPage, setCurrentPage] = useState(currentRoute)
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState({})
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [stock, setStock] = useState(() => {
    try {
      const savedStock = JSON.parse(window.localStorage.getItem('halluamatt-stock') ?? window.localStorage.getItem('sweet-crave-stock') ?? 'null')
      const oldAvailability = JSON.parse(window.localStorage.getItem('sweet-crave-availability') ?? 'null')
      if (savedStock && typeof savedStock === 'object' && !Array.isArray(savedStock)) {
        return Object.fromEntries(products.map((product) => [product.id, Math.max(0, Number(savedStock[product.id]) || 0)]))
      }
      if (oldAvailability && typeof oldAvailability === 'object' && !Array.isArray(oldAvailability)) {
        return Object.fromEntries(products.map((product) => [product.id, oldAvailability[product.id] === false ? 0 : defaultStock[product.id]]))
      }
      return defaultStock
    } catch {
      return defaultStock
    }
  })
  const [hasLocalStock] = useState(() => Boolean(window.localStorage.getItem('halluamatt-stock') ?? window.localStorage.getItem('sweet-crave-stock')))
  const [cartOpen, setCartOpen] = useState(false)
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState('mpesa')
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [mpesaPromptOpen, setMpesaPromptOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [reviews, setReviews] = useState(() => {
    try {
      const savedReviews = JSON.parse(window.localStorage.getItem('halluamatt-reviews') ?? '[]')
      return Array.isArray(savedReviews) ? savedReviews : []
    } catch {
      return []
    }
  })
  const [hasLocalReviews] = useState(() => Boolean(window.localStorage.getItem('halluamatt-reviews')))
  const [apiStatus, setApiStatus] = useState('connecting')
  const [migrationSnapshot] = useState(() => ({ hasLocalStock, stock, hasLocalReviews, reviews }))
  const stockWriteTimers = useRef(new Map())
  const [reservationSent, setReservationSent] = useState(false)
  const [reservationConfirmation, setReservationConfirmation] = useState(null)
  const [reservationProduct, setReservationProduct] = useState(products[0].id)
  const [reservationQuantity, setReservationQuantity] = useState(1)
  const [openFaq, setOpenFaq] = useState(0)

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === 'All treats' || product.category === activeCategory
    const matchesQuery = `${product.name} ${product.detail} ${product.category}`.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  }), [activeCategory, query])

  const cartItems = products.filter((product) => cart[product.id])
  const availableCount = products.filter((product) => (stock[product.id] ?? 0) > 0).length
  const itemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const subtotal = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0)
  const selectedDeliveryFee = deliveryOptions.find((option) => option.id === delivery)?.fee ?? 0
  const deliveryFee = subtotal >= 3500 || delivery === 'pickup' ? 0 : selectedDeliveryFee
  const normalizedPhone = mpesaPhone.replace(/\s+/g, '')
  const validMpesaPhone = /^(?:\+254|0)(?:7|1)\d{8}$/.test(normalizedPhone)
  const orderTotal = subtotal + deliveryFee
  const reservedProduct = products.find((product) => product.id === Number(reservationProduct)) ?? products[0]
  const reservationSubtotal = reservedProduct.price * reservationQuantity
  const reservationDiscount = Math.round(reservationSubtotal * 0.1)

  useEffect(() => {
    let active = true
    async function loadSharedData() {
      try {
        const sharedData = await fetchStoreData()
        let nextStock = Object.keys(sharedData.stock).length ? sharedData.stock : defaultStock
        let nextReviews = sharedData.reviews
        const needsMigration = window.localStorage.getItem('halluamatt-json-server-migrated') !== 'true'

        if (needsMigration && migrationSnapshot.hasLocalStock) {
          for (const [id, quantity] of Object.entries(migrationSnapshot.stock)) {
            if (quantity !== defaultStock[id]) {
              nextStock[id] = quantity
              await saveStockQuantity(Number(id), quantity)
            }
          }
        }
        if (needsMigration && migrationSnapshot.hasLocalReviews && migrationSnapshot.reviews.length && !nextReviews.length) {
          nextReviews = []
          for (const review of migrationSnapshot.reviews) nextReviews.push(await createReview(review))
        }
        if (needsMigration) window.localStorage.setItem('halluamatt-json-server-migrated', 'true')

        if (active) {
          setStock(nextStock)
          setReviews(nextReviews)
          setApiStatus('online')
        }
      } catch {
        if (active) setApiStatus('offline')
      }
    }
    loadSharedData()
    return () => { active = false }
  }, [migrationSnapshot])

  useEffect(() => {
    try {
      window.localStorage.setItem('halluamatt-stock', JSON.stringify(stock))
    } catch {
      return
    }
  }, [stock])

  useEffect(() => () => {
    stockWriteTimers.current.forEach((timer) => window.clearTimeout(timer))
    stockWriteTimers.current.clear()
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('halluamatt-reviews', JSON.stringify(reviews))
    } catch {
      return
    }
  }, [reviews])

  useEffect(() => {
    function syncRoute() {
      setCurrentPage(currentRoute())
    }
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  function goToPage(page) {
    const path = page === 'home' ? '/' : `/${page}`
    window.history.pushState({ page }, '', path)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function navigatePage(event, page) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    goToPage(page)
  }

  function changeQuantity(productId, amount) {
    setCart((current) => {
      const nextQuantity = Math.min(stock[productId] ?? 0, (current[productId] ?? 0) + amount)
      const next = { ...current }
      if (nextQuantity <= 0) delete next[productId]
      else next[productId] = nextQuantity
      return next
    })
    setOrderPlaced(false)
    setMpesaPromptOpen(false)
  }

  function updateStock(productId, value) {
    const quantity = Math.max(0, Math.floor(Number(value) || 0))
    setStock((current) => ({ ...current, [productId]: quantity }))
    if (apiStatus === 'online') {
      const currentTimer = stockWriteTimers.current.get(productId)
      if (currentTimer) window.clearTimeout(currentTimer)
      stockWriteTimers.current.set(productId, window.setTimeout(() => {
        saveStockQuantity(productId, quantity)
          .catch(() => setApiStatus('offline'))
          .finally(() => stockWriteTimers.current.delete(productId))
      }, 350))
    }
    setCart((current) => {
      const next = { ...current }
      if (quantity === 0) delete next[productId]
      else if ((next[productId] ?? 0) > quantity) next[productId] = quantity
      return next
    })
    setOrderPlaced(false)
    setMpesaPromptOpen(false)
  }

  function submitReservation(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setReservationConfirmation({
      occasion: formData.get('occasion'),
      date: new Date(`${formData.get('celebrationDate')}T12:00:00`).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }),
      product: reservedProduct.name,
      quantity: reservationQuantity,
      total: reservationSubtotal - reservationDiscount,
    })
    setReservationSent(true)
    event.currentTarget.reset()
    setReservationProduct(products[0].id)
    setReservationQuantity(1)
  }

  function submitOrder(event) {
    event.preventDefault()
    if (!itemCount) return
    if (payment === 'mpesa') {
      setMpesaPromptOpen(true)
      return
    }
    setOrderPlaced(true)
  }

  function submitFeedback(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const submittedReview = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(formData.get('name')).trim(),
      rating: Number(formData.get('rating')),
      topic: String(formData.get('topic')),
      comment: String(formData.get('message')).trim(),
      date: new Date().toISOString(),
    }
    setReviews((current) => [submittedReview, ...current])
    if (apiStatus === 'online') {
      createReview(submittedReview).catch(() => setApiStatus('offline'))
    }
    setFeedbackSent(true)
    event.currentTarget.reset()
  }

  return (
    <div className="site-shell">
      <div className="announcement">A grand little treat is calling <span>✦</span> Free delivery on orders over KSh 3,500</div>
      <SiteHeader currentPage={currentPage} onNavigate={navigatePage} onNext={goToPage} itemCount={itemCount} onOpenCart={() => setCartOpen(true)} />

      <main className="page-frame">
        <PageCorners />
        {currentPage === 'home' && <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> THE CITY'S MOST DELICIOUS ENTRANCE</p>
            <h1>Dessert deserves<br />a standing <em>ovation.</em></h1>
            <p className="hero-description">Butter-rich, hand-finished, wildly worth it. Your next happy ending is only a click away.</p>
            <a className="primary-button hero-button" href="/shop" onClick={(event) => navigatePage(event, 'shop')}>Choose your showstopper <span aria-hidden="true">↘</span></a>
            <div className="hero-rating"><span className="stars">★★★★★</span><span>4.9/5 from our happy regulars</span></div>
          </div>
          <div className="hero-art" role="img" aria-label="A selection of freshly baked desserts">
            <img src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1100&q=85" alt="Colorful pastries topped with berries" />
            <div className="hero-sticker"><span>made fresh</span><strong>with<br />feeling</strong></div>
            <div className="hero-caption"><span>01 / 04</span><span>THE LITTLE JOY COLLECTION</span></div>
          </div>
          <div className="hero-side-note">BAKED WITH A LITTLE EXTRA LOVE — SINCE 2018</div>
        </section>}

        {currentPage === 'shop' && <section className="shop-section section-wrap" id="shop">
            <div className="section-heading">
            <div><p className="eyebrow"><span className="eyebrow-line" /> THE GRAND DESSERT PARADE</p><h2>Pick your <em>showstopper.</em></h2></div>
            <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search treats" placeholder="Find a little something..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>/</kbd></label>
          </div>
          <div className="shop-toolbar">
            <div className="category-tabs" role="tablist" aria-label="Treat categories">
              {categories.map((category) => <button key={category} className={activeCategory === category ? 'category-tab selected' : 'category-tab'} type="button" role="tab" aria-selected={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}
            </div>
            <span className="results-count">{filteredProducts.length} lovely things</span>
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} money={money} stock={stock[product.id] ?? 0} cartQuantity={cart[product.id] ?? 0} onAdd={changeQuantity} onOpenDetails={setSelectedProduct} />)}
          </div>
          {filteredProducts.length === 0 && <p className="empty-results">No treats found. Try another search or category.</p>}
          <p className="allergen-note">Made in a kitchen that handles nuts, dairy, eggs, wheat and soy. Need ingredient details? <a href="/support" onClick={(event) => navigatePage(event, 'support')}>Ask our team.</a></p>
        </section>}

        {currentPage === 'celebrations' && <section className="celebrations-section section-wrap" id="celebrations">
          <div className="celebration-copy"><p className="eyebrow"><span className="eyebrow-line" /> MAKE THE DAY UNFORGETTABLE</p><h2>Your big day<br />deserves <em>big cake.</em></h2><p>Birthdays, graduations, anniversaries, and all the “just because” days. Reserve your celebration treats ahead and enjoy 10% off.</p><div className="celebration-perk"><strong>10%</strong><span>OFF YOUR<br />CELEBRATION ORDER</span></div><div className="celebration-note">Tell us the date and the dream. We’ll confirm the details with you.</div></div>
          <form className="reservation-form" onSubmit={submitReservation} onChange={() => { setReservationSent(false); setReservationConfirmation(null) }}>
            <div className="reservation-form-heading"><span>THE OCCASION EDITION</span><h3>Reserve something <em>remarkable.</em></h3></div>
            <div className="reservation-grid"><label>Your name<input name="reservationName" required placeholder="Name" /></label><label>Email or phone<input name="reservationContact" required placeholder="How can we reach you?" /></label><label>The occasion<select name="occasion" defaultValue="Birthday"><option>Birthday</option><option>Graduation</option><option>Anniversary</option><option>Wedding</option><option>Baby shower</option><option>Engagement</option><option>Other celebration</option></select></label><label>Celebration date<input name="celebrationDate" type="date" min={new Date().toISOString().slice(0, 10)} required /></label><label className="reservation-product">Choose a treat<select name="reservationProduct" value={reservationProduct} onChange={(event) => { setReservationProduct(Number(event.target.value)); setReservationSent(false) }}>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {money(product.price)} each</option>)}</select></label><label>Quantity<input name="reservationQuantity" type="number" min="1" max="100" value={reservationQuantity} onChange={(event) => { setReservationQuantity(Math.max(1, Math.min(100, Number(event.target.value) || 1))); setReservationSent(false) }} required /></label><label className="reservation-notes">Special requests<textarea name="reservationNotes" rows="2" placeholder="Flavours, colours, a little birthday magic..." /></label></div>
            <div className="reservation-total"><span>Before discount: {money(reservationSubtotal)}<br /><b>10% celebration savings: −{money(reservationDiscount)}</b></span><strong>{money(reservationSubtotal - reservationDiscount)}</strong></div>
            <button className="primary-button reservation-submit" type="submit">Request my celebration reservation <span>↗</span></button>
            {reservationSent && reservationConfirmation && <div className="reservation-success" role="status"><strong>Reservation request noted</strong><span>{reservationConfirmation.occasion} · {reservationConfirmation.date}</span><span>{reservationConfirmation.quantity} × {reservationConfirmation.product} · estimated total {money(reservationConfirmation.total)} after 10% off</span><small>We’ll follow up to confirm. Demo only; this request hasn’t been sent to a bakery.</small></div>}
            <p className="reservation-disclaimer">The 10% discount is reflected in this estimate. Final availability and pricing are confirmed by the bakery.</p>
          </form>
        </section>}

        {currentPage === 'stock' && <section className="inventory-section section-wrap" id="inventory">
          <div className="inventory-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> THE COUNTER, RIGHT NOW</p><h2>Today’s <em>stock list.</em></h2><p>Update the exact number available for each treat. Customers see the same count in the shop.</p><span className={`data-status ${apiStatus}`}><i />{apiStatus === 'online' ? 'Shared inventory connected' : apiStatus === 'connecting' ? 'Connecting to inventory' : 'Local preview · server unavailable'}</span></div><div className="stock-count"><strong>{availableCount}</strong><span>of {products.length}<br />on the menu</span></div></div>
          <div className="inventory-list">{products.map((product) => {
            const quantity = stock[product.id] ?? 0
            const available = quantity > 0
            return <div className={`inventory-row ${available ? '' : 'inventory-row-sold'}`} key={product.id}><span className={`availability-dot ${available ? 'available' : 'sold'}`} /><div className="inventory-product"><strong>{product.name}</strong><span>{product.category} · {money(product.price)}</span></div><label className="stock-input-label">Available<input type="number" min="0" max="999" step="1" value={quantity} aria-label={`Quantity available for ${product.name}`} onChange={(event) => updateStock(product.id, event.target.value)} /></label><span className={`availability-label ${available ? 'available' : 'sold'}`}>{available ? 'On the menu' : 'Sold out'}</span><button className={available ? 'stock-action' : 'stock-action restore'} type="button" onClick={() => updateStock(product.id, available ? 0 : defaultStock[product.id])}>{available ? 'Mark sold out' : `Restock to ${defaultStock[product.id]}`}</button></div>
          })}</div>
          <p className="inventory-notice">Changes update the menu and save in this browser. To share live stock with customers on other devices, connect a shared inventory backend.</p>
        </section>}

        {currentPage === 'about' && <section className="about-section" id="about">
          <div className="about-image about-brand-art"><div className="about-chocolate-orbit" aria-hidden="true"><span /><span /><span /></div><img src="/halluamatt-chocolate-logo.svg" alt="A bright smiling mouth biting into a chocolate bar" /><span className="about-art-caption">THE BITE THAT STARTED IT ALL</span></div>
          <div className="about-copy"><p className="eyebrow"><span className="eyebrow-line" /> OUR SWEET-TOOTH STORY</p><h2>One big bite.<br />A lifelong <em>sweet tooth.</em></h2><p>HALLUAMATT - SWEET-TOOTH is for people who never take a tiny bite. Our bright teeth-and-chocolate mark says it all: come hungry, follow the chocolate, and make room for one more treat.</p><p>From everyday cravings to once-in-a-lifetime celebrations, we make sweets that deserve the spotlight and bring a little more joy to the table.</p><a className="text-link" href="/support" onClick={(event) => navigatePage(event, 'support')}>Meet your dessert people <span aria-hidden="true">↗</span></a><div className="about-signoff">With an extra bite, <span>the HALLUAMATT team</span></div></div>
          <span className="about-number">EST. 2018&nbsp;&nbsp; · &nbsp;&nbsp;MADE FRESH DAILY</span>
        </section>}

        {currentPage === 'contact' && <section className="contact-section section-wrap" id="contact">
          <div className="contact-heading"><p className="eyebrow"><span className="eyebrow-line" /> COME FIND YOUR SWEET SPOT</p><h1>Say hello.<br /><em>We’re easy to find.</em></h1><p>Visit, email, or find HALLUAMATT - SWEET-TOOTH on your favourite platform.</p></div>
          <div className="contact-grid">
            <article className="contact-card location-card"><span className="contact-card-kicker">01 / COME BY</span><span className="contact-symbol" aria-hidden="true">⌖</span><h2>Our location</h2><strong className="contact-detail">Ngong Town</strong><p>Find HALLUAMATT - SWEET-TOOTH in Ngong Town, Kenya.</p><a className="contact-card-link location-link" href="https://maps.google.com/?q=Ngong+Town%2C+Kenya" target="_blank" rel="noreferrer">Open map directions <span aria-hidden="true">↗</span></a></article>
            <article className="contact-card email-card"><span className="contact-card-kicker">02 / GIVE US A CALL</span><span className="contact-symbol" aria-hidden="true">☎</span><h2>Call or WhatsApp</h2><a className="contact-detail email-detail" href="tel:+254720231408">+254 720 231 408</a><p>Call us directly or message us on WhatsApp for orders and questions.</p><a className="contact-card-link" href="https://wa.me/254720231408" target="_blank" rel="noreferrer">Chat on WhatsApp <span aria-hidden="true">↗</span></a></article>
            <article className="contact-card email-card"><span className="contact-card-kicker">03 / DROP A NOTE</span><span className="contact-symbol" aria-hidden="true">✉</span><h2>Email us</h2><a className="contact-detail email-detail" href="mailto:halluamattsweettooth@gmail.com">halluamattsweettooth@gmail.com</a><p>For custom cakes, celebration bookings, and everything sweet.</p><a className="contact-card-link" href="mailto:halluamattsweettooth@gmail.com">Write an email <span aria-hidden="true">↗</span></a></article>
          </div>
          <div className="contact-map-block"><div className="map-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> THE SWEET ROUTE</p><h2>Nairobi CBD <em>to Ngong Town.</em></h2></div><a className="text-link" href="https://www.google.com/maps/dir/?api=1&origin=Nairobi+CBD%2C+Nairobi%2C+Kenya&destination=Ngong+Town%2C+Kenya&travelmode=driving" target="_blank" rel="noreferrer">Open directions <span aria-hidden="true">↗</span></a></div><iframe className="contact-map" title="Google Maps route from Nairobi CBD to Ngong Town" src="https://maps.google.com/maps?output=embed&saddr=Nairobi+CBD%2C+Nairobi%2C+Kenya&daddr=Ngong+Town%2C+Kenya" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
          <div className="social-section"><div className="social-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> A LITTLE MORE HALLUAMATT</p><h2>Follow the <em>crumbs.</em></h2></div><p>Follow HALLUAMATT - SWEET-TOOTH across your favourite platforms.</p></div><div className="social-grid">{socialPlatforms.map((platform) => <a className="social-card" href={platform.href} key={platform.name} target="_blank" rel="noreferrer" aria-label={`Open HALLUAMATT on ${platform.name}`}><span className={`social-mark social-${platform.name.toLowerCase()}`} aria-hidden="true">{platform.name === 'Instagram' && <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle className="icon-dot" cx="17.5" cy="6.5" r="1" /></svg>}{platform.name === 'TikTok' && <svg viewBox="0 0 24 24"><path d="M14 3v11.2a4.2 4.2 0 1 1-3.1-4.05v3.25a1.2 1.2 0 1 0 .1.8V3h3c.25 2.4 1.6 3.8 4 4.1v3.1c-1.6-.05-2.95-.6-4-1.45V3Z" /></svg>}{platform.name === 'Facebook' && <svg viewBox="0 0 24 24"><path d="M13.7 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.25-1.5 1.55-1.5H17V3.6c-.3-.05-1.3-.1-2.45-.1-2.45 0-4.1 1.5-4.1 4.25v2.15H7.7V13h2.75v8h3.25Z" /></svg>}{platform.name === 'WhatsApp' && <svg viewBox="0 0 24 24"><path d="M20.2 11.7a8.1 8.1 0 0 1-12 7.1L4 20l1.2-4A8.1 8.1 0 1 1 20.2 11.7Z" /><path d="M9 8.2c.2-.45.45-.5.75-.5h.5c.2 0 .4.05.55.45l.8 1.85c.1.25.1.45-.05.65l-.6.7c-.15.15-.25.3-.1.6.2.35.7 1.15 1.5 1.8.95.8 1.75 1.05 2.1 1.2.25.1.45.1.6-.1l.8-.95c.2-.25.4-.3.65-.2l1.75.85c.3.15.5.25.55.4.05.2.05 1.05-.35 1.65-.4.6-1.25 1-2.05 1.05-.55.05-1.25.05-2.05-.25-.45-.15-1.05-.4-1.8-.8-3.15-1.65-5.2-4.95-5.35-5.2-.15-.25-1.3-1.7-1.3-3.25 0-1.55.8-2.3 1.1-2.65Z" /></svg>}</span><div><strong>{platform.name}</strong><span>{platform.handle}</span></div><span className="social-arrow" aria-hidden="true">↗</span></a>)}</div></div>
          <div className="contact-support-link"><span>Need help with an order or have a question?</span><a className="text-link" href="/support" onClick={(event) => navigatePage(event, 'support')}>Visit customer support <span aria-hidden="true">↗</span></a></div>
        </section>}

        {currentPage === 'support' && <section className="support-section section-wrap" id="support">
          <div className="support-intro"><p className="eyebrow"><span className="eyebrow-line" /> WE’RE ALL EARS</p><h2>Need a hand?<br /><em>We’re here.</em></h2><p>Questions, kind words, or a very specific cake dream? Drop us a note. We read every one.</p><a className="support-email" href="mailto:halluamattsweettooth@gmail.com">halluamattsweettooth@gmail.com <span>↗</span></a><div className="support-hours"><span className="status-dot" /> Usually replies within one business day</div></div>
          <div className="support-content">
            <form className="feedback-form" onSubmit={submitFeedback}>
              <div className="form-heading"><h3>Leave us a little note</h3><span>FEEDBACK / QUESTIONS / LOVE NOTES</span></div>
              <div className="form-row"><label>Your name<input name="name" placeholder="Name" required /></label><label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label></div>
              <label>What’s on your mind?<select name="topic" defaultValue="Review"><option>Review</option><option>Feedback</option><option>Order question</option><option>Product idea</option><option>Something else</option></select></label>
              <label>Your rating<select name="rating" defaultValue="5"><option value="5">★★★★★ · Loved it</option><option value="4">★★★★ · Really liked it</option><option value="3">★★★ · It was good</option><option value="2">★★ · Could be better</option><option value="1">★ · Needs improvement</option></select></label>
              <label>Your message<textarea name="message" placeholder="Tell us everything..." rows="3" required /></label>
              <div className="form-submit-row"><button className="primary-button" type="submit">Send your note <span aria-hidden="true">↗</span></button>{feedbackSent && <span className="success-message" role="status">Thanks for the note. We’ll be in touch soon.</span>}</div>
            </form>
            <div className="faq-block"><div className="faq-heading"><h3>A few things people ask</h3><a href="mailto:halluamattsweettooth@gmail.com">ALL FAQs ↗</a></div>
              {[
                ['How fresh are your treats?', 'Everything is baked in small batches each morning. We only make what we can lovingly finish that day.'],
                ['Can you handle allergies?', 'We can share ingredient details for every item, but our kitchen handles common allergens and cannot guarantee an allergen-free treat.'],
                ['Can I order a custom cake?', 'Absolutely. Send us a note with your date, flavor ideas, and guest count, and our bakery team will help make it happen.'],
              ].map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? 'faq-open' : ''}`} key={question}><button type="button" className="faq-question" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{question}</span><span className="faq-plus">{openFaq === index ? '−' : '+'}</span></button>{openFaq === index && <p className="faq-answer">{answer}</p>}</div>)}
            </div>
          </div>
        </section>}
        {currentPage === 'reviews' && <ReviewsPage reviews={reviews} apiStatus={apiStatus} onNavigate={navigatePage} />}
      </main>

      <SiteFooter onNavigate={navigatePage} />

      <ProductDetailsDialog product={selectedProduct} stock={selectedProduct ? stock[selectedProduct.id] ?? 0 : 0} cartQuantity={selectedProduct ? cart[selectedProduct.id] ?? 0 : 0} money={money} onClose={() => setSelectedProduct(null)} onAdd={(productId) => { changeQuantity(productId, 1); setSelectedProduct(null) }} />

      {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}>
        <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div className="drawer-header"><div><p className="eyebrow">YOUR EVENING'S HEADLINER</p><h2 id="cart-title">The sweet list <span>({itemCount})</span></h2></div><button className="close-button" type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div>
          {cartItems.length === 0 ? <div className="cart-empty"><span className="empty-bag">♧</span><h3>Your bag feels lonely.</h3><p>Let’s find something sweet to put in it.</p><button className="primary-button" type="button" onClick={() => setCartOpen(false)}>Browse treats <span>↗</span></button></div> : <>
            <div className="cart-items">{cartItems.map((product) => <div className="cart-item" key={product.id}><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=180&q=70`} alt="" /><div className="cart-item-info"><h3>{product.name}</h3><span>{money(product.price)} each · {Math.max(0, (stock[product.id] ?? 0) - cart[product.id])} left after this</span><div className="quantity-control"><button type="button" aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(product.id, -1)}>−</button><span>{cart[product.id]}</span><button type="button" aria-label={`Add one ${product.name}`} disabled={cart[product.id] >= (stock[product.id] ?? 0)} onClick={() => changeQuantity(product.id, 1)}>+</button></div></div><strong>{money(product.price * cart[product.id])}</strong></div>)}</div>
            <form className="checkout-form" onSubmit={submitOrder}>
              <div className="checkout-group"><h3>How should we get it to you?</h3>{deliveryOptions.map((option) => <label className="choice-row" key={option.id}><input type="radio" name="delivery" value={option.id} checked={delivery === option.id} onChange={() => { setDelivery(option.id); setOrderPlaced(false); setMpesaPromptOpen(false) }} /><span className="choice-copy"><strong>{option.label}</strong><small>{option.note}</small></span><b>{option.fee && subtotal < 3500 ? money(option.fee) : 'Free'}</b></label>)}</div>
              <div className="checkout-group payment-group"><div className="payment-heading"><div><span className="payment-kicker">THE MOST KENYAN WAY TO PAY</span><h3>Settle up, <em>beautifully.</em></h3></div><span className="payment-seal">KSh<br /><b>secure</b></span></div><div className="payment-options"><label className={payment === 'mpesa' ? 'payment-option checked' : 'payment-option'}><input type="radio" name="payment" value="mpesa" checked={payment === 'mpesa'} onChange={() => { setPayment('mpesa'); setMpesaPromptOpen(false); setOrderPlaced(false) }} /><span className="mpesa-mark">M</span> M-Pesa</label><label className={payment === 'card' ? 'payment-option checked' : 'payment-option'}><input type="radio" name="payment" value="card" checked={payment === 'card'} onChange={() => { setPayment('card'); setMpesaPromptOpen(false); setOrderPlaced(false) }} /><span>▣</span> Card</label><label className={payment === 'cash' ? 'payment-option checked' : 'payment-option'}><input type="radio" name="payment" value="cash" checked={payment === 'cash'} onChange={() => { setPayment('cash'); setMpesaPromptOpen(false); setOrderPlaced(false) }} /><span>◉</span> Cash</label></div></div>
              {payment === 'mpesa' && <>
                <label className="address-field payment-phone">M-Pesa phone number<input type="tel" inputMode="tel" autoComplete="tel" required pattern="(07|01)[0-9]{8}|[+]254(7|1)[0-9]{8}" value={mpesaPhone} onChange={(event) => { setMpesaPhone(event.target.value); setMpesaPromptOpen(false); setOrderPlaced(false) }} placeholder="0712345678 or +254712345678" title="Enter a Kenyan mobile number, such as 0712345678." /></label>
                {validMpesaPhone && <div className="mpesa-prompt-preview"><div className="mpesa-preview-brand"><span className="mpesa-mark">M</span><span>STK PROMPT PREVIEW</span><b>DEMO</b></div><strong>Pay {money(orderTotal)} to HALLUAMATT - SWEET-TOOTH</strong><p>We’ll prepare a payment prompt for <b>{normalizedPhone}</b>. In a live store, you’d approve it on your phone.</p><span className="pin-warning">Your M-Pesa PIN stays on your phone. Never enter it on this website.</span></div>}
              </>}
              {payment === 'card' && <fieldset className="card-details"><legend>Card details <span>DEMO CHECKOUT</span></legend><p className="card-demo-warning">Use test details only. No payment processor is connected.</p><label>Cardholder name<input name="cardholder" autoComplete="off" required placeholder="Name on card" /></label><label>Card number<input name="cardNumber" type="text" inputMode="numeric" autoComplete="off" required pattern="[0-9 ]{13,19}" maxLength="19" placeholder="1234 5678 9012 3456" title="Enter 13 to 19 digits, with optional spaces." /></label><div className="card-detail-row"><label>Expiry date<input name="cardExpiry" type="text" inputMode="numeric" autoComplete="off" required pattern="(0[1-9]|1[0-2])/[0-9]{2}" maxLength="5" placeholder="MM/YY" title="Use MM/YY format." /></label><label>Security code<input name="cardCvc" type="password" inputMode="numeric" autoComplete="off" required pattern="[0-9]{3,4}" maxLength="4" placeholder="CVV" title="Enter the 3 or 4 digit code." /></label></div></fieldset>}
              {delivery !== 'pickup' && <label className="address-field">Delivery address<input required placeholder="Estate, street, town" /></label>}
              <div className="order-summary"><div><span>Subtotal</span><span>{money(subtotal)}</span></div><div><span>Delivery</span><span>{deliveryFee ? money(deliveryFee) : 'Free'}</span></div><div className="summary-total"><strong>Grand total</strong><strong>{money(orderTotal)}</strong></div></div>
              {mpesaPromptOpen && <div className="mpesa-request" role="status"><div className="request-topline"><span className="mpesa-mark">M</span><span>PAYMENT PROMPT PREPARED</span></div><h3>Your phone is the checkout.</h3><p>A demo prompt for <strong>{money(orderTotal)}</strong> is ready for <strong>{normalizedPhone}</strong>.</p><div className="request-safety">In a real checkout, approve the request in your M-Pesa menu. Never share your PIN here.</div><button className="primary-button place-order" type="button" onClick={() => { setOrderPlaced(true); setMpesaPromptOpen(false) }}>Confirm demo payment <span>↗</span></button><button className="prompt-back" type="button" onClick={() => setMpesaPromptOpen(false)}>Back to payment details</button><small>Preview only · No real STK push or charge is made</small></div>}
              {orderPlaced ? <p className="order-success" role="status">{payment === 'card' ? 'Card details passed demo validation only. No payment was made.' : 'Your sweet order is on its way to becoming a very good day.'}</p> : !mpesaPromptOpen && <button className="primary-button place-order" type="submit">{payment === 'mpesa' ? 'Request demo M-Pesa prompt' : payment === 'card' ? 'Preview card checkout' : 'Place your order'} <span>↗</span></button>}
              <p className="secure-note">{payment === 'mpesa' ? 'M-Pesa demo · No real payment prompt will be sent' : payment === 'card' ? 'Card demo · Details are not sent, stored, or charged' : 'Checkout demo · No payment will be charged'}</p>
            </form>
          </>}
        </aside>
      </div>}
    </div>
  )
}

export default App
