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
      name: 'Alex Johnson',
      role: 'Lead Data Engineer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    {
      name: 'Sarah Chen',
      role: 'Senior Data Scientist',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Full-Stack Developer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
    {
      name: 'Emily Davis',
      role: 'Project Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
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
                Founded in 2019, GenClover started with a simple mission: to
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
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-white/70">
              The talented individuals behind our success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {member.name}
                  </h3>
                  <p className="text-red-500 font-medium">{member.role}</p>
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

