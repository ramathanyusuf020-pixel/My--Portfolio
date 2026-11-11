import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import ProductArtwork from '../components/ProductArtwork'
import { formatPrice } from '../data/products'

function ProjectDetails({ products, onAdd }) {
  const { id } = useParams()
  const [added, setAdded] = useState(false)
  const product = products.find((item) => item.id === id)

  if (!product) {
    return (
      <section className="not-found page-section">
        <p className="eyebrow">One of a kind, and currently missing</p>
        <h1>We couldn't find that piece.</h1>
        <Link className="button button--dark" to="/projects">Back to the collection</Link>
      </section>
    )
  }

  const related = products.filter(
    (item) => item.category === product.category && item.id !== product.id,
  ).slice(0, 3)

  function addProduct() {
    onAdd(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="product-detail-page">
      <div className="page-shell breadcrumbs">
        <Link to="/">Home</Link><span>/</span><Link to="/projects">The collection</Link><span>/</span><span>{product.name}</span>
      </div>
      <section className="product-detail page-shell">
        <div className="product-detail__image">
          <ProductArtwork className="product-detail__artwork" product={product} />
          <span className="product-detail__image-note">Handmade, just for you <span aria-hidden="true">✳</span></span>
        </div>
        <div className="product-detail__info">
          <p className="eyebrow">{product.category} · one of a kind</p>
          <h1>{product.name}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <div className="product-detail__rule" />
          <p className="product-detail__description">{product.description}</p>
          <p className="product-detail__color"><span>Color story</span>{product.color}</p>
          <button className="button button--dark button--full" type="button" onClick={addProduct}>
            {added ? 'Added to your bag ✓' : `Add to bag — ${formatPrice(product.price)}`}
          </button>
          <p className="product-detail__shipping"><span aria-hidden="true">✳</span> Carefully packed and sent with love. Complimentary shipping over KSh 10,000.</p>
          <div className="product-detail__details">
            <details>
              <summary>A little more about this piece</summary>
              <p>Every Beadcraft piece is handmade in small batches. Slight variations are part of what makes yours special.</p>
            </details>
            <details>
              <summary>Care instructions</summary>
              <p>Keep your piece dry, store it gently, and wipe softly with a clean dry cloth to keep it looking lovely.</p>
            </details>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="page-section page-shell related-section">
          <div className="section-heading">
            <div><p className="eyebrow">In the same little family</p><h2>You might love <em>these, too.</em></h2></div>
            <Link className="button-link" to="/projects">Shop all <span aria-hidden="true">→</span></Link>
          </div>
          <div className="product-grid">
            {related.map((item) => <ProjectCard key={item.id} product={item} onAdd={onAdd} />)}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProjectDetails