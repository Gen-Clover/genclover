import { useId, useState } from 'react'
import { Plus } from 'lucide-react'

/** Accordion of questions and answers. The first item starts open. */
const Faq = ({ items, className = '' }) => {
  const [open, setOpen] = useState(0)
  const uid = useId().replace(/:/g, '')

  return (
    <ul className={`divide-y divide-ink-800 rounded-xl border border-ink-800 bg-ink-950 ${className}`}>
      {items.map((faq, i) => {
        const expanded = open === i
        return (
          <li key={faq.question}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`${uid}-a-${i}`}
                id={`${uid}-q-${i}`}
                onClick={() => setOpen(expanded ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-medium text-silver-100 transition-colors hover:text-accent-400"
              >
                {faq.question}
                <Plus
                  className={`h-4 w-4 shrink-0 text-accent-500 transition-transform ${expanded ? 'rotate-45' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`${uid}-a-${i}`}
              role="region"
              aria-labelledby={`${uid}-q-${i}`}
              hidden={!expanded}
              className="px-6 pb-6 text-sm leading-relaxed text-silver-400"
            >
              {faq.answer}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default Faq
