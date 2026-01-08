import { motion } from 'framer-motion'
import { Bot, MessageSquare, Sparkles, Zap, Brain, Cpu } from 'lucide-react'

const AIBotsFloating = () => {
  const elements = [
    { icon: Bot, delay: 0, x: '10%', y: '15%', color: 'text-red-500/40' },
    { icon: MessageSquare, delay: 0.5, x: '85%', y: '25%', color: 'text-red-500/40' },
    { icon: Sparkles, delay: 1, x: '20%', y: '70%', color: 'text-red-500/40' },
    { icon: Zap, delay: 1.5, x: '80%', y: '65%', color: 'text-red-500/40' },
    { icon: Brain, delay: 2, x: '50%', y: '10%', color: 'text-red-500/40' },
    { icon: Cpu, delay: 2.5, x: '5%', y: '50%', color: 'text-red-500/40' },
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
                className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
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

export default AIBotsFloating

