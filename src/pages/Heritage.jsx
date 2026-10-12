import { Link } from 'react-router-dom'
import { CRAFT, TIMELINE } from '../data/shop.js'

export default function Heritage() {
  return (
    <>
      <div className="hero-slim">
        <img src="/images/hero/pallu-gold.jpg" alt="Gold Ilkal pallu with temple motifs" />
        <div className="inner">
          <span className="kicker" style={{ color: 'var(--gold-2)' }}>
            Ramdurg,belgum district, Karnataka, India.
          </span>
          <h1>A saree older than the gazette.</h1>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', lineHeight: 1.5, maxWidth: 640 }}>
          Ilkal has been dressing the Deccan since the 8th century. The town sits where Karnataka
          leans into Maharashtra — which is why you will find this saree in a Hubballi wedding
          and a Solapur kitchen in the same week.
        </p>
        <p className="muted" style={{ marginTop: 14, lineHeight: 1.7, maxWidth: 640 }}>
          What makes it Ilkal is not a print. It is a join. The body warp is prepared on one beam,
          the silk pallu on another. They meet in a loop the weavers call <em>Tope Teni</em> —
          three shuttles, the Kondi process, a seam you can read with your fingers. In 2007 the
          Geographical Indication made that join the legal property of this town.
        </p>

        <h2 className="h-display" style={{ fontSize: '2rem', margin: '32px 0 8px' }}>
          A short history of the loom
        </h2>
        <div className="timeline">
          {TIMELINE.map((t) => (
            <div className="tl-item" key={t.year}>
              <div className="tl-year">{t.year}</div>
              <p>{t.text}</p>
            </div>
          ))}
        </div>

        <div className="craft-grid" style={{ marginBottom: 28 }}>
          {CRAFT.map((c) => (
            <article key={c.title} className="craft-card">
              <span className="kicker">{c.kicker}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>

        <div className="story" style={{ marginBottom: 28 }}>
          <img src="/images/hero/loom.jpg" alt="Hands at the pit loom" />
          <div className="story-copy">
            <span className="kicker" style={{ color: 'var(--gold-2)' }}>How we buy</span>
            <h2>From the family, not the factory.</h2>
            <p>
              We work with pit-loom households in and around Ilkal — Devanga weavers who still
              dye, warp and throw the shuttle under one roof. A checked cotton can leave the loom
              in three days; a Kasuti piece may take a week of stitch after the weave. We do not
              stock powerloom copies. If it is in this shop, a hand put it there.
            </p>
            <Link className="btn btn-gold" to="/shop">
              See what they wove
            </Link>
          </div>
        </div>

        <div className="craft-card" style={{ marginBottom: 32 }}>
          <span className="kicker">How to know it is real</span>
          <h3>A buyer’s thumb-test</h3>
          <p>
            Look for the looped join where body meets pallu — not a stitched-on silk panel. Borders
            are broad, 4 to 6 inches, often in pomegranate, peacock green or mustard. Pallu length
            sits between 16 and 27 inches, frequently with three red bands and white temple
            stripes on the classic Tope-Teni seragu. Checks are called tirki or chikki; they are
            crisp, not ikat-blurred. When in doubt, ask us. We would rather unsell a saree than
            misname one.
          </p>
        </div>
      </div>
    </>
  )
}
