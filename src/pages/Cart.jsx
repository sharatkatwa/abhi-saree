import { Link } from 'react-router-dom'
import { useState } from 'react'
import { formatINR, SHOP } from '../data/shop.js'
import { useStore } from '../context/StoreContext.jsx'
import { Icon } from '../components/Icons.jsx'

export default function Cart() {
  const { cart, setQty, removeFromCart, subtotal, clearCart, openWhatsApp, notify } = useStore()
  const [cust, setCust] = useState({ name: '', phone: '', city: '' })
  const [placing, setPlacing] = useState(false)
  const ship = subtotal === 0 || subtotal >= SHOP.freeShip ? 0 : 149
  const total = subtotal + ship

  const fallbackText = [
    'Namaste Ilkal Silk 🙏',
    'I would like to place this order:',
    ...cart.map((i) => `• ${i.name} × ${i.qty} — ${formatINR(i.price * i.qty)}`),
    `Subtotal: ${formatINR(subtotal)}`,
    `Dispatch: ${ship ? formatINR(ship) : 'Free'}`,
    `Total: ${formatINR(total)}`,
    cust.name && `Name: ${cust.name}`,
    cust.phone && `Phone: ${cust.phone}`,
    cust.city && `City: ${cust.city}`,
    '',
    'Ship to: (I will type my address here)',
  ].filter((l) => l !== undefined).join('\n')

  const placeOrder = async () => {
    setPlacing(true)
    try {
      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cust,
          items: cart.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        }),
      })
      if (!r.ok) throw new Error('order rejected')
      const d = await r.json()
      notify(`Order ${d.id} saved — tap Open WhatsApp to send it`)
      openWhatsApp(d.waText, `Order ${d.id}`)
    } catch {
      // backend offline — still let the customer order via WhatsApp
      openWhatsApp(fallbackText, 'Order on WhatsApp')
    } finally {
      setPlacing(false)
    }
  }

  if (!cart.length) {
    return (
      <div className="empty">
        <span className="kicker">Your bag is a bare loom</span>
        <h2>Nothing folded yet.</h2>
        <p className="muted" style={{ marginBottom: 18 }}>
          Kasuti, chikki checks and everyday cotton are waiting.
        </p>
        <Link className="btn btn-gold" to="/shop">
          Browse sarees
        </Link>
      </div>
    )
  }

  return (
    <div className="wrap" style={{ paddingTop: 22, paddingBottom: 28 }}>
      <span className="kicker">Your bag</span>
      <h1 className="h-display" style={{ fontSize: '2.2rem', marginBottom: 8 }}>
        Ready to drape
      </h1>

      {cart.map((i) => (
        <div className="cart-item" key={i.id}>
          <Link to={`/saree/${i.id}`}>
            <img src={i.image} alt={i.name} />
          </Link>
          <div>
            <Link to={`/saree/${i.id}`}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem' }}>{i.name}</h3>
            </Link>
            <div className="price" style={{ marginTop: 4 }}>{formatINR(i.price)}</div>
            <div className="qty">
              <button aria-label="Less" onClick={() => setQty(i.id, i.qty - 1)}>
                <Icon.minus />
              </button>
              <span>{i.qty}</span>
              <button aria-label="More" onClick={() => setQty(i.id, i.qty + 1)}>
                <Icon.plus />
              </button>
            </div>
          </div>
          <button className="tiny" style={{ color: 'var(--muted)' }} onClick={() => removeFromCart(i.id)}>
            Remove
          </button>
        </div>
      ))}

      <div className="summary">
        <div className="row">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <div className="row">
          <span>Dispatch</span>
          <span>{ship ? formatINR(ship) : 'Free'}</span>
        </div>
        <hr className="gold-rule" style={{ margin: '10px 0' }} />
        <div className="row total">
          <span>To pay</span>
          <span>{formatINR(total)}</span>
        </div>
        <p className="note" style={{ marginTop: 8 }}>
          Free courier across India above {formatINR(SHOP.freeShip)}. COD on request. 7-day
          exchange if unused, tags on.
        </p>
      </div>

      <div className="form" style={{ marginTop: 16, gap: 8 }}>
        <span className="kicker">Your details (optional)</span>
        <input
          placeholder="Your name"
          value={cust.name}
          onChange={(e) => setCust({ ...cust, name: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Your phone / WhatsApp number"
          value={cust.phone}
          onChange={(e) => setCust({ ...cust, phone: e.target.value })}
        />
        <input
          placeholder="Your city"
          value={cust.city}
          onChange={(e) => setCust({ ...cust, city: e.target.value })}
        />
      </div>

      <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
        <button className="btn btn-wa btn-block" onClick={placeOrder} disabled={placing}>
          <Icon.wa style={{ width: 18, height: 18 }} />
          {placing ? 'Saving your order…' : 'Confirm on WhatsApp'}
        </button>
        <Link className="btn btn-ghost btn-block" to="/shop">
          Keep browsing
        </Link>
        <button className="tiny muted" onClick={clearCart}>
          Empty the bag
        </button>
      </div>
    </div>
  )
}
