import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, BarChart3, Globe, Database, Brain, Bot } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  const servicesMenu = [
    { path: '/services', label: 'All Services', icon: null },
    { path: '/services/bi-solutions', label: 'Business Intelligence & Insights', icon: BarChart3 },
    { path: '/services/ai-bots', label: 'AI Assistants (bots)', icon: Bot },
    { path: '/services/data-science', label: 'Artificial Intelligence & Analytics', icon: Brain },
    { path: '/services/data-engineering', label: 'Data Platforms & Engineering', icon: Database },
    { path: '/services/web-development', label: 'Web & Digital Experiences', icon: Globe },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-lg shadow-lg border-b border-red-500/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold gradient-text relative"
            >
              <motion.span
                animate={{
                  textShadow: [
                    '0 0 10px rgba(220, 38, 38, 0.5)',
                    '0 0 20px rgba(220, 38, 38, 0.8)',
                    '0 0 10px rgba(220, 38, 38, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                GenClover
              </motion.span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`relative text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-red-500'
                  : 'text-white/80 hover:text-red-500'
              }`}
            >
              Home
              {location.pathname === '/' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                className={`relative text-sm font-medium transition-colors flex items-center space-x-1 ${
                  location.pathname.startsWith('/services')
                    ? 'text-red-500'
                    : 'text-white/80 hover:text-red-500'
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isServicesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
                {location.pathname.startsWith('/services') && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>

              <AnimatePresence>
                {isServicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-lg rounded-lg shadow-xl border border-red-500/20 py-2 z-50"
                  >
                    {servicesMenu.map((service) => {
                      const Icon = service.icon
                      const isActive = location.pathname === service.path
                      
                      return (
                        <Link
                          key={service.path}
                          to={service.path}
                          onClick={() => setIsServicesDropdownOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                            isActive
                              ? 'text-red-500 bg-red-500/10'
                              : 'text-white/80 hover:text-red-500 hover:bg-white/5'
                          }`}
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                          <span>{service.label}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-red-500'
                    : 'text-white/80 hover:text-red-500'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Get Started
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-lg border-t border-red-500/20"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium ${
                  location.pathname === '/'
                    ? 'text-red-500'
                    : 'text-white/80'
                }`}
              >
                Home
              </Link>

              {/* Mobile Services Dropdown */}
              <div>
                <button
                  onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                  className={`w-full flex items-center justify-between py-2 text-base font-medium ${
                    location.pathname.startsWith('/services')
                      ? 'text-red-500'
                      : 'text-white/80'
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isServicesDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isServicesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 space-y-2 mt-2"
                    >
                      {servicesMenu.map((service) => {
                        const Icon = service.icon
                        const isActive = location.pathname === service.path
                        
                        return (
                          <Link
                            key={service.path}
                            to={service.path}
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              setIsServicesDropdownOpen(false)
                            }}
                            className={`flex items-center space-x-2 py-2 text-sm ${
                              isActive
                                ? 'text-red-500'
                                : 'text-white/70'
                            }`}
                          >
                            {Icon && <Icon className="w-4 h-4" />}
                            <span>{service.label}</span>
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-base font-medium ${
                    location.pathname === link.path
                      ? 'text-red-500'
                      : 'text-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium text-center"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header

