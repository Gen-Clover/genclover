import { motion } from 'framer-motion'
import { Brain, CheckCircle, ArrowRight, TrendingUp, Eye, MessageSquare, Sparkles, BarChart } from 'lucide-react'
import ServiceBackground from '../components/ServiceBackground'
import DataScienceFloating from '../components/DataScienceFloating'

const DataScience = () => {
  const features = [
    {
      icon: Brain,
      title: 'Machine Learning Models',
      description: 'Develop and deploy machine learning models that solve complex business problems.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics',
      description: 'Build predictive models to forecast trends and make data-driven decisions.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Eye,
      title: 'Computer Vision',
      description: 'Implement computer vision solutions for image and video analysis.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: MessageSquare,
      title: 'Natural Language Processing',
      description: 'Extract insights from text data using advanced NLP techniques and LLMs.',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: BarChart,
      title: 'Data Visualization',
      description: 'Create interactive dashboards and visualizations to communicate insights effectively.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Sparkles,
      title: 'AI Strategy Consulting',
      description: 'Develop comprehensive AI strategies aligned with your business objectives.',
      color: 'from-red-500 to-red-600',
    },
  ]

  const services = [
    'Predictive and forecasting solutions',
    'Advanced business analytics',
    'AI-driven insights and recommendations',
    'Data-backed strategy support',
  ]

  const technologies = [
    { name: 'Python', description: 'Primary language' },
    { name: 'TensorFlow', description: 'Deep learning framework' },
    { name: 'PyTorch', description: 'ML framework' },
    { name: 'Scikit-learn', description: 'Machine learning library' },
    { name: 'Pandas & NumPy', description: 'Data manipulation' },
    { name: 'Jupyter', description: 'Interactive development' },
    { name: 'OpenCV', description: 'Computer vision' },
    { name: 'NLTK & spaCy', description: 'NLP libraries' },
    { name: 'MLflow', description: 'ML lifecycle management' },
    { name: 'Tableau & Power BI', description: 'Data visualization' },
  ]

  const process = [
    {
      step: '01',
      title: 'Problem Definition',
      description: 'Understand your business challenge and define clear objectives for the AI/ML solution.',
    },
    {
      step: '02',
      title: 'Data Exploration & Preparation',
      description: 'Analyze and prepare your data, ensuring quality and relevance for model development.',
    },
    {
      step: '03',
      title: 'Model Development & Training',
      description: 'Build, train, and optimize machine learning models using best practices and state-of-the-art techniques.',
    },
    {
      step: '04',
      title: 'Deployment & Monitoring',
      description: 'Deploy models to production and set up monitoring to ensure continued performance and accuracy.',
    },
  ]

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <ServiceBackground color="purple" />
        <DataScienceFloating />
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"
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
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl"
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
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Artificial Intelligence <span className="gradient-text">& Analytics</span>
            </h1>
            <p className="text-xl text-white/70">
              We use advanced analytics and AI models to uncover patterns, predict outcomes, and support smarter business strategies. Our focus is on solving real problems and enabling better planning.
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
              Advanced data science and AI solutions to unlock the value in your data
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
                Advanced analytics and AI solutions focused on solving real business problems
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
              Cutting-edge tools and frameworks for advanced data science
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
              A proven methodology for successful data science projects
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

export default DataScience

