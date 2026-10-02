# ILKAL Silk — heritage saree shop

Mobile-first React storefront for Ilkal handloom sarees (royal purple, cream, gold).

## Run

```bash
npm install
npm run dev
```

## Edit shop details

Open `src/data/shop.js`:

- `SHOP.whatsapp` — your number as `91XXXXXXXXXX` (no `+`)
- `SHOP.instagram` — already set to `ilkal.silk.sarees`
- `PRODUCTS` — names, prices, stories, images

Product photos live in `public/images/products/`.

---

## Backend (API + admin desk)

Two servers run together:

```
npm run server   # API on :8080  (orders, enquiries, settings)
npm run dev      # website on :5173 (proxies /api to the API)
```

**Admin desk:** open `/admin` on the site (link in the footer). Default passcode
`ilkal-admin-2026` — change `ADMIN_KEY` in `server/index.js`.

The admin desk shows:
- **Orders** — every bag checkout (id, items, total, customer details). Mark confirmed/sent or delete.
- **Enquiries** — notes from the contact form.
- **Settings** — the **admin WhatsApp number** shown to customers when they tap any
  WhatsApp button (country code, no + or spaces — e.g. `9198451xxxxx`). Saving here is live
  immediately, no code edits.

Data lives in plain JSON files under `server/data/` (`orders.json`, `leads.json`,
`settings.json`) — easy to back-up or move to a real database later.

**API:**
- `GET /api/config` — public shop settings
- `POST /api/orders` — `{name?, phone?, city?, note?, items[]}` → `{id, waText}`
- `POST /api/leads` — contact note
- admin (header `x-admin-key`): `GET /api/admin/stats`, `GET /api/admin/orders`,
  `PATCH /api/admin/orders/:id`, `DELETE /api/admin/orders/:id`, `GET /api/admin/leads`,
  `GET/PUT /api/admin/settings`
