import { Link } from 'react-router-dom'
import { Mail, MapPin, Clock, ArrowRight } from 'lucide-react'
import Logo from '../brand/Logo'
import Button from '../ui/Button'
import { site, contact, footerNav, legalNav, socialLinks, routes } from '../../data/site'
import { brandPillars } from '../../data/taxonomy'
import { trackEvent, events } from '../../lib/analytics'

/**
 * Footer. (Spec §18)
 *
 * Link architecture mirrors the taxonomy in site.js. Contact and legal details
 * are rendered only when they exist — an unset phone number or an empty social
 * list simply omits the row rather than showing a placeholder. (Spec §19)
 */
const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      {/* Brand pillars strip — Intelligence → Innovation → Automation → Growth */}
      <div className="border-b border-ink-800/70">
        <div className="container">
          <ul className="grid grid-cols-2 divide-ink-800 md:grid-cols-4 md:divide-x">
            {brandPillars.map((pillar, i) => (
              <li key={pillar.label} className={`py-6 ${i % 2 === 1 ? 'pl-5' : ''} md:px-6 md:first:pl-0`}>
                <p className="font-display text-xs font-semibold uppercase tracking-brand text-silver-100">
                  {pillar.label}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-silver-500">{pillar.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
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
                  className="-my-1 inline-flex items-center gap-2.5 py-1 text-silver-400 transition-colors hover:text-accent-400"
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
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav.map((column) => (
              <nav key={column.title} aria-labelledby={`footer-${column.title}`}>
                <h2
                  id={`footer-${column.title}`}
                  className="font-display text-xs font-semibold uppercase tracking-brand text-silver-100"
                >
                  {column.title}
                </h2>
                {/* -my-1 keeps the visual rhythm while py-1 gives each link a
                    24px+ tap target, which bare 17px text does not. */}
                <ul className="-my-1 mt-3 space-y-0.5">
                  {column.links.map((link) => (
                    <li key={link.to + link.label}>
                      <Link
                        to={link.to}
                        className="inline-block py-1.5 text-sm text-silver-400 transition-colors hover:text-accent-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-brand text-silver-100">
                Start a Project
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Tell us what you are trying to build. We will come back with a considered
                response, not a template.
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
                <Link to={link.to} className="-my-1.5 inline-block py-1.5 transition-colors hover:text-silver-300">
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
