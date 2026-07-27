import type { Item, ItemRarity, ItemType, CharacterStats } from './types'

export interface OreDefinition {
  id: string
  name: string
  tier: number
  color: string
  icon: string
  biome: string
  value: number
  description: string
}

export const ORE_DEFINITIONS: OreDefinition[] = []

const orePrefixes = [
  'Cobre', 'Ferro', 'Bronze', 'Prata', 'Ouro', 'Mitril', 'Adamantita', 'Titanio',
  'Cobalto', 'Obsidiana', 'Quartzo', 'Rubi', 'Esmeralda', 'Safira', 'Diamante',
  'Ametista', 'Topázio', 'Ônix', 'Opala', 'Azurita', 'Maltita', 'Aetherium',
  'Orichalcum', 'Eternium', 'Astralium', 'Obsidiana Negra', 'Cristal Lunar',
  'Cristal Solar', 'Pedra Sangrenta', 'Pedra Abissal', 'Fragmento Cósmico',
  'Nébula', 'Singularidade', 'Vórtex', 'Lava Solidificada', 'Gelo Eterno',
  'Trovão Petrificado', 'Essência de Luz', 'Alma Penada', 'Matéria Escura'
]

const oreSuffixes = [
  'Puro', 'Refinado', 'Ancião', 'Místico', 'Radiante', 'Sombrio', 'Vigoroso',
  'Encantado', 'Corrompido', 'Celestial', 'Flamejante', 'Glacial', 'Eletrizante'
]

let oreId = 1
for (const p of orePrefixes) {
  for (const s of oreSuffixes) {
    if (ORE_DEFINITIONS.length >= 108) break
    const tier = Math.min(10, Math.ceil(oreId / 10))
    ORE_DEFINITIONS.push({
      id: `ore_${oreId}`,
      name: `Minério de ${p} ${s}`,
      tier,
      color: getTierColor(tier),
      icon: tier > 7 ? '💎' : tier > 4 ? '✨' : '🪨',
      biome: getTierBiome(tier),
      value: tier * 15,
      description: `Minério raro de grau ${tier}. Essencial para forjar equipamentos avançados e runas.`
    })
    oreId++
  }
}

function getTierColor(tier: number): string {
  const colors = [
    '#94a3b8', '#a1a1aa', '#b45309', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#a855f7', '#ec4899', '#f43f5e'
  ]
  return colors[Math.max(0, Math.min(9, tier - 1))]
}

function getTierBiome(tier: number): string {
  const biomes = ['city', 'forest', 'tundra', 'volcano', 'abyss', 'ruins', 'crystal', 'sky', 'tower']
  return biomes[Math.min(biomes.length - 1, tier - 1)]
}

// Helper to convert ore to material item
export function createMaterialItemFromOre(ore: OreDefinition): Item {
  return {
    id: ore.id,
    name: ore.name,
    type: 'material',
    rarity: ore.tier > 8 ? 'legendary' : ore.tier > 6 ? 'epic' : ore.tier > 4 ? 'rare' : ore.tier > 2 ? 'uncommon' : 'common',
    icon: ore.icon,
    description: ore.description,
    stats: {},
    stackable: true,
    quantity: 1,
    value: ore.value
  }
}

// ─── 3x3 Minecraft Crafting System ─────────────────────────────────────────────

export interface CraftingPattern3x3 {
  name: string
  pattern: (string | null)[][] // 3x3 names or types
  result: (grid: (Item | null)[][]) => Item
}

export function checkCraftingGrid3x3(grid: (Item | null)[][]): Item | null {
  // Extract non-null items
  const items: Item[] = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[r][c]) items.push(grid[r][c]!)
    }
  }

  if (items.length === 0) return null

  // Recipe 1: 3 of same ore/ingot in top row -> Weapon
  const topRowFull = grid[0][0] && grid[0][1] && grid[0][2]
  if (topRowFull && items.length === 3) {
    const mat = grid[0][0]!
    const name = mat.name.replace('Minério de ', '').replace('Barra de ', '')
    return createCraftedItem(`Espada de ${name}`, 'weapon', 'sword', mat.value * 4)
  }

  // Recipe 2: 4 items in box shape (2x2) -> Armor
  if (grid[0][0] && grid[0][1] && grid[1][0] && grid[1][1] && items.length === 4) {
    const mat = grid[0][0]!
    const name = mat.name.replace('Minério de ', '')
    return createCraftedItem(`Armadura de ${name}`, 'armor', 'shield', mat.value * 5)
  }

  // Recipe 3: Cross pattern (plus shape) -> Helmet / Ring
  if (grid[0][1] && grid[1][0] && grid[1][1] && grid[1][2] && grid[2][1] && items.length === 5) {
    const mat = grid[1][1]!
    const name = mat.name.replace('Minério de ', '')
    return createCraftedItem(`Elmo Imperial de ${name}`, 'helmet', 'crown', mat.value * 6)
  }

  // Generic Combination: If 2 or more materials are present, combine their stats into a custom item!
  if (items.length >= 2) {
    const primary = items[0]
    const secondary = items[1]
    const type: ItemType = primary.type === 'material' ? 'weapon' : primary.type
    const combinedName = `${primary.name.split(' ')[0]} ${secondary.name.split(' ').slice(-1)[0]} Customizado`
    return createCraftedItem(combinedName, type, 'star', (primary.value + secondary.value) * 2)
  }

  return null
}

export function createCraftedItem(name: string, type: ItemType, iconSymbol: string, baseVal: number): Item {
  const rarities: ItemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary']
  const rarity = rarities[Math.min(4, Math.floor(baseVal / 50))]
  const mult = baseVal / 20 + 1

  const stats: Partial<CharacterStats> = {}
  if (type === 'weapon') {
    stats.attack = Math.round(15 * mult)
    stats.critChance = 0.08
    stats.magicPower = Math.round(10 * mult)
  } else if (type === 'armor') {
    stats.defense = Math.round(12 * mult)
    stats.maxHp = Math.round(50 * mult)
  } else if (type === 'helmet') {
    stats.defense = Math.round(8 * mult)
    stats.maxMp = Math.round(40 * mult)
  } else if (type === 'boots') {
    stats.speed = 1.2
    stats.defense = Math.round(5 * mult)
  } else {
    stats.attack = Math.round(5 * mult)
    stats.defense = Math.round(5 * mult)
    stats.critChance = 0.05
  }

  return {
    id: `crafted_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    type,
    rarity,
    icon: type === 'weapon' ? '⚔️' : type === 'armor' ? '🛡️' : type === 'helmet' ? '🪖' : '💍',
    description: `Equipamento forjado com maestria artesanal. Concede atributos elevados e sinergia de forja.`,
    stats,
    value: Math.round(baseVal * 3),
    level: Math.max(1, Math.floor(baseVal / 10))
  }
}
