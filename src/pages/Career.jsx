import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Briefcase, MapPin, XCircle, CheckCircle, ArrowRight } from 'lucide-react'
import ServiceBackground from '../components/ServiceBackground'
import { jobs } from '../data/jobs'

const Career = () => {

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-black overflow-hidden">
        <ServiceBackground color="from-red-500 to-red-600" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Join Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-xl text-white/70">
              We're always looking for talented individuals who are passionate about technology and innovation. Explore our open positions and be part of building the future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Open Positions</h2>
            <p className="text-xl text-white/70">
              Find the perfect role that matches your skills and passion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobs.map((job, index) => {
              const Icon = job.icon
              const isClosed = job.status === 'closed'
              
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative bg-black/40 backdrop-blur-sm border rounded-2xl p-8 shadow-lg ${
                    isClosed 
                      ? 'border-gray-500/30 opacity-60' 
                      : 'border-red-500/30 hover:border-red-500/50'
                  } transition-all`}
                >
                  {/* Badges */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                    {/* Job Type Badge */}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      job.type === 'Full-time' 
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : job.type === 'Freelancer'
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    }`}>
                      <Briefcase className="w-3 h-3 mr-1" />
                      {job.type}
                    </span>
                    {/* Status Badge */}
                    {isClosed ? (
                      <span className="inline-flex items-center px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium border border-gray-500/30">
                        <XCircle className="w-3 h-3 mr-1" />
                        CLOSED
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        OPEN
                      </span>
                    )}
                  </div>

                  {/* Job Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${job.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Job Title */}
                  <h3 className="text-2xl font-bold mb-2 text-white">{job.title}</h3>

                  {/* Job Meta */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-white/60">
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/70 mb-6 line-clamp-3">{job.description}</p>

                  {/* View Details Button */}
                  <Link to={`/career/job/${job.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-6 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center space-x-2 ${
                        isClosed
                          ? 'bg-gray-500/20 text-gray-400 cursor-pointer hover:bg-gray-500/30'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      <span>View Full Job Description</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Don't see a position that fits?
              </h3>
              <p className="text-white/70 mb-6">
                We're always interested in connecting with talented individuals. 
                Send us your resume and let us know how you can contribute to our team.
              </p>
              <motion.a
                href="mailto:gencloverai@gmail.com?subject=General Application"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Send Your Resume
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Career

