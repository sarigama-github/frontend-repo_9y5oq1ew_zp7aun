import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { apiGet, apiPost } from '../utils/api'

export function ProductReveal() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await apiGet('/api/products')
        if (mounted) setItems(data)
      } catch (e) {
        // Try seeding then reload
        try {
          await apiPost('/api/seed', { force: true })
          const data = await apiGet('/api/products')
          if (mounted) setItems(data)
        } catch (e2) {
          console.error(e2)
        }
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const addToCart = (p) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({ product_slug: p.slug, qty: 1, size: 'L', color: p.colors?.[0] })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart')
  }

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-400">Loading collection…</div>
    )
  }

  return (
    <section className="px-6 md:px-10 max-w-7xl mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(p => (
        <ProductCard key={p.slug} product={p} onAdd={addToCart} />
      ))}
    </section>
  )
}

export function Policies() {
  const [data, setData] = useState(null)
  useEffect(() => { apiGet('/api/policies').then(setData) }, [])
  if (!data) return null
  return (
    <section className="px-6 md:px-10 max-w-5xl mx-auto py-16 text-neutral-300 space-y-6">
      <h2 className="text-white text-2xl font-bold">Policies</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(data).map(([k, v]) => (
          <div key={k} className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
            <div className="uppercase tracking-wider text-xs text-neutral-500">{k}</div>
            <div className="text-neutral-300 mt-2">{v}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
