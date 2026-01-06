import { motion } from 'framer-motion'
import { Database, Brain, Globe, CheckCircle, ArrowRight } from 'lucide-react'

const Services = () => {
  const services = [
    {
      id: 'data-engineering',
      icon: Database,
      title: 'Data Engineering',
      description:
        'We design and build robust data infrastructure that enables your business to collect, process, and analyze data at scale.',
      features: [
        'Custom Data Pipeline Development',
        'ETL/ELT Process Design',
        'Data Warehouse Architecture',
        'Real-time Data Streaming',
        'Data Quality & Governance',
        'Cloud Data Solutions (AWS, GCP, Azure)',
        'Database Optimization',
        'Data Integration Services',
      ],
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-black/40 backdrop-blur-sm border border-red-500/20',
    },
    {
      id: 'data-science',
      icon: Brain,
      title: 'Data Science',
      description:
        'Transform your data into actionable insights with advanced analytics, machine learning, and AI solutions.',
      features: [
        'Machine Learning Model Development',
        'Predictive Analytics',
        'Statistical Analysis',
        'Data Visualization & Dashboards',
        'Natural Language Processing',
        'Computer Vision Solutions',
        'Recommendation Systems',
        'AI Strategy Consulting',
      ],
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-black/40 backdrop-blur-sm border border-red-500/20',
    },
    {
      id: 'web-development',
      icon: Globe,
      title: 'Website Development',
      description:
        'Create stunning, high-performance websites and web applications that engage users and drive business growth.',
      features: [
        'Custom Web Application Development',
        'Responsive & Mobile-First Design',
        'E-commerce Solutions',
        'Content Management Systems',
        'API Development & Integration',
        'Performance Optimization',
        'SEO & Digital Marketing',
        'Maintenance & Support',
      ],
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-black/40 backdrop-blur-sm border border-red-500/20',
    },
  ]

  const process = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description:
        'We analyze your requirements and create a comprehensive plan tailored to your business goals.',
    },
    {
      step: '02',
      title: 'Design & Development',
      description:
        'Our team builds your solution using best practices and cutting-edge technologies.',
    },
    {
      step: '03',
      title: 'Testing & Quality Assurance',
      description:
        'Rigorous testing ensures your solution meets the highest standards of quality and performance.',
    },
    {
      step: '04',
      title: 'Deployment & Support',
      description:
        'We deploy your solution and provide ongoing support to ensure continued success.',
    },
  ]

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
              Comprehensive IT solutions designed to transform your business and
              drive growth
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Details */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.id}
                  id={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`${service.bgColor} rounded-3xl p-8 md:p-12`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <div
                        className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6`}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-4xl font-bold mb-4 text-white">
                        {service.title}
                      </h2>
                      <p className="text-xl text-white/70 mb-8">
                        {service.description}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold flex items-center space-x-2"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white">
                        What We Offer
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {service.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-start space-x-3"
                          >
                    <CheckCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              Our <span className="gradient-text">Process</span>
            </h2>
            <p className="text-xl text-white/70">
              A proven methodology that ensures success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-red-500/20"
              >
                <div className="text-5xl font-bold text-red-500 mb-4">
                  {item.step}
                </div>
                      <h3 className="text-2xl font-bold mb-4 text-white">
                  {item.title}
                </h3>
                      <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services

