export default function ProductCard({ product, money, stock, cartQuantity, onAdd, onOpenDetails }) {
  const soldOut = stock <= 0
  const cartFull = cartQuantity >= stock

  return (
    <article className={`product-card ${soldOut ? 'is-sold-out' : ''}`}>
      <div className="product-image-wrap">
        <button className="product-image-button" type="button" onClick={() => onOpenDetails(product)} aria-label={`View details for ${product.name}`}>
          <img className="product-image" src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=760&q=80`} alt={product.name} loading="lazy" />
        </button>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {soldOut && <span className="sold-out-stamp">Sold out</span>}
        <button className="quick-add" type="button" disabled={soldOut || cartFull} onClick={() => onAdd(product.id)} aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to bag`}>
          {soldOut ? 'Finished for today' : cartFull ? 'All available in your bag' : cartQuantity ? `+ ${cartQuantity} in bag` : '+ Add to bag'}
        </button>
      </div>
      <div className="product-info">
        <div className="product-title-row"><h3>{product.name}</h3><span className="product-price">{money(product.price)}</span></div>
        <p className="product-detail">{product.detail}</p>
        <div className="product-meta"><span><b>★</b> {product.rating}</span><span>{product.calories} cal</span><span>{product.category}</span><span className={soldOut ? 'stock-quantity none' : 'stock-quantity'}>{soldOut ? 'Sold out' : `${stock} available`}</span></div>
        <button className="product-details-trigger" type="button" onClick={() => onOpenDetails(product)}>All product details <span aria-hidden="true">↗</span></button>
      </div>
    </article>
  )
}