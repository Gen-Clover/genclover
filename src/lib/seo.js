import { useEffect } from 'react'
import { site } from '../data/site'

/**
 * Dependency-free page metadata. (Spec §15)
 *
 * Every route calls usePageMeta once so titles, descriptions, canonical URLs
 * and Open Graph tags stay unique per page. Implemented against the document
 * directly rather than pulling in a helmet library — the site is a small SPA and
 * this keeps the bundle honest.
 *
 * Note: this runs client-side. If search-engine rendering of these tags becomes
 * a requirement, the next step is prerendering or SSR, not a bigger hook.
 */

const DEFAULT_IMAGE = '/brand/gen-clover-banner.png'

const upsertMeta = (selector, attrs) => {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  return el
}

const upsertLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  return el
}

export const usePageMeta = ({ title, description, path, image, noIndex = false }) => {
  useEffect(() => {
    const fullTitle = title ?? `${site.name} | ${site.positioning}`
    const canonical = path ? `${site.url}${path}` : window.location.origin + window.location.pathname
    const ogImage = image ? `${site.url}${image}` : `${site.url}${DEFAULT_IMAGE}`

    document.title = fullTitle

    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: description })
      upsertMeta('meta[property="og:description"]', {
        property: 'og:description',
        content: description,
      })
    }

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    })

    upsertLink('canonical', canonical)
  }, [title, description, path, image, noIndex])
}

/**
 * Page titles and descriptions. (Spec §15)
 * Pattern: "<Page> | Gen Clover". Descriptions stay within ~160 characters.
 */
export const pageMeta = {
  home: {
    title: 'Gen Clover | Digital Products, Technology & AI Solutions',
    description:
      'Gen Clover designs and builds digital products that move businesses forward: websites, web applications, e-commerce, AI and automation, data, DevOps and SEO.',
    path: '/',
  },
  services: {
    title: 'Services: Websites, Applications, AI & Data | Gen Clover',
    description:
      'Websites, web applications, e-commerce, AI and automation, data and analytics, technology solutions, DevOps and MLOps, and digital marketing and SEO.',
    path: '/services',
  },
  work: {
    title: 'Our Work: Websites, Applications, AI & Data | Gen Clover',
    description:
      'Delivered Gen Clover projects across AI and automation, data and analytics, web applications, platforms and websites, each with a full case study.',
    path: '/work',
  },
  industries: {
    title: 'Industries We Serve | Gen Clover',
    description:
      'Gen Clover works across healthcare, media and publishing, professional services, technology and SaaS, financial services, retail, manufacturing, logistics and more.',
    path: '/industries',
  },
  howWeWork: {
    title: 'How We Work | Gen Clover',
    description:
      'Discover, Define, Design, Build, Validate, Launch, Grow: the seven-stage delivery process behind every Gen Clover engagement, and the care that follows launch.',
    path: '/how-we-work',
  },
  about: {
    title: 'About Us | Gen Clover',
    description:
      'Gen Clover is a technology and digital product company building practical, high-quality websites, applications, AI and data solutions for modern businesses.',
    path: '/about',
  },
  careers: {
    title: 'Careers | Gen Clover',
    description:
      'Careers at Gen Clover, a technology and digital product company. See current and recent roles, and send a general application.',
    path: '/careers',
  },
  startProject: {
    title: 'Start a Project | Gen Clover',
    description:
      'Tell us about your project in eight short questions, so our first reply is about your goals rather than a generic capability deck.',
    path: '/start-a-project',
  },
  privacy: {
    title: 'Privacy Notice | Gen Clover',
    description: 'How Gen Clover handles the information you submit through this website.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms of Use | Gen Clover',
    description: 'The terms that apply when you use the Gen Clover website.',
    path: '/terms',
  },
}
