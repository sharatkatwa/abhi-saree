import { Link, NavLink } from 'react-router-dom'
import { Icon } from './Icons.jsx'
import { useStore } from '../context/StoreContext.jsx'

export default function Header() {
  const { count, setSearchOpen } = useStore()
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Ilkal Silk home">
          <span className="brand-mark" aria-hidden>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.8 15.1 9H8.9L12 2.8Zm-6.2 7.4L8.6 15H2.6l3.2-4.8Zm6.2 0L15.1 15H8.9l3.1-4.8Zm6.2 0 3.2 4.8h-6l3-4.8ZM4 16.4h16v1.2H4zm1.4 2.2h13.2v.9H5.4z" />
            </svg>
          </span>
          <span className="brand-text">
            <strong>ILKAL</strong>
            <span>Silk · Karnataka</span>
          </span>
        </Link>

        <nav className="nav-desk" aria-label="Primary">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/heritage">Heritage</NavLink>
          <NavLink to="/contact">Visit</NavLink>
        </nav>

        <div className="header-actions">
          <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Icon.search />
          </button>
          <Link to="/cart" className="icon-btn" aria-label="Bag">
            <Icon.bag />
            {count > 0 && <span className="badge">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
