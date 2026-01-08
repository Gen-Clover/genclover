import { motion } from 'framer-motion'
import { Bot, MessageSquare, Zap, CheckCircle, ArrowRight, Brain, Globe, Headphones, Briefcase, ShoppingCart, Users, FileText, Settings } from 'lucide-react'
import ServiceBackground from '../components/ServiceBackground'
import AIBotsFloating from '../components/AIBotsFloating'

const AIBots = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Chatbots & Virtual Assistants',
      description: 'Intelligent conversational AI bots that provide 24/7 customer support and automate interactions.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Brain,
      title: 'AI-Powered Automation',
      description: 'Automate repetitive tasks and workflows with intelligent bots that learn and adapt.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Zap,
      title: 'Natural Language Processing',
      description: 'Advanced NLP capabilities for understanding context, intent, and sentiment in conversations.',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Globe,
      title: 'Multi-Channel Integration',
      description: 'Deploy AI bots across websites, mobile apps, messaging platforms, and social media.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Headphones,
      title: 'Customer Support Bots',
      description: 'Enhance customer experience with intelligent bots that handle queries, tickets, and support requests.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Briefcase,
      title: 'Business Process Automation',
      description: 'Streamline business processes with AI bots that handle complex workflows and decision-making.',
      color: 'from-red-500 to-red-600',
    },
  ]

  const services = [
    'AI assistants & virtual agents',
    'Process automation & workflows',
    'Customer and internal support solutions',
    'Intelligent systems that improve efficiency',
  ]

  const useCases = [
    {
      icon: Headphones,
      title: 'Customer Support',
      description: '24/7 automated customer support with instant responses to common queries.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Briefcase,
      title: 'Lead Qualification',
      description: 'Automatically qualify leads and route them to the right sales team member.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce Assistant',
      description: 'Help customers find products, answer questions, and guide purchase decisions.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Users,
      title: 'HR & Recruitment',
      description: 'Automate initial candidate screening, schedule interviews, and answer FAQs.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: FileText,
      title: 'Document Processing',
      description: 'Automatically extract, categorize, and process documents using AI.',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Settings,
      title: 'IT Helpdesk',
      description: 'Resolve IT issues, provide technical support, and automate ticket management.',
      color: 'from-red-500 to-red-600',
    },
  ]

  const technologies = [
    { name: 'OpenAI GPT', description: 'Advanced language models' },
    { name: 'Microsoft Bot Framework', description: 'Bot development platform' },
    { name: 'Dialogflow', description: 'Google conversational AI' },
    { name: 'Rasa', description: 'Open-source NLP framework' },
    { name: 'AWS Lex', description: 'Amazon conversational AI' },
    { name: 'IBM Watson', description: 'Enterprise AI platform' },
    { name: 'LangChain', description: 'LLM application framework' },
    { name: 'Vector Databases', description: 'Semantic search & memory' },
  ]

  const process = [
    {
      step: '01',
      title: 'Requirements & Design',
      description: 'Understand your needs, define bot personality, and design conversation flows.',
    },
    {
      step: '02',
      title: 'Development & Training',
      description: 'Build the bot, integrate AI models, and train it on your data and use cases.',
    },
    {
      step: '03',
      title: 'Testing & Integration',
      description: 'Thoroughly test the bot, integrate with your systems, and ensure smooth operation.',
    },
    {
      step: '04',
      title: 'Deployment & Optimization',
      description: 'Deploy the bot, monitor performance, and continuously optimize based on interactions.',
    },
  ]

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <ServiceBackground color="red" />
        <AIBotsFloating />
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
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              AI <span className="gradient-text">Assistants</span> (bots)
            </h1>
            <p className="text-xl text-white/70">
              We design AI-powered assistants that help automate tasks, improve customer interactions, and support internal teams. These solutions are built to be practical, reliable, and aligned with real business needs.
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
              Comprehensive AI bot solutions for businesses of all sizes
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
                Practical AI assistant solutions aligned with real business needs
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

      {/* Use Cases Section */}
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
              Common <span className="gradient-text">Use Cases</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              AI bots solving real business challenges across industries
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon
              return (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 hover:border-red-500/40 transition-colors"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${useCase.color} rounded-xl flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{useCase.title}</h3>
                  <p className="text-white/70">{useCase.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
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
              Technologies We <span className="gradient-text">Use</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Leading AI platforms and frameworks for building intelligent bots
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
              A structured approach to building successful AI bots
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

export default AIBots

