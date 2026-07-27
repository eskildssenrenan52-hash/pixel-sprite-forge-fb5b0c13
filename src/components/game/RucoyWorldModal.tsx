import { memo, useState, useRef, useEffect, useMemo } from 'react'
import type { Player, MonsterType } from '@/lib/game/types'
import { getAllMegaBiomeSpecs } from '@/lib/game/megaBiomes'
import { OPEN_WORLD_REGIONS, WORLD_MAP_SIZE, BiomeRegion, getOrCreateWorldMapTexture } from '@/lib/game/unifiedWorldGenerator'
import { ALL_100_BIOMES } from '@/lib/game/new100Biomes'

interface MapData {
  id: string
  name: string
  minLvl: number
  description?: string
  category?: string
  weather?: string
  mobs?: MonsterType[]
  boss?: MonsterType
  coords?: { x: number; y: number }
}

interface Props {
  isOpen: boolean
  onClose: () => void
  player: Player
  currentMapId: string
  onMapChange: (mapId: string) => void
}

// Map monster types to Portuguese names & Emojis
const MONSTER_INFO: Record<string, { name: string; emoji: string }> = {
  slime: { name: 'Slime', emoji: '🟢' },
  goblin: { name: 'Goblin', emoji: '🧌' },
  wolf: { name: 'Lobo Selvagem', emoji: '🐺' },
  orc: { name: 'Orc Guerreiro', emoji: '👹' },
  skeleton: { name: 'Esqueleto', emoji: '💀' },
  spider: { name: 'Aranha Venenosa', emoji: '🕷️' },
  zombie: { name: 'Zumbi Putrefato', emoji: '🧟' },
  witch: { name: 'Bruxa das Sombras', emoji: '🧙' },
  demon: { name: 'Demônio Infernal', emoji: '😈' },
  dragon: { name: 'Dragão Ancestral', emoji: '🐉' },
  troll: { name: 'Troll da Montanha', emoji: '🗿' },
  knight_enemy: { name: 'Cavaleiro Negro', emoji: '⚔️' },
  mage_enemy: { name: 'Mago Sombrio', emoji: '🔮' },
  archer_enemy: { name: 'Arqueiro Renegado', emoji: '🏹' },
  treant: { name: 'Ent Espinhoso', emoji: '🪵' },
  ghost: { name: 'Espectro', emoji: '👻' },
  vampire: { name: 'Vampiro Abissal', emoji: '🦇' },
}

const WEATHER_INFO: Record<string, { name: string; icon: string }> = {
  none: { name: 'Clima Agradável', icon: '☀️' },
  rain: { name: 'Chuva Tropical', icon: '🌧️' },
  storm: { name: 'Tempestade Elétrica', icon: '⚡' },
  snow: { name: 'Nevasca Glacial', icon: '❄️' },
  fog: { name: 'Névoa Densa', icon: '🌫️' },
  sandstorm: { name: 'Tempestade de Areia', icon: '🌪️' },
  ash_fall: { name: 'Chuva de Cinzas Vulcânicas', icon: '🌋' },
  aurora: { name: 'Aurora Boreal Mística', icon: '✨' },
}

const CATEGORY_NAMES: Record<string, { name: string; icon: string; color: string }> = {
  all: { name: 'Todos os Biomas', icon: '🌐', color: '#e2e8f0' },
  hub: { name: 'Capital & Cidades', icon: '🏰', color: '#fde047' },
  forest: { name: 'Florestas & Bosques', icon: '🌲', color: '#22c55e' },
  desert: { name: 'Desertos & Cânions', icon: '🏜️', color: '#eab308' },
  volcano: { name: 'Vulcões & Fogo', icon: '🌋', color: '#ef4444' },
  tundra: { name: 'Gelo & Tundra', icon: '❄️', color: '#06b6d4' },
  swamp: { name: 'Pântanos & Mangues', icon: '🌿', color: '#10b981' },
  crystal: { name: 'Cristais & Cavernas', icon: '💎', color: '#a855f7' },
  abyss: { name: 'Abismo & Trevas', icon: '🌌', color: '#8b5cf6' },
  ruins: { name: 'Ruínas Antigas', icon: '🏛️', color: '#f97316' },
  sky: { name: 'Céu & Celestial', icon: '☁️', color: '#38bdf8' },
  mega: { name: 'Mega Biomas Únicos', icon: '🌐', color: '#ec4899' },
  dungeon: { name: 'Masmorra das Sombras', icon: '🏚️', color: '#64748b' },
}

let _destinationsCache: MapData[] | null = null

function getDestinations(): MapData[] {
  if (_destinationsCache) return _destinationsCache

  const destinations: MapData[] = [
    { id: 'city', name: 'Capital Real de Rucoy', minLvl: 1, description: 'Hub central, comércio e centro do mundo', category: 'hub', weather: 'none', coords: { x: 240, y: 240 } },
  ]

  // Adiciona os 100 Biomas Principais
  for (const b of ALL_100_BIOMES) {
    const reg = OPEN_WORLD_REGIONS.find(r => r.id === b.id)
    destinations.push({
      id: b.id,
      name: b.name,
      minLvl: b.minLevel,
      description: `Bioma de ${b.category.toUpperCase()} · Inimigos Nv.${b.minLevel}+`,
      category: b.category,
      weather: b.weather,
      mobs: b.mobPool,
      boss: b.bossType,
      coords: reg ? { x: reg.centerX, y: reg.centerY } : undefined
    })
  }

  // Adiciona Mega Biomas
  for (const m of getAllMegaBiomeSpecs()) {
    const reg = OPEN_WORLD_REGIONS.find(r => r.id === m.id)
    destinations.push({
      id: m.id,
      name: m.name,
      minLvl: m.minLvl,
      description: `Mega Bioma ${m.pattern.toUpperCase()} · Desafio Épico Nv.${m.minLvl}+`,
      category: 'mega',
      weather: m.pal.base === 'ice' ? 'snow' : (m.pal.base === 'ash' ? 'ash_fall' : 'none'),
      mobs: m.pool as MonsterType[],
      boss: m.boss as MonsterType,
      coords: reg ? { x: reg.centerX, y: reg.centerY } : undefined
    })
  }

  // Adiciona Andares de Masmorra
  for (let f = 1; f <= 100; f++) {
    destinations.push({
      id: `dungeon${f}`,
      name: `Masmorra das Sombras — Andar ${f}/100`,
      minLvl: 5 + Math.floor(f * 1.5),
      description: f === 100 ? '👑 Sala do Boss Overlord Abissal' : `Desafio do Calabouço Andar ${f}`,
      category: 'dungeon',
      mobs: ['skeleton', 'vampire', 'demon'],
      boss: f % 10 === 0 ? 'demon' : undefined
    })
  }

  _destinationsCache = destinations
  return destinations
}

const ALL_DESTINATIONS: MapData[] = new Proxy([] as MapData[], {
  get(_target, prop, receiver) {
    const list = getDestinations()
    const val = Reflect.get(list, prop, receiver)
    return typeof val === 'function' ? val.bind(list) : val
  },
  ownKeys() {
    return Reflect.ownKeys(getDestinations())
  },
  getOwnPropertyDescriptor(_target, prop) {
    return Reflect.getOwnPropertyDescriptor(getDestinations(), prop)
  }
})

const MAP_ICON = (id: string, category?: string) => {
  if (id === 'city') return '🏰'
  if (id.startsWith('dungeon')) return '🏚️'
  if (category && CATEGORY_NAMES[category]) return CATEGORY_NAMES[category].icon
  return '📍'
}

function RucoyWorldModal({ isOpen, onClose, player, currentMapId, onMapChange }: Props) {
  const [selectedMapId, setSelectedMapId] = useState<string>('city')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'visual' | 'grid'>('visual')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredMapId, setHoveredMapId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Visited biomes tracker (Capital Real + Current Map are always visited)
  const visitedSet = useMemo(() => {
    const set = new Set<string>(['city', currentMapId])
    if (player._visitedMapIds && Array.isArray(player._visitedMapIds)) {
      for (const id of player._visitedMapIds) {
        set.add(id)
      }
    }
    return set
  }, [player._visitedMapIds, currentMapId])

  const isMapVisited = (id: string) => visitedSet.has(id)

  // Map Data at glance
  const selectedData = useMemo(() => {
    return ALL_DESTINATIONS.find(d => d.id === selectedMapId) || ALL_DESTINATIONS[0]
  }, [selectedMapId])

  const filteredMapList = useMemo(() => {
    return ALL_DESTINATIONS.filter(m => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'mega' && m.category !== 'mega') return false
        if (selectedCategory !== 'mega' && m.category !== selectedCategory) return false
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = m.name.toLowerCase().includes(q)
        const matchId = m.id.toLowerCase().includes(q)
        const matchDesc = m.description && m.description.toLowerCase().includes(q)
        const matchCategory = m.category && m.category.toLowerCase().includes(q)
        return matchName || matchId || matchDesc || matchCategory
      }
      return true
    })
  }, [selectedCategory, searchQuery])

  // Canvas Drawing for High-Detail Fantasy Interactive World Map
  useEffect(() => {
    if (!isOpen || viewMode !== 'visual') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    // 1. Draw Real World 1:1 Pixel Map Terrain Canvas
    const worldTexture = getOrCreateWorldMapTexture()
    ctx.imageSmoothingEnabled = true
    ctx.drawImage(worldTexture, 0, 0, W, H)

    // Cartography Latitude/Longitude Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1
    for (let gx = 0; gx < W; gx += 40) {
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.lineTo(gx, H)
      ctx.stroke()
    }
    for (let gy = 0; gy < H; gy += 40) {
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(W, gy)
      ctx.stroke()
    }

    const scaleX = W / WORLD_MAP_SIZE
    const scaleY = H / WORLD_MAP_SIZE

    // 2. Fog of War Cloud Overlay for Unvisited Biomes
    for (const reg of OPEN_WORLD_REGIONS) {
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'mega' && !reg.category?.startsWith('mega')) continue
        if (selectedCategory !== 'mega' && reg.category !== selectedCategory && reg.id !== 'city') continue
      }

      const cx = reg.centerX * scaleX
      const cy = reg.centerY * scaleY
      const rad = Math.max(16, reg.radius * scaleX * 1.3)
      const visited = isMapVisited(reg.id)

      if (!visited) {
        // Organic dark fog of war over unexplored territory
        const fogGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rad)
        fogGrad.addColorStop(0, 'rgba(8, 12, 22, 0.96)')
        fogGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.88)')
        fogGrad.addColorStop(1, 'rgba(8, 12, 22, 0.25)')

        ctx.fillStyle = fogGrad
        ctx.beginPath()
        ctx.arc(cx, cy, rad, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Discovered territory subtle golden border
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.3)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(cx, cy, rad * 0.9, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // 3. Trade Routes & Golden Highways (Revealed only between discovered biomes)
    const cityX = (WORLD_MAP_SIZE / 2) * scaleX
    const cityY = (WORLD_MAP_SIZE / 2) * scaleY

    for (const reg of OPEN_WORLD_REGIONS) {
      if (reg.id === 'city') continue
      const visited = isMapVisited(reg.id)

      if (reg.minLevel % 10 === 0 || reg.radius > 18) {
        ctx.beginPath()
        ctx.moveTo(cityX, cityY)
        ctx.lineTo(reg.centerX * scaleX, reg.centerY * scaleY)

        if (visited) {
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)'
          ctx.lineWidth = 1.5
          ctx.setLineDash([3, 3])
        } else {
          ctx.strokeStyle = 'rgba(71, 85, 105, 0.15)'
          ctx.lineWidth = 1
          ctx.setLineDash([2, 4])
        }
        ctx.stroke()
      }
    }
    ctx.setLineDash([])

    // 4. Capital Real Castle Hub Highlight
    ctx.fillStyle = '#fde047'
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(cityX, cityY, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // 5. Render Biome Node Pins & Fog of War Clouds
    for (const reg of OPEN_WORLD_REGIONS) {
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'mega' && !reg.category?.startsWith('mega')) continue
        if (selectedCategory !== 'mega' && reg.category !== selectedCategory && reg.id !== 'city') continue
      }

      const cx = reg.centerX * scaleX
      const cy = reg.centerY * scaleY

      const isCurrent = currentMapId === reg.id
      const isSelected = selectedMapId === reg.id
      const isHovered = hoveredMapId === reg.id
      const visited = isMapVisited(reg.id)

      if (!visited) {
        // FOG OF WAR OVERLAY CLOUD
        const cloudRad = Math.max(12, reg.radius * scaleX * 1.1)
        const fogGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, cloudRad)
        fogGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)')
        fogGrad.addColorStop(0.7, 'rgba(30, 41, 59, 0.85)')
        fogGrad.addColorStop(1, 'rgba(15, 23, 42, 0)')

        ctx.fillStyle = fogGrad
        ctx.beginPath()
        ctx.arc(cx, cy, cloudRad, 0, Math.PI * 2)
        ctx.fill()

        // Fog Lock / Mystery Badge
        ctx.fillStyle = '#64748b'
        ctx.font = '10px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('☁️', cx, cy + 3)

        if (isSelected) {
          ctx.strokeStyle = '#94a3b8'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(cx, cy, 10, 0, Math.PI * 2)
          ctx.stroke()
        }
      } else {
        // DISCOVERED BIOME NODE
        if (isSelected) {
          // Selection glow ring
          ctx.strokeStyle = '#f59e0b'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(cx, cy, 11, 0, Math.PI * 2)
          ctx.stroke()

          ctx.fillStyle = '#fbbf24'
          ctx.beginPath()
          ctx.arc(cx, cy, 6, 0, Math.PI * 2)
          ctx.fill()
        } else if (isCurrent) {
          // Current location beacon radar pulse
          ctx.strokeStyle = '#10b981'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(cx, cy, 9, 0, Math.PI * 2)
          ctx.stroke()

          ctx.fillStyle = '#34d399'
          ctx.beginPath()
          ctx.arc(cx, cy, 5, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = player.level >= reg.minLevel ? '#f8fafc' : '#94a3b8'
          ctx.strokeStyle = player.level >= reg.minLevel ? '#0284c7' : '#475569'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(cx, cy, isHovered ? 5 : 4, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }

        // Draw Level Badge for high level/boss regions
        if (reg.minLevel >= 20 || reg.radius >= 20) {
          ctx.fillStyle = player.level >= reg.minLevel ? '#fde047' : '#ef4444'
          ctx.font = 'bold 9px monospace'
          ctx.textAlign = 'center'
          ctx.fillText(`v${reg.minLevel}`, cx, cy - 7)
        }
      }
    }

    // 6. Draw Player Location Indicator Beacon
    const curReg = OPEN_WORLD_REGIONS.find(r => r.id === currentMapId)
    if (curReg) {
      const px = curReg.centerX * scaleX
      const py = curReg.centerY * scaleY

      ctx.fillStyle = '#34d399'
      ctx.font = 'bold 10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('📍 VOCÊ', px, py - 14)
    }

  }, [isOpen, viewMode, currentMapId, selectedMapId, selectedCategory, player.level, hoveredMapId, visitedSet])

  if (!isOpen) return null

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = WORLD_MAP_SIZE / rect.width
    const scaleY = WORLD_MAP_SIZE / rect.height
    const worldX = (e.clientX - rect.left) * scaleX
    const worldY = (e.clientY - rect.top) * scaleY

    let bestRegion: BiomeRegion | null = null
    let minDist = Infinity

    for (const r of OPEN_WORLD_REGIONS) {
      const d = Math.hypot(worldX - r.centerX, worldY - r.centerY)
      if (d < minDist) {
        minDist = d
        bestRegion = r
      }
    }

    if (minDist < 30 && bestRegion) {
      setHoveredMapId(bestRegion.id)
    } else {
      setHoveredMapId(null)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = WORLD_MAP_SIZE / rect.width
    const scaleY = WORLD_MAP_SIZE / rect.height
    const worldX = (e.clientX - rect.left) * scaleX
    const worldY = (e.clientY - rect.top) * scaleY

    let bestRegion = OPEN_WORLD_REGIONS[0]
    let minDist = Infinity

    for (const r of OPEN_WORLD_REGIONS) {
      const d = Math.hypot(worldX - r.centerX, worldY - r.centerY)
      if (d < minDist) {
        minDist = d
        bestRegion = r
      }
    }

    if (minDist < 35) {
      setSelectedMapId(bestRegion.id)
    }
  }

  const handleTravelToSelected = () => {
    if (player.level >= selectedData.minLvl) {
      onMapChange(selectedData.id)
      onClose()
    }
  }

  const isSelectedVisited = isMapVisited(selectedData.id)

  return (
    <div
      className="rcy-overlay rcy-pixel animate-in fade-in duration-200"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="rcy-modal rcy-modal--xl rcy-pop-in max-h-[92vh] flex flex-col bg-slate-950 text-slate-100 border border-slate-800 rounded-xl shadow-2xl overflow-hidden transition-transform duration-200">
        {/* Modal Header */}
        <div className="rcy-modal__header flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="rcy-modal__title text-amber-400 font-extrabold text-base tracking-wider flex items-center gap-2">
              <span>🗺️</span>
              <span>MAPA MUNDI — BIOMAS & NÉVOA DE GUERRA</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              Nv. {player.level} · {visitedSet.size}/{ALL_DESTINATIONS.length} Explorados
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(v => v === 'visual' ? 'grid' : 'visual')}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-colors flex items-center gap-1.5"
            >
              <span>{viewMode === 'visual' ? '📋 Lista Geral' : '🗺️ Mapa Interativo'}</span>
            </button>
            <button className="rcy-btn rcy-btn--icon rcy-btn--close text-slate-400 hover:text-white text-lg" onClick={onClose} aria-label="Fechar">×</button>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2 bg-slate-900/90 border-b border-slate-800 scrollbar-none">
          {Object.entries(CATEGORY_NAMES).map(([catKey, catInfo]) => {
            const isActive = selectedCategory === catKey
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors border ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{catInfo.icon}</span>
                <span>{catInfo.name}</span>
              </button>
            )
          })}
        </div>

        {/* Search Bar for Grid mode */}
        {viewMode === 'grid' && (
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800">
            <input
              type="text"
              placeholder="🔍 Pesquisar bioma, monstro, clima ou andar (ex: 'Floresta', 'Lava', 'Dragão', 'Andar 50')..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 text-amber-300 placeholder-slate-500 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-amber-500/80"
            />
          </div>
        )}

        {/* Body Container */}
        <div className="rcy-modal__body overflow-y-auto flex-1 p-3">
          {viewMode === 'visual' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Left/Main Column: World Map Canvas */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center p-2 bg-slate-950 rounded-xl border border-slate-800 relative shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={560}
                  height={380}
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMouseMove}
                  className="w-full h-80 sm:h-96 rounded-lg border border-slate-800 cursor-pointer object-contain"
                />
                <div className="mt-2 text-[11px] text-slate-400 text-center font-medium flex items-center justify-between w-full px-2">
                  <span>💡 Clique nos nós do mapa para inspecionar e viajar</span>
                  <span className="text-amber-400/90 font-semibold">☁️ Névoa cobre áreas não visitadas</span>
                </div>
              </div>

              {/* Right Column: Detailed Biome Inspector Panel */}
              <div className="flex flex-col bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 justify-between">
                <div>
                  {/* Biome Title & Category Header */}
                  <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{isSelectedVisited ? MAP_ICON(selectedData.id, selectedData.category) : '☁️'}</span>
                        <h3 className="text-amber-400 font-extrabold text-sm">
                          {isSelectedVisited ? selectedData.name : `${selectedData.name} (Inexplorado)`}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isSelectedVisited
                          ? (selectedData.description || 'Região Explorada de Rucoy')
                          : '☁️ Bioma sob Névoa de Guerra. Viaje até a região para revelar sua fauna completa.'}
                      </p>
                    </div>
                  </div>

                  {/* Fog of War Status Banner */}
                  {!isSelectedVisited && (
                    <div className="my-2.5 p-2 bg-indigo-950/40 border border-indigo-500/40 rounded-lg text-xs text-indigo-200 flex items-center gap-2">
                      <span className="text-base">☁️</span>
                      <div>
                        <div className="font-bold text-indigo-300">Névoa de Guerra Ativa</div>
                        <div className="text-[10px] text-indigo-300/80">Você ainda não pisou neste bioma. O mapa se revelará ao explorar.</div>
                      </div>
                    </div>
                  )}

                  {/* Level Requirement & Status Badge */}
                  <div className="my-2.5 p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Nível Recomendado:</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                      player.level >= selectedData.minLvl
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}>
                      {player.level >= selectedData.minLvl ? '✅ Nv.' : '🔒 Nv.'} {selectedData.minLvl}+
                    </span>
                  </div>

                  {/* Climate & Weather */}
                  {selectedData.weather && WEATHER_INFO[selectedData.weather] && (
                    <div className="mb-2.5 p-2 bg-slate-950/70 rounded-lg border border-slate-800 text-xs">
                      <div className="text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                        <span>{WEATHER_INFO[selectedData.weather].icon}</span>
                        <span>Clima Atmosférico:</span>
                      </div>
                      <span className="text-amber-300 font-semibold pl-5">
                        {WEATHER_INFO[selectedData.weather].name}
                      </span>
                    </div>
                  )}

                  {/* Native Monster Population */}
                  {selectedData.mobs && selectedData.mobs.length > 0 && (
                    <div className="mb-2.5 p-2 bg-slate-950/70 rounded-lg border border-slate-800 text-xs">
                      <div className="text-slate-400 font-medium mb-1.5 flex items-center gap-1">
                        <span>👾</span>
                        <span>Habitantes Nativo (Fauna):</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {isSelectedVisited ? (
                          selectedData.mobs.map(m => {
                            const info = MONSTER_INFO[m] || { name: m, emoji: '👾' }
                            return (
                              <span key={m} className="px-2 py-0.5 bg-slate-900 border border-slate-700/80 rounded text-[11px] text-slate-200 flex items-center gap-1">
                                <span>{info.emoji}</span>
                                <span>{info.name}</span>
                              </span>
                            )
                          })
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">❓ Criaturas Ocultas pela Névoa</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Chief Biome Boss */}
                  {selectedData.boss && (
                    <div className="mb-2.5 p-2 bg-amber-950/20 border border-amber-500/30 rounded-lg text-xs">
                      <div className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                        <span>👑</span>
                        <span>Lorde Supremo do Bioma:</span>
                      </div>
                      <span className="text-amber-200 font-extrabold pl-5">
                        {isSelectedVisited
                          ? (MONSTER_INFO[selectedData.boss]?.name || selectedData.boss)
                          : '❓ Chefe Desconhecido'}
                      </span>
                    </div>
                  )}

                  {/* Coordinates & Region Info */}
                  {selectedData.coords && (
                    <div className="text-[10px] text-slate-500 flex items-center justify-between px-1">
                      <span>Coordenadas Mundiais: X:{selectedData.coords.x}, Y:{selectedData.coords.y}</span>
                      <span>{Math.round(Math.hypot(selectedData.coords.x - 240, selectedData.coords.y - 240) * 10)}m da Capital</span>
                    </div>
                  )}
                </div>

                {/* Teleport / Travel Action Button */}
                <div className="mt-4 pt-2 border-t border-slate-800">
                  <button
                    onClick={handleTravelToSelected}
                    disabled={player.level < selectedData.minLvl}
                    className={`w-full py-2.5 px-3 rounded-lg font-extrabold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 ${
                      player.level >= selectedData.minLvl
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-[0.98] shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {player.level >= selectedData.minLvl ? (
                      <>
                        <span>🚀 VIAJAR PARA ESTE BIOMA</span>
                      </>
                    ) : (
                      <>
                        <span>🔒 NÍVEL {selectedData.minLvl} REQUERIDO</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Grid View Mode */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredMapList.map(mapData => {
                const locked = player.level < mapData.minLvl
                const visited = isMapVisited(mapData.id)
                const isActive = currentMapId === mapData.id
                const isSelected = selectedMapId === mapData.id

                return (
                  <div
                    key={mapData.id}
                    onClick={() => setSelectedMapId(mapData.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300 shadow-md'
                        : isSelected
                        ? 'bg-amber-950/40 border-amber-500/80 text-amber-300 shadow-md'
                        : !visited
                        ? 'bg-slate-950 border-slate-800/80 text-slate-400'
                        : locked
                        ? 'bg-slate-950/50 border-slate-900 text-slate-600'
                        : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 text-xs font-bold truncate">
                        <span className="truncate flex items-center gap-1">
                          <span>{visited ? MAP_ICON(mapData.id, mapData.category) : '☁️'}</span>
                          <span className="truncate">{visited ? mapData.name : `${mapData.name}`}</span>
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          locked ? 'bg-red-950/80 text-red-400 border border-red-900' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-900'
                        }`}>
                          Nv.{mapData.minLvl}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-1">
                        {visited ? mapData.description : '☁️ Bioma sob Névoa de Guerra'}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
                      {mapData.weather && WEATHER_INFO[mapData.weather] && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span>{WEATHER_INFO[mapData.weather].icon}</span>
                          <span>{WEATHER_INFO[mapData.weather].name}</span>
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!locked) {
                            onMapChange(mapData.id)
                            onClose()
                          }
                        }}
                        disabled={locked}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          locked ? 'bg-slate-800 text-slate-600' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        {locked ? 'Bloqueado' : 'Viajar ➔'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="rcy-modal__footer border-t border-slate-800 px-4 py-2.5 bg-slate-900/90 backdrop-blur-md flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">Bioma Selecionado:</span>
            <span className="text-slate-200 font-semibold">{selectedData.name}</span>
            <span className="text-slate-500">· Nv.{selectedData.minLvl}+</span>
            {!isSelectedVisited && <span className="text-indigo-400 font-medium">(Inexplorado)</span>}
          </div>
          <div className="text-slate-500 text-[11px]">
            [M] para fechar o mapa
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(RucoyWorldModal)
