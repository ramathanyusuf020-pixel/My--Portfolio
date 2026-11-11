import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { categories, products } from '../data/products'

function Projects({ onAdd }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const activeCategory = searchParams.get('category') || 'All pieces'

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        activeCategory === 'All pieces' || product.category === activeCategory
      const matchesQuery = `${product.name} ${product.category} ${product.color}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
      return matchesCategory && matchesQuery
    })

    return [...filtered].sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price
      if (sort === 'price-high') return b.price - a.price
      if (sort === 'name') return a.name.localeCompare(b.name)
      return Number(b.featured) - Number(a.featured)
    })
  }, [activeCategory, query, sort])

  function chooseCategory(category) {
    if (category === 'All pieces') setSearchParams({})
    else setSearchParams({ category })
  }

  return (
    <div className="collection-page">
      <section className="collection-hero">
        <div className="page-shell">
          <p className="eyebrow">The beadcraft collection</p>
          <h1>Little things.<br /><em>Big feelings.</em></h1>
          <p>One-of-a-kind details, made by hand and meant to be kept.</p>
          <span className="collection-hero__flower" aria-hidden="true">✳</span>
        </div>
      </section>
      <section className="page-section page-shell">
        <div className="collection-toolbar">
          <div className="filter-list" aria-label="Filter by category">
            {categories.map((category) => (
              <button
                type="button"
                className={`filter-chip${activeCategory === category ? ' is-active' : ''}`}
                key={category}
                onClick={() => chooseCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="collection-controls">
            <label className="search-field">
              <span className="sr-only">Search pieces</span>
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Find your piece"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label className="sort-field">
              <span className="sr-only">Sort products</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Sort: featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>
        </div>
        <p className="result-count">{visibleProducts.length} thoughtful {visibleProducts.length === 1 ? 'piece' : 'pieces'}</p>
        {visibleProducts.length > 0 ? (
          <div className="product-grid product-grid--collection">
            {visibleProducts.map((product) => (
              <ProjectCard key={product.id} product={product} onAdd={onAdd} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <span aria-hidden="true">✳</span>
            <h2>No little treasures found.</h2>
            <p>Try another search or choose a different category.</p>
            <button
              className="button button--outline"
              type="button"
              onClick={() => { setQuery(''); chooseCategory('All pieces') }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default Projects