import { motion } from 'framer-motion'
import { Target, Users, Award, Zap } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description:
        'We are committed to delivering solutions that drive real business value and measurable results.',
    },
    {
      icon: Users,
      title: 'Client-Focused',
      description:
        'Your success is our success. We work closely with clients to understand their unique needs.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description:
        'We maintain the highest standards in everything we do, from code quality to client communication.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description:
        'We stay at the forefront of technology, constantly learning and adopting new tools and methodologies.',
    },
  ]

  const team = [
    {
        name: 'Rakesh',
        role: 'Master Developer - Solution Architect',
      },
    {
      name: 'Cheshta',
      role: 'Full Stack Developer',
    },
    {
      name: 'Ananya',
      role: 'LEAD DEVELOPER',
    },
    {
      name: 'Amit',
      role: 'Full Stack Developer',
    },
    {
      name: 'Karan ',
      role: 'Full Stack Developer',
    }

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
              About <span className="gradient-text">GenClover</span>
            </h1>
            <p className="text-xl text-white/70">
              We are a team of passionate technologists dedicated to transforming
              businesses through innovative IT solutions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Our Story
              </h2>
              <p className="text-lg text-white/70 mb-6">
                Founded in 2020, GenClover started with a simple mission: to
                help businesses harness the power of data and technology to
                achieve their goals. What began as a small team of passionate
                developers has grown into a trusted partner for companies across
                various industries.
              </p>
              <p className="text-lg text-white/70 mb-6">
                We specialize in three core areas: Data Engineering, Data
                Science, and Website Development. Our team combines deep
                technical expertise with a keen understanding of business needs,
                ensuring that every solution we deliver drives real value.
              </p>
              <p className="text-lg text-white/70">
                Today, we've completed over 50 projects, served 30+ clients, and
                continue to push the boundaries of what's possible with modern
                technology. Our commitment to excellence and innovation remains
                as strong as ever.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-xl text-white/70">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {value.title}
                  </h3>
                  <p className="text-white/70">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our <span className="gradient-text">Master Developers</span>
            </h2>
            <p className="text-xl text-white/70">
              The talented developers behind our success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="p-8 text-center">
                  <motion.div
                    className="inline-block px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full mb-3"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-red-400 text-xs font-semibold">MASTER DEVELOPER</span>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {member.name}
                  </h3>
                  <p className="text-red-500 font-medium text-sm">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

