import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie, CheckCircle } from 'lucide-react'

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setShowBanner(true)
      }, 1000)
    } else {
      setAccepted(consent === 'accepted')
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setAccepted(true)
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setAccepted(false)
    setShowBanner(false)
  }

  const handleClose = () => {
    setShowBanner(false)
    // Don't store preference if user just closes without choosing
  }

  if (accepted && !showBanner) {
    return null
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="bg-black/95 backdrop-blur-xl border border-red-500/30 rounded-2xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
              {/* Background Glow Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full filter blur-3xl" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Cookie Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="flex-shrink-0"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Cookie className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-white/70 text-sm md:text-base mb-4">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                    By clicking "Accept All", you consent to our use of cookies. You can also choose to decline non-essential cookies.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-white/60">
                    <span className="px-2 py-1 bg-red-500/20 rounded">Essential</span>
                    <span className="px-2 py-1 bg-red-500/20 rounded">Analytics</span>
                    <span className="px-2 py-1 bg-red-500/20 rounded">Preferences</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
                  <motion.button
                    onClick={handleDecline}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-transparent border-2 border-white/20 text-white rounded-lg font-medium hover:border-white/40 transition-colors whitespace-nowrap"
                  >
                    Decline
                  </motion.button>
                  <motion.button
                    onClick={handleAccept}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(220, 38, 38, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Accept All
                  </motion.button>
                </div>

                {/* Close Button */}
                <motion.button
                  onClick={handleClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close cookie banner"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent

