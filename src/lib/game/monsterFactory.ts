import type { Monster, MonsterType, EliteTier, Item } from './types'
import { isExtendedType, getExtendedDef, buildExtendedMonsterFromDef } from './extendedMonsters'

let _itemsRef: Record<string, Item> | null = null
export function setItemsRef(items: Record<string, Item>) {
  _itemsRef = items
}

const ELITE_MULT: Record<EliteTier, { hp: number; atk: number; xp: number; gold: number }> = {
  normal:   { hp: 1,    atk: 1,    xp: 1,   gold: 1 },
  elite:    { hp: 2.2,  atk: 1.5,  xp: 2.5, gold: 2.5 },
  champion: { hp: 4,    atk: 2.1,  xp: 5,   gold: 5 },
  boss:     { hp: 9,    atk: 3.2,  xp: 12,  gold: 12 },
}

const ELITE_PREFIX: Record<EliteTier, string> = {
  normal: '', elite: 'Elite ', champion: 'Campeao ', boss: 'CHEFE ',
}

const RANGED_TYPES: MonsterType[] = ['archer_enemy', 'mage_enemy', 'witch', 'ghost']

// Inimigos 3x mais fracos (era 5.0 / 4.0)
const DIFF_HP = 5.0 / 3
const DIFF_ATK = 4.0 / 3
const DIFF_DEF = 2.5

export function rollEliteTier(bossChance = 0): EliteTier {
  const r = Math.random()
  if (bossChance > 0 && r < bossChance) return 'boss'
  if (r < 0.08) return 'champion'
  if (r < 0.28) return 'elite'
  return 'normal'
}

export function createMonster(type: MonsterType, level: number, x: number, y: number, elite: EliteTier = 'normal'): Monster {
  if (isExtendedType(type as string)) {
    const def = getExtendedDef(type as string)
    if (def) {
      return buildExtendedMonsterFromDef(def, level, x, y, elite)
    }
  }

  const items = _itemsRef || (globalThis as any).__ITEMS__ || {}

  const templates: Record<string, Omit<Monster, 'id' | 'position' | 'targetPosition' | 'animFrame' | 'animTimer' | 'isDead' | 'deathTimer' | 'isMoving' | 'isAttacking' | 'attackCooldown' | 'isAggrod' | 'direction' | 'attackRange' | 'isRanged' | 'elite'>> = {
    slime: { type: 'slime', name: 'Slime', level, hp: 20 * level, maxHp: 20 * level, attack: 3 * level, defense: 1, speed: 1.5, xpReward: 10 * level, goldReward: 2 * level, aggroRange: 120, drops: [{ item: { ...(items.slime_gel || {}), quantity: 1 }, chance: 0.7 }, { item: { ...(items.small_potion || {}), quantity: 1 }, chance: 0.15 }] },
    skeleton: { type: 'skeleton', name: 'Esqueleto', level, hp: 30 * level, maxHp: 30 * level, attack: 7 * level, defense: 3, speed: 2, xpReward: 18 * level, goldReward: 5 * level, aggroRange: 150, drops: [{ item: { ...(items.bone_shard || {}), quantity: 1 }, chance: 0.8 }, { item: { ...(items.iron_sword || {}), quantity: 1 }, chance: 0.05 }] },
    goblin: { type: 'goblin', name: 'Goblin', level, hp: 25 * level, maxHp: 25 * level, attack: 6 * level, defense: 2, speed: 2.5, xpReward: 15 * level, goldReward: 8 * level, aggroRange: 140, drops: [{ item: { ...(items.small_potion || {}), quantity: 1 }, chance: 0.3 }, { item: { ...(items.leather_armor || {}), quantity: 1 }, chance: 0.04 }] },
    orc: { type: 'orc', name: 'Orc', level, hp: 60 * level, maxHp: 60 * level, attack: 12 * level, defense: 6, speed: 1.8, xpReward: 30 * level, goldReward: 15 * level, aggroRange: 130, drops: [{ item: { ...(items.chainmail || {}), quantity: 1 }, chance: 0.08 }, { item: { ...(items.potion || {}), quantity: 1 }, chance: 0.25 }] },
    wolf: { type: 'wolf', name: 'Lobo', level, hp: 35 * level, maxHp: 35 * level, attack: 9 * level, defense: 2, speed: 3.5, xpReward: 20 * level, goldReward: 6 * level, aggroRange: 160, drops: [{ item: { ...(items.wolf_pelt || {}), quantity: 1 }, chance: 0.75 }, { item: { ...(items.leather_boots || {}), quantity: 1 }, chance: 0.06 }] },
    spider: { type: 'spider', name: 'Aranha Venenosa', level, hp: 28 * level, maxHp: 28 * level, attack: 8 * level, defense: 2, speed: 2.8, xpReward: 22 * level, goldReward: 7 * level, aggroRange: 110, drops: [{ item: { ...(items.mana_potion || {}), quantity: 1 }, chance: 0.2 }, { item: { ...(items.copper_ring || {}), quantity: 1 }, chance: 0.04 }] },
    zombie: { type: 'zombie', name: 'Zumbi', level, hp: 45 * level, maxHp: 45 * level, attack: 8 * level, defense: 4, speed: 1.2, xpReward: 25 * level, goldReward: 10 * level, aggroRange: 100, drops: [{ item: { ...(items.bone_shard || {}), quantity: 1 }, chance: 0.5 }, { item: { ...(items.potion || {}), quantity: 1 }, chance: 0.2 }] },
    demon: { type: 'demon', name: 'Demonio', level, hp: 80 * level, maxHp: 80 * level, attack: 18 * level, defense: 8, speed: 2.2, xpReward: 50 * level, goldReward: 30 * level, aggroRange: 170, drops: [{ item: { ...(items.demon_horn || {}), quantity: 1 }, chance: 0.5 }, { item: { ...(items.great_potion || {}), quantity: 1 }, chance: 0.3 }, { item: { ...(items.titan_armor || {}), quantity: 1 }, chance: 0.02 }] },
    dragon: { type: 'dragon', name: 'Dragao Antigo', level, hp: 200 * level, maxHp: 200 * level, attack: 35 * level, defense: 15, speed: 1.5, xpReward: 200 * level, goldReward: 200 * level, aggroRange: 200, drops: [{ item: { ...(items.dragon_scale || {}), quantity: 1 }, chance: 0.8 }, { item: { ...(items.titan_sword || {}), quantity: 1 }, chance: 0.05 }, { item: { ...(items.titan_armor || {}), quantity: 1 }, chance: 0.05 }] },
    troll: { type: 'troll', name: 'Troll da Floresta', level, hp: 120 * level, maxHp: 120 * level, attack: 22 * level, defense: 10, speed: 1.6, xpReward: 80 * level, goldReward: 50 * level, aggroRange: 140, drops: [{ item: { ...(items.great_potion || {}), quantity: 1 }, chance: 0.35 }, { item: { ...(items.plate_armor || {}), quantity: 1 }, chance: 0.04 }] },
    witch: { type: 'witch', name: 'Bruxa Sombria', level, hp: 55 * level, maxHp: 55 * level, attack: 15 * level, defense: 5, speed: 2.0, xpReward: 40 * level, goldReward: 25 * level, aggroRange: 180, drops: [{ item: { ...(items.arcane_staff || {}), quantity: 1 }, chance: 0.06 }, { item: { ...(items.mana_potion || {}), quantity: 1 }, chance: 0.4 }, { item: { ...(items.magic_ring || {}), quantity: 1 }, chance: 0.05 }] },
    knight_enemy: { type: 'knight_enemy', name: 'Cavaleiro das Trevas', level, hp: 70 * level, maxHp: 70 * level, attack: 16 * level, defense: 12, speed: 2.0, xpReward: 60 * level, goldReward: 40 * level, aggroRange: 150, drops: [{ item: { ...(items.knight_blade || {}), quantity: 1 }, chance: 0.05 }, { item: { ...(items.plate_armor || {}), quantity: 1 }, chance: 0.05 }, { item: { ...(items.potion || {}), quantity: 1 }, chance: 0.4 }] },
    archer_enemy: { type: 'archer_enemy', name: 'Arqueiro Sombrio', level, hp: 40 * level, maxHp: 40 * level, attack: 14 * level, defense: 6, speed: 3.0, xpReward: 45 * level, goldReward: 30 * level, aggroRange: 200, drops: [{ item: { ...(items.elven_bow || {}), quantity: 1 }, chance: 0.04 }, { item: { ...(items.leather_armor || {}), quantity: 1 }, chance: 0.1 }] },
    mage_enemy: { type: 'mage_enemy', name: 'Mago das Sombras', level, hp: 35 * level, maxHp: 35 * level, attack: 12 * level, defense: 4, speed: 2.5, xpReward: 55 * level, goldReward: 35 * level, aggroRange: 190, drops: [{ item: { ...(items.arcane_staff || {}), quantity: 1 }, chance: 0.05 }, { item: { ...(items.mana_potion || {}), quantity: 1 }, chance: 0.5 }, { item: { ...(items.magic_ring || {}), quantity: 1 }, chance: 0.04 }] },
    ghost: { type: 'ghost', name: 'Fantasma', level, hp: 30 * level, maxHp: 30 * level, attack: 18 * level, defense: 2, speed: 2.8, xpReward: 50 * level, goldReward: 28 * level, aggroRange: 170, drops: [{ item: { ...(items.mana_potion || {}), quantity: 1 }, chance: 0.5 }, { item: { ...(items.soul_staff || {}), quantity: 1 }, chance: 0.002 }, { item: { ...(items.void_crystal || {}), quantity: 1 }, chance: 0.25 }] },
    vampire: { type: 'vampire', name: 'Vampiro', level, hp: 60 * level, maxHp: 60 * level, attack: 20 * level, defense: 8, speed: 3.2, xpReward: 70 * level, goldReward: 50 * level, aggroRange: 160, drops: [{ item: { ...(items.magic_ring || {}), quantity: 1 }, chance: 0.08 }, { item: { ...(items.potion || {}), quantity: 1 }, chance: 0.4 }, { item: { ...(items.vampire_cloak || {}), quantity: 1 }, chance: 0.004 }] },
    treant: { type: 'treant', name: 'Treante', level, hp: 90 * level, maxHp: 90 * level, attack: 22 * level, defense: 15, speed: 1.4, xpReward: 80 * level, goldReward: 60 * level, aggroRange: 130, drops: [{ item: { ...(items.iron_sword || {}), quantity: 1 }, chance: 0.03 }, { item: { ...(items.potion || {}), quantity: 1 }, chance: 0.3 }, { item: { ...(items.treant_ring || {}), quantity: 1 }, chance: 0.006 }, { item: { ...(items.ancient_bow || {}), quantity: 1 }, chance: 0.001 }, { item: { ...(items.ancient_bark_piece || {}), quantity: 1 }, chance: 0.35 }] },
    mummy: { type: 'mummy', name: 'Múmia Anciã', level, hp: 50 * level, maxHp: 50 * level, attack: 10 * level, defense: 5, speed: 1.5, xpReward: 35 * level, goldReward: 20 * level, aggroRange: 130, drops: [{ item: { ...(items.potion || {}), quantity: 1 }, chance: 0.3 }] },
    cryomancer: { type: 'cryomancer', name: 'Criomante de Gelo', level, hp: 45 * level, maxHp: 45 * level, attack: 15 * level, defense: 4, speed: 2.2, xpReward: 50 * level, goldReward: 30 * level, aggroRange: 190, drops: [{ item: { ...(items.mana_potion || {}), quantity: 1 }, chance: 0.4 }] },
    pyromancer: { type: 'pyromancer', name: 'Piromante Infernal', level, hp: 45 * level, maxHp: 45 * level, attack: 18 * level, defense: 4, speed: 2.2, xpReward: 55 * level, goldReward: 35 * level, aggroRange: 190, drops: [{ item: { ...(items.mana_potion || {}), quantity: 1 }, chance: 0.4 }] },
    valkyrie: { type: 'valkyrie', name: 'Valquíria Celestial', level, hp: 80 * level, maxHp: 80 * level, attack: 22 * level, defense: 10, speed: 2.8, xpReward: 90 * level, goldReward: 60 * level, aggroRange: 200, drops: [{ item: { ...(items.great_potion || {}), quantity: 1 }, chance: 0.5 }] },
  }

  const template = templates[type] || templates['slime'] || {
    type: 'slime', name: 'Monstro', level, hp: 20 * level, maxHp: 20 * level, attack: 3 * level, defense: 1, speed: 1.5, xpReward: 10 * level, goldReward: 2 * level, aggroRange: 120, drops: []
  }
  const mult = ELITE_MULT[elite] || ELITE_MULT['normal']
  const isRanged = RANGED_TYPES.includes(type)

  const maxHp = Math.round((template.maxHp || 20 * level) * DIFF_HP * mult.hp)
  const attack = Math.round((template.attack || 3 * level) * DIFF_ATK * mult.atk)
  const defense = Math.round((template.defense || 1) * DIFF_DEF + level * 2)
  const eliteScale = elite === 'normal' ? 1 : elite === 'elite' ? 1.15 : elite === 'champion' ? 1.3 : 1.6

  return {
    ...template,
    type,
    name: `${ELITE_PREFIX[elite] || ''}${template.name || type}`,
    maxHp,
    hp: maxHp,
    attack,
    defense,
    xpReward: Math.round((template.xpReward || 10) * mult.xp * 1.5),
    goldReward: Math.round((template.goldReward || 2) * mult.gold * 1.5),
    aggroRange: Math.round((template.aggroRange || 120) * (isRanged ? 1.3 : 1.1) * 1.3),
    speed: (template.speed || 1.5) * (elite === 'boss' ? 0.9 : 1) * 1.4,
    attackRange: isRanged ? 220 : 42 + Math.round(eliteScale * 4),
    isRanged,
    elite,
    id: `${type}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    position: { x, y },
    targetPosition: { x, y },
    direction: 'down',
    isMoving: false,
    isAttacking: false,
    attackCooldown: 0,
    isAggrod: false,
    animFrame: Math.random() * 60,
    animTimer: 0,
    isDead: false,
    deathTimer: 0,
    _spawnX: x,
    _spawnY: y,
    _spawnType: type,
    _spawnLevel: level,
    _spawnElite: elite,
    _respawnIn: 0,
  }
}
