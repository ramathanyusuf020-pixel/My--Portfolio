import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import About from './pages/About'
import Home from './pages/Home'
import ProjectDetails from './pages/ProjectDetails'
import Projects from './pages/Projects'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { products } from './data/products'
import './App.css'

function App() {
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)

  function addToCart(product) {
    setCart((current) => ({
      ...current,
      [product.id]: {
        product,
        quantity: (current[product.id]?.quantity ?? 0) + 1,
      },
    }))
    setCartOpen(true)
  }

  function changeQuantity(productId, quantity) {
    setCart((current) => {
      if (quantity <= 0) {
        const next = { ...current }
        delete next[productId]
        return next
      }
      return {
        ...current,
        [productId]: { ...current[productId], quantity },
      }
    })
  }

  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <div className="announcement">
        <span>Small-batch treasures, made slowly and with love</span>
        <span className="announcement__sparkle" aria-hidden="true">✳</span>
        <span>Complimentary shipping on orders over KSh 10,000</span>
      </div>
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Home onAdd={addToCart} />} />
          <Route path="/projects" element={<Projects onAdd={addToCart} />} />
          <Route
            path="/projects/:id"
            element={<ProjectDetails products={products} onAdd={addToCart} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={() => setCartOpen(false)}
          onChangeQuantity={changeQuantity}
        />
      )}
    </>
  )
}

function NotFound() {
  return (
    <section className="not-found page-section">
      <p className="eyebrow">A little detour</p>
      <h1>This page wandered off.</h1>
      <a className="button button--dark" href="/">Back to the beginning</a>
    </section>
  )
}

export default App