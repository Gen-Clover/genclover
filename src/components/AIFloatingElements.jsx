import { motion } from 'framer-motion'
import { Brain, Zap, Sparkles, Cpu } from 'lucide-react'

const AIFloatingElements = () => {
  const elements = [
    { icon: Brain, delay: 0, x: '10%', y: '20%' },
    { icon: Zap, delay: 0.5, x: '80%', y: '30%' },
    { icon: Sparkles, delay: 1, x: '20%', y: '70%' },
    { icon: Cpu, delay: 1.5, x: '75%', y: '75%' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => {
        const Icon = element.icon
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: element.x,
              top: element.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              delay: element.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="relative">
              <Icon className="w-8 h-8 text-red-500/40" />
              <motion.div
                className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default AIFloatingElements

