import { useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { Icon } from './Icons.jsx'

export function displayNumber(wa) {
  const d = String(wa || '').replace(/\D/g, '')
  if (d.length === 12 && d.startsWith('91')) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`
  return d ? '+' + d : '—'
}

export default function WhatsAppSheet() {
  const { waPrompt, closeWhatsApp, shopCfg } = useStore()
  const [copied, setCopied] = useState(false)
  if (!waPrompt) return null

  const number = displayNumber(shopCfg.whatsapp)
  const link = `https://wa.me/${shopCfg.whatsapp}?text=${encodeURIComponent(waPrompt.text || '')}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(number)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* older browsers — number is selectable on screen */
    }
  }

  return (
    <div className="wa-sheet" onClick={closeWhatsApp}>
      <div className="wa-panel" onClick={(e) => e.stopPropagation()}>
        <button className="wa-close" onClick={closeWhatsApp} aria-label="Close">
          ✕
        </button>
        <span className="kicker" style={{ color: '#128C4A' }}>
          {waPrompt.title || 'Chat with the shop'}
        </span>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', margin: '6px 0 2px' }}>
          Our WhatsApp number
        </h3>
        <p className="muted" style={{ fontSize: '0.85rem' }}>
          You will be chatting with the shop admin at
        </p>

        <div className="wa-number">{number}</div>

        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          <a className="btn btn-wa btn-block" href={link} target="_blank" rel="noreferrer">
            <Icon.wa style={{ width: 18, height: 18 }} /> Open WhatsApp chat
          </a>
          <button className="btn btn-ghost btn-block" onClick={copy} style={{ color: 'var(--royal)' }}>
            {copied ? 'Number copied ✓' : 'Copy number'}
          </button>
          <p className="note" style={{ textAlign: 'center', margin: 0 }}>
            WhatsApp opens with your message already written — just press send.
          </p>
        </div>
      </div>
    </div>
  )
}
