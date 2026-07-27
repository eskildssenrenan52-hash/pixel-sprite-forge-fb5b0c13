import React from 'react'
import type { Player } from '../../lib/game/types'
import { Anchor, Compass, Shield, Zap, Sparkles } from 'lucide-react'

interface ShipCraftingModalProps {
  player: Player
  onUpdatePlayer: (player: Player) => void
  onClose: () => void
}

export const ShipCraftingModal: React.FC<ShipCraftingModalProps> = ({ player, onUpdatePlayer, onClose }) => {
  const hasShip = player.hasShip ?? false
  const isSailing = player.isSailing ?? false

  const shipCostGold = 2500

  const handleBuildShip = () => {
    if (player.gold < shipCostGold) {
      alert('Ouro insuficiente para construir a Caravela dos Mares!')
      return
    }

    const updatedPlayer: Player = {
      ...player,
      gold: player.gold - shipCostGold,
      hasShip: true,
      shipType: 'caravel',
      isSailing: true,
    }

    onUpdatePlayer(updatedPlayer)
    alert('🚢 Caravela dos Mares construída com sucesso! Agora você pode navegar pelas águas para alcançar as 20 Ilhas de cada continente!')
  }

  const handleToggleSailing = () => {
    onUpdatePlayer({
      ...player,
      isSailing: !isSailing,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-sky-500/40 rounded-xl max-w-xl w-full p-5 text-slate-100 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-sky-500/30 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <Anchor className="w-6 h-6 text-sky-400" />
            <div>
              <h2 className="text-xl font-bold text-sky-300">Estaleiro Imperial de Navegação</h2>
              <p className="text-xs text-slate-400">Construa sua embarcação para navegar pelos mares e ilhas distantes</p>
            </div>
          </div>
          <button onClick={onClose} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold text-sm">✕</button>
        </div>

        {/* Status */}
        <div className="bg-slate-800/80 border border-sky-500/30 rounded-lg p-4 mb-5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-slate-200">Status de Navegação:</span>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-bold ${hasShip ? 'bg-emerald-600/80 text-white' : 'bg-rose-950 text-rose-300 border border-rose-500/40'}`}>
              {hasShip ? 'Embarcação Pronta ⚓' : 'Sem Embarcação'}
            </span>
          </div>

          {hasShip ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Sua <b>Caravela dos Mares</b> permite atravessar oceanos, lagos e rios para acessar as 20 ilhas isoladas de cada continente.
              </p>
              <button
                onClick={handleToggleSailing}
                className={`w-full py-2.5 rounded font-bold text-sm transition-all ${
                  isSailing
                    ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                {isSailing ? '⛵ Navegação Ativada (Andando na Água)' : '⚓ Ativar Modo Navegação'}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-300 mb-3">
                Para explorar ilhas afastadas e oceânicas, você precisa construir uma <b>Caravela dos Mares</b> com materiais e madeira nobre.
              </p>
              <div className="bg-slate-900/60 p-3 rounded text-xs text-slate-400 space-y-1 mb-4">
                <div>• Permite andar sobre água profunda sem restrições</div>
                <div>• Custo de Construção: <b className="text-amber-400">{shipCostGold} Ouro</b></div>
              </div>

              <button
                disabled={player.gold < shipCostGold}
                onClick={handleBuildShip}
                className={`w-full py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  player.gold >= shipCostGold
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xl'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" /> Construir Caravela dos Mares ({shipCostGold} Ouro)
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
