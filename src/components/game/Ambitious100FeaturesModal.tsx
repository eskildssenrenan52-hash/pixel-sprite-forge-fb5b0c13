import { memo, useState } from 'react'
import { AMBITIOUS_FEATURES_CATALOG } from '@/lib/game/ambitious100Features'

interface Props {
  isOpen: boolean
  onClose: () => void
}

function Ambitious100FeaturesModal({ isOpen, onClose }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [searchQuery, setSearchQuery] = useState<string>('')

  if (!isOpen) return null

  const categories = ['Todos', 'Clima', 'Eventos', 'Montarias', 'Pets', 'Crafting', 'Cosméticos', 'Social', 'Economia', 'PvP', 'Profissões', 'Combate', 'Bosses', 'Dungeons', 'Sistemas']

  const filteredFeatures = AMBITIOUS_FEATURES_CATALOG.filter(f => {
    const matchesCat = selectedCategory === 'Todos' || f.category === selectedCategory
    const matchesQuery = !searchQuery.trim() || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesQuery
  })

  return (
    <div className="rcy-overlay rcy-pixel z-50" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="rcy-modal rcy-modal--xl max-h-[90vh] flex flex-col bg-slate-950 border-2 border-amber-500/80 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌟</span>
            <div>
              <h2 className="text-lg font-bold text-amber-300 uppercase tracking-wide">100 RECURSOS AMBICIOSOS ATIVOS</h2>
              <p className="text-xs text-slate-400">Expandido & Totalmente Integrado ao Rucoy MMORPG</p>
            </div>
          </div>
          <button className="rcy-btn rcy-btn--icon rcy-btn--close" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        {/* Filter Controls */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-col gap-2">
          <input
            type="text"
            placeholder="🔍 Pesquisar nos 100 Recursos (ex: 'Montaria', 'Guerra', 'Runa', 'Masmorra')..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950 text-amber-300 placeholder-slate-500 rounded border border-slate-700 text-xs focus:outline-none focus:border-amber-500"
          />
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all ${selectedCategory === cat ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredFeatures.map((feat, idx) => (
            <div
              key={feat.id}
              className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80 text-[10px]">
                      #{idx + 1}
                    </span>
                    {feat.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {feat.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{feat.desc}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-emerald-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  SISTEMA ATIVO NO JOGO
                </span>
                <span className="text-slate-500">v3.5 EXPANDED</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Total: <b className="text-amber-400">{filteredFeatures.length}</b> de 100 Recursos Exibidos</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
          >
            Entendido & Jogar!
          </button>
        </div>

      </div>
    </div>
  )
}

export default memo(Ambitious100FeaturesModal)
