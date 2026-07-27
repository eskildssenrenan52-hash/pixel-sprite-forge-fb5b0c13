import { useState } from 'react'
import type { Player, Item } from '@/lib/game/types'
import { playSfx } from '@/lib/game/audio'
import { checkCraftingGrid3x3 } from '@/lib/game/craftingSystem'
import { ALL_RUNES, evaluateRuneSynergies, type Rune } from '@/lib/game/runes'
import { Overlay, ModalHeader, ModalFooter } from './QuestPanel'

export interface CraftRecipe {
  id: string
  name: string
  goldCost: number
  materials: { id: string; count: number }[]
  result: Item
}

export const CRAFT_RECIPES: CraftRecipe[] = []

interface Props {
  player: Player
  onClose: () => void
  onCraftSuccess?: (newItem: Item) => void
  onCraft?: (recipe: CraftRecipe) => void
}

export default function CraftingPanel({ player, onClose, onCraftSuccess, onCraft }: Props) {
  const [activeTab, setActiveTab] = useState<'3x3' | 'forge' | 'runes'>('3x3')

  // 3x3 Grid State
  const [grid, setGrid] = useState<(Item | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ])

  // Selected rune for socketing
  const [selectedRune, setSelectedRune] = useState<Rune | null>(ALL_RUNES[0] || null)

  const craftPreviewItem = checkCraftingGrid3x3(grid)

  const handlePlaceInGrid = (item: Item, r: number, c: number) => {
    const nextGrid = grid.map(row => [...row])
    nextGrid[r][c] = item
    setGrid(nextGrid)
    playSfx('click')
  }

  const handleClearGridSlot = (r: number, c: number) => {
    const nextGrid = grid.map(row => [...row])
    nextGrid[r][c] = null
    setGrid(nextGrid)
    playSfx('click')
  }

  const handleCraft = () => {
    if (!craftPreviewItem) return

    playSfx('item_drop')
    if (onCraftSuccess) onCraftSuccess(craftPreviewItem)

    // Clear grid
    setGrid([
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ])
  }

  return (
    <Overlay onBgClick={onClose} title="Forja">
      <div className="w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200">
        
        {/* Modal Header */}
        <ModalHeader title="⚒️ Bancada de Criação & Forja Rúnica" onClose={onClose} />

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('3x3')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all ${
              activeTab === '3x3'
                ? 'bg-amber-500/10 border-t border-x border-amber-500 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🧩 Grade 3x3 (Estilo Minecraft)
          </button>
          <button
            onClick={() => setActiveTab('forge')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all ${
              activeTab === 'forge'
                ? 'bg-amber-500/10 border-t border-x border-amber-500 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔥 Forja & Fundição
          </button>
          <button
            onClick={() => setActiveTab('runes')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all ${
              activeTab === 'runes'
                ? 'bg-amber-500/10 border-t border-x border-amber-500 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔮 Altar de Runas (100+ Runas)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          
          {/* TAB 1: 3x3 CRAFTING GRID */}
          {activeTab === '3x3' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* 3x3 Grid Display */}
              <div className="md:col-span-6 flex flex-col items-center">
                <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                  Grade de Combinação 3x3
                </div>
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/80 border border-slate-800 rounded-xl shadow-inner">
                  {grid.map((row, r) =>
                    row.map((cell, c) => (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => cell && handleClearGridSlot(r, c)}
                        className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-700 bg-slate-950 flex flex-col items-center justify-center hover:border-amber-500 transition-all relative group"
                      >
                        {cell ? (
                          <>
                            <span className="text-2xl">{cell.icon}</span>
                            <span className="text-[9px] text-slate-300 font-mono truncate w-14 text-center">
                              {cell.name.split(' ')[0]}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-slate-700 font-mono">+</span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Crafting Result Preview */}
              <div className="md:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
                <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Resultado
                </div>

                {craftPreviewItem ? (
                  <div className="flex flex-col items-center gap-2 p-4 bg-amber-500/10 border border-amber-500/40 rounded-xl w-full">
                    <span className="text-4xl">{craftPreviewItem.icon}</span>
                    <span className="text-sm font-bold text-amber-400">{craftPreviewItem.name}</span>
                    <p className="text-[11px] text-slate-300 text-center">{craftPreviewItem.description}</p>
                    <button
                      onClick={handleCraft}
                      className="mt-2 w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
                    >
                      Criar Item
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic p-6 text-center">
                    Coloque materiais na grade 3x3 para formar um item
                  </div>
                )}
              </div>

              {/* Player Material Inventory Quick Select */}
              <div className="col-span-12 pt-4 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Seus Materiais (Clique para colocar na grade)
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-900/50 rounded-xl border border-slate-800">
                  {player.inventory.filter((it): it is Item => it !== null && (it.type === 'material' || it.type === 'consumable')).map((item, idx) => (
                    <button
                      key={`${item.id}_${idx}`}
                      onClick={() => {
                        // find first empty slot in 3x3
                        for (let r = 0; r < 3; r++) {
                          for (let c = 0; c < 3; c++) {
                            if (!grid[r][c]) {
                              handlePlaceInGrid(item, r, c)
                              return
                            }
                          }
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                      {item.quantity && <span className="text-[10px] text-amber-400 font-bold">x{item.quantity}</span>}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FORGE & SMELTING */}
          {activeTab === 'forge' && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                🔥 <b>Forja Mística:</b> Funda minérios colhidos nos biomas em barras puras e equipamento com bônus de raridade elevados.
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <span className="text-3xl">⛏️</span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400">Minério de Ferro → Barra</h4>
                    <span className="text-[10px] text-slate-400">Requer 3x Minério de Ferro</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <span className="text-3xl">🪙</span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400">Minério de Ouro → Barra</h4>
                    <span className="text-[10px] text-slate-400">Requer 3x Minério de Ouro</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RUNES & SYNERGIES */}
          {activeTab === 'runes' && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
                🔮 <b>Altar de Runas (100+ Runas):</b> Engaste runas em suas armas e armaduras para desbloquear sinergias elementais e bônus de status maciços.
              </div>

              {/* Rune Showcase List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto p-2 bg-slate-900/50 rounded-xl border border-slate-800">
                {ALL_RUNES.slice(0, 16).map(rune => (
                  <button
                    key={rune.id}
                    onClick={() => setSelectedRune(rune)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      selectedRune?.id === rune.id
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl">{rune.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate" style={{ color: rune.color }}>
                        {rune.name}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{rune.description}</p>
                      <div className="flex gap-1 mt-1">
                        {rune.synergyTags.map(t => (
                          <span key={t} className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Rune Synergies Preview */}
              {selectedRune && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                  <div className="text-xs font-bold text-amber-400">
                    Sinergia Ativa: {selectedRune.passiveEffect}
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Encaixar esta runa em equipamento do tipo <b>{selectedRune.socketType.toUpperCase()}</b> ativa bônus permanentes em combate.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <ModalFooter hint="Combine minérios e runas para forjar itens e ativá-los em combate." />
      </div>
    </Overlay>
  )
}
