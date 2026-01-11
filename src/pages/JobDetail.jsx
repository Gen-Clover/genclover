import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, XCircle, CheckCircle, ArrowLeft, Mail, Clock } from 'lucide-react'
import ServiceBackground from '../components/ServiceBackground'
import { jobs } from '../data/jobs'

const JobDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = jobs.find(j => j.id === parseInt(id))

  if (!job) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Job Not Found</h1>
          <p className="text-xl mb-8 text-white/70">The job posting you're looking for doesn't exist.</p>
          <Link to="/career" className="text-red-500 hover:underline">
            Back to Career Page
          </Link>
        </div>
      </div>
    )
  }

  const Icon = job.icon
  const isClosed = job.status === 'closed'

  return (
    <div className="pt-20 min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-16 bg-black overflow-hidden">
        <ServiceBackground color="from-red-500 to-red-600" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <Link
              to="/career"
              className="inline-flex items-center space-x-2 text-white/70 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Career</span>
            </Link>

            <div className="max-w-4xl mx-auto">
              {/* Job Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-start space-x-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${job.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/70">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-5 h-5" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="flex flex-col gap-2 items-end">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
                    job.type === 'Full-time' 
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      : job.type === 'Freelancer'
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  }`}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    {job.type}
                  </span>
                  {isClosed ? (
                    <span className="inline-flex items-center px-4 py-2 bg-gray-500/20 text-gray-400 rounded-full text-sm font-medium border border-gray-500/30">
                      <XCircle className="w-4 h-4 mr-2" />
                      CLOSED
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      OPEN
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Job Details Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 md:p-12">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold mb-6 text-white">Job Description</h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  {job.description}
                </p>
              </motion.div>

              {/* Requirements */}
              {job.requirements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl font-bold mb-6 text-white">Requirements</h2>
                  <ul className="space-y-4">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start space-x-4 text-white/80">
                        <span className="text-red-500 mt-2 text-xl">•</span>
                        <span className="text-lg leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Responsibilities */}
              {job.responsibilities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl font-bold mb-6 text-white">Responsibilities</h2>
                  <ul className="space-y-4">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start space-x-4 text-white/80">
                        <span className="text-red-500 mt-2 text-xl">•</span>
                        <span className="text-lg leading-relaxed">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Apply Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="pt-8 border-t border-red-500/30"
              >
                {!isClosed ? (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 text-white">Ready to Apply?</h3>
                    <p className="text-white/70 mb-6">
                      Send us your resume and cover letter. We'd love to hear from you!
                    </p>
                    <motion.a
                      href={`mailto:gencloverai@gmail.com?subject=Application for ${job.title} Position`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-3 px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Apply Now</span>
                    </motion.a>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 text-white">Position Closed</h3>
                    <p className="text-white/70 mb-6">
                      This position is currently closed. However, we're always interested in connecting with talented individuals.
                    </p>
                    <motion.a
                      href="mailto:gencloverai@gmail.com?subject=General Application Inquiry"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-3 px-8 py-4 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Send General Inquiry</span>
                    </motion.a>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <div className="bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-center space-x-2 text-white/70 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Application Process</span>
                </div>
                <p className="text-white/60 text-sm">
                  We review applications on a rolling basis. Selected candidates will be contacted within 2-3 weeks.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default JobDetail

