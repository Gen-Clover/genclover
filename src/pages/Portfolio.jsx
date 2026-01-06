import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Database, Brain, Globe, Filter } from 'lucide-react'

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Analytics Platform',
      category: 'data-engineering',
      description:
        'Built a comprehensive data pipeline processing millions of transactions daily with real-time analytics dashboard.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      technologies: ['Python', 'Apache Airflow', 'PostgreSQL', 'Tableau'],
      link: '#',
      github: '#',
      icon: Database,
    },
    {
      id: 2,
      title: 'Customer Churn Prediction Model',
      category: 'data-science',
      description:
        'Developed ML models to predict customer churn with 92% accuracy, helping reduce churn by 35%.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      technologies: ['Python', 'Scikit-learn', 'TensorFlow', 'Pandas'],
      link: '#',
      github: '#',
      icon: Brain,
    },
    {
      id: 3,
      title: 'Corporate Website Redesign',
      category: 'web-development',
      description:
        'Modern, responsive website with improved UX, resulting in 40% increase in conversions.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8b9b3d?w=800',
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
      link: '#',
      github: '#',
      icon: Globe,
    },
    {
      id: 4,
      title: 'Real-time Data Streaming Platform',
      category: 'data-engineering',
      description:
        'Implemented Kafka-based streaming architecture for processing real-time events at scale.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      technologies: ['Kafka', 'Python', 'AWS', 'Docker'],
      link: '#',
      github: '#',
      icon: Database,
    },
    {
      id: 5,
      title: 'Recommendation Engine',
      category: 'data-science',
      description:
        'AI-powered recommendation system that increased user engagement by 60% and sales by 25%.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      technologies: ['Python', 'TensorFlow', 'Redis', 'FastAPI'],
      link: '#',
      github: '#',
      icon: Brain,
    },
    {
      id: 6,
      title: 'SaaS Dashboard Application',
      category: 'web-development',
      description:
        'Full-stack SaaS application with user authentication, subscription management, and analytics.',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: '#',
      github: '#',
      icon: Globe,
    },
    {
      id: 7,
      title: 'Data Warehouse Migration',
      category: 'data-engineering',
      description:
        'Migrated legacy data warehouse to cloud-based solution, reducing costs by 45% and improving query performance.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      technologies: ['Snowflake', 'dbt', 'Python', 'AWS'],
      link: '#',
      github: '#',
      icon: Database,
    },
    {
      id: 8,
      title: 'Image Classification System',
      category: 'data-science',
      description:
        'Deep learning model for automated image classification with 96% accuracy for quality control.',
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
      technologies: ['PyTorch', 'OpenCV', 'Flask', 'Docker'],
      link: '#',
      github: '#',
      icon: Brain,
    },
    {
      id: 9,
      title: 'Portfolio Website',
      category: 'web-development',
      description:
        'Beautiful, animated portfolio website with modern design and smooth user experience.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8b9b3d?w=800',
      technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'Vite'],
      link: '#',
      github: '#',
      icon: Globe,
    },
  ]

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'data-engineering', label: 'Data Engineering' },
    { id: 'data-science', label: 'Data Science' },
    { id: 'web-development', label: 'Web Development' },
  ]

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((project) => project.category === activeFilter)

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
              Our <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-xl text-white/70">
              Explore our successful projects and see how we've helped businesses
              achieve their goals
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-black/80 backdrop-blur-lg border-b border-red-500/20 sticky top-20 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  activeFilter === category.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-black/40 text-white/80 hover:bg-black/60 border border-red-500/20'
                }`}
              >
                {category.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-black/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => {
                const Icon = project.icon
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4">
                        <div className="w-12 h-12 bg-red-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-red-500/30">
                          <Icon className="w-6 h-6 text-red-500" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 text-white">
                        {project.title}
                      </h3>
                      <p className="text-white/70 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4">
                        <a
                          href={project.link}
                          className="flex items-center text-red-500 font-semibold hover:text-red-400 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Project
                        </a>
                        <a
                          href={project.github}
                          className="flex items-center text-white/70 hover:text-white transition-colors"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

export default Portfolio

