import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { SHOP } from '../data/shop.js'

const StoreContext = createContext(null)
const CART_KEY = 'ilkal-cart-v1'
const WISH_KEY = 'ilkal-wish-v1'

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch {
      return []
    }
  })
  const [wish, setWish] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(WISH_KEY)) || []
    } catch {
      return []
    }
  })
  const [toast, setToast] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  // Live shop settings from the backend (whatsapp number editable in /admin)
  const [shopCfg, setShopCfg] = useState(SHOP)
  // WhatsApp bottom-sheet: { title, text } or null
  const [waPrompt, setWaPrompt] = useState(null)

  useEffect(() => {
    fetch('/api/config')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no config'))))
      .then((cfg) => setShopCfg((prev) => ({ ...prev, ...cfg })))
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(wish))
  }, [wish])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const notify = (message) => setToast({ id: Date.now(), message })

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id)
      if (found) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.thumb || product.image, qty }]
    })
    notify(`${product.name} folded into your bag`)
  }

  const setQty = (id, qty) => {
    setCart((prev) =>
      qty < 1 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
    )
  }

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id))
  const clearCart = () => setCart([])

  const toggleWish = (id) => {
    setWish((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  // Open the WhatsApp sheet (shows the admin number, then continues to wa.me chat)
  const openWhatsApp = (text, title) => setWaPrompt({ text, title })
  const closeWhatsApp = () => setWaPrompt(null)

  const count = cart.reduce((s, i) => s + i.qty, 0)
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const value = useMemo(
    () => ({
      cart,
      wish,
      toast,
      searchOpen,
      setSearchOpen,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      toggleWish,
      notify,
      count,
      subtotal,
      shopCfg,
      waPrompt,
      openWhatsApp,
      closeWhatsApp,
    }),
    [cart, wish, toast, searchOpen, count, subtotal, shopCfg, waPrompt],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
