import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import ProductArtwork from './ProductArtwork'

function CartDrawer({ items, onClose, onChangeQuantity }) {
  const entries = Object.values(items)
  const total = entries.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0,
  )

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="cart-drawer__header">
          <div>
            <p className="eyebrow">Your little treasures</p>
            <h2 id="cart-title">Shopping bag ({entries.length})</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close bag">
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="cart-empty">
            <span aria-hidden="true">✳</span>
            <h3>Your bag is taking a breather.</h3>
            <p>Find a handmade piece that feels like you.</p>
            <Link className="button button--dark" to="/projects" onClick={onClose}>
              Explore the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {entries.map(({ product, quantity }) => (
                <article className="cart-item" key={product.id}>
                  <ProductArtwork className="cart-item__artwork" product={product} />
                  <div className="cart-item__details">
                    <p className="eyebrow">{product.category}</p>
                    <h3>{product.name}</h3>
                    <p>{formatPrice(product.price)}</p>
                    <div className="quantity-control" aria-label={`Quantity of ${product.name}`}>
                      <button
                        type="button"
                        onClick={() => onChangeQuantity(product.id, quantity - 1)}
                        aria-label={`Remove one ${product.name}`}
                      >
                        −
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        onClick={() => onChangeQuantity(product.id, quantity + 1)}
                        aria-label={`Add one ${product.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <p><span>Subtotal</span><strong>{formatPrice(total)}</strong></p>
              <small>Shipping and any applicable taxes are calculated at checkout.</small>
              <button
                className="button button--dark button--full"
                type="button"
                disabled
              >
                Checkout coming soon
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer
