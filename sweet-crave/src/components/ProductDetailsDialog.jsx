import { useEffect } from 'react'

export default function ProductDetailsDialog({ product, stock, cartQuantity, money, onClose, onAdd }) {
  useEffect(() => {
    if (!product) return undefined
    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [product, onClose])

  if (!product) return null
  const soldOut = stock <= 0
  const cartFull = cartQuantity >= stock

  return (
    <div className="product-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title">
        <button className="close-button product-dialog-close" type="button" onClick={onClose} aria-label="Close product details" autoFocus>×</button>
        <div className="product-dialog-image-wrap"><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=900&q=85`} alt={product.name} /></div>
        <div className="product-dialog-content">
          <p className="eyebrow"><span className="eyebrow-line" /> {product.category.toUpperCase()} / HALLUAMATT BAKERY</p>
          <h2 id="product-dialog-title">{product.name}</h2>
          <p className="product-dialog-deck">{product.description}</p>
          <div className="product-dialog-price-row"><strong>{money(product.price)}</strong><span>★ {product.rating} customer rating</span><span>{product.calories} calories per serving</span></div>
          <div className="product-facts"><div><span>BEST BEFORE</span><strong>{product.bestBefore}</strong></div><div><span>STORAGE</span><strong>{product.storage}</strong></div><div><span>SERVING</span><strong>{product.serving}</strong></div></div>
          <div className="product-ingredients"><h3>Ingredients</h3><p>{product.ingredients}</p></div>
          <div className="product-allergens"><h3>Allergen information</h3><p>{product.allergens}. Prepared in a kitchen that handles other common allergens.</p></div>
          <p className="product-facts-note">Calories and shelf-life guidance are estimates. Check the package label or confirm with the bakery for current recipe, allergen, and best-before information.</p>
          <div className="product-dialog-actions"><span>{soldOut ? 'Currently sold out' : `${Math.max(0, stock - cartQuantity)} available to add`}</span><button className="primary-button" type="button" disabled={soldOut || cartFull} onClick={() => onAdd(product.id)}>{soldOut ? 'Sold out' : cartFull ? 'All available in bag' : 'Add to bag'} <span aria-hidden="true">+</span></button></div>
        </div>
      </section>
    </div>
  )
}