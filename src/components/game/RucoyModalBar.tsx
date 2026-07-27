import { memo, useState, useMemo } from 'react'
import PixelArtIcon64, { IconType64 } from './PixelArtIcons64'

interface Props {
  isInventoryOpen: boolean
  isQuestOpen: boolean
  isAchievementsOpen: boolean
  isPassiveOpen: boolean
  isSkillTreeOpen?: boolean
  isCraftingOpen: boolean
  isStatsOpen: boolean
  isHelpOpen: boolean
  isMapOpen: boolean
  isPrestigeOpen?: boolean
  isSpecOpen?: boolean
  isPetsOpen?: boolean
  isEditorOpen?: boolean
  isAmbitiousOpen?: boolean
  isMercenariesOpen?: boolean
  isShipOpen?: boolean
  isContinentsOpen?: boolean
  isSubskillsOpen?: boolean
  onToggleInventory: () => void
  onToggleQuest: () => void
  onToggleAchievements: () => void
  onTogglePassive: () => void
  onToggleSkillTree?: () => void
  onToggleCrafting: () => void
  onToggleStats: () => void
  onToggleHelp: () => void
  onToggleMap: () => void
  onTogglePrestige?: () => void
  onToggleSpec?: () => void
  onTogglePets?: () => void
  onToggleEditor?: () => void
  onToggleAmbitious?: () => void
  onToggleMercenaries?: () => void
  onToggleShip?: () => void
  onToggleContinents?: () => void
  onToggleSubskills?: () => void
  onSave: () => void
}

type BtnDef = { key: string; iconType: IconType64; label: string; shortcut: string; category: 'personagem' | 'mundo' | 'atividades' | 'sistema' }

const ALL_BUTTONS: BtnDef[] = [
  // Personagem
  { key: 'inventory',   iconType: 'modal_inventory', label: 'Inventário',     shortcut: 'I',  category: 'personagem' },
  { key: 'stats',       iconType: 'modal_stats',     label: 'Status & Atrib.', shortcut: 'S',  category: 'personagem' },
  { key: 'subskills',   iconType: 'modal_subskills', label: 'Subskills',      shortcut: 'U',  category: 'personagem' },
  { key: 'skilltree',   iconType: 'modal_skilltree', label: 'Habilidades',    shortcut: 'K',  category: 'personagem' },
  { key: 'passive',     iconType: 'modal_passive',   label: 'Árvore Passiva',  shortcut: 'P',  category: 'personagem' },
  { key: 'spec',        iconType: 'modal_spec',      label: 'Especialização', shortcut: 'O',  category: 'personagem' },
  { key: 'prestige',    iconType: 'modal_prestige',  label: 'Prestígio',      shortcut: 'X',  category: 'personagem' },

  // Mundo
  { key: 'map',         iconType: 'modal_map',        label: 'Mapa do Mundo',  shortcut: 'M',  category: 'mundo' },
  { key: 'continents',  iconType: 'modal_continents', label: '30 Continentes', shortcut: 'N',  category: 'mundo' },
  { key: 'ship',        iconType: 'modal_ship',       label: 'Navegação',      shortcut: 'B',  category: 'mundo' },
  { key: 'mercenaries', iconType: 'modal_mercenaries',label: 'Mercenários',    shortcut: 'V',  category: 'mundo' },

  // Atividades
  { key: 'quest',       iconType: 'modal_quest',       label: 'Missões',        shortcut: 'Q',  category: 'atividades' },
  { key: 'achievements', iconType: 'modal_achievements',label: 'Conquistas',   shortcut: 'A',  category: 'atividades' },
  { key: 'crafting',    iconType: 'modal_crafting',    label: 'Ferraria',       shortcut: 'C',  category: 'atividades' },
  { key: 'pets',        iconType: 'modal_pets',        label: 'Mascotes',       shortcut: 'E',  category: 'atividades' },
  { key: 'ambitious',   iconType: 'modal_ambitious',   label: '100 Recursos',   shortcut: 'U',  category: 'atividades' },

  // Sistema
  { key: 'editor',      iconType: 'modal_editor', label: 'Editor de Mapa', shortcut: 'F2', category: 'sistema' },
  { key: 'help',        iconType: 'modal_help',   label: 'Guia / Ajuda',   shortcut: 'H',  category: 'sistema' },
]

// Primary quick-launch icons always visible on top bar
const PRIMARY_KEYS = ['inventory', 'stats', 'skilltree', 'map', 'quest', 'crafting']

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'personagem', label: '👤 Personagem' },
  { id: 'mundo', label: '🌍 Mundo' },
  { id: 'atividades', label: '⚔️ Atividades' },
  { id: 'sistema', label: '⚙️ Sistema' },
]

function RucoyModalBar({
  isInventoryOpen,
  isQuestOpen,
  isAchievementsOpen,
  isPassiveOpen,
  isSkillTreeOpen,
  isCraftingOpen,
  isStatsOpen,
  isHelpOpen,
  isMapOpen,
  isPrestigeOpen,
  isSpecOpen,
  isPetsOpen,
  isEditorOpen,
  isAmbitiousOpen,
  isMercenariesOpen,
  isShipOpen,
  isContinentsOpen,
  isSubskillsOpen,
  onToggleInventory,
  onToggleQuest,
  onToggleAchievements,
  onTogglePassive,
  onToggleSkillTree,
  onToggleCrafting,
  onToggleStats,
  onToggleHelp,
  onToggleMap,
  onTogglePrestige,
  onToggleSpec,
  onTogglePets,
  onToggleEditor,
  onToggleAmbitious,
  onToggleMercenaries,
  onToggleShip,
  onToggleContinents,
  onToggleSubskills,
  onSave,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleMap: Record<string, () => void> = {
    continents: onToggleContinents ?? (() => {}),
    subskills: onToggleSubskills ?? (() => {}),
    mercenaries: onToggleMercenaries ?? (() => {}),
    ship: onToggleShip ?? (() => {}),
    map: onToggleMap,
    ambitious: onToggleAmbitious ?? (() => {}),
    inventory: onToggleInventory,
    stats: onToggleStats,
    quest: onToggleQuest,
    achievements: onToggleAchievements,
    passive: onTogglePassive,
    skilltree: onToggleSkillTree ?? (() => {}),
    crafting: onToggleCrafting,
    pets: onTogglePets ?? (() => {}),
    prestige: onTogglePrestige ?? (() => {}),
    spec: onToggleSpec ?? (() => {}),
    editor: onToggleEditor ?? (() => {}),
    help: onToggleHelp,
  }

  const isOpen: Record<string, boolean> = {
    continents: !!isContinentsOpen,
    subskills: !!isSubskillsOpen,
    mercenaries: !!isMercenariesOpen,
    ship: !!isShipOpen,
    map: isMapOpen,
    ambitious: !!isAmbitiousOpen,
    inventory: isInventoryOpen,
    stats: isStatsOpen,
    quest: isQuestOpen,
    achievements: isAchievementsOpen,
    passive: isPassiveOpen,
    skilltree: !!isSkillTreeOpen,
    crafting: isCraftingOpen,
    pets: !!isPetsOpen,
    prestige: !!isPrestigeOpen,
    spec: !!isSpecOpen,
    editor: !!isEditorOpen,
    help: isHelpOpen,
  }

  const activeCount = Object.values(isOpen).filter(Boolean).length

  const filteredButtons = useMemo(() => {
    return ALL_BUTTONS.filter(b => {
      const matchCat = activeCategory === 'all' || b.category === activeCategory
      const matchSearch = !searchQuery || b.label.toLowerCase().includes(searchQuery.toLowerCase()) || b.shortcut.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div
      className="rcy-pixel pointer-events-auto select-none"
      style={{
        position: 'fixed',
        top: 8,
        right: 8,
        zIndex: 1000,
      }}
    >
      {/* Top Quick Bar */}
      <div
        className="rcy-frame"
        style={{
          padding: '4px 6px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(10, 12, 20, 0.92)',
          border: '1px solid rgba(255, 210, 74, 0.25)',
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Primary shortcuts */}
        {ALL_BUTTONS.filter(b => PRIMARY_KEYS.includes(b.key)).map(btn => {
          const active = isOpen[btn.key]
          return (
            <button
              key={btn.key}
              onClick={() => {
                toggleMap[btn.key]?.()
              }}
              title={`${btn.label} [${btn.shortcut}]`}
              className={`rcy-btn rcy-btn--icon ${active ? 'rcy-btn--active' : ''}`}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: active
                  ? 'linear-gradient(180deg, rgba(255,210,74,0.35), rgba(200,140,20,0.2))'
                  : 'rgba(26, 32, 50, 0.75)',
                border: active ? '1.5px solid #ffd24a' : '1px solid rgba(255,255,255,0.12)',
                boxShadow: active ? '0 0 10px rgba(255,210,74,0.4)' : 'none',
                transition: 'all 0.12s ease',
              }}
            >
              <PixelArtIcon64 type={btn.iconType} size={22} />
            </button>
          )
        })}

        {/* Save button */}
        <button
          onClick={onSave}
          title="Salvar Jogo [G]"
          className="rcy-btn rcy-btn--icon rcy-btn--gold"
          style={{ width: 32, height: 32, borderRadius: 8, fontSize: 15 }}
        >
          💾
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.15)', margin: '0 2px' }} />

        {/* Toggle full category menu */}
        <button
          className={`rcy-btn ${menuOpen ? 'rcy-btn--active' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          title="Menu de Painéis (Todos)"
          style={{
            height: 32,
            padding: '0 8px',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: menuOpen ? 'var(--rcy-gold)' : 'rgba(35, 45, 68, 0.85)',
            color: menuOpen ? '#111' : '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <span>☰</span>
          <span>Painéis</span>
          {activeCount > 0 && (
            <span style={{
              background: '#ef4444', color: '#fff', fontSize: 9, borderRadius: 10,
              padding: '1px 5px', fontWeight: 800, lineHeight: 1
            }}>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Categorized Dropdown Menu */}
      {menuOpen && (
        <div
          className="rcy-frame"
          style={{
            position: 'absolute',
            top: 42,
            right: 0,
            width: 320,
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(12, 14, 22, 0.96)',
            border: '1px solid rgba(255,210,74,0.3)',
            borderRadius: 14,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)',
            padding: 10,
            gap: 8,
            animation: 'fadeSlideIn 0.18s ease-out',
            zIndex: 1001,
          }}
        >
          {/* Header with Search */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar painel... (I, M, Q)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,210,74,0.25)',
                borderRadius: 8,
                padding: '4px 8px',
                fontSize: 10,
                color: '#fff',
                outline: 'none',
              }}
            />
            <button
              onClick={() => setMenuOpen(false)}
              className="rcy-btn rcy-btn--icon"
              style={{ width: 24, height: 24, borderRadius: 6, fontSize: 11 }}
            >
              ✕
            </button>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 2 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '3px 7px',
                  fontSize: 9,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  borderRadius: 6,
                  border: activeCategory === cat.id ? '1px solid #ffd24a' : '1px solid transparent',
                  background: activeCategory === cat.id ? 'rgba(255,210,74,0.2)' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat.id ? 'var(--rcy-gold)' : 'var(--rcy-text-dim)',
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Feature Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 6,
              overflowY: 'auto',
              maxHeight: 340,
              paddingRight: 2,
            }}
          >
            {filteredButtons.map(btn => {
              const active = isOpen[btn.key]
              return (
                <button
                  key={btn.key}
                  onClick={() => {
                    toggleMap[btn.key]?.()
                  }}
                  className={`rcy-btn ${active ? 'rcy-btn--active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: 8,
                    fontSize: 11,
                    background: active
                      ? 'linear-gradient(180deg, rgba(255,210,74,0.3), rgba(180,120,20,0.15))'
                      : 'rgba(22, 28, 44, 0.75)',
                    border: active ? '1px solid #ffd24a' : '1px solid rgba(255,255,255,0.08)',
                    textAlign: 'left',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <PixelArtIcon64 type={btn.iconType} size={20} />
                    <span style={{
                      color: active ? '#ffd24a' : '#fff',
                      fontSize: 10,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {btn.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.4)',
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: 4,
                    padding: '1px 4px',
                    marginLeft: 4,
                  }}>
                    {btn.shortcut}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Quick Footer hint */}
          <div style={{ fontSize: 9, color: 'var(--rcy-text-mute)', textAlign: 'center', paddingTop: 4, borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
            Dica: Teclas de atalho funcionam a qualquer momento.
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(RucoyModalBar)

