import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Clock, ArrowRight, ChevronDown } from 'lucide-react'
import Logo from '../brand/Logo'
import Button from '../ui/Button'
import { site, contact, footerNav, legalNav, socialLinks, routes } from '../../data/site'
import { trackEvent, events } from '../../lib/analytics'

/**
 * Footer. (Spec §18)
 *
 * Link architecture mirrors the taxonomy in site.js. Contact and legal details
 * are rendered only when they exist — an unset phone number or an empty social
 * list simply omits the row rather than showing a placeholder. (Spec §19)
 */
/**
 * A footer link column. On phones it collapses behind its heading (tap to
 * expand), so the footer does not run to a screen and a half; from the sm
 * breakpoint up it is always open.
 */
const FooterColumn = ({ title, children }) => {
  const [open, setOpen] = useState(false)
  const id = `footer-${title.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <nav aria-labelledby={`${id}-h`} className="border-b border-ink-800 sm:border-0">
      <h2 id={`${id}-h`} className="font-display text-xs font-semibold uppercase tracking-brand text-silver-100">
        {/* Phones: a toggle. From sm up the column is always open, so the
            heading is plain text rather than a focusable button that says
            "collapsed" beside visible links. */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[48px] w-full items-center justify-between uppercase tracking-brand sm:hidden"
        >
          {title}
          <ChevronDown
            className={`h-4 w-4 text-silver-500 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        <span className="hidden sm:block">{title}</span>
      </h2>
      <ul id={id} className={`${open ? 'block' : 'hidden'} pb-3 sm:mt-3 sm:block sm:pb-0`}>
        {children}
      </ul>
    </nav>
  )
}

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="container py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_2fr] lg:gap-12">
          {/* Brand + contact */}
          <div>
            <Link to={routes.home} aria-label="Gen Clover home" className="inline-block rounded-sm">
              <Logo markClassName="h-9 w-9" wordClassName="text-lg" />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-silver-400">
              {site.meaning}
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="-my-2 inline-flex min-h-[44px] items-center gap-2.5 text-silver-400 transition-colors hover:text-accent-400"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
              {contact.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="-my-1 inline-flex items-center gap-2.5 py-1 text-silver-400 transition-colors hover:text-accent-400"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2.5 text-silver-400">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                {contact.location}
              </li>
              <li className="flex items-center gap-2.5 text-silver-500">
                <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                {contact.hours}
              </li>
            </ul>

            <p className="mt-5 text-xs leading-relaxed text-silver-500">{contact.servingNote}</p>

            {socialLinks.length > 0 && (
              <ul className="mt-6 flex gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={social.label}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-700 text-silver-400 transition-colors hover:border-accent-600 hover:text-accent-400"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Link columns + CTA */}
          <div className="grid gap-0 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
            {footerNav.map((column) => (
              <FooterColumn key={column.title} title={column.title}>
                  {column.links.map((link) => (
                    <li key={link.to + link.label}>
                      <Link
                        to={link.to}
                        className="flex min-h-[44px] items-center text-sm text-silver-400 transition-colors hover:text-accent-400 md:inline-flex md:min-h-0 md:py-1.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </FooterColumn>
            ))}

            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-brand text-silver-100">
                Start a Project
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                A short brief is all it takes to start the conversation.
              </p>
              <Button
                to={routes.startProject}
                size="sm"
                className="mt-5 w-full"
                onClick={() => trackEvent(events.START_PROJECT_CTA, { location: 'footer' })}
              >
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-xs text-silver-500 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <ul className="flex items-center gap-5">
            {legalNav.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="-my-3 inline-flex min-h-[44px] items-center transition-colors hover:text-silver-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
