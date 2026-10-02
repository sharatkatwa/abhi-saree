import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import Heritage from './pages/Heritage.jsx'
import Cart from './pages/Cart.jsx'
import Contact from './pages/Contact.jsx'
import Admin from './pages/Admin.jsx'
import { useStore } from './context/StoreContext.jsx'
import { Icon } from './components/Icons.jsx'
import { PRODUCTS } from './data/shop.js'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import WhatsAppSheet from './components/WhatsAppSheet.jsx'

export default function App() {
  const { toast, searchOpen, setSearchOpen, openWhatsApp } = useStore()
  const loc = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    setSearchOpen(false)
  }, [loc.pathname, setSearchOpen])

  const hideFab = loc.pathname.startsWith('/saree/') || loc.pathname === '/cart' || loc.pathname === '/contact' || loc.pathname === '/admin'

  return (
    <div className="app">
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/saree/:id" element={<Product />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
      {!hideFab && (
        <button
          className="fab-wa"
          onClick={() =>
            openWhatsApp('Namaste Ilkal Silk, I would like to know more about your heritage sarees.')
          }
          aria-label="WhatsApp the shop"
        >
          <Icon.wa />
        </button>
      )}
      <WhatsAppSheet />
      {toast && <div className="toast">{toast.message}</div>}
      {searchOpen && <SearchSheet onClose={() => setSearchOpen(false)} />}
    </div>
  )
}

function SearchSheet({ onClose }) {
  const [q, setQ] = useState('')
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return PRODUCTS.slice(0, 5)
    return PRODUCTS.filter((p) =>
      `${p.name} ${p.subtitle} ${p.fabric} ${p.story}`.toLowerCase().includes(s),
    )
  }, [q])

  return (
    <div className="search-sheet" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          placeholder="Search Kasuti, checks, cotton…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          {hits.map((p) => (
            <Link key={p.id} to={`/saree/${p.id}`} className="search-hit" onClick={onClose}>
              <img src={p.thumb} alt="" />
              <div>
                <strong style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem' }}>{p.name}</strong>
                <div className="tiny muted">{p.subtitle}</div>
              </div>
              <Icon.chev style={{ width: 16, height: 16, opacity: 0.5 }} />
            </Link>
          ))}
          {!hits.length && <p className="muted" style={{ padding: 16 }}>No saree by that name on the loom yet.</p>}
        </div>
      </div>
    </div>
  )
}
