import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import Logo from '../brand/Logo'
import Button from '../ui/Button'
import ThemeToggle from '../ui/ThemeToggle'
import SoundToggle from '../ui/SoundToggle'
import { primaryNav, routes } from '../../data/site'
import { trackEvent, events } from '../../lib/analytics'
import { canHover } from '../../lib/pointer'

/**
 * Primary navigation. (Spec §3, §18)
 *
 * Services, Work, Industries, How We Work, About, Careers + a persistent Start a
 * Project CTA. All items come from site.js, which derives them from the service
 * and work taxonomies, so nothing here is hard-coded. (Spec §25)
 *
 * Keyboard behavior: dropdowns open on click or focus, close on Escape and on
 * focus leaving the group, so the header is fully operable without a mouse.
 */
const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileSection, setMobileSection] = useState(null)
  const navRef = useRef(null)
  const location = useLocation()
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Any navigation closes every menu.
  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
    setMobileSection(null)
  }, [location.pathname, location.search])

  // Lock background scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return
      setOpenMenu(null)
      setMobileOpen(false)
    }
    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [])

  const isSectionActive = (item) =>
    location.pathname === item.to || location.pathname.startsWith(`${item.to}/`) ||
    item.children?.some((c) => location.pathname === c.to.split('?')[0])

  const handleCtaClick = useCallback(() => {
    trackEvent(events.START_PROJECT_CTA, { location: 'header' })
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? 'border-b border-ink-800 bg-ink-950/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav ref={navRef} className="container" aria-label="Primary">
          <div className="flex h-20 items-center justify-between gap-6">
            <Link
              to={routes.home}
              className="shrink-0 rounded-sm"
              aria-label="Gen Clover home"
              onClick={() => setOpenMenu(null)}
            >
              <Logo markClassName="h-8 w-8" wordClassName="text-base md:text-lg" />
            </Link>

            {/* ------------------------------------------------ desktop nav */}
            <ul className="hidden items-center gap-0 lg:flex xl:gap-1">
              {primaryNav.map((item) => {
                const active = isSectionActive(item)

                if (!item.children) {
                  return (
                    <li key={item.label}>
                      <NavLink
                        to={item.to}
                        className={`relative whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors xl:px-3 ${
                          active ? 'text-silver-100' : 'text-silver-400 hover:text-silver-100'
                        }`}
                      >
                        {item.label}
                        {active && (
                          <span className="absolute inset-x-3 -bottom-0.5 h-px bg-accent-500" />
                        )}
                      </NavLink>
                    </li>
                  )
                }

                const expanded = openMenu === item.label

                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => !reduced && setOpenMenu(item.label)}
                    onMouseLeave={() => !reduced && setOpenMenu(null)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) setOpenMenu(null)
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-haspopup="true"
                      onClick={(e) => {
                        // With a mouse, hovering has already opened the menu, so a
                        // click must not toggle it shut again. Keyboard (detail 0)
                        // and touch keep the normal open/close toggle.
                        if (e.detail > 0 && canHover() && !reduced) setOpenMenu(item.label)
                        else setOpenMenu(expanded ? null : item.label)
                      }}
                      className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-2 xl:px-3 text-sm font-medium transition-colors ${
                        active || expanded
                          ? 'text-silver-100'
                          : 'text-silver-400 hover:text-silver-100'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          expanded ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                      {active && (
                        <span className="absolute inset-x-3 -bottom-0.5 h-px bg-accent-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                          className={`absolute left-0 top-full z-50 pt-2 ${
                            item.label === 'Services' ? 'w-[40rem]' : 'w-64'
                          }`}
                        >
                          <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-900/97 p-2 shadow-lift backdrop-blur-xl">
                            <ul
                              className={
                                item.label === 'Services' ? 'grid grid-cols-2 gap-1' : 'space-y-0.5'
                              }
                            >
                              {item.children.map((child) => {
                                const Icon = child.icon
                                return (
                                  <li key={child.to}>
                                    <Link
                                      to={child.to}
                                      className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-800"
                                      onClick={() => setOpenMenu(null)}
                                    >
                                      {Icon && (
                                        <Icon
                                          className="mt-0.5 h-4 w-4 shrink-0 text-accent-500"
                                          aria-hidden="true"
                                        />
                                      )}
                                      <span className="min-w-0">
                                        <span className="block text-sm font-medium text-silver-200 group-hover:text-silver-100">
                                          {child.label}
                                        </span>
                                        {child.description && (
                                          <span className="mt-0.5 block line-clamp-2 text-xs leading-relaxed text-silver-500">
                                            {child.description}
                                          </span>
                                        )}
                                      </span>
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>

                            <div className="mt-1 border-t border-ink-800 pt-1">
                              <Link
                                to={item.to}
                                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-accent-400 transition-colors hover:bg-ink-800"
                                onClick={() => setOpenMenu(null)}
                              >
                                View all {item.label.toLowerCase()}
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-2">
              {/* Hover sounds are mouse-only, so the toggle is hidden on touch-size screens */}
              <SoundToggle className="hidden lg:inline-flex" />
              <ThemeToggle />

              <Button
                to={routes.startProject}
                size="sm"
                className="hidden sm:inline-flex"
                onClick={handleCtaClick}
              >
                Start a Project
              </Button>

              <button
                type="button"
                className="-mr-2 rounded-md p-2 text-silver-200 lg:hidden"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* -------------------------------------------------- mobile sheet */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav"
              initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-ink-800 bg-ink-950 lg:hidden"
            >
              <div className="container max-h-[calc(100dvh-5rem)] overflow-y-auto py-4">
                <ul className="divide-y divide-ink-800">
                  {primaryNav.map((item) => (
                    <li key={item.label} className="py-1">
                      {item.children ? (
                        <>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between py-3 text-left text-base font-medium text-silver-100"
                            aria-expanded={mobileSection === item.label}
                            onClick={() =>
                              setMobileSection(mobileSection === item.label ? null : item.label)
                            }
                          >
                            {item.label}
                            <ChevronDown
                              className={`h-4 w-4 text-silver-400 transition-transform ${
                                mobileSection === item.label ? 'rotate-180' : ''
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {mobileSection === item.label && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pb-2 pl-1"
                              >
                                <li>
                                  <Link
                                    to={item.to}
                                    className="block py-2.5 text-sm font-medium text-accent-400"
                                  >
                                    View all {item.label.toLowerCase()}
                                  </Link>
                                </li>
                                {item.children.map((child) => (
                                  <li key={child.to}>
                                    <Link
                                      to={child.to}
                                      className="block py-2.5 text-sm text-silver-400"
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <NavLink
                          to={item.to}
                          className="block py-3 text-base font-medium text-silver-100"
                        >
                          {item.label}
                        </NavLink>
                      )}
                    </li>
                  ))}
                </ul>

                <Button
                  to={routes.startProject}
                  size="lg"
                  className="mt-5 w-full"
                  onClick={handleCtaClick}
                >
                  Start a Project
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

export default Header
