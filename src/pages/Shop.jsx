import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS } from '../data/shop.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const active = params.get('c') || 'all'
  const [sort, setSort] = useState('featured')

  const list = useMemo(() => {
    let rows = PRODUCTS.filter((p) => active === 'all' || p.categories.includes(active))
    if (sort === 'low') rows = [...rows].sort((a, b) => a.price - b.price)
    if (sort === 'high') rows = [...rows].sort((a, b) => b.price - a.price)
    if (sort === 'az') rows = [...rows].sort((a, b) => a.name.localeCompare(b.name))
    return rows
  }, [active, sort])

  return (
    <>
      <div className="wrap" style={{ paddingTop: 22 }}>
        <span className="kicker">The collection</span>
        <h1 className="h-display" style={{ fontSize: 'clamp(2rem, 7vw, 3.2rem)', margin: '6px 0 4px' }}>
          Sarees on the loom
        </h1>
        <p className="muted" style={{ maxWidth: 460, lineHeight: 1.55 }}>
          Every piece photographed is in our Ilkal shop — Kasuti, chikki checks, Hatti More and
          everyday cotton. What you see is what we ship.
        </p>
      </div>

      <div className="toolbar">
        <div className="wrap">
          <div className="chips" role="tablist">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`chip ${active === c.id ? 'on' : ''}`}
                onClick={() => {
                  const next = new URLSearchParams(params)
                  if (c.id === 'all') next.delete('c')
                  else next.set('c', c.id)
                  setParams(next)
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="tiny muted">{list.length} sarees</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                border: 0,
                background: 'transparent',
                color: 'var(--royal)',
                fontSize: '0.8rem',
              }}
            >
              <option value="featured">Featured</option>
              <option value="low">Price · low</option>
              <option value="high">Price · high</option>
              <option value="az">Name</option>
            </select>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: 24 }}>
        <div className="grid-prods">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </>
  )
}
