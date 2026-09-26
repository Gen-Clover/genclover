import { useState, useRef, useEffect, useMemo } from 'react'
import { AlertCircle, Check, ChevronDown } from 'lucide-react'

/**
 * Form primitives for the project brief.
 * Every field is labeled, describes its own error via aria-describedby, and
 * sets aria-invalid — so validation is announced, not just coloured. (Spec §22)
 */

export const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm text-accent-400">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  ) : null

const inputClasses = (invalid) =>
  `w-full rounded-lg border bg-ink-900 px-4 py-3 text-base text-silver-100 sm:text-sm placeholder:text-silver-600 transition-colors outline-none focus:border-accent-600 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 ${
    invalid ? 'border-accent-600' : 'border-ink-700 hover:border-ink-600'
  }`

export const TextField = ({ field, value, error, onChange, onBlur, autoFocus }) => {
  const errorId = `${field.name}-error`
  const isTextarea = field.type === 'textarea'
  const Tag = isTextarea ? 'textarea' : 'input'

  return (
    <div>
      <label htmlFor={field.name} className="mb-2 block text-sm font-medium text-silver-200">
        {field.label}
        {!field.required && <span className="ml-1.5 text-xs text-silver-600">(optional)</span>}
      </label>
      <Tag
        id={field.name}
        name={field.name}
        type={isTextarea ? undefined : field.type}
        rows={isTextarea ? 7 : undefined}
        value={value}
        autoFocus={autoFocus}
        autoComplete={field.autoComplete}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        required={field.required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onChange(field.name, e.target.value)}
        onBlur={() => onBlur?.(field.name)}
        className={`${inputClasses(Boolean(error))} ${isTextarea ? 'resize-y leading-relaxed' : ''}`}
      />
      <FieldError id={errorId} message={error} />
    </div>
  )
}

/**
 * Radio cards. Rendered as a real radiogroup with roving tabindex so the whole
 * set is one Tab stop and arrow keys move between options.
 */
export const OptionGrid = ({ name, options, value, error, onChange }) => {
  const errorId = `${name}-error`

  const handleKeyDown = (e) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const index = options.findIndex((o) => o.value === value)
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1
    const nextIndex = index === -1 ? 0 : (index + delta + options.length) % options.length
    onChange(name, options[nextIndex].value)
  }

  return (
    <div>
      <div
        role="radiogroup"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onKeyDown={handleKeyDown}
        className="grid gap-2.5 sm:grid-cols-2"
      >
        {options.map((option, i) => {
          const selected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected || (!value && i === 0) ? 0 : -1}
              onClick={() => onChange(name, option.value)}
              className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3.5 text-left text-sm transition-colors ${
                selected
                  ? 'border-accent-600 bg-accent-950/50 text-silver-100'
                  : 'border-ink-700 bg-ink-900 text-silver-300 hover:border-ink-600 hover:bg-ink-850'
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors ${
                  selected ? 'border-accent-500 bg-accent-600' : 'border-ink-600'
                }`}
                aria-hidden="true"
              >
                {selected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export const ConsentField = ({ checked, error, label, onChange, children }) => {
  const errorId = 'consent-error'

  return (
    <div>
      <label
        htmlFor="consent"
        className={`flex cursor-pointer items-start gap-3.5 rounded-lg border p-5 transition-colors ${
          error ? 'border-accent-600' : 'border-ink-700 bg-ink-900 hover:border-ink-600'
        }`}
      >
        <input
          id="consent"
          name="consent"
          type="checkbox"
          checked={checked}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange('consent', e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-ink-600 bg-ink-800 text-accent-600 accent-accent-600"
        />
        <span className="text-sm leading-relaxed text-silver-300">
          {label}
          {children}
        </span>
      </label>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

/**
 * Searchable single-select, built on the ARIA combobox pattern: an input with
 * role="combobox" that filters a listbox as the visitor types. Arrow keys move
 * the highlight, Enter picks, Escape closes and restores the current value.
 *
 * Used where the option list is too long for radio cards — currencies and
 * phone country codes.
 */
export const SearchSelect = ({
  id,
  label,
  options,
  value,
  onChange,
  error,
  placeholder = 'Type to search',
  required = false,
  hideLabel = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef(null)
  const wrapRef = useRef(null)
  const errorId = `${id}-error`
  const listId = `${id}-listbox`

  const selected = options.find((o) => o.value === value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) =>
      [o.label, o.value, o.keywords].filter(Boolean).join(' ').toLowerCase().includes(q)
    )
  }, [options, query])

  // Close when focus or a click lands outside the control.
  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Keep the highlighted option in view.
  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const openList = () => {
    setQuery('')
    const index = options.findIndex((o) => o.value === value)
    setActive(index >= 0 ? index : 0)
    setOpen(true)
  }

  const pick = (option) => {
    onChange(option.value)
    setOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      e.preventDefault()
      openList()
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[active]) pick(filtered[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      setQuery('')
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <label
        htmlFor={id}
        className={hideLabel ? 'sr-only' : 'mb-2 block text-sm font-medium text-silver-200'}
      >
        {label}
        {!required && !hideLabel && (
          <span className="ml-1.5 text-xs text-silver-600">(optional)</span>
        )}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[active] ? `${id}-opt-${active}` : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          placeholder={open ? placeholder : selected ? undefined : placeholder}
          value={open ? query : (selected?.display ?? selected?.label ?? '')}
          onFocus={openList}
          onClick={() => !open && openList()}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
            if (!open) setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          className={`${inputClasses(Boolean(error))} pr-10`}
        />
        <ChevronDown
          className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </div>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute z-30 mt-1.5 max-h-64 w-full min-w-[16rem] overflow-auto rounded-lg border border-ink-700 bg-ink-850 py-1 shadow-xl"
        >
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-silver-500">No matches</li>
          )}
          {filtered.map((option, i) => {
            const isSelected = option.value === value
            return (
              <li
                key={option.value}
                id={`${id}-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(option)}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm ${
                  i === active ? 'bg-ink-800 text-silver-100' : 'text-silver-300'
                }`}
              >
                <span>{option.label}</span>
                <span className="flex items-center gap-2 text-xs text-silver-500">
                  {option.hint}
                  {isSelected && <Check className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />}
                </span>
              </li>
            )
          })}
        </ul>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  )
}

/** Budget step: any ISO currency, searchable, plus an optional rough figure. */
export const BudgetField = ({ currency, amount, currencyOptions, error, onChange, onBlur, preview }) => (
  <div className="grid gap-5 sm:grid-cols-[1.1fr_1fr]">
    <SearchSelect
      id="budgetCurrency"
      label="Currency"
      options={currencyOptions}
      value={currency}
      onChange={(v) => onChange('budgetCurrency', v)}
      placeholder="Search currency, e.g. USD or euro"
      required
    />
    <div>
      <label htmlFor="budgetAmount" className="mb-2 block text-sm font-medium text-silver-200">
        Approximate amount
        <span className="ml-1.5 text-xs text-silver-600">(optional)</span>
      </label>
      <input
        id="budgetAmount"
        name="budgetAmount"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="e.g. 15000"
        value={amount}
        maxLength={20}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'budgetAmount-error' : preview ? 'budgetAmount-preview' : undefined}
        onChange={(e) => onChange('budgetAmount', e.target.value)}
        onBlur={() => onBlur?.('budgetAmount')}
        className={inputClasses(Boolean(error))}
      />
      {preview && !error && (
        <p id="budgetAmount-preview" className="mt-2 text-xs text-silver-500">
          {preview}
        </p>
      )}
      <FieldError id="budgetAmount-error" message={error} />
    </div>
  </div>
)

/** Phone number with a searchable country calling code in front of it. */
export const PhoneField = ({ field, value, country, countryOptions, errors, onChange, onBlur }) => {
  const error = errors[field.countryName] || errors[field.name]
  const errorId = `${field.name}-error`
  return (
    <div>
      <label htmlFor={field.name} className="mb-2 block text-sm font-medium text-silver-200">
        {field.label}
      </label>
      <div className="grid grid-cols-[8.5rem_1fr] gap-2">
        <SearchSelect
          id={field.countryName}
          label="Country code"
          hideLabel
          required
          options={countryOptions}
          value={country}
          onChange={(v) => onChange(field.countryName, v)}
          placeholder="+ code"
        />
        <input
          id={field.name}
          name={field.name}
          type="tel"
          autoComplete={field.autoComplete}
          maxLength={field.maxLength}
          required={field.required}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange(field.name, e.target.value)}
          onBlur={() => onBlur?.(field.name)}
          className={inputClasses(Boolean(error))}
        />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}
