import { motion } from 'framer-motion'
import { Globe, Code, Smartphone, ShoppingCart, Zap, CheckCircle, ArrowRight, Palette, Server, Shield } from 'lucide-react'
import ServiceBackground from '../components/ServiceBackground'
import WebDevFloating from '../components/WebDevFloating'

const WebDevelopment = () => {
  const services = [
    {
      icon: Globe,
      title: 'Custom Web Applications',
      description: 'Build scalable, high-performance web applications tailored to your business needs.',
      features: [
        'Full-Stack Development',
        'API Development & Integration',
        'Database Design & Optimization',
        'Third-party Integrations',
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Smartphone,
      title: 'Responsive Web Design',
      description: 'Create beautiful, mobile-first websites that work seamlessly across all devices.',
      features: [
        'Mobile-First Approach',
        'Cross-Browser Compatibility',
        'Touch-Friendly Interfaces',
        'Progressive Web Apps (PWA)',
      ],
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce Solutions',
      description: 'Build powerful online stores with secure payment processing and inventory management.',
      features: [
        'Shopping Cart Integration',
        'Payment Gateway Setup',
        'Inventory Management',
        'Order Processing System',
      ],
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Code,
      title: 'Content Management Systems',
      description: 'Customizable CMS solutions that make content management easy and intuitive.',
      features: [
        'Custom CMS Development',
        'WordPress Development',
        'Headless CMS Implementation',
        'Content Workflow Automation',
      ],
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Optimize your website for speed, SEO, and user experience to drive conversions.',
      features: [
        'Page Speed Optimization',
        'SEO Optimization',
        'Image & Asset Optimization',
        'Caching Strategies',
      ],
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Shield,
      title: 'Security & Maintenance',
      description: 'Ensure your website is secure, up-to-date, and running smoothly at all times.',
      features: [
        'Security Audits & Hardening',
        'SSL Certificate Setup',
        'Regular Updates & Patches',
        '24/7 Monitoring & Support',
      ],
      color: 'from-red-500 to-red-600',
    },
  ]

  const technologies = [
    { category: 'Frontend', items: ['React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'PHP', 'Java', '.NET', 'Ruby on Rails'] },
    { category: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase'] },
    { category: 'Cloud & DevOps', items: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD'] },
  ]

  const process = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We analyze your requirements, target audience, and goals to create a comprehensive project plan.',
    },
    {
      step: '02',
      title: 'Design & Prototyping',
      description: 'Create wireframes and prototypes to visualize the user experience before development begins.',
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'Build your website using best practices, with continuous testing to ensure quality and performance.',
    },
    {
      step: '04',
      title: 'Launch & Support',
      description: 'Deploy your website and provide ongoing maintenance and support to ensure continued success.',
    },
  ]

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <ServiceBackground color="orange" />
        <WebDevFloating />
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-orange-500/20 rounded-full filter blur-3xl"
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
            className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/20 rounded-full filter blur-3xl"
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
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Web & Digital <span className="gradient-text">Experiences</span>
            </h1>
            <p className="text-xl text-white/70">
              We create modern websites and digital platforms that reflect your brand, communicate clearly, and support business growth. Our focus is on thoughtful design, usability, and performance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
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
              Comprehensive web development solutions for businesses of all sizes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-red-500/20"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                  <p className="text-white/70 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What We Deliver Section */}
      <section className="py-20 bg-black/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What We <span className="gradient-text">Deliver</span>
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Comprehensive web and digital solutions tailored to your business needs
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Our Deliverables</h3>
              <div className="space-y-4">
                {[
                  'Business & portfolio websites',
                  'Custom web platforms',
                  'User-focused design & experiences',
                  'Performance and usability optimization',
                ].map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Technologies We <span className="gradient-text">Use</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Modern, proven technologies to build robust and scalable solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20"
              >
                <h3 className="text-2xl font-bold mb-6 text-white">{tech.category}</h3>
                <ul className="space-y-3">
                  {tech.items.map((item) => (
                    <li key={item} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
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
              A structured approach to delivering successful web projects
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
                <div className="text-5xl font-bold text-red-500 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Your <span className="gradient-text">Website?</span>
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Let's discuss your project and create a solution that drives results
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg flex items-center space-x-2 mx-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default WebDevelopment

