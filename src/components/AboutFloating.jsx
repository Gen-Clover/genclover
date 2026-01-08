import { motion } from 'framer-motion'
import { BookOpen, Users, Eye, Handshake, Heart, TrendingUp, Sparkles, Building2 } from 'lucide-react'

const AboutFloating = () => {
  const elements = [
    { icon: BookOpen, delay: 0, x: '8%', y: '15%', color: 'text-red-500/40', label: 'Story' },
    { icon: Users, delay: 0.5, x: '90%', y: '25%', color: 'text-red-500/40', label: 'Clients' },
    { icon: Eye, delay: 1, x: '12%', y: '75%', color: 'text-red-500/40', label: 'Vision' },
    { icon: Handshake, delay: 1.5, x: '88%', y: '70%', color: 'text-red-500/40', label: 'Partnership' },
    { icon: Heart, delay: 2, x: '50%', y: '8%', color: 'text-red-500/40', label: 'Care' },
    { icon: TrendingUp, delay: 2.5, x: '3%', y: '50%', color: 'text-red-500/40', label: 'Growth' },
    { icon: Sparkles, delay: 3, x: '95%', y: '55%', color: 'text-red-500/40', label: 'Innovation' },
    { icon: Building2, delay: 3.5, x: '50%', y: '90%', color: 'text-red-500/40', label: 'Business' },
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
              opacity: [0.15, 0.4, 0.15],
              scale: [1, 1.2, 1],
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6,
              delay: element.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="relative">
              <Icon className={`w-10 h-10 ${element.color}`} />
              <motion.div
                className="absolute inset-0 bg-red-500/15 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4,
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

export default AboutFloating

