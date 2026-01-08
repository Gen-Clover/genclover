import { motion } from 'framer-motion'
import { Brain, TrendingUp, BarChart3, Eye, Sparkles, Target } from 'lucide-react'

const DataScienceFloating = () => {
  const elements = [
    { icon: Brain, delay: 0, x: '12%', y: '18%', color: 'text-purple-500/40' },
    { icon: TrendingUp, delay: 0.5, x: '87%', y: '28%', color: 'text-purple-500/40' },
    { icon: BarChart3, delay: 1, x: '18%', y: '72%', color: 'text-purple-500/40' },
    { icon: Eye, delay: 1.5, x: '85%', y: '68%', color: 'text-purple-500/40' },
    { icon: Sparkles, delay: 2, x: '52%', y: '8%', color: 'text-purple-500/40' },
    { icon: Target, delay: 2.5, x: '4%', y: '52%', color: 'text-purple-500/40' },
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
                className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl"
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

export default DataScienceFloating

