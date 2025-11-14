import { motion } from 'framer-motion'

export default function ProductCard({ product, onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden hover:border-red-700/60 transition-colors"
    >
      <div className="relative aspect-square overflow-hidden">
        <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">{product.title}</h3>
          <div className="text-red-400 font-semibold">${product.price}</div>
        </div>
        <div className="mt-2 text-neutral-400 text-sm line-clamp-2">{product.description}</div>
        <div className="mt-3 flex gap-2">
          {product.colors?.map(c => (
            <span key={c} title={c} className={`w-3 h-3 rounded-full ring-1 ring-neutral-700`} style={{ backgroundColor: c === 'off-white' ? '#f5f5f0' : (c === 'coffee-brown' ? '#6f4e37' : c) }} />
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => onAdd?.(product)} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm transition-colors">Add to Cart</button>
          <a href={`#/product/${product.slug}`} className="px-4 py-2 rounded-lg bg-blue-950/50 text-blue-200 hover:bg-blue-900/60 text-sm transition-colors">Quick View</a>
        </div>
      </div>
    </motion.div>
  )
}
