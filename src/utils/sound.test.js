import { describe, it, expect, afterEach } from 'vitest'
import { playSound, setMuted, isMuted } from './sound.js'

describe('sound utility', () => {
  afterEach(() => setMuted(false))

  it('tracks the muted flag', () => {
    expect(isMuted()).toBe(false)
    setMuted(true)
    expect(isMuted()).toBe(true)
    setMuted(false)
    expect(isMuted()).toBe(false)
  })

  it('is a silent no-op when Web Audio is unavailable (jsdom has no AudioContext)', () => {
    expect(() => playSound('correct')).not.toThrow()
    expect(() => playSound('start')).not.toThrow()
  })

  it('ignores unknown sound names without throwing', () => {
    expect(() => playSound('does-not-exist')).not.toThrow()
  })

  it('does nothing while muted', () => {
    setMuted(true)
    expect(() => playSound('wrong')).not.toThrow()
  })
})
