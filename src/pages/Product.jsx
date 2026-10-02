import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { formatINR, getProduct, relatedProducts, SHOP } from '../data/shop.js'
import { useStore } from '../context/StoreContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { Icon } from '../components/Icons.jsx'

export default function Product() {
  const { id } = useParams()
  const product = getProduct(id)
  const { addToCart, toggleWish, wish, openWhatsApp } = useStore()
  const [shot, setShot] = useState(0)

  if (!product) {
    return (
      <div className="empty">
        <h2>This saree has left the loom.</h2>
        <Link className="btn btn-gold" to="/shop">
          Back to the shop
        </Link>
      </div>
    )
  }

  const loved = wish.includes(product.id)
  const img = product.gallery[shot] || product.image
  const save = Math.round((1 - product.price / product.mrp) * 100)
  const waText = `Namaste Ilkal Silk 🙏\nI would like to order:\n• ${product.name} — ${formatINR(product.price)}\nPlease confirm blouse piece and dispatch.`

  return (
    <>
      <div className="wrap pdp">
        <div>
          <div className="pdp-gallery">
            <img src={img} alt={product.name} />
          </div>
          {product.gallery.length > 1 && (
            <div className="pdp-thumbs">
              {product.gallery.map((g, i) => (
                <button key={g} className={i === shot ? 'on' : ''} onClick={() => setShot(i)}>
                  <img src={g} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp-body">
          <Link to="/shop" className="tiny" style={{ color: 'var(--royal)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon.back style={{ width: 14, height: 14 }} /> All sarees
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8, marginTop: 8 }}>
            <div>
              <span className="kicker">{product.fabric}</span>
              <h1>{product.name}</h1>
              <p className="muted" style={{ marginTop: 4 }}>{product.subtitle}</p>
            </div>
            <button className={`wish-btn ${loved ? 'on' : ''}`} style={{ position: 'relative', top: 4 }} onClick={() => toggleWish(product.id)}>
              {loved ? <Icon.heartFill /> : <Icon.heart />}
            </button>
          </div>

          <div style={{ margin: '14px 0 4px', display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span className="price" style={{ fontSize: '1.45rem' }}>{formatINR(product.price)}</span>
            <span className="mrp" style={{ fontSize: '0.95rem' }}>{formatINR(product.mrp)}</span>
            <span className="gi-pill">{save}% off</span>
          </div>
          <p className="note">Inclusive of GST · Free dispatch above {formatINR(SHOP.freeShip)}</p>

          <div className="swatches" aria-label="Colours">
            {product.swatches.map((c) => (
              <span key={c} className="swatch" style={{ background: c }} />
            ))}
          </div>

          <div className="meta-grid">
            <div className="meta">
              <b>Border</b>
              <span>{product.border}</span>
            </div>
            <div className="meta">
              <b>Pallu</b>
              <span>{product.pallu}</span>
            </div>
            <div className="meta">
              <b>Blouse</b>
              <span>{product.blouse}</span>
            </div>
            <div className="meta">
              <b>Length</b>
              <span>{product.length}</span>
            </div>
          </div>

          <p className="story-text">{product.story}</p>
          <ul className="bullets">
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>

          <div className="sticky-buy">
            <button className="btn btn-royal" onClick={() => addToCart(product)}>
              Add to bag
            </button>
            <button className="btn btn-wa" onClick={() => openWhatsApp(waText, 'Order on WhatsApp')}>
              <Icon.wa style={{ width: 18, height: 18 }} /> Order on WhatsApp
            </button>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>From the same loom</h2>
          </div>
          <div className="grid-prods">
            {relatedProducts(product.id).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
