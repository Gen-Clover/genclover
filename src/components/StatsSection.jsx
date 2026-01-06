import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const StatsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const stats = [
    { value: '50+', label: 'Projects Completed', suffix: '' },
    { value: '30+', label: 'Happy Clients', suffix: '' },
    { value: '95%', label: 'Client Satisfaction', suffix: '' },
    { value: '24/7', label: 'Support Available', suffix: '' },
  ]

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-red-600 to-red-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by Leading Businesses
          </h2>
          <p className="text-xl text-white/90">
            Numbers that speak for themselves
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                className="text-5xl md:text-6xl font-bold mb-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        scale: [0, 1.2, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                {stat.value}
                {stat.suffix}
              </motion.div>
              <div className="text-white/80 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection

