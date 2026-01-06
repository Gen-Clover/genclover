import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Database, Brain, Globe, ArrowRight } from 'lucide-react'

const ServicesSection = () => {
  const services = [
    {
      icon: Database,
      title: 'Data Engineering',
      description:
        'Build robust data pipelines, ETL processes, and data warehouses that scale with your business needs.',
      features: [
        'Data Pipeline Design',
        'ETL/ELT Processes',
        'Data Warehousing',
        'Real-time Data Processing',
      ],
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Brain,
      title: 'Data Science',
      description:
        'Leverage machine learning and AI to extract valuable insights from your data and make data-driven decisions.',
      features: [
        'Machine Learning Models',
        'Predictive Analytics',
        'Data Visualization',
        'AI Solutions',
      ],
      color: 'from-red-600 to-red-700',
    },
    {
      icon: Globe,
      title: 'Website Development',
      description:
        'Create stunning, responsive websites and web applications that engage users and drive conversions.',
      features: [
        'Custom Web Development',
        'Responsive Design',
        'E-commerce Solutions',
        'Performance Optimization',
      ],
      color: 'from-red-500 to-red-600',
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
    <section id="services" className="py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Comprehensive IT solutions that take your business to the next level
          </p>
        </motion.div>

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
                key={service.title}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative bg-black/40 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-500/20"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                />
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {service.title}
                </h3>
                <p className="text-white/70 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-white/70">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/services"
                  className="inline-flex items-center text-red-500 font-semibold group-hover:text-red-400 transition-colors"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesSection

