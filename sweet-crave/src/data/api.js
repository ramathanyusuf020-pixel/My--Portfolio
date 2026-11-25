const apiRoot = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request(path, options) {
  const response = await fetch(`${apiRoot}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!response.ok) throw new Error(`Store API request failed: ${response.status}`)
  if (response.status === 204) return null
  return response.json()
}

export async function fetchStoreData() {
  const [stockRecords, reviews] = await Promise.all([
    request('/stock'),
    request('/reviews?_sort=date&_order=desc'),
  ])

  return {
    stock: Object.fromEntries(stockRecords.map(({ id, quantity }) => [Number(id), Math.max(0, Number(quantity) || 0)])),
    reviews: Array.isArray(reviews) ? reviews : [],
  }
}

export function saveStockQuantity(productId, quantity) {
  return request(`/stock/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  })
}

export function createReview(review) {
  return request('/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  })
}