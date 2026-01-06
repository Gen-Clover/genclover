import { motion } from 'framer-motion'
import { Award, Shield, Clock, Users } from 'lucide-react'

const AnimatedBadge = ({ icon: Icon, label, value, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 text-center group"
    >
      <motion.div
        className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.div>
      <motion.div
        className="text-3xl font-bold text-red-500 mb-2"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.2, type: 'spring' }}
      >
        {value}
      </motion.div>
      <div className="text-white/70 text-sm">{label}</div>
    </motion.div>
  )
}

export default AnimatedBadge

