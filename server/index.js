// Ilkal Silk — tiny API server
// Stores orders & enquiries as JSON files, serves shop settings, powers /admin.
//
//   Run:  node server/index.js            (or)  npm run server
//   Port: 8080 (Vite proxies /api here)
//
// CHANGE THIS after first login — the passcode that opens /admin:
const ADMIN_KEY = process.env.ILKAL_ADMIN_KEY || 'ilkal-admin-2026'

import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.join(__dirname, 'data')
fs.mkdirSync(DATA, { recursive: true })

const DEFAULT_SETTINGS = {
  brand: 'Ilkal Silk',
  whatsapp: '919731025877', // ← shop admin WhatsApp number, editable from /admin
  email: 'hello@ilkalsilk.in',
  city: 'Ilkal, Bagalkot, Karnataka',
  hours: '10:00 AM – 7:30 PM IST',
  instagram: 'ilkal.silk.sarees',
  freeShip: 4999,
}

// ── tiny JSON-file store ────────────────────────────────────────────
function load(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'))
  } catch {
    return fallback
  }
}
function save(file, obj) {
  fs.writeFileSync(path.join(DATA, file), JSON.stringify(obj, null, 2))
}
if (!fs.existsSync(path.join(DATA, 'settings.json'))) save('settings.json', DEFAULT_SETTINGS)

const settings = () => ({ ...DEFAULT_SETTINGS, ...load('settings.json', {}) })
const clip = (s, n = 200) => String(s ?? '').slice(0, n)
const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')

const app = express()
app.use(express.json({ limit: '256kb' }))

// ── public ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }))

app.get('/api/config', (req, res) => {
  const s = settings()
  res.json({
    brand: s.brand,
    whatsapp: s.whatsapp,
    email: s.email,
    city: s.city,
    hours: s.hours,
    instagram: s.instagram,
    freeShip: s.freeShip,
  })
})

// Place an order → saved + returns the WhatsApp message to pre-fill
app.post('/api/orders', (req, res) => {
  const b = req.body || {}
  const items = Array.isArray(b.items) ? b.items.slice(0, 50) : []
  if (!items.length) return res.status(400).json({ ok: false, error: 'Bag is empty' })

  const clean = items.map((i) => ({
    id: clip(i.id, 60),
    name: clip(i.name, 120),
    price: Math.max(0, Number(i.price) || 0),
    qty: Math.min(20, Math.max(1, Number(i.qty) || 1)),
  }))
  const subtotal = clean.reduce((s, i) => s + i.price * i.qty, 0)
  const freeShip = settings().freeShip
  const ship = subtotal === 0 || subtotal >= freeShip ? 0 : 149
  const total = subtotal + ship

  const orders = load('orders.json', [])
  const next = 1001 + orders.reduce((m, o) => Math.max(m, Number(String(o.id).replace(/\D/g, '')) - 1000), 0)
  const order = {
    id: 'ILK-' + next,
    createdAt: new Date().toISOString(),
    status: 'new',
    customer: {
      name: clip(b.name, 80),
      phone: clip(b.phone, 20),
      city: clip(b.city, 80),
      note: clip(b.note, 400),
    },
    items: clean,
    subtotal,
    ship,
    total,
  }
  orders.push(order)
  save('orders.json', orders)

  const lines = [
    'Namaste Ilkal Silk 🙏',
    `Order ${order.id}:`,
    ...clean.map((i) => `• ${i.name} × ${i.qty} — ${inr(i.price * i.qty)}`),
    `Subtotal: ${inr(subtotal)}`,
    `Dispatch: ${ship ? inr(ship) : 'Free'}`,
    `Total: ${inr(total)}`,
  ]
  if (order.customer.name) lines.push(`Name: ${order.customer.name}`)
  if (order.customer.phone) lines.push(`Phone: ${order.customer.phone}`)
  if (order.customer.city) lines.push(`City: ${order.customer.city}`)
  if (order.customer.note) lines.push(`Note: ${order.customer.note}`)
  lines.push('Shipping address: (I will type it here)')

  res.status(201).json({ ok: true, id: order.id, waText: lines.join('\n') })
})

// Contact-form note → saved as a lead
app.post('/api/leads', (req, res) => {
  const b = req.body || {}
  const lead = {
    id: 'LEAD-' + Date.now(),
    createdAt: new Date().toISOString(),
    name: clip(b.name, 80),
    phone: clip(b.phone, 20),
    note: clip(b.note, 600),
  }
  const leads = load('leads.json', [])
  leads.push(lead)
  save('leads.json', leads)
  res.status(201).json({ ok: true, id: lead.id })
})

// ── admin (passcode via x-admin-key header) ─────────────────────────
app.use('/api/admin', (req, res, next) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: 'Bad passcode' })
  }
  next()
})

app.get('/api/admin/stats', (req, res) => {
  const orders = load('orders.json', [])
  const leads = load('leads.json', [])
  res.json({
    orders: orders.length,
    newOrders: orders.filter((o) => o.status === 'new').length,
    revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
    leads: leads.length,
  })
})

app.get('/api/admin/orders', (req, res) => {
  const orders = load('orders.json', []).slice().reverse()
  res.json({ orders })
})

app.patch('/api/admin/orders/:id', (req, res) => {
  const orders = load('orders.json', [])
  const o = orders.find((x) => x.id === req.params.id)
  if (!o) return res.status(404).json({ ok: false, error: 'Not found' })
  o.status = ['new', 'confirmed', 'sent'].includes(req.body?.status) ? req.body.status : o.status
  save('orders.json', orders)
  res.json({ ok: true, order: o })
})

app.delete('/api/admin/orders/:id', (req, res) => {
  const orders = load('orders.json', [])
  const kept = orders.filter((x) => x.id !== req.params.id)
  save('orders.json', kept)
  res.json({ ok: true, removed: orders.length - kept.length })
})

app.get('/api/admin/leads', (req, res) => {
  const leads = load('leads.json', []).slice().reverse()
  res.json({ leads })
})

app.get('/api/admin/settings', (req, res) => res.json({ settings: settings() }))

app.put('/api/admin/settings', (req, res) => {
  const b = req.body || {}
  const s = settings()
  if (b.whatsapp) s.whatsapp = clip(String(b.whatsapp).replace(/\D/g, ''), 15)
  if (b.email) s.email = clip(b.email, 120)
  if (b.city) s.city = clip(b.city, 120)
  if (b.hours) s.hours = clip(b.hours, 60)
  if (b.instagram) s.instagram = clip(b.instagram, 60)
  if (b.freeShip != null) s.freeShip = Math.max(0, Number(b.freeShip) || s.freeShip)
  save('settings.json', s)
  res.json({ ok: true, settings: s })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, '127.0.0.1', () => console.log(`Ilkal API on http://127.0.0.1:${PORT}`))
