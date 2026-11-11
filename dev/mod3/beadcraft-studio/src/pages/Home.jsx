import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import Hero from '../components/Hero'
import { products } from '../data/products'
import ProductArtwork from '../components/ProductArtwork'

const categoryCards = [
  {
    id: 'sunlit-beaded-bag',
    name: 'Beaded bags',
    copy: 'Carry a little color.',
  },
  {
    id: 'petal-beaded-mat',
    name: 'Beaded mats',
    copy: 'Handmade for your home.',
  },
  {
    id: 'golden-hour-bracelet',
    name: 'Beaded bracelets',
    copy: 'Little treasures to keep.',
  },
]

function Home({ onAdd }) {
  const featured = products.filter((product) => product.featured)

  return (
    <>
      <Hero />
      <section className="promise-strip" aria-label="Our promises">
        <p><span aria-hidden="true">✳</span> Made in small batches</p>
        <p><span aria-hidden="true">✳</span> Thoughtful materials</p>
        <p><span aria-hidden="true">✳</span> A little joy in every parcel</p>
      </section>

      <section className="page-section page-shell category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Find your favorite</p>
            <h2>A little something for <em>every day.</em></h2>
          </div>
          <Link className="button-link" to="/projects">Shop all pieces <span aria-hidden="true">→</span></Link>
        </div>
        <div className="category-grid">
          {categoryCards.map((category, index) => (
            <Link
              className={`category-card category-card--${index + 1}`}
              to={`/projects?category=${category.name}`}
              key={category.name}
            >
              <ProductArtwork
                className="category-card__art"
                product={products.find((product) => product.id === category.id)}
              />
              <span className="category-card__content">
                <span className="category-card__copy">{category.copy}</span>
                <span className="category-card__title">{category.name} <span aria-hidden="true">↗</span></span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="page-section page-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Handpicked for you</p>
              <h2>Meet the <em>little loves.</em></h2>
            </div>
            <Link className="button-link" to="/projects">See everything <span aria-hidden="true">→</span></Link>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProjectCard key={product.id} product={product} onAdd={onAdd} />
            ))}
          </div>
        </div>
      </section>

      <section className="maker-note page-shell">
        <div className="maker-note__image">
          <img
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=85"
            alt="A bright, welcoming creative studio"
            loading="lazy"
          />
          <span className="maker-note__stamp">Made<br />by hand</span>
        </div>
        <div className="maker-note__copy">
          <p className="eyebrow">A slower kind of special</p>
          <h2>Good things take<br /><em>a little time.</em></h2>
          <p>
            Every bead is chosen, every detail considered. We make in small
            batches so your favorite things can feel personal, not ordinary.
          </p>
          <Link className="button button--outline" to="/about">Get to know our studio <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  )
}

export default Home