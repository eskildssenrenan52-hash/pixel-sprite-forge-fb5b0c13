// @ts-nocheck
import type { AbilityDef, AbilityState, CharacterClass } from './types'
import { ALL_100_CLASSES, SUBSKILLS, SubskillDef } from './hundredClassesData'

export interface AbilityCondition {
  name: string
  type: 'always' | 'hp_above_30' | 'mana_above_15' | 'combo_high' | 'in_combat' | 'in_range'
}

export interface ExtendedAbilityDef extends AbilityDef {
  condition: AbilityCondition
  animationFrames: number // 32+ frames
  fxStyle: 'fire_vortex' | 'ice_burst' | 'holy_beam' | 'shadow_strike' | 'lightning_strike' | 'poison_cloud' | 'blade_dance' | 'blood_explosion' | 'time_warp' | 'meteor_rain'
}

// ─── 10 Habilidades para as classes base e geradas dinamicamente para todas as 100 classes ───
const EFFECT_TYPES: Array<import('./types').AbilityEffectType> = [
  'melee_aoe', 'projectile', 'multi_projectile', 'nova', 'target_aoe',
  'dash', 'summon', 'heal', 'buff', 'life_drain'
]

const CONDITIONS: AbilityCondition[] = [
  { name: 'Sempre Ativa (Pronta)', type: 'always' },
  { name: 'Nível de HP > 30%', type: 'hp_above_30' },
  { name: 'Nível de Mana > 15%', type: 'mana_above_15' },
  { name: 'Ataque em Combate', type: 'in_combat' },
  { name: 'Alvo ao Alcance', type: 'in_range' },
  { name: 'Combo de Golpes', type: 'combo_high' },
]

const FX_STYLES = [
  'fire_vortex', 'ice_burst', 'holy_beam', 'shadow_strike',
  'lightning_strike', 'poison_cloud', 'blade_dance', 'blood_explosion',
  'time_warp', 'meteor_rain'
] as const

const ABILITY_NAME_TEMPLATES = [
  ['Impacto Inicial', 'Golfada Flamejante', 'Escudo da Fé', 'Lâmina das Sombras', 'Explosão Arcana', 'Invocar Ajuda', 'Tempestade de Aço', 'Regeneração Viva', 'Bênção Suprema', 'Devastação Apocalíptica'],
  ['Tiro Certeiro', 'Flecha Tripla', 'Olho de Águia', 'Chuva de Projéteis', 'Salto Evasivo', 'Disparo de Luz', 'Caça Selvagem', 'Foco Mortal', 'Vento Celerado', 'Dilúvio do Caçador'],
  ['Faísca Mística', 'Orbe do Caos', 'Cura da Alma', 'Nova Glacial', 'Anel de Fogo', 'Barreira Mágica', 'Raio do Abismo', 'Drenagem de Mana', 'Colapso Celestial', 'Singularidade Astral'],
]

// Generate 10 abilities per class for all 100 classes
export const ABILITIES: Record<string, ExtendedAbilityDef> = {}
export const CLASS_ABILITIES: Record<string, string[]> = {}

ALL_100_CLASSES.forEach((clsMeta) => {
  const clsId = clsMeta.id
  const classAbilities: string[] = []

  for (let i = 0; i < 10; i++) {
    const abId = `${clsId}_ability_${i + 1}`
    const templateGroup = ABILITY_NAME_TEMPLATES[i % ABILITY_NAME_TEMPLATES.length]
    const name = `${templateGroup[i]} de ${clsMeta.name}`
    const effect = EFFECT_TYPES[i % EFFECT_TYPES.length]
    const condition = CONDITIONS[i % CONDITIONS.length]
    const fxStyle = FX_STYLES[i % FX_STYLES.length]

    const def: ExtendedAbilityDef = {
      id: abId,
      name,
      cls: clsId as CharacterClass,
      description: `Habilidade Nível ${i + 1} de ${clsMeta.name}. Efeito ${effect} com animação especial de 32 frames.`,
      icon: clsMeta.icon,
      color: clsMeta.color,
      manaCost: 10 + (i * 4),
      cooldown: 80 + (i * 50),
      unlockLevel: i + 1,
      effect,
      damageMultiplier: 1.5 + (i * 0.3),
      range: effect === 'projectile' || effect === 'multi_projectile' || effect === 'target_aoe' ? 240 + (i * 15) : 80,
      radius: 60 + (i * 10),
      projectileCount: effect === 'multi_projectile' ? 3 + Math.floor(i / 2) : 1,
      duration: 300 + (i * 30),
      healPercent: effect === 'heal' || effect === 'life_drain' ? 0.2 + (i * 0.05) : 0,
      condition,
      animationFrames: 32,
      fxStyle,
    }

    ABILITIES[abId] = def
    classAbilities.push(abId)
  }

  CLASS_ABILITIES[clsId] = classAbilities
})

export function buildAbilityStates(cls: CharacterClass): AbilityState[] {
  const abList = CLASS_ABILITIES[cls] || []
  return abList.map((id) => ({ id, currentCooldown: 0 }))
}

export function getAbilityDef(id: string): ExtendedAbilityDef | undefined {
  return ABILITIES[id]
}

export function getBuffForAbility(abilityId: string): { name: string; stat: keyof import('./types').CharacterStats; amount: number; duration: number }[] {
  const ab = getAbilityDef(abilityId)
  if (!ab) return []
  return [
    { name: ab.name, stat: 'attack', amount: 15, duration: ab.duration || 300 },
    { name: ab.name, stat: 'defense', amount: 10, duration: ab.duration || 300 },
  ]
}
