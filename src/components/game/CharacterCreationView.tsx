import { useState, useEffect, useRef, useMemo } from 'react'
import type { CharacterClass } from '@/lib/game/types'
import { ALL_100_CLASSES, ClassMeta } from '@/lib/game/hundredClassesData'
import { ABILITIES, CLASS_ABILITIES, ExtendedAbilityDef } from '@/lib/game/abilities'
import { getClassPortrait } from '@/lib/game/portraits'
import { drawCharacter, SKIN_NAMES } from '@/lib/game/sprites'
import PixelArtIcon64, { IconType64 } from './PixelArtIcons64'

interface Props {
  name: string
  setName: (name: string) => void
  error: string
  setError: (err: string) => void
  onStart: (name: string, cls: CharacterClass, skin: number) => void
  onBack: () => void
  tick: number
}

// Category filter options
type CategoryType = 'all' | 'warrior' | 'mage' | 'ranger' | 'support' | 'legendary'

const CATEGORIES: { id: CategoryType; label: string; iconType: IconType64 }[] = [
  { id: 'all', label: 'Todas (100)', iconType: 'category_all' },
  { id: 'warrior', label: 'Guerreiros', iconType: 'category_warrior' },
  { id: 'mage', label: 'Magos', iconType: 'category_mage' },
  { id: 'ranger', label: 'Atiradores', iconType: 'category_ranger' },
  { id: 'support', label: 'Suporte', iconType: 'category_support' },
  { id: 'legendary', label: 'Lendários', iconType: 'category_legendary' },
]

// ─── ORIGIN ALLEGIANCE DEFINITIONS ───────────────────────────────────────────
export interface OriginDef {
  id: string
  name: string
  bonus: string
  icon: string
  desc: string
  color: string
}

export const ORIGINS: OriginDef[] = [
  {
    id: 'aethelgard',
    name: 'Reino de Aethelgard',
    bonus: '+10% Dano Crítico',
    icon: '🏰',
    desc: 'Berço dos cavaleiros de honra e mestres de armas lendários.',
    color: '#eab308',
  },
  {
    id: 'vorax',
    name: 'Domínio de Vorax',
    bonus: '+12% Roubo de Vida',
    icon: '🌋',
    desc: 'Terras vulcânicas habitadas por guerreiros sedentos de sangue.',
    color: '#ef4444',
  },
  {
    id: 'sacro',
    name: 'Sacro Império Dourado',
    bonus: '+20% Cura Recebida',
    icon: '✨',
    desc: 'Santuário abençoado pelos deuses com luz purificadora.',
    color: '#facc15',
  },
  {
    id: 'cidadela',
    name: 'Cidadela Steampunk',
    bonus: '+15% Vel. Ataque',
    icon: '⚙️',
    desc: 'Metrópole industrial de inventores, mecanismos e alquimia.',
    color: '#f97316',
  },
  {
    id: 'cronomantes',
    name: 'Ordem do Tempo',
    bonus: '-10% Recarga Habilidades',
    icon: '⏳',
    desc: 'Espiras ancestrais que manipulam os fios temporais da criação.',
    color: '#38bdf8',
  },
  {
    id: 'floresta',
    name: 'Tribos da Floresta',
    bonus: '+20% HP Máximo',
    icon: '🌲',
    desc: 'Guardas da natureza e espíritos xamânicos da vida eterna.',
    color: '#22c55e',
  },
  {
    id: 'celestial',
    name: 'Cume Celestial',
    bonus: '+25% Dano Elemental',
    icon: '🌌',
    desc: 'Picos sagrados envoltos em poeira estelar e magia arcana.',
    color: '#a855f7',
  },
]

// ─── ELEMENT AFFINITY DEFINITIONS ───────────────────────────────────────────
export interface ElementDef {
  id: string
  name: string
  bonus: string
  icon: string
  color: string
}

export const ELEMENTS: ElementDef[] = [
  { id: 'fire', name: 'Chamas Devastadoras', bonus: '+10% Dano de Fogo', icon: '🔥', color: '#ef4444' },
  { id: 'ice', name: 'Geada Eterna', bonus: '+10% Dano de Gelo', icon: '❄️', color: '#38bdf8' },
  { id: 'lightning', name: 'Tempestade Elétrica', bonus: '+10% Dano Elétrico', icon: '⚡', color: '#facc15' },
  { id: 'nature', name: 'Essência da Natureza', bonus: '+10% Cura & Reg. HP', icon: '🌿', color: '#22c55e' },
  { id: 'holy', name: 'Luminosidade Sagrada', bonus: '+10% Dano Sagrado', icon: '✨', color: '#fef08a' },
  { id: 'shadow', name: 'Sombras Abissais', bonus: '+10% Dano Sombrio & Esquiva', icon: '🌙', color: '#a855f7' },
  { id: 'void', name: 'Energia Cósmica', bonus: '+10% Mana Max & Magia', icon: '🌌', color: '#6366f1' },
]

// ─── STARTER RELIC DEFINITIONS ──────────────────────────────────────────────
export interface RelicDef {
  id: string
  name: string
  bonus: string
  icon: string
  desc: string
}

export const RELICS: RelicDef[] = [
  { id: 'dragon_blood', name: 'Sangue de Dragão', bonus: '+50 HP Inicial', icon: '🩸', desc: 'Aumenta permanentemente a vitalidade máxima.' },
  { id: 'philosopher_stone', name: 'Pedra Filosofal', bonus: '+50 MP Inicial', icon: '💎', desc: 'Canaliza mana infinito nos momentos críticos.' },
  { id: 'midas_ring', name: 'Anel de Midas', bonus: '+25% Ouro Inimigos', icon: '💍', desc: 'Inimigos mortos soltam moedas de ouro extra.' },
  { id: 'wind_boots', name: 'Amuleto do Vento', bonus: '+1.5 Vel. Movimento', icon: '🌪️', desc: 'Permite esquivar e andar com leveza suprema.' },
  { id: 'wisdom_seal', name: 'Selo da Sabedoria', bonus: '+15% Bônus XP', icon: '📜', desc: 'Acelera os níveis de maestria de classe.' },
]

export default function CharacterCreationView({
  name,
  setName,
  error,
  setError,
  onStart,
  onBack,
  tick,
}: Props) {
  const [selectedClassId, setSelectedClassId] = useState<CharacterClass>('knight')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all')
  const [skin, setSkin] = useState<number>(0)
  const [fxFrame, setFxFrame] = useState<number>(0)
  const [mobileTab, setMobileTab] = useState<'list' | 'details'>('list')
  const [activeTab, setActiveTab] = useState<'general' | 'origin' | 'stats' | 'skins'>('general')

  // Customization Options State
  const [selectedOrigin, setSelectedOrigin] = useState<string>('aethelgard')
  const [selectedElement, setSelectedElement] = useState<string>('fire')
  const [selectedRelic, setSelectedRelic] = useState<string>('dragon_blood')
  const [poseMode, setPoseMode] = useState<'idle' | 'walk' | 'attack' | 'ultimate'>('idle')
  const [showAiGallery, setShowAiGallery] = useState<boolean>(false)

  // Stat Points Allocation (10 Points)
  const [statPoints, setStatPoints] = useState({ str: 2, agi: 2, int: 2, vit: 2, lck: 2 })
  const totalAllocated = useMemo(
    () => statPoints.str + statPoints.agi + statPoints.int + statPoints.vit + statPoints.lck,
    [statPoints]
  )
  const pointsRemaining = 10 - totalAllocated

  // FX 34-Frame Animation Ticker
  useEffect(() => {
    const id = setInterval(() => {
      setFxFrame((f) => (f + 1) % 34)
    }, 45) // ~22 fps for smooth 34-frame cycle
    return () => clearInterval(id)
  }, [])

  // Find selected class meta
  const selectedMeta: ClassMeta = useMemo(() => {
    return ALL_100_CLASSES.find((c) => c.id === selectedClassId) || ALL_100_CLASSES[0]
  }, [selectedClassId])

  // Abilities for selected class
  const classAbilityIds = CLASS_ABILITIES[selectedClassId] || []
  const initialActiveAbility: ExtendedAbilityDef | undefined =
    classAbilityIds.length > 0 ? ABILITIES[classAbilityIds[0]] : undefined
  const specialAbility: ExtendedAbilityDef | undefined =
    classAbilityIds.length > 9 ? ABILITIES[classAbilityIds[9]] : ABILITIES[classAbilityIds[0]]

  // Category Filtering Logic
  const filteredClasses = useMemo(() => {
    return ALL_100_CLASSES.filter((cls) => {
      const matchesSearch =
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.subclass.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.primarySkillName.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesSearch) return false

      if (activeCategory === 'warrior') {
        return (
          ['knight', 'paladin', 'berserker', 'samurai', 'monk', 'templar', 'valkyrie'].includes(
            cls.id
          ) ||
          cls.name.toLowerCase().includes('knight') ||
          cls.name.toLowerCase().includes('rider') ||
          cls.subclass.toLowerCase().includes('cavaleiro') ||
          cls.subclass.toLowerCase().includes('guardião')
        )
      }
      if (activeCategory === 'mage') {
        return (
          [
            'mage',
            'pyromancer',
            'cryomancer',
            'stormcaller',
            'geomancer',
            'chronomancer',
            'necromancer',
            'warlock',
            'summoner',
          ].includes(cls.id) ||
          cls.name.toLowerCase().includes('mage') ||
          cls.name.toLowerCase().includes('sage') ||
          cls.subclass.toLowerCase().includes('mago') ||
          cls.subclass.toLowerCase().includes('feitiç')
        )
      }
      if (activeCategory === 'ranger') {
        return (
          ['archer', 'assassin', 'ninja', 'gunner'].includes(cls.id) ||
          cls.name.toLowerCase().includes('slayer') ||
          cls.name.toLowerCase().includes('dancer') ||
          cls.subclass.toLowerCase().includes('arqueiro') ||
          cls.subclass.toLowerCase().includes('assassino')
        )
      }
      if (activeCategory === 'support') {
        return (
          ['druid', 'alchemist', 'beastmaster', 'bard'].includes(cls.id) ||
          cls.name.toLowerCase().includes('warden') ||
          cls.name.toLowerCase().includes('weaver') ||
          cls.subclass.toLowerCase().includes('druida') ||
          cls.subclass.toLowerCase().includes('bardo')
        )
      }
      if (activeCategory === 'legendary') {
        return (
          cls.id.startsWith('class_') ||
          ['valkyrie', 'chronomancer', 'necromancer', 'samurai'].includes(cls.id)
        )
      }
      return true
    })
  }, [searchTerm, activeCategory])

  const handleSelectClass = (clsId: CharacterClass) => {
    setSelectedClassId(clsId)
    setSkin(0)
    setMobileTab('details')
  }

  const handleModifyStat = (stat: keyof typeof statPoints, delta: number) => {
    if (delta > 0 && pointsRemaining <= 0) return
    if (delta < 0 && statPoints[stat] <= 0) return
    setStatPoints((prev) => ({
      ...prev,
      [stat]: Math.max(0, prev[stat] + delta),
    }))
  }

  const handleCreate = () => {
    if (!name.trim()) {
      setError('Por favor, digite o nome do seu herói.')
      return
    }
    if (name.trim().length < 2) {
      setError('O nome deve ter no mínimo 2 caracteres.')
      return
    }
    setError('')
    onStart(name.trim(), selectedClassId, skin)
  }

  return (
    <div className="w-full max-w-6xl mx-auto h-[95vh] sm:h-[90vh] bg-[#22130c] border-4 border-[#d4af37] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-[#f3e5ab] font-serif relative">
      {/* Decorative Golden Corners */}
      <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-[#f0c040] pointer-events-none z-20" />
      <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-[#f0c040] pointer-events-none z-20" />
      <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-[#f0c040] pointer-events-none z-20" />
      <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-[#f0c040] pointer-events-none z-20" />

      {/* Top Header Bar */}
      <div className="px-4 py-2.5 border-b-2 border-[#c9952a] bg-gradient-to-r from-[#381e11] via-[#4d2c1a] to-[#381e11] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <PixelArtIcon64 type="category_legendary" size={42} />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#f0c040] tracking-wider uppercase drop-shadow flex items-center gap-2">
              <span>Criação de Personagem</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#1f0f07] border border-[#f0c040] text-[#f0c040] font-mono">
                100 Classes
              </span>
            </h2>
            <p className="text-[11px] text-[#d4b483] font-sans">
              Personalize a classe lendária, origem ancestral, afinidade elemental e atributos!
            </p>
          </div>
        </div>

        {/* Hero Name Input */}
        <div className="w-full sm:w-auto flex items-center gap-2 bg-[#180c07] px-3 py-1.5 rounded-md border-2 border-[#c9952a] shadow-inner">
          <span className="text-xs text-[#f0c040]">🏷️</span>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            maxLength={20}
            placeholder="Nome do Herói..."
            className="w-full sm:w-48 bg-transparent text-[#fff3cd] placeholder-[#9a7b52] text-xs font-bold font-mono focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <span className="text-[10px] text-[#c9952a] font-mono">{name.length}/20</span>
        </div>
      </div>

      {/* Mobile Tab Toggle Bar (< md screens) */}
      <div className="md:hidden flex border-b border-[#c9952a] bg-[#1a0e08] shrink-0 font-sans">
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-2 text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            mobileTab === 'list'
              ? 'bg-[#3b2112] text-[#f0c040] border-b-2 border-[#f0c040]'
              : 'text-[#a88960] hover:bg-[#28150c]'
          }`}
        >
          <span>📜 Classes (100)</span>
        </button>
        <button
          onClick={() => setMobileTab('details')}
          className={`flex-1 py-2 text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            mobileTab === 'details'
              ? 'bg-[#3b2112] text-[#f0c040] border-b-2 border-[#f0c040]'
              : 'text-[#a88960] hover:bg-[#28150c]'
          }`}
        >
          <span>⚔️ Personalização & Status</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-[radial-gradient(ellipse_at_top,#321c11_0%,#1a0d07_100%)]">
        {/* Left Column (5/12): Filter & 100 Classes List */}
        <div
          className={`md:col-span-5 p-3 sm:p-4 border-r-0 md:border-r-2 border-[#c9952a]/60 bg-[#1c0f08]/90 overflow-y-auto space-y-3 ${
            mobileTab === 'list' ? 'block' : 'hidden md:block'
          }`}
        >
          {/* Category Filter Pills */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pb-2 border-b border-[#8c5a2b]/40">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`p-1.5 rounded-lg flex flex-col items-center gap-1 transition-all border ${
                    isActive
                      ? 'bg-[#4a2b17] text-[#f0c040] border-[#f0c040] shadow-md scale-105'
                      : 'bg-[#29170e] text-[#b89569] border-[#5c371d] hover:bg-[#382013]'
                  }`}
                >
                  <PixelArtIcon64 type={cat.iconType} size={30} />
                  <span className="text-[10px] font-sans font-bold leading-none truncate max-w-full">
                    {cat.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar por classe, habilidade ou subclasse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[#120804] border border-[#c9952a]/60 text-[#f3e5ab] text-xs font-sans placeholder-[#8c6d46] focus:outline-none focus:border-[#f0c040]"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-sans text-[#d4b483] font-bold px-1">
            <span>Classes Encontradas</span>
            <span className="text-[#f0c040] font-mono">{filteredClasses.length} / 100</span>
          </div>

          {/* Scrollable 100 Classes List */}
          <div className="space-y-1.5 pr-1 max-h-[calc(100%-140px)] overflow-y-auto">
            {filteredClasses.map((c, idx) => {
              const isSelected = selectedClassId === c.id

              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectClass(c.id as CharacterClass)}
                  className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between border font-sans ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#59331a] to-[#3d2110] border-[#f0c040] text-[#ffffff] shadow-lg ring-1 ring-[#f0c040]/50'
                      : 'bg-[#28160c]/60 border-[#54331a] hover:bg-[#382012] text-[#d4b483]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-[#150a04] rounded border border-[#8c5a2b] flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                      <ClassSpriteCanvas cls={c.id as CharacterClass} skin={0} tick={tick} scale={1.25} pose="idle" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#f5e6be]">{c.name}</div>
                      <span className="text-[10px] text-[#a88a60] block">{c.subclass}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#120804] border border-[#a87a32] text-[#f0c040] block">
                      Nv. {idx + 1}
                    </span>
                    <span className="text-[9px] text-[#8c6d46] mt-0.5 block">
                      {c.startWeapon === 'wooden_staff' ? 'Magia' : 'Físico'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column (7/12): Detailed Showcase & Customization Tabs */}
        <div
          className={`md:col-span-7 p-3 sm:p-5 overflow-y-auto flex flex-col justify-between space-y-3 ${
            mobileTab === 'details' ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="space-y-3">
            {/* Header Title with Primary Skill */}
            <div className="flex items-center justify-between pb-2 border-b border-[#c9952a]/50">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-[#1f1008] rounded-lg border-2 border-[#c9952a]">
                  {selectedMeta.icon}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#f0c040] drop-shadow">
                    {selectedMeta.name}
                  </h3>
                  <span className="text-xs text-[#d4b483] font-sans font-semibold">
                    Subclasse: {selectedMeta.subclass}
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 rounded bg-[#381e11] border border-[#f0c040] text-[#f0c040] text-xs font-sans font-bold shadow">
                {selectedMeta.primarySkillName}
              </span>
            </div>

            {/* Custom Sub-Tabs Navigation */}
            <div className="flex border-b border-[#8c5a2b]/60 bg-[#150a04] rounded-t-lg p-1 gap-1 font-sans text-xs">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex-1 py-1.5 rounded font-bold transition-all ${
                  activeTab === 'general'
                    ? 'bg-[#4a2b17] text-[#f0c040] border border-[#f0c040]'
                    : 'text-[#a88a60] hover:text-[#f3e5ab]'
                }`}
              >
                ⚔️ Geral & Skill
              </button>
              <button
                onClick={() => setActiveTab('origin')}
                className={`flex-1 py-1.5 rounded font-bold transition-all ${
                  activeTab === 'origin'
                    ? 'bg-[#4a2b17] text-[#f0c040] border border-[#f0c040]'
                    : 'text-[#a88a60] hover:text-[#f3e5ab]'
                }`}
              >
                🔮 Origem & Elemento
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-1.5 rounded font-bold transition-all ${
                  activeTab === 'stats'
                    ? 'bg-[#4a2b17] text-[#f0c040] border border-[#f0c040]'
                    : 'text-[#a88a60] hover:text-[#f3e5ab]'
                }`}
              >
                📊 Atributos (+10)
              </button>
              <button
                onClick={() => setActiveTab('skins')}
                className={`flex-1 py-1.5 rounded font-bold transition-all ${
                  activeTab === 'skins'
                    ? 'bg-[#4a2b17] text-[#f0c040] border border-[#f0c040]'
                    : 'text-[#a88a60] hover:text-[#f3e5ab]'
                }`}
              >
                🎨 Skins & Poses
              </button>
            </div>

            {/* TAB 1: GERAL & SKILL SHOWCASE */}
            {activeTab === 'general' && (
              <div className="space-y-3">
                {/* Visual Showcase: Portrait + Live Pixel Sprite + 34-Frames FX */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#1e1008]/80 p-3 rounded-lg border-2 border-[#8c5a2b] shadow-inner">
                  {/* Left Side: Portrait & Live Character Sprite */}
                  <div className="flex items-center justify-center gap-3 bg-[#120804] p-2 rounded-md border border-[#5c371d]">
                    {getClassPortrait(selectedClassId, skin) && (
                      <img
                        src={getClassPortrait(selectedClassId, skin)!}
                        alt={selectedMeta.name}
                        width={75}
                        height={75}
                        className="rounded-lg border-2 shadow-lg"
                        style={{
                          imageRendering: 'pixelated',
                          borderColor: selectedMeta.color,
                          boxShadow: `0 0 16px ${selectedMeta.color}88`,
                        }}
                      />
                    )}
                    <div className="flex flex-col items-center">
                      <ClassSpriteCanvas
                        cls={selectedClassId}
                        skin={skin}
                        tick={tick}
                        pose={poseMode}
                      />
                      <span className="text-[10px] text-[#f0c040] font-sans font-bold mt-1">
                        Skin {skin + 1} ({poseMode.toUpperCase()})
                      </span>
                    </div>
                  </div>

                  {/* Right Side: 34-Frames FX Animated Preview Canvas */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-md bg-[#120804] border border-[#c9952a]/70 text-center">
                    <div className="flex items-center gap-1 mb-1">
                      <PixelArtIcon64 type="ability_special" size={24} />
                      <span className="text-[10px] font-sans font-bold text-[#f0c040] uppercase tracking-wider">
                        Especial FX (34 Frames)
                      </span>
                    </div>
                    <SpecialFXCanvas
                      fxStyle={specialAbility?.fxStyle || 'fire_vortex'}
                      color={selectedMeta.color}
                      frame={fxFrame}
                    />
                    <span className="text-[9px] text-[#d4b483] font-mono mt-1">
                      FRAME: {fxFrame + 1} / 34
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs font-sans text-[#f3e5ab] bg-[#22130c] p-2.5 rounded-md border border-[#8c5a2b]/60 leading-relaxed">
                  {selectedMeta.description}
                </p>

                {/* Base Stats Progress Bars */}
                <div className="bg-[#180c07] p-2.5 rounded-md border border-[#8c5a2b] space-y-1.5">
                  <span className="text-[11px] font-sans font-bold text-[#f0c040] uppercase tracking-wider block">
                    Atributos da Classe
                  </span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-sans">
                    <StatBar icon="stat_hp" label="HP Max" value={selectedMeta.baseStats.maxHp} max={250} color="#ef4444" />
                    <StatBar icon="stat_mp" label="MP Max" value={selectedMeta.baseStats.maxMp} max={200} color="#3b82f6" />
                    <StatBar icon="stat_atk" label="Ataque" value={selectedMeta.baseStats.attack} max={30} color="#f97316" />
                    <StatBar icon="stat_def" label="Defesa" value={selectedMeta.baseStats.defense} max={25} color="#10b981" />
                    <StatBar icon="stat_magic" label="Poder Mag." value={selectedMeta.baseStats.magicPower} max={30} color="#a855f7" />
                    <StatBar icon="stat_speed" label="Velocidade" value={Math.round(selectedMeta.baseStats.speed * 10)} max={80} color="#eab308" />
                  </div>
                </div>

                {/* Active & Passive Abilities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans">
                  {/* Active Ability */}
                  <div className="p-2 rounded-md bg-[#24130a] border border-[#c9952a]/60 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <PixelArtIcon64 type="ability_active" size={24} />
                      <span className="text-[10px] font-bold text-[#f0c040] uppercase">
                        Habilidade Ativa
                      </span>
                    </div>
                    {initialActiveAbility ? (
                      <>
                        <div className="text-xs font-bold text-[#ffffff] flex items-center justify-between">
                          <span>{initialActiveAbility.name}</span>
                          <span className="text-[10px] text-[#f0c040] font-mono">
                            Mana: {initialActiveAbility.manaCost}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#d4b483] leading-tight">
                          {initialActiveAbility.description}
                        </p>
                      </>
                    ) : (
                      <span className="text-xs text-[#a88a60]">Ataque Físico Padrão</span>
                    )}
                  </div>

                  {/* Passive Skill */}
                  <div className="p-2 rounded-md bg-[#24130a] border border-[#c9952a]/60 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <PixelArtIcon64 type="ability_passive" size={24} />
                      <span className="text-[10px] font-bold text-[#f0c040] uppercase">
                        Passiva Única
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#ffffff]">
                      Passiva {selectedMeta.primarySkillName}
                    </div>
                    <p className="text-[10px] text-[#d4b483] leading-tight">
                      Eleva os acertos críticos e regenera recursos místicas durante os combates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ORIGEM & ELEMENTO & RELÍQUIA */}
            {activeTab === 'origin' && (
              <div className="space-y-3 font-sans">
                {/* Allegiance Origin Selection */}
                <div>
                  <span className="text-[11px] font-bold text-[#f0c040] uppercase tracking-wider block mb-1">
                    1. Escolha sua Origem Ancestral
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {ORIGINS.map((orig) => {
                      const isSelected = selectedOrigin === orig.id
                      return (
                        <button
                          key={orig.id}
                          onClick={() => setSelectedOrigin(orig.id)}
                          className={`p-2 rounded-md text-left transition-all border flex items-center gap-2 ${
                            isSelected
                              ? 'bg-[#4a2b17] border-[#f0c040] ring-1 ring-[#f0c040]'
                              : 'bg-[#180c07] border-[#5c371d] hover:bg-[#2e1a0e]'
                          }`}
                        >
                          <span className="text-xl">{orig.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-[#ffffff]">{orig.name}</div>
                            <div
                              className="text-[10px] font-bold"
                              style={{ color: orig.color }}
                            >
                              {orig.bonus}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Element Affinity Selection */}
                <div>
                  <span className="text-[11px] font-bold text-[#f0c040] uppercase tracking-wider block mb-1">
                    2. Afinidade Elemental
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {ELEMENTS.map((elem) => {
                      const isSelected = selectedElement === elem.id
                      return (
                        <button
                          key={elem.id}
                          onClick={() => setSelectedElement(elem.id)}
                          className={`p-1.5 rounded-md text-center transition-all border ${
                            isSelected
                              ? 'bg-[#4a2b17] border-[#f0c040] ring-1 ring-[#f0c040]'
                              : 'bg-[#180c07] border-[#5c371d] hover:bg-[#2e1a0e]'
                          }`}
                        >
                          <span className="text-lg block">{elem.icon}</span>
                          <span className="text-[10px] font-bold text-[#ffffff] block">
                            {elem.name}
                          </span>
                          <span className="text-[9px] font-bold block" style={{ color: elem.color }}>
                            {elem.bonus}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Starter Relic Selection */}
                <div>
                  <span className="text-[11px] font-bold text-[#f0c040] uppercase tracking-wider block mb-1">
                    3. Relíquia de Início
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {RELICS.map((rel) => {
                      const isSelected = selectedRelic === rel.id
                      return (
                        <button
                          key={rel.id}
                          onClick={() => setSelectedRelic(rel.id)}
                          className={`p-2 rounded-md text-left transition-all border flex items-center gap-2 ${
                            isSelected
                              ? 'bg-[#4a2b17] border-[#f0c040] ring-1 ring-[#f0c040]'
                              : 'bg-[#180c07] border-[#5c371d] hover:bg-[#2e1a0e]'
                          }`}
                        >
                          <span className="text-xl">{rel.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-[#ffffff]">{rel.name}</div>
                            <div className="text-[10px] text-[#f0c040] font-bold">{rel.bonus}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ATRIBUTOS (10 PTS ALLOCATION) */}
            {activeTab === 'stats' && (
              <div className="space-y-3 font-sans">
                <div className="bg-[#180c07] p-3 rounded-md border border-[#c9952a] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#f0c040] uppercase">
                      Distribuição de Atributos Iniciais
                    </h4>
                    <p className="text-[10px] text-[#d4b483]">
                      Distribua 10 pontos para moldar os atributos únicos do seu herói!
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#a88a60] block">Pontos Restantes</span>
                    <span className="text-base font-bold font-mono text-[#f0c040]">
                      {pointsRemaining} / 10
                    </span>
                  </div>
                </div>

                <div className="space-y-2 bg-[#1f1008] p-3 rounded-md border border-[#8c5a2b]">
                  {/* STR */}
                  <StatAllocRow
                    label="Força (STR)"
                    desc="Aumenta Dano Físico e Capacidade de Carga"
                    val={statPoints.str}
                    onMinus={() => handleModifyStat('str', -1)}
                    onPlus={() => handleModifyStat('str', 1)}
                    color="#ef4444"
                  />
                  {/* AGI */}
                  <StatAllocRow
                    label="Agilidade (AGI)"
                    desc="Aumenta Vel. de Ataque e Chance de Esquiva"
                    val={statPoints.agi}
                    onMinus={() => handleModifyStat('agi', -1)}
                    onPlus={() => handleModifyStat('agi', 1)}
                    color="#eab308"
                  />
                  {/* INT */}
                  <StatAllocRow
                    label="Inteligência (INT)"
                    desc="Aumenta Poder Mágico e Mana Máximo"
                    val={statPoints.int}
                    onMinus={() => handleModifyStat('int', -1)}
                    onPlus={() => handleModifyStat('int', 1)}
                    color="#38bdf8"
                  />
                  {/* VIT */}
                  <StatAllocRow
                    label="Vitalidade (VIT)"
                    desc="Aumenta Vida Máxima e Defesa Física"
                    val={statPoints.vit}
                    onMinus={() => handleModifyStat('vit', -1)}
                    onPlus={() => handleModifyStat('vit', 1)}
                    color="#22c55e"
                  />
                  {/* LCK */}
                  <StatAllocRow
                    label="Sorte (LCK)"
                    desc="Aumenta Chance de Crítico e Drop de Itens"
                    val={statPoints.lck}
                    onMinus={() => handleModifyStat('lck', -1)}
                    onPlus={() => handleModifyStat('lck', 1)}
                    color="#a855f7"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: SKINS & POSES PREVIEW */}
            {activeTab === 'skins' && (
              <div className="space-y-3 font-sans">
                {/* Pose Mode Selector */}
                <div>
                  <span className="text-[11px] font-bold text-[#f0c040] uppercase tracking-wider block mb-1">
                    Modo de Animação
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['idle', 'walk', 'attack', 'ultimate'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPoseMode(p)}
                        className={`py-1.5 rounded text-xs font-bold uppercase transition-all border ${
                          poseMode === p
                            ? 'bg-[#4a2b17] border-[#f0c040] text-[#f0c040]'
                            : 'bg-[#180c07] border-[#5c371d] text-[#a88a60]'
                        }`}
                      >
                        {p === 'idle'
                          ? '🧍 Parado'
                          : p === 'walk'
                          ? '🏃 Andando'
                          : p === 'attack'
                          ? '⚔️ Atacando'
                          : '✨ Especial'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skin Selector (10 Skins) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#f0c040] uppercase tracking-wider flex items-center gap-1">
                      <PixelArtIcon64 type="skin_icon" size={20} />
                      <span>Selecionar Skin ({skin + 1} / 10)</span>
                    </span>
                    <span className="text-[10px] text-[#d4b483] font-bold">
                      {SKIN_NAMES[selectedClassId]?.[skin] ?? `Skin ${skin + 1}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {Array.from({ length: 10 }, (_, s) => (
                      <button
                        key={s}
                        onClick={() => setSkin(s)}
                        className={`p-1 rounded-md flex flex-col items-center gap-1 transition-all border ${
                          skin === s
                            ? 'bg-[#4a2a16] border-[#f0c040] shadow-md scale-105 ring-1 ring-[#f0c040]'
                            : 'bg-[#180c07] border-[#4a2e18] hover:bg-[#2e1a0e]'
                        }`}
                      >
                        <ClassSpriteCanvas
                          cls={selectedClassId}
                          skin={s}
                          tick={tick}
                          scale={1.2}
                          pose={poseMode}
                        />
                        <span className="text-[8px] font-bold truncate max-w-[36px] text-[#d4b483]">
                          #{s + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-3 border-t border-[#c9952a]/50 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-2 rounded-md bg-[#180c07] border border-[#a87a32] hover:bg-[#29170e] text-[#f0c040] text-xs font-bold uppercase transition-all"
            >
              ◀ Voltar ao Menu
            </button>

            {error && <span className="text-xs text-red-400 font-bold text-center">{error}</span>}

            <button
              onClick={handleCreate}
              className="w-full sm:w-auto px-8 py-2.5 rounded-md bg-gradient-to-r from-[#d4af37] via-[#f0c040] to-[#d4af37] hover:brightness-110 text-[#1a0d07] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>⚔</span>
              <span>COMEÇAR AVENTURA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

function ClassSpriteCanvas({
  cls,
  skin,
  tick,
  scale = 2.2,
  pose = 'idle',
}: {
  cls: CharacterClass
  skin: number
  tick: number
  scale?: number
  pose?: 'idle' | 'walk' | 'attack' | 'ultimate'
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const size = 32 * scale

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, size, size)

    const isMoving = pose === 'walk'
    const isAttacking = pose === 'attack' || pose === 'ultimate'
    const animFrame = pose === 'ultimate' ? tick * 2 : tick

    drawCharacter(ctx, cls, 'down', isMoving, isAttacking, animFrame, 0, 0, scale, skin)
  }, [cls, skin, tick, scale, size, pose])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

function StatAllocRow({
  label,
  desc,
  val,
  onMinus,
  onPlus,
  color,
}: {
  label: string
  desc: string
  val: number
  onMinus: () => void
  onPlus: () => void
  color: string
}) {
  return (
    <div className="flex items-center justify-between bg-[#120804] p-2 rounded border border-[#5c371d]">
      <div>
        <span className="text-xs font-bold block" style={{ color }}>
          {label}
        </span>
        <span className="text-[10px] text-[#a88a60] block">{desc}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMinus}
          className="w-6 h-6 rounded bg-[#2e1a0e] border border-[#8c5a2b] hover:bg-[#4a2b17] text-[#f0c040] font-bold text-xs flex items-center justify-center"
        >
          -
        </button>
        <span className="text-xs font-bold font-mono text-[#ffffff] w-4 text-center">
          {val}
        </span>
        <button
          onClick={onPlus}
          className="w-6 h-6 rounded bg-[#2e1a0e] border border-[#8c5a2b] hover:bg-[#4a2b17] text-[#f0c040] font-bold text-xs flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  )
}

function StatBar({
  icon,
  label,
  value,
  max,
  color,
}: {
  icon: IconType64
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = Math.min(100, Math.max(10, Math.round((value / max) * 100)))

  return (
    <div className="flex items-center gap-1.5">
      <PixelArtIcon64 type={icon} size={20} />
      <span className="text-[10px] text-[#d4b483] w-16 truncate font-bold">{label}</span>
      <div className="flex-1 h-2 rounded bg-[#0d0603] border border-[#5c371d] overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-bold font-mono text-[#f0c040] w-7 text-right">
        {value}
      </span>
    </div>
  )
}

// 34-Frames FX Canvas Renderer
function SpecialFXCanvas({
  fxStyle,
  color,
  frame,
}: {
  fxStyle: string
  color: string
  frame: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    const cx = w / 2
    const cy = h / 2
    const progress = frame / 34

    const pulse = 0.5 + Math.sin(progress * Math.PI * 2) * 0.3
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 45)
    grad.addColorStop(0, color)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    ctx.save()

    if (fxStyle === 'fire_vortex' || fxStyle === 'flame_eruption') {
      for (let i = 0; i < 16; i++) {
        const ang = (i * Math.PI) / 8 + progress * Math.PI * 2
        const r = 4 + progress * 32
        const px = cx + Math.cos(ang) * r
        const py = cy + Math.sin(ang) * r
        ctx.fillStyle = i % 2 === 0 ? '#ef4444' : i % 3 === 0 ? '#f97316' : '#fef08a'
        ctx.beginPath()
        ctx.arc(px, py, Math.max(1, 5 - progress * 3), 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (fxStyle === 'ice_burst' || fxStyle === 'frost_shatter') {
      for (let i = 0; i < 12; i++) {
        const ang = (i * Math.PI) / 6
        const r = progress * 32
        const px = cx + Math.cos(ang) * r
        const py = cy + Math.sin(ang) * r
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#a5f3fc'
        ctx.fillRect(px - 3, py - 3, 6, 6)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(px - 1, py - 1, 2, 2)
      }
    } else if (fxStyle === 'holy_beam' || fxStyle === 'divine_judgement') {
      const beamW = 24 - Math.abs(17 - frame) * 0.5
      ctx.fillStyle = `rgba(250, 204, 21, ${pulse})`
      ctx.fillRect(cx - beamW / 2, 0, beamW, h)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(cx - beamW / 4, 0, beamW / 2, h)

      ctx.strokeStyle = '#fef08a'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(cx, cy, beamW * 1.5, beamW * 0.5, 0, 0, Math.PI * 2)
      ctx.stroke()
    } else if (fxStyle === 'shadow_strike' || fxStyle === 'void_rift') {
      ctx.strokeStyle = '#c084fc'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(cx, cy, 6 + progress * 26, 0, Math.PI * 2)
      ctx.stroke()

      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3 - progress * Math.PI * 2
        const r = 12 + progress * 15
        ctx.fillStyle = '#382bf0'
        ctx.fillRect(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, 4, 4)
      }
    } else if (fxStyle === 'thunder_burst' || fxStyle === 'storm_lightning') {
      ctx.strokeStyle = '#facc15'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(cx - 25, cy - 30)
      ctx.lineTo(cx - 5, cy - 5)
      ctx.lineTo(cx + 10, cy - 10)
      ctx.lineTo(cx + 25, cy + 30)
      ctx.stroke()

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.stroke()
    } else if (fxStyle === 'toxic_eruption' || fxStyle === 'poison_spores') {
      for (let i = 0; i < 10; i++) {
        const px = cx + Math.sin(i * 1.5 + progress * 6) * 20
        const py = cy + Math.cos(i * 2 - progress * 4) * 20
        ctx.fillStyle = i % 2 === 0 ? '#22c55e' : '#a3e635'
        ctx.beginPath()
        ctx.arc(px, py, 3 + (i % 3), 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (fxStyle === 'blood_wave' || fxStyle === 'vampire_slash') {
      ctx.strokeStyle = '#dc2626'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(cx, cy, 10 + progress * 20, -Math.PI / 2, Math.PI / 2)
      ctx.stroke()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.stroke()
    } else {
      for (let i = 0; i < 10; i++) {
        const ang = (i * Math.PI) / 5 + progress * Math.PI * 2
        const px = cx + Math.cos(ang) * (10 + progress * 20)
        const py = cy + Math.sin(ang) * (10 + progress * 20)
        ctx.fillStyle = color || '#f59e0b'
        ctx.fillRect(px - 2, py - 2, 4, 4)
      }
    }

    ctx.restore()
  }, [fxStyle, color, frame])

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={75}
      className="rounded bg-[#0a0a02] border border-[#8c5a2b]"
    />
  )
}

