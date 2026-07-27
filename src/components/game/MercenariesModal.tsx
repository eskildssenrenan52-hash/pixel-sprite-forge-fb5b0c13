import React from 'react'
import type { Player, MercenaryType } from '../../lib/game/types'
import { MERCENARY_CATALOG, hireMercenary, toggleSummonMercenary } from '../../lib/game/mercenariesSystem'
import { Shield, UserPlus, Zap, Heart, Award, CheckCircle, Crosshair, Users } from 'lucide-react'

interface MercenariesModalProps {
  player: Player
  onUpdatePlayer: (player: Player) => void
  onClose: () => void
}

export const MercenariesModal: React.FC<MercenariesModalProps> = ({ player, onUpdatePlayer, onClose }) => {
  const mercenaries = player.mercenaries ?? []

  const handleHire = (type: MercenaryType) => {
    const res = hireMercenary(player, type)
    if (res.success) {
      onUpdatePlayer(res.player)
    } else {
      alert(res.message)
    }
  }

  const handleToggle = (id: string) => {
    const updated = toggleSummonMercenary(player, id)
    onUpdatePlayer(updated)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 border-b border-amber-500/30 bg-gradient-to-r from-amber-950/60 to-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-amber-300">Recrutador de Mercenários das Sombras</h2>
              <p className="text-xs text-slate-400">Contrate companheiros leais para lutar, curar e evoluir ao seu lado</p>
            </div>
          </div>
          <button onClick={onClose} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold text-sm">✕</button>
        </div>

        <div className="p-4 overflow-y-auto space-y-6 flex-1">

          {/* Active Mercenaries Section */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Seus Mercenários Contratados ({mercenaries.length})
            </h3>

            {mercenaries.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-4 text-center text-slate-400 text-sm">
                Você ainda não contratou nenhum mercenário. Escolha um dos combatentes abaixo!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mercenaries.map(merc => (
                  <div key={merc.id} className="bg-slate-800/80 border border-amber-500/30 rounded-lg p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{merc.portrait}</span>
                          <div>
                            <h4 className="font-bold text-slate-200 text-sm">{merc.name}</h4>
                            <span className="text-xs text-amber-400">Nível {merc.level}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggle(merc.id)}
                          className={`px-3 py-1 text-xs rounded font-bold transition-colors ${
                            merc.isSummoned
                              ? 'bg-emerald-600/80 hover:bg-emerald-500 text-white'
                              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                          }`}
                        >
                          {merc.isSummoned ? 'Invocado ✓' : 'Invocação Pausada'}
                        </button>
                      </div>

                      {/* HP & XP */}
                      <div className="space-y-1 text-xs text-slate-300 mb-2">
                        <div className="flex justify-between">
                          <span>HP:</span>
                          <span>{merc.hp} / {merc.maxHp}</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full transition-all"
                            style={{ width: `${Math.min(100, (merc.hp / merc.maxHp) * 100)}%` }}
                          />
                        </div>

                        <div className="flex justify-between">
                          <span>XP Progresso:</span>
                          <span>{merc.xp} / {merc.xpToNext}</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full transition-all"
                            style={{ width: `${Math.min(100, (merc.xp / merc.xpToNext) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-1 bg-slate-900/60 rounded p-1.5 text-[11px] text-center text-slate-300">
                        <div>Ataque: <b className="text-amber-400">{merc.attack}</b></div>
                        <div>Defesa: <b className="text-sky-400">{merc.defense}</b></div>
                        <div>Velocidade: <b className="text-emerald-400">{merc.speed}</b></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mercenaries Catalog */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Catálogo da Guilda de Mercenários
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Object.keys(MERCENARY_CATALOG) as MercenaryType[]).map(type => {
                const item = MERCENARY_CATALOG[type]
                const alreadyHired = mercenaries.some(m => m.type === type)

                return (
                  <div key={type} className="bg-slate-800/60 border border-slate-700/80 hover:border-amber-500/50 rounded-lg p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{item.portrait}</span>
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm">{item.name}</h4>
                          <span className="text-[11px] text-amber-400">{item.title}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mb-3">{item.description}</p>

                      <div className="space-y-1 text-xs text-slate-400 mb-3 bg-slate-900/40 p-2 rounded">
                        <div>HP Inicial: <b className="text-emerald-400">{item.baseHp}</b></div>
                        <div>Ataque Base: <b className="text-amber-400">{item.baseAtk}</b></div>
                        <div>Habilidades: {item.skills.join(', ')}</div>
                      </div>
                    </div>

                    <button
                      disabled={alreadyHired || player.gold < item.costGold}
                      onClick={() => handleHire(type)}
                      className={`w-full py-2 rounded font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        alreadyHired
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : player.gold >= item.costGold
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      {alreadyHired ? (
                        <>Contratado ✓</>
                      ) : (
                        <>Contratar por {item.costGold} Ouro</>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
