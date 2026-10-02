import { useState } from 'react'
import { SHOP } from '../data/shop.js'
import { Icon } from '../components/Icons.jsx'
import { useStore } from '../context/StoreContext.jsx'

export default function Contact() {
  const { openWhatsApp } = useStore()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', note: '' })

  const onSubmit = (e) => {
    e.preventDefault()
    const text = `Namaste Ilkal Silk 🙏\nI am ${form.name || 'a customer'}.\nPhone: ${form.phone}\n\n${form.note || 'I would like help choosing a saree.'}`
    // save the note in the shop's backend (visible in /admin), then open WhatsApp
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).catch(() => {})
    openWhatsApp(text, 'Message the shop')
    setSent(true)
  }

  return (
    <div className="wrap" style={{ paddingTop: 22, paddingBottom: 32 }}>
      <span className="kicker">Visit & order</span>
      <h1 className="h-display" style={{ fontSize: 'clamp(2rem, 7vw, 3rem)', margin: '6px 0 10px' }}>
        The shop is a loom-town.
      </h1>
      <p className="muted" style={{ maxWidth: 480, lineHeight: 1.65 }}>
        Write, WhatsApp or follow the reel — we answer the way a family shop answers, usually
        before sundown. Mention the saree name if you already know it.
      </p>

      <div className="meta-grid" style={{ marginTop: 20 }}>
        <div className="meta">
          <b>Town</b>
          <span>{SHOP.city}</span>
        </div>
        <div className="meta">
          <b>Hours</b>
          <span>{SHOP.hours}</span>
        </div>
        <div className="meta">
          <b>Instagram</b>
          <span>@{SHOP.instagram}</span>
        </div>
        <div className="meta">
          <b>Email</b>
          <span>{SHOP.email}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <button
          className="btn btn-wa"
          onClick={() => openWhatsApp('Namaste Ilkal Silk, I would like to know more about your sarees.')}
        >
          <Icon.wa style={{ width: 18, height: 18 }} /> WhatsApp
        </button>
        <a className="btn btn-royal" href={SHOP.instagramUrl} target="_blank" rel="noreferrer">
          <Icon.ig style={{ width: 16, height: 16 }} /> @{SHOP.instagram}
        </a>
      </div>

      <form className="form" onSubmit={onSubmit} style={{ marginTop: 28 }}>
        <h2 className="h-display" style={{ fontSize: '1.8rem' }}>Send a note</h2>
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          type="tel"
          placeholder="WhatsApp number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <textarea
          placeholder="Colour, occasion, blouse stitch — tell us how you want to wear it."
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
        <button className="btn btn-gold btn-block" type="submit">
          Open WhatsApp with this note
        </button>
        {sent && (
          <p className="note">
            WhatsApp should have opened with your message. If it did not, message @{SHOP.instagram}.
          </p>
        )}
      </form>

      <img
        src="/images/hero/folded-stack.jpg"
        alt="Folded Ilkal sarees"
        style={{ marginTop: 28, borderRadius: 18, width: '100%', maxHeight: 320, objectFit: 'cover' }}
      />
    </div>
  )
}
