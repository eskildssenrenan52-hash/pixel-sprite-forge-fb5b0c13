import { useState } from 'react'
import type { CharacterClass, Player } from '@/lib/game/types'
import { ALL_100_CLASSES } from '@/lib/game/hundredClassesData'
import ClassPixelArtPreview from './ClassPixelArtPreview'

interface Props {
  player: Player
  onSwitch: (cls: CharacterClass) => void
}

export interface ClassInfo {
  id: CharacterClass
  label: string
  subclass: string
  icon: string
  color: string
  poseName: string
  description: string
  primaryStat: string
  difficulty: string
  specialSkill: string
}

export const CLASSES_LIST: ClassInfo[] = ALL_100_CLASSES.map((c, idx) => ({
  id: c.id,
  label: c.name,
  subclass: c.subclass,
  icon: c.icon,
  color: c.color,
  poseName: c.subclass,
  description: c.description,
  primaryStat: c.primarySkillName,
  difficulty: idx < 10 ? 'Fácil' : idx < 40 ? 'Médio' : idx < 70 ? 'Difícil' : 'Extremo',
  specialSkill: c.primarySkillName,
}))

export default function ClassSwitcher({ player, onSwitch }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState<CharacterClass>(player.class)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredList = CLASSES_LIST.filter(c =>
    c.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subclass.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentClassInfo = CLASSES_LIST.find(c => c.id === selectedClassId) || CLASSES_LIST[0]
  const activeClassInfo = CLASSES_LIST.find(c => c.id === player.class) || CLASSES_LIST[0]

  return (
    <div className="pointer-events-auto">
      {/* HUD Quick Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded bg-amber-950/90 border-2 border-amber-500 hover:border-amber-300 text-amber-200 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/50 transition-all active:scale-95"
      >
        <span className="text-sm">{activeClassInfo.icon}</span>
        <span>{activeClassInfo.label.toUpperCase()}</span>
        <span className="text-[10px] text-amber-400/80 font-mono">[C]</span>
      </button>

      {/* Reworked Class Selection Modal Showcase */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-5xl h-[90vh] bg-amber-950/95 border-2 border-amber-500/80 rounded-lg shadow-2xl flex flex-col overflow-hidden text-amber-100 font-mono">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-amber-600/50 bg-amber-900/60">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <h2 className="text-lg font-bold text-amber-300 uppercase tracking-wider">
                    Santuário das 100 Classes
                  </h2>
                  <p className="text-xs text-amber-200/80">
                    Selecione sua classe e subclasse com habilidades únicas e 10 skins estilizadas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded border border-amber-500 bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold transition-all"
              >
                ✕ FECHAR
              </button>
            </div>

            {/* Main Body Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              
              {/* Left Column: 100 Classes List (Scrollable + Search) */}
              <div className="md:col-span-5 p-4 border-r-2 border-amber-600/40 overflow-y-auto space-y-2 bg-amber-950/80">
                <input
                  type="text"
                  placeholder="🔍 Buscar entre as 100 classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full mb-3 px-3 py-1.5 rounded bg-amber-900/80 border border-amber-500 text-amber-100 text-xs placeholder-amber-400/60 focus:outline-none focus:border-amber-300"
                />

                <div className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider mb-2">
                  Classes Encontradas ({filteredList.length} / 100)
                </div>

                <div className="space-y-1.5 pr-1">
                  {filteredList.map((c) => {
                    const isSelected = selectedClassId === c.id
                    const isActive = player.class === c.id
                    const lvl = player.classProgress[c.id]?.level ?? 1

                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedClassId(c.id)}
                        className={`w-full p-2.5 rounded text-left transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-amber-800/90 border-amber-300 text-amber-100 shadow-md'
                            : 'bg-amber-900/30 border-amber-700/40 hover:bg-amber-900/60 hover:border-amber-500/60 text-amber-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{c.icon}</span>
                          <div>
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              <span>{c.label}</span>
                              {isActive && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500 text-amber-950 font-bold uppercase">
                                  Ativa
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-amber-300/70 block">
                              Subclasse: {c.subclass}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-bold text-amber-400 block">
                            Nv. {lvl}
                          </span>
                          <span className="text-[9px] text-amber-300/60">{c.difficulty}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Class Preview Showcase */}
              <div className="md:col-span-7 p-6 overflow-y-auto flex flex-col justify-between bg-amber-950/40">
                <div className="space-y-4">
                  {/* Class Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-amber-700/50">
                    <div>
                      <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
                        <span>{currentClassInfo.icon}</span>
                        <span>{currentClassInfo.label}</span>
                      </h3>
                      <p className="text-xs text-amber-400 font-semibold">
                        Subclasse: {currentClassInfo.subclass}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded border border-amber-500 bg-amber-900/80 text-amber-200 text-xs font-bold">
                      Dificuldade: {currentClassInfo.difficulty}
                    </span>
                  </div>

                  {/* Pixel Art Showcase */}
                  <ClassPixelArtPreview
                    cls={currentClassInfo.id}
                    color={currentClassInfo.color}
                    label={currentClassInfo.label}
                    poseName={currentClassInfo.subclass}
                  />

                  {/* Description Box */}
                  <div className="w-full p-4 rounded bg-amber-900/60 border border-amber-600/60 text-xs text-amber-100 leading-relaxed text-center shadow-inner">
                    {currentClassInfo.description}
                  </div>

                  {/* Class Info Grid */}
                  <div className="w-full grid grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-amber-900/40 border border-amber-600/50">
                      <span className="text-[10px] font-semibold text-amber-300/80 uppercase block">Habilidade Principal</span>
                      <span className="text-xs font-bold text-amber-300">{currentClassInfo.primaryStat}</span>
                    </div>
                    <div className="p-3 rounded bg-amber-900/40 border border-amber-600/50">
                      <span className="text-[10px] font-semibold text-amber-300/80 uppercase block">Subhabilidade / Efeito</span>
                      <span className="text-xs font-bold text-amber-200">{currentClassInfo.specialSkill}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="w-full pt-4 mt-4 border-t border-amber-700/60 flex items-center justify-between">
                  <div className="text-xs text-amber-300 font-mono">
                    Nível da Classe: <span className="text-amber-200 font-bold">{player.classProgress[selectedClassId]?.level ?? 1}</span>
                  </div>

                  <button
                    onClick={() => {
                      onSwitch(selectedClassId)
                      setIsOpen(false)
                    }}
                    disabled={player.class === selectedClassId}
                    className={`px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-all border ${
                      player.class === selectedClassId
                        ? 'bg-amber-900/50 border-amber-800 text-amber-500/50 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-400 border-amber-300 text-amber-950 shadow-lg shadow-amber-500/20 active:scale-95'
                    }`}
                  >
                    {player.class === selectedClassId ? 'Classe Ativa' : 'Selecionar & Alternar Classe'}
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  )
}
