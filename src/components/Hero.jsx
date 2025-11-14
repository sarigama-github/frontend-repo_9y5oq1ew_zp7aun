import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.08),transparent_60%)]" />
      <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full blur-3xl opacity-20 bg-blue-900" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full blur-3xl opacity-20 bg-red-900" />

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="relative z-10 px-6">
        <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight">
          Wear Your Companion
        </h1>
        <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">
          420 GSM heavy-weight hoodies in premium cotton fleece. Elevated patchwork, rich embroidery, and timeless silhouettes.
        </p>
      </motion.div>
    </section>
  )
}
