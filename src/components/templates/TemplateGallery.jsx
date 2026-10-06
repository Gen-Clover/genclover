import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Play, RefreshCcw, Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import { websiteTemplates, templatePath } from '../../data/templates'
import { routes } from '../../data/site'
import { useMotionVariants } from '../../lib/motion'
import { trackEvent, events } from '../../lib/analytics'

/**
 * The website template gallery and the ways into a demo. (Templates)
 *
 * Tiles open a full-screen live preview; from there, or straight from a tile,
 * a visitor books a demo built on that template, or asks us to redesign their
 * existing site as a demo. Up to nine templates; until the last row is full,
 * one "more on the way" tile stretches across the rest of it.
 */

export const demoLink = ({ type, template } = {}) => {
  const params = new URLSearchParams()
  if (type) params.set('type', type)
  if (template) params.set('template', template)
  const query = params.toString()
  return query ? `${routes.bookDemo}?${query}` : routes.bookDemo
}

/**
 * Arriving from another page at #templates, the gallery is in a lazy chunk
 * that mounts after ScrollRestoration has looked for it, so scroll here.
 */
export const useTemplatesAnchor = () => {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash === '#templates') document.getElementById('templates')?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [hash])
}

/** Phones and tablets have no hover: the first tap reveals the details. */
const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

/**
 * A tile is the template's picture. Its details sit on the picture itself:
 * revealed on hover or keyboard focus, or on a first tap where there is no
 * hover. A click anywhere outside the buttons opens the live preview.
 */
const TemplateCard = ({ template, open, onOpen }) => {
  const v = useMotionVariants()
  const preview = templatePath(template.slug)

  const handlePreview = (event) => {
    if (!canHover() && !open) {
      event.preventDefault()
      onOpen(template.slug)
      return
    }
    trackEvent(events.TEMPLATE_OPEN, { template: template.slug, location: 'tile' })
  }

  return (
    <motion.article
      variants={v.fadeUp}
      data-open={open || undefined}
      className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-ink-700 bg-ink-900 shadow-lg transition-colors hover:border-accent-700/70 data-[open]:border-accent-700/70"
    >
      <Link to={preview} onClick={handlePreview} className="absolute inset-0 block" aria-label={`Open the live preview of ${template.name}`}>
        <img
          src={template.thumbnail}
          alt=""
          decoding="async"
          className="h-full w-full object-cover object-top transition duration-700 ease-out group-focus-within:scale-105 group-focus-within:blur-[3px] group-hover:scale-105 group-hover:blur-[3px] group-data-[open]:scale-105 group-data-[open]:blur-[3px]"
        />
      </Link>

      {/* at rest: just the name, so the picture does the talking */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-4 pt-16 transition-opacity duration-300 group-focus-within:opacity-0 group-hover:opacity-0 group-data-[open]:opacity-0">
        <div>
          <p className="text-lg font-semibold leading-tight text-white">{template.name}</p>
          <p className="text-xs text-white/70">{template.style}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <Play className="h-3 w-3 fill-current" aria-hidden="true" />
          <span className="[@media(hover:none)]:hidden">Live preview</span>
          <span className="[@media(hover:hover)]:hidden">Tap for details</span>
        </span>
      </div>

      {/* revealed: the details and the two ways forward */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-ink-950/75 p-5 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 group-data-[open]:opacity-100 sm:p-6">
        <p className="font-display text-[11px] font-semibold uppercase tracking-brand text-accent-400">{template.style}</p>
        <h3 className="mt-1 text-xl font-semibold text-silver-100">{template.name}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-silver-300 sm:text-sm">{template.summary}</p>
        <div className="pointer-events-auto mt-4 flex flex-wrap items-center gap-2">
          <Button
            to={preview}
            size="sm"
            variant="secondary"
            onClick={() => trackEvent(events.TEMPLATE_OPEN, { template: template.slug, location: 'tile_button' })}
          >
            Preview
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            to={demoLink({ type: 'template', template: template.slug })}
            size="sm"
            onClick={() => trackEvent(events.DEMO_CTA, { template: template.slug, location: 'tile' })}
          >
            Book a demo
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

/** Holds the last row's empty cells while the catalogue is still growing. */
const ComingSoonCard = ({ className = '' }) => {
  const v = useMotionVariants()
  return (
    <motion.div
      variants={v.fadeUp}
      data-tick
      className={`${className} flex min-h-[12rem] flex-col items-center justify-center rounded-xl border border-dashed border-ink-700 p-8 text-center`}
    >
      <Sparkles className="h-6 w-6 text-accent-500" aria-hidden="true" />
      <p className="mt-4 font-semibold text-silver-200">More templates on the way</p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-silver-500">
        Have a style in mind already? Describe it in your brief and we will design around it.
      </p>
      <Link to={routes.startProject} className="mt-4 text-sm font-medium text-accent-400 hover:text-accent-300">
        Start a project
      </Link>
    </motion.div>
  )
}

/** The gallery: every template, or just the ones passed in. */
export const TemplateGrid = ({ templates = websiteTemplates }) => {
  const v = useMotionVariants()
  // Touch only: which tile has its details showing. One at a time.
  const [openSlug, setOpenSlug] = useState(null)
  const fillers = (3 - (templates.length % 3)) % 3

  useEffect(() => {
    if (!openSlug) return undefined
    const close = (event) => {
      if (!event.target.closest('article[data-open]')) setOpenSlug(null)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [openSlug])
  return (
    <motion.div initial="hidden" animate="visible" variants={v.stagger(0.08)} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.slug} template={template} open={openSlug === template.slug} onOpen={setOpenSlug} />
      ))}
      {fillers > 0 && <ComingSoonCard className={fillers === 2 ? 'lg:col-span-2' : ''} />}
    </motion.div>
  )
}

/** Redesign: the other way into a demo, for people who already have a site. */
export const RedesignCallout = ({ className = '' }) => (
  <div
    data-tick
    className={`grid gap-5 rounded-2xl border border-accent-800/60 bg-gradient-to-br from-accent-950/60 to-ink-900 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:px-8 ${className}`}
  >
    <span className="grid h-11 w-11 place-items-center rounded-full border border-accent-700 bg-accent-950">
      <RefreshCcw className="h-5 w-5 text-accent-400" aria-hidden="true" />
    </span>
    <div>
      <h2 className="text-lg font-semibold text-silver-100 md:text-xl">Already have a website? See it redesigned first.</h2>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-silver-400">
        Share your current site and your permission to use its name, logo, photos and content. We build a private
        demo redesign and walk you through it on our first call, before you commit to anything.
      </p>
    </div>
    <Button
      to={demoLink({ type: 'redesign' })}
      size="md"
      onClick={() => trackEvent(events.DEMO_CTA, { location: 'redesign_callout' })}
    >
      Request a redesign demo
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Button>
  </div>
)
