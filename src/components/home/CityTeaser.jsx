import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Skyline } from '../industries/IndustrySkyline'
import { industryPages } from '../../data/industries'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'
import { canHover } from '../../lib/pointer'

/**
 * Who we build for: the same city as /industries, in miniature. Hover lights a
 * building and names it (first tap on touch); clicking opens that sector.
 */
const CityTeaser = () => {
  const v = useMotionVariants()
  const navigate = useNavigate()
  const [active, setActive] = useState(null)
  const labels = useMemo(() => Object.fromEntries(industryPages.map((i) => [i.id, i.label])), [])

  const activate = (event, id) => {
    event.preventDefault()
    if (!canHover() && active !== id) {
      setActive(id)
      return
    }
    navigate(`${routes.industries}/${id}`)
  }

  return (
    <section className="relative overflow-hidden bg-ink-950 pb-10 pt-20 md:pt-24" aria-label="Who we build for">
      <div className="container">
        <motion.div variants={v.fadeUp} {...revealOnce} className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Who we build for</p>
            <h2 className="mt-3 text-3xl leading-tight md:text-4xl">A whole city of sectors.</h2>
          </div>
          <Link to={routes.industries} className="hidden shrink-0 items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300 sm:inline-flex">
            Walk the city
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>

        <div className="-mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="min-w-[860px] lg:min-w-0">
            <Skyline active={active} labels={labels} onEnter={setActive} onLeave={() => setActive(null)} onActivate={activate} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CityTeaser
