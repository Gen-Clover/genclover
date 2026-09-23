import { AlertCircle, Check } from 'lucide-react'

/**
 * Form primitives for the project brief.
 * Every field is labelled, describes its own error via aria-describedby, and
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
  `w-full rounded-lg border bg-ink-900 px-4 py-3 text-sm text-silver-100 placeholder:text-silver-600 transition-colors outline-none focus:border-accent-600 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 ${
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
