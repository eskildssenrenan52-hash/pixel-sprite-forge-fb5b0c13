// @ts-nocheck
import { useState, useEffect, useRef } from 'react'
import { fetchGeminiPixelArtBg, BIOME_SCENES, type GeminiPixelArtScene } from '@/lib/game/geminiPixelArt'

interface GameLoaderProps {
  isLoading: boolean
  progress: number // 0 to 100
  statusText?: string
  onComplete?: () => void
}

interface BiomePreview {
  id: string
  name: string
  emoji: string
  color: string
  description: string
  recommendedLvl: string
}

const BIOME_PREVIEWS: BiomePreview[] = [
  {
    id: 'forest',
    name: 'Bosque dos Sussurros',
    emoji: '🌲',
    color: '#22c55e',
    description: 'Florestas densas com gnomos, cogumelos místicos e minério de esmeralda.',
    recommendedLvl: 'Nv. 1 - 15'
  },
  {
    id: 'tundra',
    name: 'Tundra dos Ventos Uivantes',
    emoji: '❄️',
    color: '#38bdf8',
    description: 'Picos nevados eternos, auroras boreais e cristais de gelo sagrado.',
    recommendedLvl: 'Nv. 15 - 30'
  },
  {
    id: 'volcano',
    name: 'Cratera Magmática do Vulcão',
    emoji: '🌋',
    color: '#f97316',
    description: 'Lava ardente, rocha de obsidiana e o ninho do Dragão Ancião.',
    recommendedLvl: 'Nv. 30 - 50'
  },
  {
    id: 'desert',
    name: 'Deserto das Dunas Douradas',
    emoji: '⏳',
    color: '#eab308',
    description: 'Dunas infinitas, ruínas antigas de orcs e oásis de água mística.',
    recommendedLvl: 'Nv. 20 - 40'
  },
  {
    id: 'abyss',
    name: 'Portal do Abismo Infernal',
    emoji: '🔮',
    color: '#a855f7',
    description: 'Fendas de energia negra, cristais sombrios e lordes da necromancia.',
    recommendedLvl: 'Nv. 50 - 80'
  },
  {
    id: 'sky',
    name: 'Ilhas Suspensas das Nuvens',
    emoji: '☁️',
    color: '#e0e7ff',
    description: 'Plataformas flutuantes celestiais com valquírias e bênçãos arcanas.',
    recommendedLvl: 'Nv. 60 - 100'
  }
]

const GAME_TIPS = [
  '💡 Dica: Pressione K para abrir a Árvore de Habilidades da sua classe!',
  '💡 Dica: F2 abre o Editor de Mundo para desenhar e modificar o mapa em tempo real.',
  '💡 Dica: Mande itens raros para a Ferraria para criar equipamentos lendários.',
  '💡 Dica: Use poções no seu cinto rápido para sobreviver contra Chefes de Bioma.',
  '💡 Dica: Derrote monstros do seu elemento para ganhar EXP e Pontos de Prestígio.',
  '💡 Dica: Complete as Missões Diárias (Q) para receber bastante Ouro e Rubis.'
]

export default function GameLoader({ isLoading, progress, statusText, onComplete }: GameLoaderProps) {
  const [currentBiomeIdx, setCurrentBiomeIdx] = useState(0)
  const [currentTipIdx, setCurrentTipIdx] = useState(0)
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  const tickRef = useRef<number>(0)

  // Cycle biomes every 1200ms
  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setCurrentBiomeIdx(prev => (prev + 1) % BIOME_PREVIEWS.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [isLoading])

  // Cycle tips every 2200ms
  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setCurrentTipIdx(prev => (prev + 1) % GAME_TIPS.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [isLoading])

  // Canvas Procedural Pixel Art Renderer
  useEffect(() => {
    const canvas = bgCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = false
    let animId: number

    const renderPixelArt = () => {
      tickRef.current += 1
      const t = tickRef.current
      const w = canvas.width
      const h = canvas.height

      const currentBiome = BIOME_PREVIEWS[currentBiomeIdx]
      const scene = fetchGeminiPixelArtBg(currentBiome.id)

      // 1. Sky Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, scene.skyGradient[0])
      grad.addColorStop(1, scene.skyGradient[1])
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // 2. Stars / Celestial Dust
      for (let i = 0; i < 50; i++) {
        const sx = (i * 123 + t * 0.15) % w
        const sy = (i * 67) % (h * 0.55)
        const alpha = 0.3 + Math.sin(t * 0.08 + i) * 0.4
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0.1, alpha)})`
        ctx.fillRect(Math.floor(sx), Math.floor(sy), i % 3 === 0 ? 3 : 2, i % 3 === 0 ? 3 : 2)
      }

      // 3. Biome-Specific Background Pixel Art
      if (currentBiome.id === 'forest') {
        // Pine Trees Silhouette
        ctx.fillStyle = scene.secondaryColor
        for (let x = -10; x < w + 20; x += 32) {
          const treeH = 45 + Math.sin(x) * 10
          ctx.beginPath()
          ctx.moveTo(x + 16, h - 30 - treeH)
          ctx.lineTo(x, h - 30)
          ctx.lineTo(x + 32, h - 30)
          ctx.closePath()
          ctx.fill()
        }
        // Fireflies
        for (let f = 0; f < 12; f++) {
          const fx = (f * 50 + Math.sin(t * 0.05 + f) * 20) % w
          const fy = h - 40 - ((f * 15 + t * 0.5) % 120)
          ctx.fillStyle = '#86efac'
          ctx.fillRect(Math.floor(fx), Math.floor(fy), 3, 3)
        }
      } else if (currentBiome.id === 'volcano') {
        // Volcano Peak
        ctx.fillStyle = '#260404'
        ctx.beginPath()
        ctx.moveTo(w * 0.5, h * 0.35)
        ctx.lineTo(w * 0.2, h - 25)
        ctx.lineTo(w * 0.8, h - 25)
        ctx.closePath()
        ctx.fill()

        // Magma Crater Glow
        ctx.fillStyle = '#f97316'
        ctx.fillRect(w * 0.46, h * 0.35, w * 0.08, 6)

        // Ember Particles Rising
        for (let e = 0; e < 20; e++) {
          const ex = (w * 0.45) + Math.sin(t * 0.1 + e) * 60
          const ey = (h * 0.35) - ((e * 10 + t * 1.2) % 100)
          ctx.fillStyle = e % 2 === 0 ? '#ea580c' : '#fef08a'
          ctx.fillRect(Math.floor(ex), Math.floor(ey), 3, 3)
        }
      } else if (currentBiome.id === 'tundra') {
        // Snowy Mountains
        ctx.fillStyle = '#0f172a'
        ctx.beginPath()
        ctx.moveTo(0, h - 25)
        ctx.lineTo(w * 0.25, h * 0.3)
        ctx.lineTo(w * 0.5, h - 25)
        ctx.lineTo(w * 0.75, h * 0.35)
        ctx.lineTo(w, h - 25)
        ctx.closePath()
        ctx.fill()

        // Snow Cap
        ctx.fillStyle = '#bae6fd'
        ctx.fillRect(w * 0.23, h * 0.3, 12, 10)
        ctx.fillRect(w * 0.73, h * 0.35, 12, 10)

        // Snowflakes Falling
        for (let s = 0; s < 25; s++) {
          const sx = (s * 35 + t * 0.4) % w
          const sy = (s * 20 + t * 0.9) % h
          ctx.fillStyle = '#f0f9ff'
          ctx.fillRect(Math.floor(sx), Math.floor(sy), 2, 2)
        }
      } else if (currentBiome.id === 'abyss') {
        // Void Vortex Center
        const vx = w * 0.5
        const vy = h * 0.45
        ctx.fillStyle = '#3b0764'
        ctx.beginPath()
        ctx.arc(vx, vy, 45 + Math.sin(t * 0.05) * 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#a855f7'
        ctx.beginPath()
        ctx.arc(vx, vy, 20 + Math.cos(t * 0.05) * 3, 0, Math.PI * 2)
        ctx.fill()

        // Floating Void Runes
        for (let r = 0; r < 12; r++) {
          const rx = vx + Math.cos(t * 0.03 + r) * (60 + r * 5)
          const ry = vy + Math.sin(t * 0.03 + r) * (35 + r * 3)
          ctx.fillStyle = '#e879f9'
          ctx.fillRect(Math.floor(rx), Math.floor(ry), 4, 4)
        }
      } else {
        // Default Horizon Dunes / Floating Clouds
        ctx.fillStyle = scene.secondaryColor
        ctx.beginPath()
        ctx.arc(w * 0.3, h + 80, 180, 0, Math.PI * 2)
        ctx.arc(w * 0.7, h + 90, 200, 0, Math.PI * 2)
        ctx.fill()
      }

      // 4. Pixel Ground Floor
      ctx.fillStyle = scene.themeColor
      ctx.fillRect(0, h - 25, w, 25)
      ctx.fillStyle = '#090d16'
      ctx.fillRect(0, h - 8, w, 8)

      animId = requestAnimationFrame(renderPixelArt)
    }

    renderPixelArt()
    return () => cancelAnimationFrame(animId)
  }, [currentBiomeIdx])

  useEffect(() => {
    if (progress >= 100 && onComplete) {
      const timeout = setTimeout(() => {
        onComplete()
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [progress, onComplete])

  if (!isLoading) return null

  const currentBiome = BIOME_PREVIEWS[currentBiomeIdx]
  const scene = fetchGeminiPixelArtBg(currentBiome.id)
  const currentTip = scene.tipText || GAME_TIPS[currentTipIdx]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#060810',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        color: '#fff',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic Pixel Art Canvas Background */}
      <canvas
        ref={bgCanvasRef}
        width={480}
        height={270}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          imageRendering: 'pixelated',
          opacity: 0.88
        }}
      />

      {/* Dark Radial Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.85) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '92%',
          maxWidth: '520px',
          padding: '26px',
          background: 'rgba(10, 12, 20, 0.95)',
          border: `3px solid ${currentBiome.color}`,
          borderRadius: '12px',
          boxShadow: `0 0 30px ${currentBiome.color}55, inset 0 0 20px rgba(0,0,0,0.9)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '18px',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease'
        }}
      >
        {/* Title & Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '900',
              color: '#f59e0b',
              textShadow: '3px 3px 0 #000, -2px -2px 0 #000, 0 0 16px #f59e0b88',
              letterSpacing: '2px'
            }}
          >
            RUCOY OFFLINE
          </div>
          <div style={{ fontSize: '9px', color: '#38bdf8', letterSpacing: '1px' }}>
            ✦ MOTOR DE BIOMAS & PIXEL ART ✦
          </div>
        </div>

        {/* Biome Pixel Art Card */}
        <div
          style={{
            width: '100%',
            padding: '18px',
            background: 'rgba(0,0,0,0.75)',
            borderRadius: '10px',
            border: `1px solid ${currentBiome.color}aa`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Level Badge */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '12px',
              fontSize: '8px',
              padding: '3px 8px',
              borderRadius: '4px',
              background: `${currentBiome.color}33`,
              color: currentBiome.color,
              border: `1px solid ${currentBiome.color}66`
            }}
          >
            {currentBiome.recommendedLvl}
          </div>

          <div
            style={{
              fontSize: '44px',
              filter: `drop-shadow(0 0 14px ${currentBiome.color})`,
              transform: 'scale(1.05)',
              transition: 'transform 0.3s ease'
            }}
          >
            {currentBiome.emoji}
          </div>

          <div style={{ fontSize: '13px', color: currentBiome.color, textShadow: '1px 1px 0 #000', fontWeight: 'bold' }}>
            {scene.biomeName || currentBiome.name}
          </div>

          <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4', fontFamily: 'sans-serif' }}>
            {scene.loreText || currentBiome.description}
          </div>
        </div>

        {/* Real Status Text */}
        <div style={{ fontSize: '11px', color: '#f8fafc', minHeight: '22px', textShadow: '1px 1px 2px #000', fontWeight: 'bold' }}>
          {statusText || 'Iniciando Motor Rucoy Offline...'}
        </div>

        {/* Real Progress Bar */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              width: '100%',
              height: '24px',
              background: '#090d16',
              border: '2px solid #334155',
              borderRadius: '6px',
              padding: '2px',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated Progress Fill */}
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, progress))}%`,
                background: `linear-gradient(90deg, ${currentBiome.color}, #f59e0b)`,
                borderRadius: '3px',
                transition: 'width 0.15s ease-out',
                boxShadow: `0 0 14px ${currentBiome.color}`
              }}
            />

            {/* Percentage Badge */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '1px 1px 2px #000, -1px -1px 2px #000'
              }}
            >
              {Math.round(progress)}%
            </div>
          </div>

          {/* Cycling Tip Footer */}
          <div style={{ fontSize: '9px', color: '#94a3b8', lineHeight: '1.3', minHeight: '26px', fontFamily: 'sans-serif', fontStyle: 'italic' }}>
            {currentTip}
          </div>
        </div>
      </div>
    </div>
  )
}
