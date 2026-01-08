import { motion } from 'framer-motion'
import { Database, GitBranch, Cloud, Zap, Settings, Server } from 'lucide-react'

const DataEngineeringFloating = () => {
  const elements = [
    { icon: Database, delay: 0, x: '10%', y: '20%', color: 'text-blue-500/40' },
    { icon: GitBranch, delay: 0.5, x: '86%', y: '32%', color: 'text-blue-500/40' },
    { icon: Cloud, delay: 1, x: '16%', y: '74%', color: 'text-blue-500/40' },
    { icon: Zap, delay: 1.5, x: '84%', y: '66%', color: 'text-blue-500/40' },
    { icon: Settings, delay: 2, x: '48%', y: '12%', color: 'text-blue-500/40' },
    { icon: Server, delay: 2.5, x: '5%', y: '54%', color: 'text-blue-500/40' },
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
                className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
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

export default DataEngineeringFloating

