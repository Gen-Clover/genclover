/** True on devices with a real hover (mouse or trackpad), false on touch. */
export const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches

/** Focus that came from the keyboard (not a tap or click). */
export const isKeyboardFocus = (e) => {
  try {
    return e.target.matches(':focus-visible')
  } catch {
    return true
  }
}

/**
 * For list-and-preview screens: on touch devices the first tap on an item
 * previews it, the second opens it. Returns an onClick handler.
 */
export const previewFirstTap = (isActive, activate) => (e) => {
  if (canHover() || isActive) return
  // The preview panel only exists on large screens.
  if (!window.matchMedia?.('(min-width: 1024px)').matches) return
  e.preventDefault()
  activate()
}
