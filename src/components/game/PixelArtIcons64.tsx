import { useEffect, useRef } from 'react'

export type IconType64 =
  | 'category_all'
  | 'category_warrior'
  | 'category_mage'
  | 'category_ranger'
  | 'category_support'
  | 'category_legendary'
  | 'ability_active'
  | 'ability_passive'
  | 'ability_special'
  | 'stat_hp'
  | 'stat_mp'
  | 'stat_atk'
  | 'stat_def'
  | 'stat_magic'
  | 'stat_speed'
  | 'skin_icon'
  | 'modal_inventory'
  | 'modal_stats'
  | 'modal_subskills'
  | 'modal_skilltree'
  | 'modal_passive'
  | 'modal_spec'
  | 'modal_prestige'
  | 'modal_map'
  | 'modal_continents'
  | 'modal_ship'
  | 'modal_mercenaries'
  | 'modal_quest'
  | 'modal_achievements'
  | 'modal_crafting'
  | 'modal_pets'
  | 'modal_ambitious'
  | 'modal_editor'
  | 'modal_help'

interface Props {
  type: IconType64
  size?: number
  className?: string
  color?: string
}

export default function PixelArtIcon64({
  type,
  size = 64,
  className = '',
  color = '#ffd700',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, 64, 64)

    // Wood / Gold frame background
    const bgGrad = ctx.createRadialGradient(32, 32, 5, 32, 32, 30)
    bgGrad.addColorStop(0, '#2d180d')
    bgGrad.addColorStop(1, '#150a04')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 64, 64)

    // Gold inner border
    ctx.strokeStyle = '#c9952a'
    ctx.lineWidth = 2
    ctx.strokeRect(2, 2, 60, 60)

    ctx.strokeStyle = '#f0d060'
    ctx.lineWidth = 1
    ctx.strokeRect(4, 4, 56, 56)

    // Corner brass studs
    ctx.fillStyle = '#f0c040'
    ctx.fillRect(3, 3, 3, 3)
    ctx.fillRect(58, 3, 3, 3)
    ctx.fillRect(3, 58, 3, 3)
    ctx.fillRect(58, 58, 3, 3)

    // Draw procedural 64x64 pixel art depending on type
    ctx.save()

    switch (type) {
      case 'category_all': {
        // Crossed Golden Swords & Gem Crest
        ctx.fillStyle = '#f59e0b'
        // Sword 1
        ctx.beginPath()
        ctx.moveTo(14, 50)
        ctx.lineTo(50, 14)
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 4
        ctx.stroke()

        // Sword 2
        ctx.beginPath()
        ctx.moveTo(50, 50)
        ctx.lineTo(14, 14)
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 4
        ctx.stroke()

        // Center Gem
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(32, 32, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 1.5
        ctx.stroke()
        break
      }

      case 'category_warrior': {
        // Heavy Shield & Battle Sword
        // Shield body
        ctx.fillStyle = '#475569'
        ctx.beginPath()
        ctx.moveTo(18, 16)
        ctx.lineTo(46, 16)
        ctx.lineTo(46, 38)
        ctx.lineTo(32, 52)
        ctx.lineTo(18, 38)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        ctx.stroke()

        // Sword in center
        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(32, 10)
        ctx.lineTo(32, 48)
        ctx.stroke()

        // Hilt
        ctx.fillStyle = '#f59e0b'
        ctx.fillRect(24, 42, 16, 4)
        break
      }

      case 'category_mage': {
        // Arcane Wooden Staff with Glowing Crystal
        ctx.strokeStyle = '#78350f'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(18, 52)
        ctx.lineTo(38, 20)
        ctx.stroke()

        // Orb
        const orbGrad = ctx.createRadialGradient(42, 16, 2, 42, 16, 10)
        orbGrad.addColorStop(0, '#60a5fa')
        orbGrad.addColorStop(1, '#1e3a8a')
        ctx.fillStyle = orbGrad
        ctx.beginPath()
        ctx.arc(42, 16, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#93c5fd'
        ctx.lineWidth = 2
        ctx.stroke()

        // Magic spark
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(40, 14, 4, 4)
        break
      }

      case 'category_ranger': {
        // Elven Bow & Arrow
        ctx.strokeStyle = '#854d0e'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(24, 32, 22, -Math.PI / 2.2, Math.PI / 2.2)
        ctx.stroke()

        // String
        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(32, 10)
        ctx.lineTo(32, 54)
        ctx.stroke()

        // Arrow
        ctx.strokeStyle = '#22c55e'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(12, 32)
        ctx.lineTo(48, 32)
        ctx.stroke()

        // Arrow tip
        ctx.fillStyle = '#4ade80'
        ctx.beginPath()
        ctx.moveTo(48, 28)
        ctx.lineTo(56, 32)
        ctx.lineTo(48, 36)
        ctx.closePath()
        ctx.fill()
        break
      }

      case 'category_support': {
        // Sacred Leaf & Healing Potion
        ctx.fillStyle = '#15803d'
        ctx.beginPath()
        ctx.ellipse(24, 28, 12, 18, Math.PI / 4, 0, Math.PI * 2)
        ctx.fill()

        // Potion Flask
        ctx.fillStyle = '#ef4444'
        ctx.fillRect(36, 34, 16, 18)
        ctx.fillStyle = '#dc2626'
        ctx.fillRect(38, 28, 12, 6)
        ctx.fillStyle = '#fef08a'
        ctx.fillRect(40, 24, 8, 4)
        ctx.strokeStyle = '#fcd34d'
        ctx.lineWidth = 1.5
        ctx.strokeRect(36, 34, 16, 18)
        break
      }

      case 'category_legendary': {
        // Glowing Golden Crown with Gems
        ctx.fillStyle = '#f59e0b'
        ctx.beginPath()
        ctx.moveTo(12, 46)
        ctx.lineTo(52, 46)
        ctx.lineTo(52, 24)
        ctx.lineTo(42, 34)
        ctx.lineTo(32, 18)
        ctx.lineTo(22, 34)
        ctx.lineTo(12, 24)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = '#fef08a'
        ctx.lineWidth = 2
        ctx.stroke()

        // Gems
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(32, 38, 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.arc(20, 38, 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#10b981'
        ctx.beginPath()
        ctx.arc(44, 38, 3, 0, Math.PI * 2)
        ctx.fill()
        break
      }

      case 'ability_active': {
        // Spellbook Grimoire with Glowing Rune
        ctx.fillStyle = '#7f1d1d'
        ctx.fillRect(16, 16, 32, 38)
        ctx.fillStyle = '#fef3c7'
        ctx.fillRect(20, 20, 24, 30)

        ctx.strokeStyle = '#b45309'
        ctx.lineWidth = 2
        ctx.strokeRect(16, 16, 32, 38)

        // Magic Rune
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(32, 26)
        ctx.lineTo(32, 44)
        ctx.moveTo(24, 35)
        ctx.lineTo(40, 35)
        ctx.stroke()
        break
      }

      case 'ability_passive': {
        // Golden Winged Shield
        ctx.fillStyle = '#ca8a04'
        ctx.beginPath()
        ctx.moveTo(22, 18)
        ctx.lineTo(42, 18)
        ctx.lineTo(42, 36)
        ctx.lineTo(32, 48)
        ctx.lineTo(22, 36)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = '#fef08a'
        ctx.lineWidth = 2
        ctx.stroke()

        // Wings
        ctx.strokeStyle = '#eab308'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(12, 22)
        ctx.lineTo(22, 28)
        ctx.moveTo(52, 22)
        ctx.lineTo(42, 28)
        ctx.stroke()
        break
      }

      case 'ability_special': {
        // Flaming Energy Blast / FX 34-Frames Icon
        const flameGrad = ctx.createRadialGradient(32, 32, 2, 32, 32, 22)
        flameGrad.addColorStop(0, '#ffffff')
        flameGrad.addColorStop(0.3, '#f97316')
        flameGrad.addColorStop(0.8, '#dc2626')
        flameGrad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = flameGrad
        ctx.fillRect(10, 10, 44, 44)

        // Outer Rays
        ctx.strokeStyle = '#fef08a'
        ctx.lineWidth = 2
        for (let i = 0; i < 8; i++) {
          const ang = (i * Math.PI) / 4
          ctx.beginPath()
          ctx.moveTo(32 + Math.cos(ang) * 12, 32 + Math.sin(ang) * 12)
          ctx.lineTo(32 + Math.cos(ang) * 24, 32 + Math.sin(ang) * 24)
          ctx.stroke()
        }
        break
      }

      case 'stat_hp': {
        // Red Heart
        ctx.fillStyle = '#dc2626'
        ctx.beginPath()
        ctx.moveTo(32, 48)
        ctx.bezierCurveTo(32, 48, 14, 34, 14, 24)
        ctx.bezierCurveTo(14, 16, 22, 16, 32, 24)
        ctx.bezierCurveTo(42, 16, 50, 16, 50, 24)
        ctx.bezierCurveTo(50, 34, 32, 48, 32, 48)
        ctx.fill()
        ctx.strokeStyle = '#fca5a5'
        ctx.lineWidth = 1.5
        ctx.stroke()
        break
      }

      case 'stat_mp': {
        // Blue Mana Orb
        const mpGrad = ctx.createRadialGradient(30, 30, 2, 32, 32, 18)
        mpGrad.addColorStop(0, '#93c5fd')
        mpGrad.addColorStop(0.5, '#2563eb')
        mpGrad.addColorStop(1, '#1e3a8a')
        ctx.fillStyle = mpGrad
        ctx.beginPath()
        ctx.arc(32, 32, 18, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#bfdbfe'
        ctx.lineWidth = 2
        ctx.stroke()
        break
      }

      case 'stat_atk': {
        // Flaming Axe/Sword
        ctx.strokeStyle = '#f97316'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(18, 48)
        ctx.lineTo(46, 18)
        ctx.stroke()

        // Blade
        ctx.fillStyle = '#ea580c'
        ctx.beginPath()
        ctx.arc(42, 22, 10, -Math.PI / 2, Math.PI / 2)
        ctx.fill()
        break
      }

      case 'stat_def': {
        // Iron Shield
        ctx.fillStyle = '#475569'
        ctx.fillRect(18, 16, 28, 32)
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 2
        ctx.strokeRect(18, 16, 28, 32)

        // Cross
        ctx.fillStyle = '#f59e0b'
        ctx.fillRect(28, 16, 8, 32)
        ctx.fillRect(18, 28, 28, 8)
        break
      }

      case 'stat_magic': {
        // Magic Crystal Star
        ctx.fillStyle = '#a855f7'
        ctx.beginPath()
        ctx.moveTo(32, 14)
        ctx.lineTo(37, 27)
        ctx.lineTo(50, 32)
        ctx.lineTo(37, 37)
        ctx.lineTo(32, 50)
        ctx.lineTo(27, 37)
        ctx.lineTo(14, 32)
        ctx.lineTo(27, 27)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = '#f0abfc'
        ctx.lineWidth = 1.5
        ctx.stroke()
        break
      }

      case 'stat_speed': {
        // Winged Boot
        ctx.fillStyle = '#eab308'
        ctx.beginPath()
        ctx.moveTo(20, 20)
        ctx.lineTo(32, 20)
        ctx.lineTo(32, 38)
        ctx.lineTo(46, 38)
        ctx.lineTo(46, 46)
        ctx.lineTo(20, 46)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = '#fef08a'
        ctx.lineWidth = 1.5
        ctx.stroke()
        break
      }

      case 'skin_icon': {
        // Palette / Skin Wardrobe Icon
        ctx.fillStyle = '#854d0e'
        ctx.beginPath()
        ctx.arc(32, 32, 18, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#fef08a'
        ctx.lineWidth = 2
        ctx.stroke()

        // Paint dabs
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#eab308']
        colors.forEach((c, idx) => {
          const ang = (idx * Math.PI) / 2
          ctx.fillStyle = c
          ctx.beginPath()
          ctx.arc(32 + Math.cos(ang) * 10, 32 + Math.sin(ang) * 10, 4, 0, Math.PI * 2)
          ctx.fill()
        })
        break
      }

      case 'modal_inventory': {
        // Leather Backpack
        ctx.fillStyle = '#78350f'
        ctx.fillRect(16, 18, 32, 34)
        ctx.fillStyle = '#92400e'
        ctx.fillRect(20, 24, 24, 22)
        ctx.fillStyle = '#f59e0b' // Gold Buckle
        ctx.fillRect(28, 28, 8, 6)
        ctx.strokeStyle = '#292524'
        ctx.lineWidth = 2
        ctx.strokeRect(16, 18, 32, 34)
        break
      }

      case 'modal_stats': {
        // Stat Bar Chart
        ctx.fillStyle = '#3b82f6'
        ctx.fillRect(16, 36, 8, 16)
        ctx.fillStyle = '#10b981'
        ctx.fillRect(28, 24, 8, 28)
        ctx.fillStyle = '#f59e0b'
        ctx.fillRect(40, 16, 8, 36)
        ctx.strokeStyle = '#fef08a'
        ctx.lineWidth = 1.5
        ctx.strokeRect(14, 14, 36, 40)
        break
      }

      case 'modal_subskills': {
        // Cyan Rune Gem
        ctx.fillStyle = '#06b6d4'
        ctx.beginPath()
        ctx.moveTo(32, 12)
        ctx.lineTo(48, 32)
        ctx.lineTo(32, 52)
        ctx.lineTo(16, 32)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = '#a5f3fc'
        ctx.lineWidth = 2
        ctx.stroke()
        break
      }

      case 'modal_skilltree': {
        // Lightning Bolt Tree
        ctx.fillStyle = '#eab308'
        ctx.beginPath()
        ctx.moveTo(34, 10)
        ctx.lineTo(18, 32)
        ctx.lineTo(30, 32)
        ctx.lineTo(24, 54)
        ctx.lineTo(46, 28)
        ctx.lineTo(34, 28)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = '#fef08a'
        ctx.lineWidth = 1.5
        ctx.stroke()
        break
      }

      case 'modal_passive': {
        // Oak Tree
        ctx.fillStyle = '#15803d'
        ctx.beginPath()
        ctx.arc(32, 26, 18, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#78350f'
        ctx.fillRect(28, 38, 8, 16)
        break
      }

      case 'modal_spec': {
        // Star Crest
        ctx.fillStyle = '#f59e0b'
        ctx.beginPath()
        ctx.arc(32, 32, 18, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(30, 18, 4, 28)
        ctx.fillRect(18, 30, 28, 4)
        break
      }

      case 'modal_prestige': {
        // Prestige Crown
        ctx.fillStyle = '#f59e0b'
        ctx.beginPath()
        ctx.moveTo(14, 48)
        ctx.lineTo(50, 48)
        ctx.lineTo(50, 20)
        ctx.lineTo(40, 32)
        ctx.lineTo(32, 14)
        ctx.lineTo(24, 32)
        ctx.lineTo(14, 20)
        ctx.closePath()
        ctx.fill()
        break
      }

      case 'modal_map': {
        // Map Parchment
        ctx.fillStyle = '#fef3c7'
        ctx.fillRect(14, 14, 36, 36)
        ctx.strokeStyle = '#92400e'
        ctx.lineWidth = 2
        ctx.strokeRect(14, 14, 36, 36)
        ctx.fillStyle = '#ef4444' // X mark
        ctx.fillRect(28, 28, 8, 8)
        break
      }

      case 'modal_continents': {
        // World Globe
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.arc(32, 32, 18, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#22c55e'
        ctx.fillRect(24, 22, 12, 10)
        ctx.fillRect(28, 34, 14, 8)
        break
      }

      case 'modal_ship': {
        // Ship Boat
        ctx.fillStyle = '#78350f'
        ctx.fillRect(14, 36, 36, 12)
        ctx.fillStyle = '#ffffff' // Sail
        ctx.beginPath()
        ctx.moveTo(32, 12)
        ctx.lineTo(46, 32)
        ctx.lineTo(32, 32)
        ctx.closePath()
        ctx.fill()
        break
      }

      case 'modal_mercenaries': {
        // Crossed Swords Shield
        ctx.fillStyle = '#475569'
        ctx.fillRect(18, 16, 28, 32)
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        ctx.strokeRect(18, 16, 28, 32)
        break
      }

      case 'modal_quest': {
        // Scroll with Wax Seal
        ctx.fillStyle = '#fef3c7'
        ctx.fillRect(18, 14, 28, 36)
        ctx.fillStyle = '#dc2626' // Red Seal
        ctx.beginPath()
        ctx.arc(32, 38, 6, 0, Math.PI * 2)
        ctx.fill()
        break
      }

      case 'modal_achievements': {
        // Golden Trophy
        ctx.fillStyle = '#f59e0b'
        ctx.fillRect(20, 16, 24, 20)
        ctx.fillRect(28, 36, 8, 10)
        ctx.fillRect(22, 46, 20, 6)
        break
      }

      case 'modal_crafting': {
        // Anvil & Hammer
        ctx.fillStyle = '#334155'
        ctx.fillRect(16, 34, 32, 16)
        ctx.fillStyle = '#f59e0b'
        ctx.fillRect(24, 16, 16, 14)
        break
      }

      case 'modal_pets': {
        // Paw Print
        ctx.fillStyle = '#f59e0b'
        ctx.beginPath()
        ctx.arc(32, 36, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.arc(22, 22, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.arc(32, 18, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.arc(42, 22, 4, 0, Math.PI * 2)
        ctx.fill()
        break
      }

      case 'modal_ambitious': {
        // Glowing Star
        ctx.fillStyle = '#eab308'
        ctx.beginPath()
        ctx.arc(32, 32, 16, 0, Math.PI * 2)
        ctx.fill()
        break
      }

      case 'modal_editor': {
        // Hammer
        ctx.fillStyle = '#64748b'
        ctx.fillRect(22, 18, 20, 10)
        ctx.fillStyle = '#78350f'
        ctx.fillRect(30, 28, 4, 24)
        break
      }

      case 'modal_help': {
        // Question Book
        ctx.fillStyle = '#1e3a8a'
        ctx.fillRect(18, 14, 28, 36)
        ctx.fillStyle = '#fef08a'
        ctx.font = '24px monospace'
        ctx.fillText('?', 27, 40)
        break
      }
    }

    ctx.restore()
  }, [type, color])

  return (
    <canvas
      ref={canvasRef}
      width={64}
      height={64}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        imageRendering: 'pixelated',
      }}
      className={`inline-block shrink-0 ${className}`}
    />
  )
}
