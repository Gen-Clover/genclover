import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Database, Brain, Globe, BarChart3, Bot, ArrowRight } from 'lucide-react'

const ServicesSection = () => {
  const services = [
    {
      icon: BarChart3,
      title: 'Business Intelligence & Insights',
      path: '/services/bi-solutions',
      description:
        "We help businesses make better decisions by turning data into clear, meaningful insights. Our BI solutions focus on visibility, reporting, and performance tracking. So leaders can understand what's happening and act with confidence.",
      features: [
        'Executive Dashboards & Reports',
        'Business Performance Tracking',
        'Data-Driven Decision Support',
        'Custom Insights',
      ],
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Bot,
      title: 'AI Assistants (bots)',
      path: '/services/ai-bots',
      description:
        'We design AI-powered assistants that help automate tasks, improve customer interactions, and support internal teams. These solutions are built to be practical, reliable, and aligned with real business needs.',
      features: [
        'AI Assistants & Virtual Agents',
        'Process Automation',
        'Customer Support Solutions',
        'Intelligent Systems',
      ],
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Brain,
      title: 'Artificial Intelligence & Analytics',
      path: '/services/data-science',
      description:
        'We use advanced analytics and AI models to uncover patterns, predict outcomes, and support smarter business strategies. Our focus is on solving real problems and enabling better planning.',
      features: [
        'Predictive Solutions',
        'Advanced Analytics',
        'AI-Driven Insights',
        'Data-Backed Strategy',
      ],
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Database,
      title: 'Data Platforms & Engineering',
      path: '/services/data-engineering',
      description:
        'We build strong data foundations that ensure your information is reliable, accessible, and ready to scale. Our data platforms are designed to support analytics, AI, and reporting.',
      features: [
        'Scalable Data Platforms',
        'Data Integration',
        'Reliable Pipelines',
        'Foundations for Analytics',
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Globe,
      title: 'Web & Digital Experiences',
      path: '/services/web-development',
      description:
        'We create modern websites and digital platforms that reflect your brand, communicate clearly, and support business growth. Our focus is on thoughtful design, usability, and performance.',
      features: [
        'Business Websites',
        'Custom Web Platforms',
        'User-Focused Design',
        'Performance Optimization',
      ],
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
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {service.title}
                </h3>
                <p className="text-white/70 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center text-sm text-white/70"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                      />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <Link
                  to={service.path}
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

