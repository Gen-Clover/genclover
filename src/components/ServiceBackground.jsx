import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const ServiceBackground = ({ color = 'red' }) => {
  const [particles, setParticles] = useState([])
  const colorMap = {
    red: 'bg-red-500/30',
    blue: 'bg-blue-500/30',
    purple: 'bg-purple-500/30',
    green: 'bg-green-500/30',
    orange: 'bg-orange-500/30',
  }

  useEffect(() => {
    const particleCount = 40
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${colorMap[color] || colorMap.red}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default ServiceBackground

