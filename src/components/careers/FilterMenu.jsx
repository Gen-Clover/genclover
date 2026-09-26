import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

/**
 * A LinkedIn-style filter pill: a button that opens a small panel of options.
 * `multiple` renders checkboxes (value is an array), otherwise radios (value is
 * a string, '' meaning "any"). Changes apply immediately. Escape or a click
 * outside closes the panel and returns focus to the pill.
 */
const FilterMenu = ({ label, options, value, onChange, multiple = false, counts = {} }) => {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const buttonRef = useRef(null)
  const panelId = useId()

  const selected = multiple ? value : value ? [value] : []
  const active = selected.length > 0
  const summary = !active
    ? label
    : multiple
      ? selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label
        : `${label} · ${selected.length}`
      : options.find((o) => o.value === value)?.label

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = (optionValue) => {
    if (multiple) {
      onChange(
        value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]
      )
    } else {
      onChange(optionValue)
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm transition-colors ${
          active
            ? 'border-accent-600 bg-accent-950/50 text-silver-100'
            : 'border-ink-600 bg-ink-900 text-silver-300 hover:border-ink-500 hover:text-silver-100'
        }`}
      >
        {summary}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={label}
          className="absolute left-0 top-full z-30 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-ink-700 bg-ink-850 p-1.5 shadow-2xl"
        >
          {options.map((option) => {
            const checked = multiple ? value.includes(option.value) : value === option.value
            const count = counts[option.value]
            return (
              <label
                key={option.value || 'any'}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-silver-300 hover:bg-ink-800"
              >
                <input
                  type={multiple ? 'checkbox' : 'radio'}
                  name={multiple ? undefined : panelId}
                  checked={checked}
                  onChange={() => toggle(option.value)}
                  className="peer sr-only"
                />
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent-500 ${
                    multiple ? 'rounded' : 'rounded-full'
                  } ${checked ? 'border-accent-500 bg-accent-600' : 'border-ink-600'}`}
                  aria-hidden="true"
                >
                  {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                </span>
                <span className="flex-1">{option.label}</span>
                {count != null && <span className="text-xs text-silver-600">{count}</span>}
              </label>
            )
          })}
          {multiple && active && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs text-accent-400 hover:bg-ink-800"
            >
              Clear {label.toLowerCase()}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterMenu
