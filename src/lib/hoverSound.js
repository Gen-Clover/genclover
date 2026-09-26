import { useEffect, useState, useCallback } from 'react'

/**
 * "Tak" sound when the mouse moves from one card or tile to another.
 *
 * Synthesized with the Web Audio API (a short filtered noise burst), so there
 * is no audio file to download. Browsers only allow sound after the visitor has
 * interacted with the page, so ticks start after the first click, tap or key
 * press. Mouse only: touch and keyboard never trigger it. Off by default;
 * visitors turn it on from the header, and the choice is remembered in
 * localStorage under `gc-sound`.
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
let enabled = false
let lastTile = null
let lastAt = 0
const listeners = new Set()

/**
 * Off by default: most visitors dislike sound they did not ask for (surveys
 * put annoyance with unrequested website audio well above 30%), so the tick
 * plays only after the visitor turns it on with the header toggle.
 */
const readPref = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    return false
  }
}

const lockListeners = new Set()
const notifyLock = () => lockListeners.forEach((fn) => fn(ctx?.state !== 'running'))

const getContext = () => {
  if (ctx) return ctx
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  ctx = new Ctx()
  ctx.onstatechange = notifyLock
  // One reusable buffer of white noise, a few milliseconds long.
  const length = Math.floor(ctx.sampleRate * 0.03)
  noise = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1
  return ctx
}

/** Overall loudness of the tick (0–1). Raise or lower to taste. */
const VOLUME = 1

let master = null

/** One shared output chain: gain → limiter → speakers, so ticks never clip. */
const getOutput = () => {
  if (master) return master
  const limiter = ctx.createDynamicsCompressor()
  limiter.threshold.value = -6
  limiter.knee.value = 0
  limiter.ratio.value = 12
  limiter.attack.value = 0.001
  limiter.release.value = 0.05
  master = ctx.createGain()
  master.gain.value = VOLUME
  master.connect(limiter).connect(ctx.destination)
  return master
}

const tak = () => {
  if (!ctx || ctx.state !== 'running') return
  const now = ctx.currentTime
  const out = getOutput()

  // 1. The click: a burst of noise, lightly band-passed so it reads as "tak".
  const src = ctx.createBufferSource()
  src.buffer = noise
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 2200 + Math.random() * 400
  band.Q.value = 1.4
  const clickGain = ctx.createGain()
  clickGain.gain.setValueAtTime(0.0001, now)
  clickGain.gain.exponentialRampToValueAtTime(3.2, now + 0.001)
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)
  src.connect(band).connect(clickGain).connect(out)
  src.start(now)
  src.stop(now + 0.035)

  // 2. The body: a very short falling tone that gives the tick weight.
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  const pitch = 1100 + Math.random() * 150
  osc.frequency.setValueAtTime(pitch, now)
  osc.frequency.exponentialRampToValueAtTime(pitch * 0.55, now + 0.03)
  const toneGain = ctx.createGain()
  toneGain.gain.setValueAtTime(0.0001, now)
  toneGain.gain.exponentialRampToValueAtTime(1.5, now + 0.002)
  toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
  osc.connect(toneGain).connect(out)
  osc.start(now)
  osc.stop(now + 0.045)
}

const onPointerOver = (e) => {
  if (!enabled || e.pointerType !== 'mouse') return
  // Browsers only allow audio after a click, tap or key press. Where the
  // browser already permits it (e.g. Chrome on a site the visitor uses
  // often), this starts the sound without waiting for a click.
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {})
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
  // Nothing to start while sound is off; the engine is created on first use.
  if (!enabled) return
  const c = getContext()
  if (c && c.state === 'suspended') c.resume().then(notifyLock).catch(() => {})
}

/** Call once at the app root. */
export const useHoverSound = () => {
  useEffect(() => {
    enabled = readPref()
    // Only a visitor who turned sound on gets an audio engine at load (it
    // starts suspended, so their first click only has to resume it). For
    // everyone else it is created when they switch sound on.
    if (enabled) getContext()
    notifyLock()
    const opts = { passive: true, capture: true }
    document.addEventListener('pointerover', onPointerOver, opts)
    document.addEventListener('pointerout', onPointerOut, opts)
    ;UNLOCK_EVENTS.forEach((type) => window.addEventListener(type, unlock, opts))
    return () => {
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      UNLOCK_EVENTS.forEach((type) => window.removeEventListener(type, unlock, opts))
    }
  }, [])
}

/** Events browsers accept as permission to start audio. */
const UNLOCK_EVENTS = ['pointerdown', 'mousedown', 'click', 'keydown', 'touchend']

/** State for the header's mute toggle. `locked` = waiting for a first click. */
export const useSoundSetting = () => {
  const [on, setOn] = useState(() => (typeof window === 'undefined' ? false : readPref()))
  const [locked, setLocked] = useState(() => !ctx || ctx.state !== 'running')

  useEffect(() => {
    listeners.add(setOn)
    lockListeners.add(setLocked)
    setLocked(!ctx || ctx.state !== 'running')
    return () => {
      listeners.delete(setOn)
      lockListeners.delete(setLocked)
    }
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

  return { on, toggle, locked }
}
