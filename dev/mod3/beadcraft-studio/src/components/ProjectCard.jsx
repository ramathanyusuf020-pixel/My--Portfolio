import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import ProductArtwork from './ProductArtwork'

function ProjectCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <Link
        className="product-card__image-link"
        to={`/projects/${product.id}`}
        aria-label={`View ${product.name}`}
      >
        <ProductArtwork
          className="product-card__image"
          product={product}
        />
        {product.featured && <span className="product-card__badge">Made with love</span>}
      </Link>
      <div className="product-card__info">
        <div>
          <p className="eyebrow">{product.category}</p>
          <Link className="product-card__title" to={`/projects/${product.id}`}>
            {product.name}
          </Link>
        </div>
        <span className="product-card__price">{formatPrice(product.price)}</span>
      </div>
      <button
        className="text-button product-card__add"
        type="button"
        onClick={() => onAdd(product)}
        aria-label={`Add ${product.name} to your bag`}
      >
        Add to bag <span aria-hidden="true">+</span>
      </button>
    </article>
  )
}

export default ProjectCard