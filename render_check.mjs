import { createServer } from 'vite'
const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa', logLevel: 'silent' })
try {
  const mod = await vite.ssrLoadModule('/src/data/shop.js')
  console.log('SSR-loaded PRODUCTS count:', mod.PRODUCTS.length)
  console.log('first 5 ids:', mod.PRODUCTS.slice(0, 5).map((p) => p.id).join(', '))
} catch (e) {
  console.log('SSR LOAD ERROR:', e.message)
} finally {
  await vite.close()
}
