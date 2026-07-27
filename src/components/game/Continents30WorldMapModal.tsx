import React, { useState, useEffect, useRef } from 'react'
import type { Player } from '../../lib/game/types'
import { CONTINENTS_30 } from '../../lib/game/continentsSystem'
import { Globe, MapPin, Compass, Search, Shield, Zap, Sparkles, Navigation, Layers, Grid, Filter } from 'lucide-react'

interface Continents30WorldMapModalProps {
  player: Player
  onWarpToMap: (mapId: string) => void
  onClose: () => void
}

export const Continents30WorldMapModal: React.FC<Continents30WorldMapModalProps> = ({ player, onWarpToMap, onClose }) => {
  const [selectedContinentNum, setSelectedContinentNum] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<'atlas' | 'biomes' | 'islands' | 'planet'>('atlas')
  const [biomeSearch, setBiomeSearch] = useState('')

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const planetCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const selectedContinent = CONTINENTS_30.find(c => c.number === selectedContinentNum) || CONTINENTS_30[0]

  // Render Continent 52 Biomes Layout on Canvas
  useEffect(() => {
    if (activeTab !== 'atlas' || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background Ocean
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const cx = canvas.width / 2
    const cy = canvas.height / 2

    // Draw 52 Biome Zones
    selectedContinent.biomes.forEach((b, i) => {
      let bx = cx
      let by = cy

      switch (selectedContinent.organizationStyle) {
        case 'spiral': {
          const angle = i * 0.45
          const r = 15 + i * 2.8
          bx = cx + Math.cos(angle) * r
          by = cy + Math.sin(angle) * r
          break
        }
        case 'concentric': {
          const ring = Math.floor(i / 8) + 1
          const pos = i % 8
          const angle = (pos / 8) * Math.PI * 2
          const r = ring * 22
          bx = cx + Math.cos(angle) * r
          by = cy + Math.sin(angle) * r
          break
        }
        case 'checkerboard': {
          const gx = i % 8
          const gy = Math.floor(i / 8)
          bx = 40 + gx * 28
          by = 40 + gy * 28
          break
        }
        case 'clustered': {
          const cluster = Math.floor(i / 13)
          const angle = (cluster / 4) * Math.PI * 2
          const cRadius = 70
          const clx = cx + Math.cos(angle) * cRadius
          const cly = cy + Math.sin(angle) * cRadius
          const subAngle = ((i % 13) / 13) * Math.PI * 2
          bx = clx + Math.cos(subAngle) * 22
          by = cly + Math.sin(subAngle) * 22
          break
        }
        case 'linear_valley': {
          const step = (i - 26) * 5
          bx = cx + step
          by = cy + Math.sin(i * 0.3) * 50
          break
        }
        case 'scattered_archipelago': {
          const angle = (i / 52) * Math.PI * 2
          const r = 50 + (i % 4) * 20
          bx = cx + Math.cos(angle) * r
          by = cy + Math.sin(angle) * r
          break
        }
        case 'labyrinth': {
          const gx = i % 8
          const gy = Math.floor(i / 8)
          bx = 45 + gx * 26 + (gy % 2 === 0 ? 10 : 0)
          by = 45 + gy * 26
          break
        }
      }

      // Biome circle node
      ctx.fillStyle = selectedContinent.color
      ctx.beginPath()
      ctx.arc(bx, by, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#ffffff80'
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Draw 20 Offshore Islands
    selectedContinent.islands.forEach((isl, i) => {
      const angle = (i / 20) * Math.PI * 2
      const ix = cx + Math.cos(angle) * 125
      const iy = cy + Math.sin(angle) * 125

      ctx.fillStyle = isl.secretDungeon ? '#f59e0b' : '#38bdf8'
      ctx.beginPath()
      ctx.arc(ix, iy, 4, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [selectedContinent, activeTab])

  // Render Planet Map Canvas
  useEffect(() => {
    if (activeTab !== 'planet' || !planetCanvasRef.current) return
    const canvas = planetCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#020617'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const cx = canvas.width / 2
    const cy = canvas.height / 2

    // Draw 30 Continents on Planet Sphere Grid
    CONTINENTS_30.forEach((cont, idx) => {
      const angle = (idx / 30) * Math.PI * 2
      const r = 60 + (idx % 3) * 45
      const px = cx + Math.cos(angle) * r
      const py = cy + Math.sin(angle) * r

      const isSel = cont.number === selectedContinentNum

      ctx.fillStyle = cont.portalColor
      ctx.beginPath()
      ctx.arc(px, py, isSel ? 12 : 8, 0, Math.PI * 2)
      ctx.fill()

      if (isSel) {
        ctx.strokeStyle = '#fef08a'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      ctx.fillStyle = '#94a3b8'
      ctx.font = '9px sans-serif'
      ctx.fillText(`C${cont.number}`, px - 6, py + 18)
    })
  }, [activeTab, selectedContinentNum])

  const filteredBiomes = selectedContinent.biomes.filter(b =>
    b.name.toLowerCase().includes(biomeSearch.toLowerCase()) ||
    b.description.toLowerCase().includes(biomeSearch.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-sky-500/40 rounded-xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 border-b border-sky-500/30 bg-gradient-to-r from-sky-950/80 to-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Globe className="w-7 h-7 text-sky-400 animate-pulse" />
            <div>
              <h2 className="text-xl font-bold text-sky-300">Mapa Mundi — 30 Continentes e 1.560 Biomas</h2>
              <p className="text-xs text-slate-400">
                Cada continente possui <b>52 biomas gigantes organizados de forma única</b> e 20 ilhas marítimas com masmorras infinitas.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold text-sm">✕</button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          
          {/* Continent List Selector (30 Continents) */}
          <div className="p-3 overflow-y-auto max-h-[35vh] md:max-h-[75vh] space-y-1.5 bg-slate-950/40">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Selecionar Continente (30)
            </div>

            {CONTINENTS_30.map(cont => {
              const isSelected = cont.number === selectedContinentNum
              const meetsLvl = player.level >= cont.minLevel

              return (
                <button
                  key={cont.id}
                  onClick={() => setSelectedContinentNum(cont.number)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex justify-between items-center ${
                    isSelected
                      ? 'bg-sky-900/60 border-sky-400 text-white font-bold shadow-md'
                      : meetsLvl
                      ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                      : 'bg-slate-900/80 border-slate-800/80 text-slate-500 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cont.portalColor }} />
                    <span className="truncate max-w-[150px]">{cont.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {cont.organizationStyle.toUpperCase()}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${meetsLvl ? 'bg-sky-950 text-sky-300' : 'bg-rose-950 text-rose-400'}`}>
                      Lv {cont.minLevel}+
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Selected Continent View Panel */}
          <div className="md:col-span-2 p-4 overflow-y-auto space-y-4 flex flex-col justify-between">
            <div>
              {/* Continent Banner */}
              <div
                className="p-4 rounded-xl border mb-3 relative overflow-hidden"
                style={{
                  borderColor: `${selectedContinent.portalColor}80`,
                  background: `linear-gradient(135deg, ${selectedContinent.portalColor}20, rgba(15,23,42,0.95))`,
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-400" /> {selectedContinent.name}
                    </h3>
                    <span className="text-xs text-amber-300 font-medium">
                      {selectedContinent.title} — Organização: <b className="text-sky-300 uppercase">{selectedContinent.organizationStyle}</b>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onWarpToMap(selectedContinent.id)
                      onClose()
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition-all"
                  >
                    <Navigation className="w-4 h-4" /> Viajar ao Continente
                  </button>
                </div>

                <p className="text-xs text-slate-300 mb-3">{selectedContinent.description}</p>

                <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                  <span className="bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700">
                    Biomas Totais: <b className="text-amber-400">52 Biomas</b>
                  </span>
                  <span className="bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700">
                    Ilhas do Continente: <b className="text-sky-400">{selectedContinent.islands.length} Ilhas</b>
                  </span>
                  <span className="bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700">
                    Profundidade Média: <b className="text-emerald-400">8 a 12 Andares/Ilha</b>
                  </span>
                </div>
              </div>

              {/* View Tabs */}
              <div className="flex gap-2 mb-3 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveTab('atlas')}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 ${
                    activeTab === 'atlas' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Atlas Canvas do Continente
                </button>
                <button
                  onClick={() => setActiveTab('biomes')}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 ${
                    activeTab === 'biomes' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" /> 52 Biomas em Lista
                </button>
                <button
                  onClick={() => setActiveTab('islands')}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 ${
                    activeTab === 'islands' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> 20 Ilhas Marítimas
                </button>
                <button
                  onClick={() => setActiveTab('planet')}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 ${
                    activeTab === 'planet' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Visão Geral do Planeta
                </button>
              </div>

              {/* Tab 1: Canvas Atlas */}
              {activeTab === 'atlas' && (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center">
                  <div className="text-xs text-slate-400 mb-2">
                    Visualização da Estrutura <b>{selectedContinent.organizationStyle.toUpperCase()}</b> dos 52 Biomas + 20 Ilhas
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={320}
                    height={320}
                    className="border border-sky-500/30 rounded-lg bg-slate-900 shadow-inner"
                  />
                </div>
              )}

              {/* Tab 2: 52 Biomes List */}
              {activeTab === 'biomes' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded border border-slate-700">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar entre os 52 biomas..."
                      value={biomeSearch}
                      onChange={e => setBiomeSearch(e.target.value)}
                      className="bg-transparent text-xs text-slate-200 outline-none w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                    {filteredBiomes.map((b) => (
                      <div key={b.id} className="bg-slate-800/60 border border-slate-700/60 rounded p-2.5 text-xs">
                        <div className="font-bold text-sky-300">{b.name}</div>
                        <div className="text-[10px] text-amber-400 mb-1">Recomendado: Nível {b.recommendedLevel}+</div>
                        <div className="text-[11px] text-slate-300">{b.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: 20 Offshore Islands */}
              {activeTab === 'islands' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                  {selectedContinent.islands.map((isl) => (
                    <div key={isl.id} className="bg-slate-800/60 border border-slate-700/60 rounded p-2 text-xs">
                      <div className="font-bold text-slate-200 truncate">{isl.name}</div>
                      <div className="text-[10px] text-sky-400">{isl.biomeName}</div>
                      <div className="text-[10px] text-slate-400">Masmorra: {isl.floorsCount} andares</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Planet Overview */}
              {activeTab === 'planet' && (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center">
                  <div className="text-xs text-slate-400 mb-2">Visão Esférica do Planeta Imperial (30 Continentes)</div>
                  <canvas
                    ref={planetCanvasRef}
                    width={320}
                    height={320}
                    className="border border-sky-500/30 rounded-lg bg-slate-950 shadow-inner"
                  />
                </div>
              )}

            </div>

            {/* Direct Warp Hall */}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">Prefere ir ao Salão dos Portais em pessoa?</span>
              <button
                onClick={() => {
                  onWarpToMap('portal_hall')
                  onClose()
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded border border-amber-500/30"
              >
                Entrar no Salão Imperial dos 30 Portais
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
