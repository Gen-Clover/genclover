import { useEffect, useState, useCallback } from 'react'

/**
 * "Tak" sound when the mouse moves from one card or tile to another.
 *
 * Synthesized with the Web Audio API (a short filtered noise burst), so there
 * is no audio file to download. Browsers only allow sound after the visitor has
 * interacted with the page, so ticks start after the first click, tap or key
 * press. Mouse only: touch and keyboard never trigger it. Visitors can mute it
 * from the header; the choice is remembered in localStorage under `gc-sound`.
 */

const STORAGE_KEY = 'gc-sound'
const MIN_GAP_MS = 45

/** What counts as a card or tile. The closest match to the pointer wins. */
const TILE_SELECTOR = [
  '[data-tick]',
  'main article',
  'main .surface',
  'main ul > li',
  'main ol > li',
  '[role="tab"]',
  '[role="radio"]',
].join(',')

let ctx = null
let noise = null
let enabled = true
let lastTile = null
let lastAt = 0
const listeners = new Set()

const readPref = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

const getContext = () => {
  if (ctx) return ctx
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  ctx = new Ctx()
  // One reusable buffer of white noise, a few milliseconds long.
  const length = Math.floor(ctx.sampleRate * 0.03)
  noise = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1
  return ctx
}

const tak = () => {
  if (!ctx || ctx.state !== 'running') return
  const now = ctx.currentTime
  const src = ctx.createBufferSource()
  src.buffer = noise

  // A band-passed click with a slight random pitch reads as "tak" rather than hiss.
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 1900 + Math.random() * 500
  band.Q.value = 6

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028)

  src.connect(band).connect(gain).connect(ctx.destination)
  src.start(now)
  src.stop(now + 0.03)
}

const onPointerOver = (e) => {
  if (!enabled || e.pointerType !== 'mouse') return
  const tile = e.target.closest?.(TILE_SELECTOR)
  if (!tile || tile === lastTile) return
  lastTile = tile
  const t = performance.now()
  if (t - lastAt < MIN_GAP_MS) return
  lastAt = t
  tak()
}

const onPointerOut = (e) => {
  // Leaving a tile for empty space resets, so re-entering the same tile ticks again.
  if (lastTile && !e.relatedTarget?.closest?.(TILE_SELECTOR)) lastTile = null
}

const unlock = () => {
  const c = getContext()
  if (c && c.state === 'suspended') c.resume().catch(() => {})
}

/** Call once at the app root. */
export const useHoverSound = () => {
  useEffect(() => {
    enabled = readPref()
    const opts = { passive: true }
    document.addEventListener('pointerover', onPointerOver, opts)
    document.addEventListener('pointerout', onPointerOut, opts)
    ;['pointerdown', 'keydown', 'touchstart'].forEach((type) =>
      window.addEventListener(type, unlock, opts)
    )
    return () => {
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      ;['pointerdown', 'keydown', 'touchstart'].forEach((type) =>
        window.removeEventListener(type, unlock)
      )
    }
  }, [])
}

/** State for the header's mute toggle. */
export const useSoundSetting = () => {
  const [on, setOn] = useState(() => (typeof window === 'undefined' ? true : readPref()))

  useEffect(() => {
    listeners.add(setOn)
    return () => listeners.delete(setOn)
  }, [])

  const toggle = useCallback(() => {
    enabled = !enabled
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
    } catch {
      /* the choice just will not persist */
    }
    listeners.forEach((fn) => fn(enabled))
    if (enabled) {
      unlock()
      setTimeout(tak, 60)
    }
  }, [])

  return { on, toggle }
}
