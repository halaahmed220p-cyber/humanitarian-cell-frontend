import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function ProgressBar({ progress, color }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-5">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${progress}%` } : { width: 0 }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  )
}