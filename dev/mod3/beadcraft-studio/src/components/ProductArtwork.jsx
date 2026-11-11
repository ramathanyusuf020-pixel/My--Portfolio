const palettes = {
  'sunlit-beaded-bag': ['#a65c3c', '#e9bd73', '#f4e3bf', '#744634'],
  'wildflower-beaded-bag': ['#a94e57', '#e9b86d', '#87a17a', '#f2d5c9'],
  'rose-garden-beaded-bag': ['#b76470', '#e9aeb0', '#f4d5c7', '#81515b'],
  'petal-beaded-mat': ['#b96c4b', '#e2aa74', '#f5e1c2', '#65795a'],
  'meadow-beaded-mat': ['#70865c', '#d2ad71', '#e9d8bd', '#ae7358'],
  'sunrise-beaded-mat': ['#c7794d', '#e8b36b', '#f3dbb1', '#9d5949'],
  'coastal-beaded-mat': ['#527b88', '#91b3ad', '#e3d5b9', '#b87858'],
  'golden-hour-bracelet': ['#b98543', '#e8c779', '#f4e1b4', '#745340'],
  'ocean-tide-bracelet': ['#527b88', '#8eb8b7', '#e9d7b3', '#d08b67'],
  'rose-garden-bracelet': ['#b76470', '#e7a9a7', '#f1d7c6', '#93614f'],
  'wildflower-bracelet': ['#aa685d', '#e6b461', '#83996a', '#859ab1'],
  'berry-beaded-bracelet': ['#985366', '#cf7e86', '#e7b6a0', '#d2a35e'],
}

const backgrounds = ['#e9d9c9', '#ead8d0', '#e4e0cf', '#dbe3df']

function ProductArtwork({ product, className = '' }) {
  const colors = palettes[product.id] ?? palettes['sunlit-beaded-bag']
  const background = backgrounds[product.id.length % backgrounds.length]
  const beadAngles = Array.from({ length: 44 }, (_, index) => {
    const angle = (index / 44) * Math.PI * 2 - Math.PI / 2
    return {
      x: 300 + Math.cos(angle) * 157,
      y: 354 + Math.sin(angle) * 172,
      color: colors[index % colors.length],
      size: index % 4 === 0 ? 13 : 11,
    }
  })
  const braceletBeads = Array.from({ length: 36 }, (_, index) => {
    const angle = (index / 36) * Math.PI * 2 - Math.PI / 2
    return {
      x: 300 + Math.cos(angle) * 132,
      y: 365 + Math.sin(angle) * 154,
      color: colors[index % colors.length],
    }
  })

  return (
    <svg
      className={className}
      viewBox="0 0 600 700"
      role="img"
      aria-label={product.imageAlt}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`bg-${product.id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={background} />
          <stop offset="1" stopColor="#f8f2e9" />
        </linearGradient>
        <linearGradient id={`object-${product.id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={colors[2]} />
          <stop offset="1" stopColor={colors[0]} />
        </linearGradient>
        <filter id={`shadow-${product.id}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#49372e" floodOpacity=".18" />
        </filter>
      </defs>
      <rect width="600" height="700" fill={`url(#bg-${product.id})`} />
      <circle cx="500" cy="112" r="118" fill="#fffaf4" opacity=".34" />
      <circle cx="74" cy="570" r="132" fill={colors[2]} opacity=".14" />
      <path d="M0 540 Q170 490 310 545 T600 515 V700 H0Z" fill="#fffaf4" opacity=".3" />

      {product.category === 'Beaded bags' && (
        <g filter={`url(#shadow-${product.id})`}>
          <path
            d="M205 274 C205 177 395 177 395 274"
            fill="none"
            stroke={colors[3]}
            strokeWidth="19"
            strokeLinecap="round"
          />
          <path d="M185 270 Q300 243 415 270 L440 520 Q300 573 160 520Z" fill={`url(#object-${product.id})`} />
          <path d="M185 270 Q300 243 415 270 L440 520 Q300 573 160 520Z" fill="none" stroke="#fff4e3" strokeWidth="5" opacity=".8" />
          {Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 7 }, (_, column) => {
              const x = 196 + column * 34 + (row % 2) * 8
              const y = 316 + row * 32
              return (
                <circle
                  key={`${row}-${column}`}
                  cx={x}
                  cy={y}
                  r={column % 3 === 0 ? 8 : 6.5}
                  fill={colors[(row + column) % colors.length]}
                  stroke="#fff4e4"
                  strokeWidth="2"
                />
              )
            }),
          )}
          <path d="M218 288 Q300 273 382 288" fill="none" stroke={colors[3]} strokeWidth="7" strokeLinecap="round" />
        </g>
      )}

      {product.category === 'Beaded mats' && (
        <g filter={`url(#shadow-${product.id})`}>
          <ellipse cx="300" cy="386" rx="213" ry="159" fill="#fff9ee" opacity=".8" />
          <ellipse cx="300" cy="380" rx="195" ry="145" fill={colors[2]} stroke={colors[0]} strokeWidth="13" />
          <ellipse cx="300" cy="380" rx="164" ry="118" fill="none" stroke={colors[3]} strokeWidth="9" strokeDasharray="2 13" strokeLinecap="round" />
          <ellipse cx="300" cy="380" rx="133" ry="91" fill="none" stroke={colors[0]} strokeWidth="8" strokeDasharray="2 12" strokeLinecap="round" />
          <ellipse cx="300" cy="380" rx="101" ry="66" fill="none" stroke={colors[1]} strokeWidth="8" strokeDasharray="2 11" strokeLinecap="round" />
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index / 8) * Math.PI * 2
            const x = 300 + Math.cos(angle) * 77
            const y = 380 + Math.sin(angle) * 52
            return (
              <g key={index}>
                <circle cx={x} cy={y} r="18" fill={colors[index % colors.length]} stroke="#fff6e8" strokeWidth="4" />
                <circle cx={x} cy={y} r="5" fill="#fff8eb" opacity=".8" />
              </g>
            )
          })}
          {beadAngles.map((bead, index) => (
            <circle
              key={index}
              cx={bead.x}
              cy={bead.y}
              r={bead.size / 2}
              fill={bead.color}
              stroke="#fff8eb"
              strokeWidth="2"
            />
          ))}
        </g>
      )}

      {product.category === 'Beaded bracelets' && (
        <g filter={`url(#shadow-${product.id})`}>
          <ellipse cx="300" cy="365" rx="132" ry="154" fill="none" stroke="#fff9ef" strokeWidth="48" />
          <ellipse cx="300" cy="365" rx="132" ry="154" fill="none" stroke={colors[3]} strokeWidth="2" opacity=".8" />
          {braceletBeads.map((bead, index) => (
            <circle
              key={index}
              cx={bead.x}
              cy={bead.y}
              r={index % 5 === 0 ? 16 : 13}
              fill={bead.color}
              stroke="#fff5e7"
              strokeWidth="4"
            />
          ))}
          <circle cx="300" cy="365" r="65" fill="#fff9ef" opacity=".65" />
          <circle cx="300" cy="365" r="42" fill="none" stroke={colors[1]} strokeWidth="2" opacity=".7" />
        </g>
      )}
      <text x="34" y="654" fill="#6a5548" fontFamily="Georgia, serif" fontSize="18" fontStyle="italic">
        beadcraft studio · handmade with love
      </text>
    </svg>
  )
}

export default ProductArtwork
