import type { CharacterClass } from './types'
import { ALL_100_CLASSES } from './hundredClassesData'
import { drawCharacter } from './sprites'

const portraitCache = new Map<string, string>()

/**
 * Generates high-quality 64x64 Rucoy/Tibia style pixel art character portraits
 * directly in HTML5 Canvas for ALL 100 classes and 10 skins per class (1,000 combinations).
 * Pure JavaScript code execution — zero external image network calls, zero asset files,
 * 100% standalone and guaranteed to never disappear or corrupt across platforms.
 */
export function getClassPortrait(cls: CharacterClass, skin: number = 0): string {
  if (typeof document === 'undefined') return ''

  const key = `${cls}_${skin}`
  if (portraitCache.has(key)) {
    return portraitCache.get(key)!
  }

  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  ctx.imageSmoothingEnabled = false

  const meta = ALL_100_CLASSES.find(c => c.id === cls) || {
    id: cls,
    name: cls,
    color: '#f59e0b',
  }

  const mainColor = meta.color || '#f59e0b'

  // 1. Dark Fantasy Radial Background Gradient
  const bgGrad = ctx.createRadialGradient(32, 32, 4, 32, 32, 36)
  bgGrad.addColorStop(0, '#26140b')
  bgGrad.addColorStop(0.7, '#120804')
  bgGrad.addColorStop(1, '#080301')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, 64, 64)

  // 2. Class Aura Glow
  const auraGrad = ctx.createRadialGradient(32, 32, 2, 32, 32, 24)
  auraGrad.addColorStop(0, mainColor)
  auraGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.save()
  ctx.globalAlpha = 0.35
  ctx.fillStyle = auraGrad
  ctx.fillRect(0, 0, 64, 64)
  ctx.restore()

  // 3. Pedestal Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  ctx.beginPath()
  ctx.ellipse(32, 54, 18, 6, 0, 0, Math.PI * 2)
  ctx.fill()

  // 4. Draw character sprite centered at scale 2 (32px * 2 = 64px)
  drawCharacter(ctx, cls, 'down', false, false, 0, 0, 0, 2, skin)

  // 5. Pixel Art Border Frame
  ctx.lineWidth = 2
  ctx.strokeStyle = '#5c371d'
  ctx.strokeRect(1, 1, 62, 62)

  ctx.lineWidth = 1
  ctx.strokeStyle = mainColor
  ctx.strokeRect(3, 3, 58, 58)

  // Gold Corners
  ctx.fillStyle = '#f0c040'
  ctx.fillRect(1, 1, 3, 3)
  ctx.fillRect(60, 1, 3, 3)
  ctx.fillRect(1, 60, 3, 3)
  ctx.fillRect(60, 60, 3, 3)

  const dataUrl = canvas.toDataURL('image/png')
  portraitCache.set(key, dataUrl)
  return dataUrl
}

export function hasOwnPortrait(_cls: CharacterClass): boolean {
  return true
}

export const AI_GEMINI_PORTRAITS_SHEET = ''
export const AI_GEMINI_SKINS_SHEET = ''
