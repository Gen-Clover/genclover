import { useState } from 'react'
import { Copy, Check, Mail } from 'lucide-react'

/**
 * Ways to write to us that do not depend on the visitor's computer having a
 * mail app set up. A bare mailto: link hands off to whatever the OS has
 * registered, which on most desktops is nothing useful; Gmail and Outlook web
 * compose links open in the browser (via their sign-in page if needed).
 */
export const composeLinks = ({ to, subject, body = '' }) => {
  const q = (params) => new URLSearchParams(params).toString()
  return {
    gmail: `https://mail.google.com/mail/?${q({ view: 'cm', fs: '1', to, su: subject, body })}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?${q({ to, subject, body })}`,
    mailto: `mailto:${to}?${q({ subject, body }).replace(/\+/g, '%20')}`,
  }
}

const chip =
  'inline-flex h-8 items-center gap-1.5 rounded-md border border-ink-700 bg-ink-900 px-2.5 text-xs text-silver-300 transition-colors hover:border-accent-700/60 hover:text-silver-100'

/** Copies `text`, and reports `copied` for two seconds so the UI can confirm it. */
const useCopy = (text) => {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Older browsers: select-and-copy through a temporary field.
      const field = Object.assign(document.createElement('textarea'), { value: text })
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return [copied, copy]
}

/** An email address that copies itself on click, instead of a mailto: link. */
export const CopyAddress = ({ address, className = '' }) => {
  const [copied, copy] = useCopy(address)
  return (
    <button
      type="button"
      onClick={copy}
      title="Copy email address"
      className={`inline-flex items-center gap-1.5 text-xs text-accent-400 transition-colors hover:text-accent-300 ${className}`}
    >
      {address}
      {copied ? (
        <span className="inline-flex items-center gap-1 text-emerald-500" aria-live="polite">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Copied
        </span>
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </button>
  )
}

const EmailOptions = ({ to, subject, body, label = 'Prefer email?', className = '' }) => {
  const [copied, copy] = useCopy(to)
  const links = composeLinks({ to, subject, body })

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {label && <span className="mr-1 text-xs text-silver-500">{label}</span>}
      <a href={links.gmail} target="_blank" rel="noopener noreferrer" className={chip}>
        Gmail
      </a>
      <a href={links.outlook} target="_blank" rel="noopener noreferrer" className={chip}>
        Outlook
      </a>
      <a href={links.mailto} className={chip}>
        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
        Email app
      </a>
      <button type="button" onClick={copy} className={chip} aria-live="polite">
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            {to}
          </>
        )}
      </button>
    </div>
  )
}

export default EmailOptions
