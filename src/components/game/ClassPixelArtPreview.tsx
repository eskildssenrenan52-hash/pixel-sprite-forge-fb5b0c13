import { useEffect, useRef, useState } from 'react'
import type { CharacterClass } from '@/lib/game/types'
import { drawCharacter } from '@/lib/game/sprites'
import { classFrame, skinFrame, drawSheetSprite, loadSheetImage } from '@/lib/game/spriteSheets'

interface Props {
  cls: CharacterClass
  color: string
  label: string
  poseName: string
  skin?: number
}

export default function ClassPixelArtPreview({ cls, color, poseName, skin = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [, setTick] = useState(0)

  // Garante repaint quando o sprite sheet terminar de carregar.
  useEffect(() => {
    const f = skinFrame(cls as string, skin) ?? classFrame(cls as string)
    if (!f) return
    const img = loadSheetImage(f.url)
    if (img.complete && img.naturalWidth > 0) return
    const on = () => setTick((t) => t + 1)
    img.addEventListener('load', on)
    return () => img.removeEventListener('load', on)
  }, [cls, skin])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = false
    const w = canvas.width
    const h = canvas.height

    // Clear background
    ctx.clearRect(0, 0, w, h)

    // Dark fantasy background gradient
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7)
    bgGrad.addColorStop(0, '#131926')
    bgGrad.addColorStop(1, '#06080e')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // Subtle background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
    ctx.lineWidth = 1
    for (let x = 0; x < w; x += 16) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += 16) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Class aura glowing background pulse
    const time = Date.now() / 300
    const pulseRad = 60 + Math.sin(time) * 8
    const auraGrad = ctx.createRadialGradient(w / 2, h / 2 + 10, 5, w / 2, h / 2 + 10, pulseRad)
    auraGrad.addColorStop(0, color)
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = auraGrad
    ctx.fillRect(0, 0, w, h)

    // Draw Isometric Floor Pedestal
    ctx.save()
    ctx.translate(w / 2, h / 2 + 60)
    ctx.fillStyle = 'rgba(20, 28, 45, 0.8)'
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(0, 0, 70, 30, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Inner glowing rune ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.setLineDash([6, 6])
    ctx.beginPath()
    ctx.ellipse(0, 0, 50, 20, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // Draw Pixel Art Character in Class Pose using master character renderer
    const scale = 3.5
    const animFrame = Math.floor(time * 10)
    const charX = w / 2 - 16 * scale
    const charY = h / 2 - 40

    // Sprite gerado por IA (sheet com grid fixo); fallback: renderizador procedural.
    const frame = skinFrame(cls as string, skin) ?? classFrame(cls as string)
    const drawn = frame
      ? drawSheetSprite(ctx, frame, w / 2 - 90, h / 2 - 100, 180)
      : false
    if (!drawn) {
      drawCharacter(ctx, cls, 'down', false, false, animFrame, charX, charY, scale, skin)
    }

    // Draw Pose Label Tag at bottom
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.fillRect(w / 2 - 80, h - 32, 160, 22)
    ctx.strokeRect(w / 2 - 80, h - 32, 160, 22)

    ctx.fillStyle = color
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`POSE: ${poseName.toUpperCase()}`, w / 2, h - 18)

  }, [cls, color, poseName, skin])

  return (
    <div className="relative flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 border border-slate-800 shadow-xl">
      <canvas ref={canvasRef} width={280} height={280} className="rounded-lg border border-slate-800/80" />
    </div>
  )
}
