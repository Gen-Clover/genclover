import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Linkedin, Twitter, Github, Mail, MapPin, ArrowRight, Clock } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Services: [
      { name: 'Business Intelligence & Insights', path: '/services/bi-solutions' },
      { name: 'AI Assistants (bots)', path: '/services/ai-bots' },
      { name: 'Artificial Intelligence & Analytics', path: '/services/data-science' },
      { name: 'Data Platforms & Engineering', path: '/services/data-engineering' },
      { name: 'Web & Digital Experiences', path: '/services/web-development' },
    ],
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Portfolio', path: '/portfolio' },
      { name: 'Career', path: '/career' },
      { name: 'Contact', path: '/contact' },
    ],
  }

  const socialLinks = [
    // { icon: Linkedin, href: '#', label: 'LinkedIn' },
    // { icon: Twitter, href: '#', label: 'Twitter' },
    // { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: 'mailto:gencloverai@gmail.com', label: 'Email' },
  ]

  const contactInfo = {
    email: 'gencloverai@gmail.com',
    phone: '8872253994',
    location: 'Chandigarh',
  }

  return (
    <footer className="bg-black/80 backdrop-blur-xl border-t border-red-500/20 text-white/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className="text-white">Gen</span>
              <span className="text-red-500">Clover</span>
            </h3>
            <p className="text-sm text-gray-400">
              Intelligent IT Solutions for Modern Businesses. We transform data
              into insights and ideas into digital experiences.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center space-x-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{contactInfo.email}</span>
              </a>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{contactInfo.location}</span>
              </div>
            </div>

            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/10 rounded-lg hover:bg-red-600 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.Services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-red-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.Company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-red-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get Started</h4>
            <p className="text-sm text-gray-400 mb-4">
              Ready to transform your business? Let's discuss your project and create a solution that drives results.
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <div className="mt-4 pt-4 border-t border-red-500/20">
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                <Clock className="w-4 h-4" />
                <span>Business Hours</span>
              </div>
              <p className="text-xs text-gray-500">
                Mon - Fri: 9:00 AM - 6:00 PM IST
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-red-500/20 mt-8 pt-8 text-center text-sm text-white/60">
          <p>
            © {currentYear} GenClover. All rights reserved. Built with
            innovation and passion.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

