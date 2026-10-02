import { useEffect, useMemo, useState } from 'react'
import { formatINR } from '../data/shop.js'
import { Icon } from '../components/Icons.jsx'

const KEY_STORE = 'ilkal-admin-key'

function when(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_STORE) || '')
  const [authed, setAuthed] = useState(false)
  const [err, setErr] = useState('')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [leads, setLeads] = useState([])
  const [settings, setSettings] = useState(null)
  const [saved, setSaved] = useState(false)

  const headers = useMemo(
    () => ({ 'x-admin-key': key, 'Content-Type': 'application/json' }),
    [key],
  )

  const load = () => {
    fetch('/api/admin/stats', { headers })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setStats)
      .catch(() => setErr('Wrong passcode or the API server is not running.'))
    fetch('/api/admin/orders', { headers })
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => {})
    fetch('/api/admin/leads', { headers })
      .then((r) => r.json())
      .then((d) => setLeads(d.leads || []))
      .catch(() => {})
    fetch('/api/admin/settings', { headers })
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => {})
  }

  useEffect(() => {
    if (authed) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  const login = (e) => {
    e.preventDefault()
    setErr('')
    fetch('/api/admin/stats', { headers })
      .then((r) => {
        if (!r.ok) throw new Error('bad key')
        sessionStorage.setItem(KEY_STORE, key)
        setAuthed(true)
      })
      .catch(() => setErr('Wrong passcode (or API server is down: run  npm run server ).'))
  }

  const setStatus = (id, status) =>
    fetch(`/api/admin/orders/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ status }) })
      .then(load)

  const delOrder = (id) =>
    fetch(`/api/admin/orders/${id}`, { method: 'DELETE', headers }).then(load)

  const saveSettings = (e) => {
    e.preventDefault()
    setSaved(false)
    setErr('')
    fetch('/api/admin/settings', { method: 'PUT', headers, body: JSON.stringify(settings) })
      .then((r) => {
        if (!r.ok) throw new Error('save failed')
        return r.json()
      })
      .then((d) => {
        setSettings(d.settings)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      })
      .catch(() => {
        setSaved(false)
        setErr('Save failed — the backend is asleep. Ask the chat to "restart the server", then try again.')
      })
  }

  if (!authed) {
    return (
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 40, maxWidth: 420 }}>
        <span className="kicker">Shop owner only</span>
        <h1 className="h-display" style={{ fontSize: '2.2rem', margin: '6px 0 14px' }}>
          Admin desk
        </h1>
        <form className="form" onSubmit={login}>
          <input
            type="password"
            placeholder="Admin passcode"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
          />
          <button className="btn btn-gold btn-block" type="submit">
            Open the desk
          </button>
          {err && <p className="note" style={{ color: '#B42318' }}>{err}</p>}
          <p className="note">
            Default passcode: <b>ilkal-admin-2026</b> — change it in <code>server/index.js</code>.
          </p>
        </form>
      </div>
    )
  }

  return (
    <div className="wrap" style={{ paddingTop: 22, paddingBottom: 40 }}>
      <span className="kicker">Shop owner desk</span>
      <h1 className="h-display" style={{ fontSize: '2.2rem', margin: '6px 0 14px' }}>
        Admin
      </h1>

      {stats && (
        <div className="stat-grid">
          <div className="stat-card"><b>{stats.orders}</b><span>Orders</span></div>
          <div className="stat-card"><b>{stats.newOrders}</b><span>New</span></div>
          <div className="stat-card"><b>{formatINR(stats.revenue)}</b><span>Order value</span></div>
          <div className="stat-card"><b>{stats.leads}</b><span>Enquiries</span></div>
        </div>
      )}

      {settings && (
        <form className="form admin-box" onSubmit={saveSettings}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem' }}>
            Shop WhatsApp number (admin)
          </h2>
          <input
            value={settings.whatsapp}
            onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value.replace(/\D/g, '') })}
            placeholder="91XXXXXXXXXX — country code, no + or spaces"
          />
          <div className="grid-2col">
            <input
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="Email"
            />
            <input
              value={settings.freeShip}
              type="number"
              onChange={(e) => setSettings({ ...settings, freeShip: e.target.value })}
              placeholder="Free-ship above ₹"
            />
          </div>
          <input
            value={settings.city}
            onChange={(e) => setSettings({ ...settings, city: e.target.value })}
            placeholder="Shop town"
          />
          <input
            value={settings.hours}
            onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
            placeholder="Hours"
          />
          <button className="btn btn-gold btn-block" type="submit">
            {saved ? 'Saved ✓ — live on the site' : 'Save settings'}
          </button>
          {err && <p className="note" style={{ color: '#B42318', margin: 0 }}>{err}</p>}
          <p className="note" style={{ margin: 0 }}>
            This number is what customers see when they tap any WhatsApp button.
          </p>
        </form>
      )}

      <div className="admin-box">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem' }}>Orders ({orders.length})</h2>
        {!orders.length && <p className="muted">No orders yet — they appear here the moment a customer confirms from the bag.</p>}
        {orders.map((o) => (
          <article key={o.id} className="admin-order">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <strong>{o.id}</strong>
              <span className="tiny muted">{when(o.createdAt)}</span>
            </div>
            <div className="admin-order-items">
              {o.items.map((i) => (
                <div key={`${o.id}-${i.id}`}>
                  {i.name} × {i.qty} — {formatINR(i.price * i.qty)}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <strong>{formatINR(o.total)}</strong>
              <span className={`st-pill st-${o.status}`}>{o.status}</span>
            </div>
            {(o.customer?.name || o.customer?.phone || o.customer?.city) && (
              <p className="tiny muted" style={{ marginTop: 6 }}>
                {[o.customer.name, o.customer.phone, o.customer.city].filter(Boolean).join(' · ')}
              </p>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {o.status === 'new' && (
                <button className="tiny admin-act" onClick={() => setStatus(o.id, 'confirmed')}>Mark confirmed</button>
              )}
              {o.status !== 'sent' && (
                <button className="tiny admin-act" onClick={() => setStatus(o.id, 'sent')}>Mark sent</button>
              )}
              <button className="tiny admin-act danger" onClick={() => delOrder(o.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      <div className="admin-box">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem' }}>Enquiries ({leads.length})</h2>
        {!leads.length && <p className="muted">Notes from the contact form appear here.</p>}
        {leads.map((l) => (
          <article key={l.id} className="admin-order">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <strong>{l.name || 'Customer'}</strong>
              <span className="tiny muted">{when(l.createdAt)}</span>
            </div>
            <p className="tiny muted" style={{ margin: '4px 0' }}>{l.phone}</p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{l.note}</p>
          </article>
        ))}
      </div>

      <a className="tiny muted" href="https://wa.me/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Icon.wa style={{ width: 14, height: 14 }} /> Your WhatsApp
      </a>
    </div>
  )
}
