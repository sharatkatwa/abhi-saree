import { Link } from 'react-router-dom'
import { SHOP } from '../data/shop.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <strong>ILKAL SILK</strong>
        <p>
          Ramdurg,belgum district, Karnataka, India.
        </p>
        <div className="footer-links">
          <Link to="/shop">The collection</Link>
          <Link to="/heritage">The craft</Link>
          <Link to="/contact">Order & visit</Link>
          <a href={SHOP.instagramUrl} target="_blank" rel="noreferrer">
            @{SHOP.instagram}
          </a>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} Ilkal Silk · {SHOP.city} · {SHOP.kannada} ·{' '}
          <Link to="/admin" style={{ opacity: 0.6 }}>
            shop admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
