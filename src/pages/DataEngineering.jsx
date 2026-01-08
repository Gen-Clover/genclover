import { motion } from 'framer-motion'
import { Database, CheckCircle, ArrowRight, Zap, Cloud, GitBranch, Settings, Shield } from 'lucide-react'
import ServiceBackground from '../components/ServiceBackground'
import DataEngineeringFloating from '../components/DataEngineeringFloating'

const DataEngineering = () => {
  const features = [
    {
      icon: Database,
      title: 'Custom Data Pipeline Development',
      description: 'Build scalable data pipelines that process millions of records efficiently.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: GitBranch,
      title: 'ETL/ELT Process Design',
      description: 'Design robust Extract, Transform, Load processes optimized for your data architecture.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Cloud,
      title: 'Data Warehouse Architecture',
      description: 'Design and implement cloud-native data warehouses for optimal performance and scalability.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Zap,
      title: 'Real-time Data Streaming',
      description: 'Implement real-time data streaming solutions using modern technologies like Kafka and Flink.',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Shield,
      title: 'Data Quality & Governance',
      description: 'Ensure data quality and compliance with comprehensive governance frameworks.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Settings,
      title: 'Database Optimization',
      description: 'Optimize database performance, queries, and indexing for maximum efficiency.',
      color: 'from-orange-500 to-orange-600',
    },
  ]

  const services = [
    'Scalable data platforms',
    'Data integration & management',
    'Reliable pipelines and workflows',
    'Foundations for analytics and AI',
  ]

  const technologies = [
    { name: 'Apache Airflow', description: 'Workflow orchestration' },
    { name: 'Apache Kafka', description: 'Real-time data streaming' },
    { name: 'Apache Spark', description: 'Large-scale data processing' },
    { name: 'Snowflake', description: 'Cloud data warehouse' },
    { name: 'AWS Redshift', description: 'Cloud data warehouse' },
    { name: 'Google BigQuery', description: 'Serverless data warehouse' },
    { name: 'dbt', description: 'Data transformation tool' },
    { name: 'PostgreSQL', description: 'Relational database' },
    { name: 'MongoDB', description: 'NoSQL database' },
    { name: 'Docker & Kubernetes', description: 'Containerization & orchestration' },
  ]

  const process = [
    {
      step: '01',
      title: 'Data Assessment',
      description: 'Analyze your current data infrastructure, sources, and requirements to design the optimal solution.',
    },
    {
      step: '02',
      title: 'Architecture Design',
      description: 'Design scalable data architecture that meets your business needs and technical requirements.',
    },
    {
      step: '03',
      title: 'Implementation',
      description: 'Build and deploy data pipelines, warehouses, and infrastructure using best practices.',
    },
    {
      step: '04',
      title: 'Monitoring & Support',
      description: 'Set up monitoring, alerting, and provide ongoing support to ensure optimal performance.',
    },
  ]

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <ServiceBackground color="blue" />
        <DataEngineeringFloating />
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"
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
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl"
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
              <Database className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Data Platforms <span className="gradient-text">& Engineering</span>
            </h1>
            <p className="text-xl text-white/70">
              We build strong data foundations that ensure your information is reliable, accessible, and ready to scale. Our data platforms are designed to support analytics, AI, and reporting.
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
              Comprehensive data engineering solutions for modern businesses
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
                Strong data foundations that ensure your information is reliable, accessible, and ready to scale
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
              Modern, proven technologies for building robust data infrastructure
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-colors text-center"
              >
                <h3 className="text-lg font-bold mb-2 text-white">{tech.name}</h3>
                <p className="text-white/70 text-sm">{tech.description}</p>
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
              A structured approach to data engineering success
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

export default DataEngineering

