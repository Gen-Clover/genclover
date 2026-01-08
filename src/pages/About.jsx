import { motion } from 'framer-motion'
import { Target, Users, Award, Zap } from 'lucide-react'
import ServiceBackground from '../components/ServiceBackground'
import AboutFloating from '../components/AboutFloating'

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description:
        'We focus on solving real problems and delivering meaningful outcomes, not just features.',
    },
    {
      icon: Users,
      title: 'Transparency & Ownership',
      description:
        'We believe in honest communication, clear expectations, and taking full responsibility for what we build.',
    },
    {
      icon: Award,
      title: 'Excellence by Design',
      description:
        'From architecture to execution, we maintain high standards in quality, security, and performance.',
    },
    {
      icon: Zap,
      title: 'Continuous Learning & Innovation',
      description:
        'Technology evolves fast and so do we. We continuously learn, adapt, and adopt better ways of building solutions.',
    },
  ]

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <ServiceBackground color="red" />
        <AboutFloating />
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-red-500/20 rounded-full filter blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/20 rounded-full filter blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="gradient-text">GenClover</span>
            </h1>
            <p className="text-xl text-white/70">
              GenClover is a technology-driven team focused on building intelligent, scalable, and future-ready digital solutions. We believe technology should not just function. It should create clarity, efficiency, and long-term value for businesses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 relative">
        {/* Subtle background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 right-1/4 w-72 h-72 bg-red-500/10 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-red-600/10 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Our Vision
              </h2>
              <p className="text-lg text-white/70 mb-8">
                Our vision is to empower organizations by simplifying complexity through data, analytics, and modern digital experiences.
              </p>

              <h2 className="text-4xl font-bold mb-6 text-white mt-12">
                Our Story
              </h2>
              <p className="text-lg text-white/70 mb-6">
                GenClover was born from a shared belief: data and technology, when used thoughtfully, can transform how businesses operate and grow.
              </p>
              <p className="text-lg text-white/70 mb-6">
                What started as a group of passionate technologists with strong foundations in data, analytics, and engineering has evolved into a focused team building real-world solutions across multiple problem domains. Rather than chasing volume, we prioritize quality, learning, and impact in everything we build.
              </p>
              <p className="text-lg text-white/70 mb-6">
                We work at the intersection of data platforms, intelligent analytics, AI-driven solutions, and web technologies, translating complex requirements into practical, scalable systems. Our approach blends deep technical expertise with a strong understanding of business workflows, ensuring solutions are not just technically sound, but genuinely useful.
              </p>
              <p className="text-lg text-white/70 mb-8">
                With over 50+ projects and use cases delivered, we continue to refine our craft, strengthen our processes, and push boundaries with modern technologies. Guided by our long-term vision rather than short-term metrics.
              </p>

              <h2 className="text-4xl font-bold mb-6 text-white mt-12">
                What We Focus On
              </h2>
              <div className="space-y-4 mb-8">
                <p className="text-lg text-white/70">
                  <strong className="text-white">Data Engineering & Platforms</strong> - Building reliable, scalable data foundations
                </p>
                <p className="text-lg text-white/70">
                  <strong className="text-white">Advanced Analytics & AI</strong> - Turning data into insights and intelligent decision systems
                </p>
                <p className="text-lg text-white/70">
                  <strong className="text-white">Web & Digital Experiences</strong> - Creating clean, functional, and scalable digital products
                </p>
              </div>

              <p className="text-lg text-white/80 font-medium italic mt-8">
                At GenClover, we're not just building solutions for today—we're shaping systems that are ready for tomorrow.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-black/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-xl text-white/70">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {value.title}
                  </h3>
                  <p className="text-white/70">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}

export default About

