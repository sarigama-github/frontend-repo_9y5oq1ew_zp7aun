import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './components/Logo'
import Hero from './components/Hero'
import { ProductReveal, Policies } from './components/Sections'
import { apiPost } from './utils/api'

function Nav({ page, setPage }) {
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'collection', label: 'Collection' },
    { key: 'shop', label: 'Shop' },
    { key: 'cart', label: 'Cart' },
  ]
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="text-neutral-400 text-xs uppercase tracking-widest">Slug’sEra</div>
        <div className="flex gap-4">
          {items.map(item => (
            <button key={item.key} onClick={() => setPage(item.key)} className={`text-sm px-3 py-1 rounded-lg transition-colors ${page===item.key?'bg-red-600 text-white':'text-neutral-300 hover:text-white hover:bg-blue-950/50'}`}>{item.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Collection() {
  return (
    <div>
      <ProductReveal/>
    </div>
  )
}

function Shop() {
  return (
    <div className="px-6 md:px-10 max-w-7xl mx-auto py-10 text-neutral-300">
      <div className="mb-6 flex flex-wrap gap-3">
        <select className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2">
          <option>All colors</option>
          <option>red</option>
          <option>off-white</option>
          <option>black</option>
          <option>coffee-brown</option>
        </select>
        <select className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2">
          <option>All designs</option>
          <option>plain</option>
          <option>graphic</option>
          <option>embroidery</option>
        </select>
      </div>
      <ProductReveal/>
    </div>
  )
}

function Cart() {
  const [summary, setSummary] = useState(null)
  const [code, setCode] = useState('')
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')

  const recalc = async () => {
    const res = await fetch((import.meta.env.VITE_BACKEND_URL||'') + '/api/calc', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart, discount_code: code, country: 'IN' })
    })
    const data = await res.json()
    setSummary(data)
  }

  return (
    <div className="px-6 md:px-10 max-w-5xl mx-auto py-10 text-neutral-300">
      <h2 className="text-white text-2xl font-bold mb-4">Cart</h2>
      {cart.length===0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {cart.map((it, idx) => (
            <div key={idx} className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-white font-semibold">{it.product_slug}</div>
                <div className="text-xs text-neutral-500">Size {it.size} / {it.color} / Qty {it.qty}</div>
              </div>
            </div>
          ))}
          <div className="flex gap-2 items-center">
            <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Discount code" className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2" />
            <button onClick={recalc} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white">Apply</button>
          </div>
          {summary && (
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
              <div className="flex justify-between text-neutral-400"><span>Subtotal</span><span>${summary.subtotal}</span></div>
              <div className="flex justify-between text-neutral-400"><span>Discount</span><span>-${summary.discount}</span></div>
              <div className="flex justify-between text-neutral-400"><span>Shipping</span><span>${summary.shipping}</span></div>
              <div className="flex justify-between text-neutral-400"><span>Tax</span><span>${summary.tax}</span></div>
              <div className="flex justify-between text-white font-semibold mt-2 text-lg"><span>Total</span><span>${summary.total}</span></div>
              <a href="#checkout" className="inline-block mt-4 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-blue-100">Proceed to Checkout</a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Checkout() {
  const [placed, setPlaced] = useState(null)
  const [form, setForm] = useState({ full_name:'', phone:'', line1:'', city:'', state:'', postal_code:'', country:'IN' })
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')

  const place = async () => {
    const payload = {
      guest: true,
      items: cart,
      address: form,
      payment_method: 'COD',
      subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0
    }
    const res = await fetch((import.meta.env.VITE_BACKEND_URL||'') + '/api/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const data = await res.json()
    setPlaced(data)
    localStorage.removeItem('cart')
  }

  return (
    <div id="checkout" className="px-6 md:px-10 max-w-5xl mx-auto py-10 text-neutral-300">
      <h2 className="text-white text-2xl font-bold mb-4">Checkout</h2>
      {placed ? (
        <div className="bg-green-900/20 border border-green-800 rounded-xl p-4 text-green-200">Thank you! Order ID: {placed.order_id}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {['full_name','phone','line1','city','state','postal_code','country'].map(k => (
              <input key={k} value={form[k]||''} onChange={e=>setForm({...form, [k]: e.target.value})} placeholder={k.replace('_',' ').toUpperCase()} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2" />
            ))}
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
            <div className="text-neutral-400">Payment</div>
            <div className="mt-2 flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white">COD</button>
              <button disabled className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-500 cursor-not-allowed">Prepaid (coming soon)</button>
            </div>
            <button onClick={place} className="mt-6 w-full px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-blue-100">Place Order</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Home() {
  return (
    <div>
      <Hero/>
      <ProductReveal/>
      <Policies/>
    </div>
  )
}

function App() {
  const [page, setPage] = useState('home')
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav page={page} setPage={setPage} />
      <Logo/>
      <AnimatePresence mode="wait">
        {page === 'home' && (
          <motion.div key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <Home/>
          </motion.div>
        )}
        {page === 'collection' && (
          <motion.div key="collection" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <Collection/>
          </motion.div>
        )}
        {page === 'shop' && (
          <motion.div key="shop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <Shop/>
          </motion.div>
        )}
        {page === 'cart' && (
          <motion.div key="cart" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <Cart/>
            <Checkout/>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="mt-10 py-8 text-center text-neutral-600 text-sm">© {new Date().getFullYear()} Slug’sEra. All rights reserved.</footer>
    </div>
  )
}

export default App
