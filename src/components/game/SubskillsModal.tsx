import { useState } from 'react'
import type { Player } from '@/lib/game/types'
import { CLASS_ABILITIES, ABILITIES, ExtendedAbilityDef } from '@/lib/game/abilities'
import { SUBSKILLS, SubskillDef } from '@/lib/game/hundredClassesData'

interface Props {
  player: Player
  onUpdateLoadout: (equipped: string[], subskills: Record<string, string>) => void
  onClose: () => void
}

export default function SubskillsModal({ player, onUpdateLoadout, onClose }: Props) {
  const classAbilities = CLASS_ABILITIES[player.class] || []
  const [equipped, setEquipped] = useState<string[]>(
    player.equippedAbilities && player.equippedAbilities.length > 0
      ? player.equippedAbilities
      : classAbilities.slice(0, 4)
  )
  const [subskillsMap, setSubskillsMap] = useState<Record<string, string>>(player.subskills || {})
  const [selectedSlot, setSelectedSlot] = useState<number>(0)

  const activeAbilityId = equipped[selectedSlot]
  const activeAbilityDef = activeAbilityId ? ABILITIES[activeAbilityId] : undefined

  const toggleEquip = (abId: string) => {
    if (equipped.includes(abId)) {
      if (equipped.length <= 1) return // Must keep at least 1 ability equipped
      setEquipped(equipped.filter(id => id !== abId))
    } else {
      if (equipped.length >= 4) return // Max 4 equipped
      setEquipped([...equipped, abId])
    }
  }

  const assignSubskill = (abId: string, subskillId: string) => {
    const updated = { ...subskillsMap }
    if (updated[abId] === subskillId) {
      delete updated[abId]
    } else {
      updated[abId] = subskillId
    }
    setSubskillsMap(updated)
  }

  const handleSave = () => {
    onUpdateLoadout(equipped, subskillsMap)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 pointer-events-auto">
      <div className="w-full max-w-4xl h-[85vh] bg-amber-950/95 border-2 border-amber-500 rounded-lg shadow-2xl flex flex-col overflow-hidden text-amber-100 font-mono">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-amber-600/50 bg-amber-900/70">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔮</span>
            <div>
              <h2 className="text-lg font-bold text-amber-300 uppercase tracking-wider">
                Gestor de Habilidades & Subskills
              </h2>
              <p className="text-xs text-amber-200/80">
                Escolha até 4 habilidades ativas e vincule subskills com efeitos únicos de 32 frames
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded border border-amber-500 bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold transition-all"
          >
            ✕ FECHAR
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Column: 10 Class Abilities */}
          <div className="md:col-span-5 p-4 border-r-2 border-amber-600/40 overflow-y-auto space-y-3 bg-amber-950/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 uppercase">
                Habilidades da Classe ({classAbilities.length})
              </span>
              <span className="text-[10px] text-amber-400/80 font-bold">
                Equipadas: {equipped.length}/4
              </span>
            </div>

            <div className="space-y-2">
              {classAbilities.map((abId, idx) => {
                const ab = ABILITIES[abId]
                if (!ab) return null
                const isEquipped = equipped.includes(abId)
                const assignedSubId = subskillsMap[abId]
                const assignedSub = assignedSubId ? SUBSKILLS[assignedSubId] : null

                return (
                  <div
                    key={abId}
                    className={`p-3 rounded border text-left transition-all ${
                      isEquipped
                        ? 'bg-amber-900/80 border-amber-400 text-amber-100 shadow'
                        : 'bg-amber-950/60 border-amber-800/80 text-amber-300/70 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{ab.icon}</span>
                        <span className="text-xs font-bold text-amber-200">{ab.name}</span>
                      </div>
                      <button
                        onClick={() => toggleEquip(abId)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                          isEquipped
                            ? 'bg-amber-500 text-amber-950 border border-amber-300'
                            : 'bg-amber-900 text-amber-300 border border-amber-600 hover:bg-amber-800'
                        }`}
                      >
                        {isEquipped ? 'Equipada' : 'Equipar'}
                      </button>
                    </div>

                    <p className="text-[10px] text-amber-200/80 line-clamp-2 mb-1.5">
                      {ab.description}
                    </p>

                    <div className="flex items-center justify-between text-[9px] text-amber-400/90 border-t border-amber-700/40 pt-1">
                      <span>Condição: {ab.condition?.name || 'Sempre Pronta'}</span>
                      <span>Mana: {ab.manaCost} | Recarga: {(ab.cooldown / 60).toFixed(1)}s</span>
                    </div>

                    {assignedSub && (
                      <div className="mt-1.5 px-2 py-1 rounded bg-amber-950/90 border border-amber-500/60 flex items-center justify-between text-[10px] text-amber-300">
                        <span className="flex items-center gap-1 font-bold">
                          <span>{assignedSub.icon}</span>
                          <span>Subskill: {assignedSub.name}</span>
                        </span>
                        <span className="text-[9px] text-amber-400">{assignedSub.effectType}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Equipped Slots & Subskill Selector */}
          <div className="md:col-span-7 p-5 overflow-y-auto flex flex-col justify-between bg-amber-950/40">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider border-b border-amber-700/60 pb-2">
                Slots de Habilidades Equipadas (Max 4)
              </h3>

              {/* 4 Slot Selectors */}
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const abId = equipped[slotIdx]
                  const ab = abId ? ABILITIES[abId] : null
                  const isSelected = selectedSlot === slotIdx

                  return (
                    <button
                      key={slotIdx}
                      onClick={() => setSelectedSlot(slotIdx)}
                      className={`p-2 rounded border-2 text-center transition-all flex flex-col items-center justify-center min-h-[80px] ${
                        isSelected
                          ? 'bg-amber-800 border-amber-300 shadow-md text-amber-100 scale-105'
                          : 'bg-amber-900/40 border-amber-700/60 hover:bg-amber-900/80 text-amber-200'
                      }`}
                    >
                      <span className="text-[9px] text-amber-400 uppercase block mb-1">
                        Atalho [{slotIdx + 1}]
                      </span>
                      {ab ? (
                        <>
                          <span className="text-xl mb-1">{ab.icon}</span>
                          <span className="text-[10px] font-bold leading-tight line-clamp-1">
                            {ab.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-amber-600 italic">Vazio</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Selected Ability Detail & Subskill Assignment */}
              {activeAbilityDef ? (
                <div className="p-4 rounded bg-amber-900/60 border border-amber-500/70 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-700/60">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{activeAbilityDef.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-amber-200">{activeAbilityDef.name}</h4>
                        <span className="text-[10px] text-amber-400">
                          Efeito Especial: {activeAbilityDef.fxStyle} (32 Frames FX)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-amber-100">{activeAbilityDef.description}</p>

                  {/* Subskills Selection */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-amber-300 block uppercase">
                      Vincular Subskill a esta Habilidade:
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(SUBSKILLS).map((sub) => {
                        const isAssigned = subskillsMap[activeAbilityDef.id] === sub.id

                        return (
                          <button
                            key={sub.id}
                            onClick={() => assignSubskill(activeAbilityDef.id, sub.id)}
                            className={`p-2 rounded border text-left transition-all ${
                              isAssigned
                                ? 'bg-amber-800 border-amber-300 text-amber-100 shadow'
                                : 'bg-amber-950/70 border-amber-800 text-amber-300/80 hover:bg-amber-900/60'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold flex items-center gap-1">
                                <span>{sub.icon}</span>
                                <span>{sub.name}</span>
                              </span>
                              {isAssigned && (
                                <span className="text-[9px] bg-amber-500 text-amber-950 px-1 rounded font-bold">
                                  Ativo
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-amber-200/80 leading-tight">
                              {sub.description}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-amber-400/60 bg-amber-900/20 border border-amber-800 rounded">
                  Selecione uma habilidade equipada para vincular Subskills.
                </div>
              )}
            </div>

            {/* Bottom Save Button */}
            <div className="pt-4 border-t border-amber-700/60 flex items-center justify-between">
              <span className="text-xs text-amber-300">
                {equipped.length} de 4 Habilidades Ativas
              </span>

              <button
                onClick={handleSave}
                className="px-6 py-2 rounded bg-amber-500 hover:bg-amber-400 border border-amber-300 text-amber-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95"
              >
                Salvar Configuração
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
