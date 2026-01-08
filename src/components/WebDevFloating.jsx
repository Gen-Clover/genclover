import { motion } from 'framer-motion'
import { Code, Globe, Layout, Zap, Monitor, Terminal } from 'lucide-react'

const WebDevFloating = () => {
  const elements = [
    { icon: Code, delay: 0, x: '8%', y: '20%', color: 'text-orange-500/40' },
    { icon: Globe, delay: 0.5, x: '88%', y: '30%', color: 'text-orange-500/40' },
    { icon: Layout, delay: 1, x: '15%', y: '75%', color: 'text-orange-500/40' },
    { icon: Zap, delay: 1.5, x: '82%', y: '70%', color: 'text-orange-500/40' },
    { icon: Monitor, delay: 2, x: '50%', y: '5%', color: 'text-orange-500/40' },
    { icon: Terminal, delay: 2.5, x: '3%', y: '55%', color: 'text-orange-500/40' },
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
              y: [0, -25, 0],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 5,
              delay: element.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="relative">
              <Icon className={`w-10 h-10 ${element.color}`} />
              <motion.div
                className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.8, 1],
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

export default WebDevFloating

