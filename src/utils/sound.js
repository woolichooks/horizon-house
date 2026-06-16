// src/utils/sound.js
// Lightweight Web Audio sound effects — synthesized at runtime, no asset files.
// Safe to call anywhere: if Web Audio isn't available (e.g. jsdom/tests, old
// browsers) every call is a silent no-op.

let ctx = null
let muted = false

function getCtx() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) {
    try {
      ctx = new AC()
    } catch {
      return null
    }
  }
  // Browsers start the context "suspended" until a user gesture; the game's
  // first sound always follows a click, so resuming here is enough.
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function setMuted(value) {
  muted = Boolean(value)
}

export function isMuted() {
  return muted
}

// One enveloped oscillator note. Times are seconds relative to "now".
function tone(c, { freq, start = 0, dur = 0.15, type = 'sine', gain = 0.12, slideTo }) {
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  const env = c.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)

  // Quick attack, smooth decay. exponentialRamp can't target 0, so use a floor.
  env.gain.setValueAtTime(0.0001, t0)
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)

  osc.connect(env).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.03)
}

// A short rising/falling sequence helper.
function sequence(c, freqs, { step = 0.09, dur = 0.18, type = 'sine', gain = 0.12 } = {}) {
  freqs.forEach((freq, i) => tone(c, { freq, start: i * step, dur, type, gain }))
}

const sounds = {
  // Soft tick when a decision card is selected.
  select: (c) => tone(c, { freq: 440, dur: 0.05, type: 'triangle', gain: 0.07 }),
  // Confirmation when an answer is locked in.
  submit: (c) => sequence(c, [392, 587.33], { step: 0.07, dur: 0.1, gain: 0.09 }),
  // CFO move — bright ascending arpeggio (C–E–G–C).
  correct: (c) => sequence(c, [523.25, 659.25, 783.99, 1046.5], { step: 0.1, dur: 0.2, gain: 0.12 }),
  // Reasonable-but-not-best — two neutral notes.
  partial: (c) => sequence(c, [523.25, 659.25], { step: 0.11, dur: 0.16, gain: 0.1 }),
  // Wrong / harmful — low descending buzz.
  wrong: (c) => tone(c, { freq: 196, dur: 0.35, type: 'sawtooth', gain: 0.07, slideTo: 110 }),
  // Moving between rounds — a quick upward sweep.
  transition: (c) => tone(c, { freq: 330, dur: 0.28, type: 'sine', gain: 0.08, slideTo: 660 }),
  // Each debrief item revealed — subtle pop.
  reveal: (c) => tone(c, { freq: 698.46, dur: 0.07, type: 'triangle', gain: 0.08 }),
  // Starting / restarting the simulation — little fanfare.
  start: (c) => sequence(c, [392, 523.25, 659.25, 783.99], { step: 0.1, dur: 0.22, gain: 0.12 }),
}

export function playSound(name) {
  if (muted) return
  const c = getCtx()
  if (!c) return
  const fn = sounds[name]
  if (!fn) return
  try {
    fn(c)
  } catch {
    // Audio is non-essential; never let a sound failure break gameplay.
  }
}
