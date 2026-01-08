import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, PieChart, FileText, CheckCircle, ArrowRight, Database, Zap } from 'lucide-react'
import ServiceBackground from '../components/ServiceBackground'
import BIFloating from '../components/BIFloating'

const BISolutions = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Interactive Dashboards',
      description: 'Create powerful, interactive dashboards that provide real-time insights into your business performance.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Leverage advanced analytics to identify trends, patterns, and opportunities in your data.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: PieChart,
      title: 'Data Visualization',
      description: 'Transform complex data into clear, actionable visualizations that drive decision-making.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: FileText,
      title: 'Custom Reports',
      description: 'Generate automated, customizable reports tailored to your business needs and schedule.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Database,
      title: 'Data Integration',
      description: 'Connect multiple data sources and create a unified view of your business information.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Zap,
      title: 'Real-time Monitoring',
      description: 'Monitor key performance indicators in real-time and receive alerts for critical events.',
      color: 'from-yellow-500 to-yellow-600',
    },
  ]

  const services = [
    'Executive dashboards & reports',
    'Business performance tracking',
    'Data-driven decision support',
    'Custom insights tailored to your goals',
  ]

  const tools = [
    { name: 'Power BI', description: 'Microsoft Power BI for comprehensive business intelligence' },
    { name: 'Tableau', description: 'Advanced analytics and visualization platform' },
    { name: 'Qlik Sense', description: 'Self-service data visualization and discovery' },
    { name: 'Looker', description: 'Modern BI platform with embedded analytics' },
    { name: 'Apache Superset', description: 'Open-source data visualization platform' },
    { name: 'Metabase', description: 'Simple and powerful business intelligence tool' },
  ]

  const process = [
    {
      step: '01',
      title: 'Business Needs Analysis',
      description: 'We analyze your business goals, key performance indicators, and decision-making requirements to understand what insights you need.',
    },
    {
      step: '02',
      title: 'Data Integration & Preparation',
      description: 'Connect and prepare your data sources to ensure clean, reliable information is available for reporting and analysis.',
    },
    {
      step: '03',
      title: 'Insights & Dashboard Creation',
      description: 'Build executive dashboards, reports, and visualizations that turn your data into clear, actionable business insights.',
    },
    {
      step: '04',
      title: 'Deployment & Enablement',
      description: 'Deploy your BI solution and train your team to use insights effectively for confident decision-making.',
    },
  ]

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <ServiceBackground color="green" />
        <BIFloating />
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-green-500/20 rounded-full filter blur-3xl"
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
            className="absolute bottom-20 right-10 w-96 h-96 bg-green-600/20 rounded-full filter blur-3xl"
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
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Business Intelligence <span className="gradient-text">& Insights</span>
            </h1>
            <p className="text-xl text-white/70">
              We help businesses make better decisions by turning data into clear, meaningful insights. Our BI solutions focus on visibility, reporting, and performance tracking. So leaders can understand what&apos;s happening and act with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
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
              Our <span className="gradient-text">Capabilities</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Comprehensive BI solutions designed to empower your business decisions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-red-500/20"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
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
                End-to-end BI solutions to help you unlock the full potential of your data
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
              <h3 className="text-2xl font-bold mb-6 text-white">What We Deliver</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{service}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
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
              BI <span className="gradient-text">Platforms</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              We work with leading BI tools to deliver the best solutions for your business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-colors"
              >
                <h3 className="text-xl font-bold mb-2 text-white">{tool.name}</h3>
                <p className="text-white/70 text-sm">{tool.description}</p>
              </motion.div>
            ))}
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
              A proven methodology for successful BI implementation
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
    </div>
  )
}

export default BISolutions

