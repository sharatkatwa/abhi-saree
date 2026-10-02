import { Link } from 'react-router-dom'
import { CRAFT, formatINR, PRODUCTS, SHOP } from '../data/shop.js'
import ProductCard from '../components/ProductCard.jsx'
import { Icon } from '../components/Icons.jsx'

const COLLECTION_IDS = ['kasuti-shelf', 'gopura-checks', 'mango-paras', 'zari-solids', 'chikki-butti']

const TICKER = [
  'Tope Teni join',
  'GI tagged 2007',
  'Chikki Paras border',
  'Kasuti stitch',
  'Pit loom · Ilkal',
  'Cotton body · silk pallu',
  'Devanga weaves',
]

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured)
  const collections = PRODUCTS.filter((p) => COLLECTION_IDS.includes(p.id))

  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <img src="/images/hero/hero-silk.jpg" alt="Royal purple Ilkal silk with gold temple border" />
        </div>
        <div className="hero-copy">
          <div className="kannada">{SHOP.kannada}</div>
          <p className="kicker" style={{ color: 'var(--gold-2)' }}>
            Handloom · Bagalkot · Since the 8th century
          </p>
          <h1>Woven in Ilkal. Worn for life.</h1>
          <p className="lead">
            Old-loom silk and cotton sarees — temple borders, chikki checks, Kasuti peacocks —
            folded the way our weavers still finish them.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-gold" to="/shop">
              Shop the loom
            </Link>
            <Link className="btn btn-ghost" to="/heritage" style={{ color: 'var(--cream)', boxShadow: 'inset 0 0 0 1px rgba(228,195,90,0.45)' }}>
              The Tope Teni story
            </Link>
          </div>
        </div>
      </section>

      <div className="ribbon" aria-hidden>
        <div className="ribbon-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i}>✦ &nbsp; {t}</span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker">This season on the loom</span>
              <h2>From our shop floor</h2>
            </div>
            <Link className="link-more" to="/shop">
              All sarees <Icon.chev />
            </Link>
          </div>
          <div className="grid-prods">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 4 }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker">Fresh from the loom shelf</span>
              <h2>This week's collections</h2>
            </div>
            <Link className="link-more" to="/shop">
              All sarees <Icon.chev />
            </Link>
          </div>
          <div className="coll-grid">
            {collections.map((p) => (
              <Link key={p.id} to={`/saree/${p.id}`} className="coll-card">
                <img src={p.image} alt={p.name} loading="lazy" />
                <span className="coll-info">
                  <strong>{p.name}</strong>
                  <em>{p.subtitle}</em>
                  <span className="coll-price">
                    {formatINR(p.price)} · Shop the colours →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="story">
            <img src="/images/hero/loom.jpg" alt="Weaver at a pit loom with royal purple silk" />
            <div className="story-copy">
              <span className="kicker" style={{ color: 'var(--gold-2)' }}>
                A town, a join, a GI
              </span>
              <h2>Only Ilkal loops the pallu this way.</h2>
              <p>
                Body warp and pallu warp are born on two beams, then married with the Tope Teni
                loop — a seam no other Indian loom is allowed to claim. We buy from the same
                Devanga families who still sit the pit loom in Bagalkot. What you see in this
                shop is what left those looms last month.
              </p>
              <Link className="btn btn-gold" to="/heritage">
                Read the heritage
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker">Three signatures</span>
              <h2>How to read an Ilkal</h2>
            </div>
          </div>
          <div className="craft-grid">
            {CRAFT.map((c) => (
              <article key={c.title} className="craft-card">
                <span className="kicker">{c.kicker}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <div
            style={{
              display: 'grid',
              gap: 14,
            }}
            className="home-split"
          >
            <figure
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                position: 'relative',
                minHeight: 260,
              }}
            >
              <img
                src="/images/hero/drape-detail.jpg"
                alt="Close-up of purple silk and gold chikki border"
                style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 260 }}
              />
            </figure>
            <div className="craft-card">
              <span className="kicker">How to order</span>
              <h3>Instagram-born. WhatsApp-easy.</h3>
              <p>
                Tap a saree, drop it in the bag, send the order on WhatsApp. We confirm colour,
                blouse piece and dispatch — usually the same evening. Pan-India courier. Falls
                and pico if you ask. Follow the loom at @{SHOP.instagram}.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                <Link className="btn btn-royal" to="/contact">
                  Write to us
                </Link>
                <a className="btn btn-ghost" href={SHOP.instagramUrl} target="_blank" rel="noreferrer">
                  <Icon.ig style={{ width: 16, height: 16 }} /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
