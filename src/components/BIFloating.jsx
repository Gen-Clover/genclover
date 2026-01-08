import { motion } from 'framer-motion'
import { BarChart3, PieChart, TrendingUp, FileText, LineChart, Activity } from 'lucide-react'

const BIFloating = () => {
  const elements = [
    { icon: BarChart3, delay: 0, x: '11%', y: '22%', color: 'text-green-500/40' },
    { icon: PieChart, delay: 0.5, x: '89%', y: '26%', color: 'text-green-500/40' },
    { icon: TrendingUp, delay: 1, x: '17%', y: '73%', color: 'text-green-500/40' },
    { icon: FileText, delay: 1.5, x: '83%', y: '69%', color: 'text-green-500/40' },
    { icon: LineChart, delay: 2, x: '51%', y: '10%', color: 'text-green-500/40' },
    { icon: Activity, delay: 2.5, x: '6%', y: '51%', color: 'text-green-500/40' },
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
                className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
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

export default BIFloating

