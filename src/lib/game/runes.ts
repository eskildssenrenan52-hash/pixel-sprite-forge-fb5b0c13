import type { Rune, ItemRarity, CharacterStats } from './types'
export type { Rune }

export const RUNE_TAGS = [
  'fire', 'ice', 'lightning', 'poison', 'holy', 'shadow', 'arcane',
  'vampire', 'crit', 'speed', 'defense', 'shield', 'blast', 'chain',
  'berserk', 'bleed', 'stun', 'time', 'cosmic', 'execute'
] as const

export const ALL_RUNES: Rune[] = []

const prefixList = [
  'Fehu', 'Uruz', 'Thurisaz', 'Ansuz', 'Raidho', 'Kenaz', 'Gebo', 'Wunjo',
  'Hagalaz', 'Nauthiz', 'Isa', 'Jera', 'Eihwaz', 'Perthro', 'Algiz', 'Sowilo',
  'Tiwaz', 'Berkano', 'Ehwaz', 'Mannaz', 'Laguz', 'Ingwaz', 'Othala', 'Dagaz',
  'Ignis', 'Glacies', 'Fulgar', 'Venenum', 'Sanctis', 'Umbra', 'Astral', 'Nexus',
  'Chronos', 'Aether', 'Titan', 'Aegis', 'Vortex', 'Kismet', 'Sol', 'Luna'
]

const elementList: { name: string; type: Rune['type']; color: string; tag: string; icon: string }[] = [
  { name: 'Chama Eterna', type: 'elemental', color: '#f97316', tag: 'fire', icon: '🔥' },
  { name: 'Gelo Primordial', type: 'elemental', color: '#38bdf8', tag: 'ice', icon: '❄️' },
  { name: 'Relâmpago Selvagem', type: 'elemental', color: '#facc15', tag: 'lightning', icon: '⚡' },
  { name: 'Veneno Mortal', type: 'elemental', color: '#22c55e', tag: 'poison', icon: '🧪' },
  { name: 'Luz Sagrada', type: 'elemental', color: '#fef08a', tag: 'holy', icon: '✨' },
  { name: 'Sombra Abissal', type: 'offensive', color: '#a855f7', tag: 'shadow', icon: '👁️' },
  { name: 'Arcano Supremo', type: 'offensive', color: '#ec4899', tag: 'arcane', icon: '🔮' },
  { name: 'Sanguessuga', type: 'utility', color: '#ef4444', tag: 'vampire', icon: '🩸' },
  { name: 'Golpe Devastador', type: 'offensive', color: '#dc2626', tag: 'crit', icon: '💥' },
  { name: 'Celeridade Astral', type: 'utility', color: '#06b6d4', tag: 'speed', icon: '🏃' },
  { name: 'Inviolável', type: 'defensive', color: '#64748b', tag: 'defense', icon: '🛡️' },
  { name: 'Escudo do Titã', type: 'defensive', color: '#e2e8f0', tag: 'shield', icon: '🏛️' },
  { name: 'Explosão de Mana', type: 'offensive', color: '#fb923c', tag: 'blast', icon: '💣' },
  { name: 'Corrente Arcana', type: 'offensive', color: '#6366f1', tag: 'chain', icon: '⛓️' },
  { name: 'Fúria Frenética', type: 'chaos', color: '#b91c1c', tag: 'berserk', icon: '🪓' },
  { name: 'Lacerado', type: 'offensive', color: '#991b1b', tag: 'bleed', icon: '🗡️' },
  { name: 'Esmagamento Stun', type: 'utility', color: '#eab308', tag: 'stun', icon: '💫' },
  { name: 'Dobra Temporal', type: 'cosmic', color: '#8b5cf6', tag: 'time', icon: '⏳' },
  { name: 'Singularidade Cósmica', type: 'cosmic', color: '#d946ef', tag: 'cosmic', icon: '🌌' },
  { name: 'Execução Final', type: 'chaos', color: '#450a0a', tag: 'execute', icon: '☠️' },
]

const rarities: { rarity: ItemRarity; mult: number }[] = [
  { rarity: 'common', mult: 1 },
  { rarity: 'uncommon', mult: 1.5 },
  { rarity: 'rare', mult: 2.2 },
  { rarity: 'epic', mult: 3.5 },
  { rarity: 'legendary', mult: 5.0 },
]

// Generate 100+ unique runes dynamically
let idCounter = 1
for (const p of prefixList) {
  for (const el of elementList) {
    if (ALL_RUNES.length >= 105) break
    const rarObj = rarities[(idCounter % rarities.length)]
    const stats: Partial<CharacterStats> = {}
    
    if (el.tag === 'fire' || el.tag === 'blast') stats.attack = Math.round(5 * rarObj.mult)
    if (el.tag === 'ice' || el.tag === 'shield') stats.defense = Math.round(4 * rarObj.mult)
    if (el.tag === 'lightning' || el.tag === 'speed') stats.speed = Number((0.5 * rarObj.mult).toFixed(1))
    if (el.tag === 'crit') stats.critChance = Number((0.03 * rarObj.mult).toFixed(2))
    if (el.tag === 'arcane' || el.tag === 'cosmic') stats.magicPower = Math.round(6 * rarObj.mult)
    if (el.tag === 'holy') stats.maxHp = Math.round(25 * rarObj.mult)

    ALL_RUNES.push({
      id: `rune_${idCounter}`,
      name: `Runa ${p} de ${el.name}`,
      rarity: rarObj.rarity,
      type: el.type,
      description: `Canaliza ${el.name}. Concede bônus elemental e sinergia com marcas de ${el.tag.toUpperCase()}.`,
      icon: el.icon,
      color: el.color,
      stats,
      synergyTags: [el.tag, rarObj.rarity, p.toLowerCase()],
      socketType: idCounter % 2 === 0 ? 'weapon' : 'armor',
      passiveEffect: `Ativa aura de ${el.name} (${Math.round(rarObj.mult * 10)}% de dano/resistência bônus)`
    })
    idCounter++
  }
}

export function evaluateRuneSynergies(runes: Rune[]) {
  const tagCounts: Record<string, number> = {}
  let bonusDamage = 0
  let bonusDefense = 0
  let bonusCrit = 0
  let bonusSpeed = 0
  const activeSynergyNames: string[] = []

  for (const r of runes) {
    for (const tag of r.synergyTags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    }
  }

  // Calculate synergy thresholds
  if ((tagCounts['fire'] || 0) >= 2) {
    bonusDamage += 15
    activeSynergyNames.push('🔥 Sinergia Incendiária (+15 Atq)')
  }
  if ((tagCounts['ice'] || 0) >= 2) {
    bonusDefense += 12
    activeSynergyNames.push('❄️ Sinergia Criogênica (+12 Def)')
  }
  if ((tagCounts['lightning'] || 0) >= 2) {
    bonusSpeed += 1.5
    activeSynergyNames.push('⚡ Sinergia Sobrecarga (+1.5 Vel)')
  }
  if ((tagCounts['crit'] || 0) >= 2) {
    bonusCrit += 0.10
    activeSynergyNames.push('💥 Sinergia Devastadora (+10% Crit)')
  }
  if ((tagCounts['cosmic'] || 0) >= 2) {
    bonusDamage += 25
    bonusDefense += 25
    activeSynergyNames.push('🌌 Sinergia Transcendente (+25 Atq/Def)')
  }

  return {
    tagCounts,
    bonusDamage,
    bonusDefense,
    bonusCrit,
    bonusSpeed,
    activeSynergyNames
  }
}
