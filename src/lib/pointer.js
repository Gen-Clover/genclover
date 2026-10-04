/** True on devices with a real hover (mouse or trackpad), false on touch. */
export const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches
