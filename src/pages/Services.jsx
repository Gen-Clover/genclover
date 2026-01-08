import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Database, Brain, Globe, BarChart3, Bot, ArrowRight } from 'lucide-react'

const Services = () => {
  const services = [
    {
      path: '/services/bi-solutions',
      icon: BarChart3,
      title: 'Business Intelligence & Insights',
      description:
        "We help businesses make better decisions by turning data into clear, meaningful insights. Our BI solutions focus on visibility, reporting, and performance tracking. So leaders can understand what's happening and act with confidence.",
      color: 'from-green-500 to-green-600',
    },
    {
      path: '/services/ai-bots',
      icon: Bot,
      title: 'AI Assistants (bots)',
      description:
        'We design AI-powered assistants that help automate tasks, improve customer interactions, and support internal teams. These solutions are built to be practical, reliable, and aligned with real business needs.',
      color: 'from-red-500 to-red-600',
    },
    {
      path: '/services/data-science',
      icon: Brain,
      title: 'Artificial Intelligence & Analytics',
      description:
        'We use advanced analytics and AI models to uncover patterns, predict outcomes, and support smarter business strategies. Our focus is on solving real problems and enabling better planning.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      path: '/services/data-engineering',
      icon: Database,
      title: 'Data Platforms & Engineering',
      description:
        'We build strong data foundations that ensure your information is reliable, accessible, and ready to scale. Our data platforms are designed to support analytics, AI, and reporting.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      path: '/services/web-development',
      icon: Globe,
      title: 'Web & Digital Experiences',
      description:
        'We create modern websites and digital platforms that reflect your brand, communicate clearly, and support business growth. Our focus is on thoughtful design, usability, and performance.',
      color: 'from-orange-500 to-orange-600',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-white/70">
              Comprehensive IT solutions designed to transform your business and drive growth
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.path}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group relative bg-black/40 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
                >
                  <Link to={service.path} className="block">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                    />
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-8 h-8 text-white relative z-10" />
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0, 0.5, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-red-400 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-white/70 mb-6">{service.description}</p>
                    <div className="flex items-center text-red-500 font-semibold group-hover:text-red-400 transition-colors">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services

