import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useState, useEffect } from 'react'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: 'Michael Thompson',
      role: 'CEO, TechFlow Solutions',
      location: 'San Francisco, CA',
      company: 'TechFlow Solutions',
      rating: 5,
      text: 'GenClover transformed our data infrastructure completely. Their AI-powered solutions helped us reduce operational costs by 40% and improved our decision-making process significantly. Highly professional team!',
      highlight: '40% Cost Reduction',
    },
    {
      name: 'Sarah Martinez',
      role: 'CTO, DataDrive Inc.',
      location: 'New York, NY',
      company: 'DataDrive Inc.',
      rating: 5,
      text: 'Working with GenClover has been exceptional. Their data engineering team built a robust pipeline that processes millions of records daily. The website they created for us increased our leads by 60%.',
      highlight: '60% Lead Increase',
    },
    {
      name: 'David Chen',
      role: 'Founder, CloudScale Ventures',
      location: 'Austin, TX',
      company: 'CloudScale Ventures',
      rating: 5,
      text: 'The machine learning models developed by GenClover have revolutionized our customer experience. Their attention to detail and commitment to excellence is unmatched. Best investment we made!',
      highlight: 'Revolutionary ML Models',
    },
    {
      name: 'Emily Rodriguez',
      role: 'VP of Operations, InnovateCorp',
      location: 'Seattle, WA',
      company: 'InnovateCorp',
      rating: 5,
      text: 'GenClover delivered beyond our expectations. Their team is responsive, professional, and truly understands business needs. The automation solutions they implemented saved us 20+ hours per week.',
      highlight: '20+ Hours Saved Weekly',
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <Quote className="w-12 h-12 text-red-500" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Trusted by <span className="gradient-text">US Companies</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            See what American businesses are saying about working with GenClover
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative h-96">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: currentIndex === index ? 1 : 0,
                  x: currentIndex === index ? 0 : 100,
                  scale: currentIndex === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 ${
                  currentIndex === index ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <div className="bg-black/60 backdrop-blur-lg border border-red-500/20 rounded-3xl p-8 md:p-12 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="w-5 h-5 fill-red-500 text-red-500" />
                      </motion.div>
                    ))}
                  </div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl text-white/90 mb-6 flex-grow italic"
                  >
                    "{testimonial.text}"
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4 pt-6 border-t border-red-500/20"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center border-2 border-red-500/50">
                      <span className="text-white font-bold text-xl">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                      <p className="text-red-400">{testimonial.role}</p>
                      <p className="text-white/60 text-sm">{testimonial.location}</p>
                    </div>
                    <motion.div
                      className="ml-auto px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-red-400 font-semibold text-sm">
                        {testimonial.highlight}
                      </span>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index
                    ? 'bg-red-500 w-8'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'US-Based Clients', value: '30+' },
              { label: 'Satisfaction Rate', value: '98%' },
              { label: 'Response Time', value: '<24hrs' },
              { label: 'Support Available', value: '24/7' },
            ].map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-red-500 mb-2">{badge.value}</div>
                <div className="text-white/70 text-sm">{badge.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials

