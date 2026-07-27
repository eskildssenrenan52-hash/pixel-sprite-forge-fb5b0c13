import type { Monster, Player, CharacterStats } from './types'

export type DifficultyTier = 'normal' | 'hard' | 'nightmare' | 'torment' | 'inferno'

export type EliteAffix =
  | 'Vampiric'
  | 'Mortar'
  | 'Shielded'
  | 'Teleporter'
  | 'Enraged'
  | 'FrostNova'
  | 'LightningChain'

export interface DifficultyConfig {
  tier: DifficultyTier
  name: string
  color: string
  hpMult: number
  dmgMult: number
  speedMult: number
  xpMult: number
  goldMult: number
  dropRarityBonus: number
  affixCount: number
}

export const DIFFICULTY_CONFIGS: Record<DifficultyTier, DifficultyConfig> = {
  normal: {
    tier: 'normal',
    name: 'Normal',
    color: '#38bdf8',
    hpMult: 1.0,
    dmgMult: 1.0,
    speedMult: 1.0,
    xpMult: 1.0,
    goldMult: 1.0,
    dropRarityBonus: 0,
    affixCount: 1,
  },
  hard: {
    tier: 'hard',
    name: 'Difícil',
    color: '#facc15',
    hpMult: 1.6,
    dmgMult: 1.4,
    speedMult: 1.1,
    xpMult: 1.5,
    goldMult: 1.5,
    dropRarityBonus: 0.15,
    affixCount: 2,
  },
  nightmare: {
    tier: 'nightmare',
    name: 'Pesadelo',
    color: '#fb923c',
    hpMult: 2.5,
    dmgMult: 2.0,
    speedMult: 1.2,
    xpMult: 2.5,
    goldMult: 2.2,
    dropRarityBonus: 0.3,
    affixCount: 3,
  },
  torment: {
    tier: 'torment',
    name: 'Tormento',
    color: '#f43f5e',
    hpMult: 4.2,
    dmgMult: 3.2,
    speedMult: 1.3,
    xpMult: 4.0,
    goldMult: 3.5,
    dropRarityBonus: 0.5,
    affixCount: 4,
  },
  inferno: {
    tier: 'inferno',
    name: 'Infernal',
    color: '#a855f7',
    hpMult: 7.5,
    dmgMult: 5.0,
    speedMult: 1.4,
    xpMult: 7.0,
    goldMult: 6.0,
    dropRarityBonus: 0.8,
    affixCount: 5,
  },
}

export function getFloorDifficultyMultiplier(floorLevel: number): number {
  return 1.0 + Math.pow(floorLevel, 1.15) * 0.08
}

export function applyDifficultyToMonster(
  m: Monster,
  floorLevel: number = 1,
  tier: DifficultyTier = 'normal'
): Monster {
  const cfg = DIFFICULTY_CONFIGS[tier] || DIFFICULTY_CONFIGS.normal
  const floorMult = getFloorDifficultyMultiplier(floorLevel)

  const finalHp = Math.round(m.maxHp * cfg.hpMult * floorMult)
  const finalAtk = Math.round(m.attack * cfg.dmgMult * Math.sqrt(floorMult))
  const finalDef = Math.round(m.defense * (1 + floorLevel * 0.03))
  const finalSpd = m.speed * cfg.speedMult
  const finalXp = Math.round(m.xpReward * cfg.xpMult * floorMult)
  const finalGold = Math.round(m.goldReward * cfg.goldMult * floorMult)

  // Attach affixes if elite/champion/boss
  const affixes: EliteAffix[] = []
  if (m.elite !== 'normal') {
    const allAffixes: EliteAffix[] = ['Vampiric', 'Mortar', 'Shielded', 'Teleporter', 'Enraged', 'FrostNova', 'LightningChain']
    const count = Math.min(cfg.affixCount, m.elite === 'boss' ? 4 : m.elite === 'champion' ? 2 : 1)
    for (let i = 0; i < count; i++) {
      const affix = allAffixes[(m.name.length + i * 3) % allAffixes.length]
      if (!affixes.includes(affix)) affixes.push(affix)
    }
  }

  return {
    ...m,
    maxHp: finalHp,
    hp: finalHp,
    attack: finalAtk,
    defense: finalDef,
    speed: finalSpd,
    xpReward: finalXp,
    goldReward: finalGold,
    _affixes: affixes,
  } as Monster & { _affixes?: EliteAffix[] }
}

export function calculatePlayerDeathPenalty(player: Player): {
  goldLost: number
  durabilityLoss: number
  xpLoss: number
} {
  const goldLost = Math.floor(player.gold * 0.08) // 8% gold loss on death
  const xpLoss = Math.floor(player.xp * 0.05)     // 5% XP loss
  return { goldLost, durabilityLoss: 10, xpLoss }
}
