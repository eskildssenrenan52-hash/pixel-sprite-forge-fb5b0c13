import type { CharacterClass } from './types'

export interface SkillNode {
  id: string
  name: string
  description: string
  icon: string
  tier: number // 1, 2, 3, 4
  col: number // 1, 2, 3 for horizontal layout inside tier
  maxLevel: number
  requires?: string[] // Prerequisites
  statBonus: {
    stat: string
    valuePerLevel: number
    isPercent?: boolean
  }
}

export interface ClassSkillTree {
  className: CharacterClass
  title: string
  color: string
  icon: string
  nodes: SkillNode[]
}

export const CLASS_SKILL_TREES: Record<string, ClassSkillTree> = {
  knight: {
    className: 'knight',
    title: 'Árvore do Guerreiro',
    color: '#d0a030',
    icon: '⚔️',
    nodes: [
      // Tier 1
      { id: 'k_str1', name: 'Força Bruta', description: 'Aumenta o dano físico base de todos os ataques.', icon: '💪', tier: 1, col: 1, maxLevel: 5, statBonus: { stat: 'attack', valuePerLevel: 5 } },
      { id: 'k_def1', name: 'Pele de Aço', description: 'Aumenta a defesa física total contra monstros.', icon: '🛡️', tier: 1, col: 2, maxLevel: 5, statBonus: { stat: 'defense', valuePerLevel: 4 } },
      { id: 'k_vit1', name: 'Vitalidade do Titã', description: 'Aumenta a vida máxima do guerreiro.', icon: '❤️', tier: 1, col: 3, maxLevel: 5, statBonus: { stat: 'hp', valuePerLevel: 25 } },

      // Tier 2
      { id: 'k_crit1', name: 'Golpe Preciso', description: 'Aumenta a chance de acerto crítico com espadas e machados.', icon: '🎯', tier: 2, col: 1, maxLevel: 5, requires: ['k_str1'], statBonus: { stat: 'critChance', valuePerLevel: 0.02, isPercent: true } },
      { id: 'k_block1', name: 'Bloqueio Perfeito', description: 'Aumenta a defesa e reduz o dano sofrido.', icon: '🛡️', tier: 2, col: 2, maxLevel: 5, requires: ['k_def1'], statBonus: { stat: 'defense', valuePerLevel: 8 } },
      { id: 'k_regen1', name: 'Recuperação Rápida', description: 'Aumenta a velocidade de regeneração de vida.', icon: '🩸', tier: 2, col: 3, maxLevel: 5, requires: ['k_vit1'], statBonus: { stat: 'hpRegen', valuePerLevel: 2 } },

      // Tier 3
      { id: 'k_cleave', name: 'Corte Varredura', description: 'Aumenta o multiplicador de dano crítico.', icon: '💥', tier: 3, col: 1, maxLevel: 5, requires: ['k_crit1'], statBonus: { stat: 'critDamage', valuePerLevel: 0.15, isPercent: true } },
      { id: 'k_thorns', name: 'Armadura Espinhosa', description: 'Devolve dano físico aos atacantes.', icon: '⚙️', tier: 3, col: 2, maxLevel: 5, requires: ['k_block1'], statBonus: { stat: 'thorns', valuePerLevel: 6 } },

      // Tier 4 (Ultimate)
      { id: 'k_ult', name: 'Ira do Berserker', description: 'Supremo: Aumenta imensamente o Dano, Vida e Defesa.', icon: '👑', tier: 4, col: 2, maxLevel: 1, requires: ['k_cleave', 'k_thorns'], statBonus: { stat: 'attack', valuePerLevel: 50 } },
    ]
  },
  archer: {
    className: 'archer',
    title: 'Árvore do Arqueiro',
    color: '#40c060',
    icon: '🏹',
    nodes: [
      // Tier 1
      { id: 'a_dex1', name: 'Mira Aguçada', description: 'Aumenta o ataque de alcance à distância.', icon: '🎯', tier: 1, col: 1, maxLevel: 5, statBonus: { stat: 'attack', valuePerLevel: 6 } },
      { id: 'a_spd1', name: 'Passos de Vento', description: 'Aumenta a velocidade de movimento.', icon: '👟', tier: 1, col: 2, maxLevel: 5, statBonus: { stat: 'speed', valuePerLevel: 0.15 } },
      { id: 'a_range1', name: 'Olho de Águia', description: 'Aumenta o alcance máximo de disparo de flechas.', icon: '🦅', tier: 1, col: 3, maxLevel: 5, statBonus: { stat: 'range', valuePerLevel: 16 } },

      // Tier 2
      { id: 'a_crit1', name: 'Tiro Mortal', description: 'Aumenta imensamente a chance de acerto crítico.', icon: '💥', tier: 2, col: 1, maxLevel: 5, requires: ['a_dex1'], statBonus: { stat: 'critChance', valuePerLevel: 0.03, isPercent: true } },
      { id: 'a_multishot', name: 'Flechas Químicas', description: 'Adiciona dano de veneno aos disparos.', icon: '🧪', tier: 2, col: 2, maxLevel: 5, requires: ['a_spd1'], statBonus: { stat: 'attack', valuePerLevel: 8 } },

      // Tier 3
      { id: 'a_pierce', name: 'Flecha Perfurante', description: 'Aumenta o dano do crítico.', icon: '🏹', tier: 3, col: 1, maxLevel: 5, requires: ['a_crit1'], statBonus: { stat: 'critDamage', valuePerLevel: 0.20, isPercent: true } },
      { id: 'a_evasion', name: 'Esquiva Ilusória', description: 'Aumenta a defesa e velocidade.', icon: '💨', tier: 3, col: 2, maxLevel: 5, requires: ['a_multishot'], statBonus: { stat: 'defense', valuePerLevel: 6 } },

      // Tier 4 (Ultimate)
      { id: 'a_ult', name: 'Tempestade de Flechas', description: 'Supremo: Aumenta o dano de todas as flechas em +40%.', icon: '🌩️', tier: 4, col: 1, maxLevel: 1, requires: ['a_pierce', 'a_evasion'], statBonus: { stat: 'attack', valuePerLevel: 45 } },
    ]
  },
  mage: {
    className: 'mage',
    title: 'Árvore do Mago',
    color: '#4080ff',
    icon: '🔮',
    nodes: [
      // Tier 1
      { id: 'm_pow1', name: 'Sabedoria Arcana', description: 'Aumenta o Poder Mágico total.', icon: '🔮', tier: 1, col: 1, maxLevel: 5, statBonus: { stat: 'magicPower', valuePerLevel: 8 } },
      { id: 'm_mana1', name: 'Reserva Mágica', description: 'Aumenta a mana máxima.', icon: '💧', tier: 1, col: 2, maxLevel: 5, statBonus: { stat: 'mp', valuePerLevel: 30 } },
      { id: 'm_cost1', name: 'Fluxo Eficiente', description: 'Aumenta a regeneração de mana por segundo.', icon: '✨', tier: 1, col: 3, maxLevel: 5, statBonus: { stat: 'mpRegen', valuePerLevel: 3 } },

      // Tier 2
      { id: 'm_fire', name: 'Especialização Elemental', description: 'Aumenta o dano de magias de Fogo e Gelo.', icon: '🔥', tier: 2, col: 1, maxLevel: 5, requires: ['m_pow1'], statBonus: { stat: 'magicPower', valuePerLevel: 12 } },
      { id: 'm_shield', name: 'Escudo Mágico', description: 'Converte poder mágico em Defesa física.', icon: '🛡️', tier: 2, col: 2, maxLevel: 5, requires: ['m_mana1'], statBonus: { stat: 'defense', valuePerLevel: 5 } },

      // Tier 3
      { id: 'm_crit', name: 'Maelstrom Crítico', description: 'Permite que magias causem dano crítico.', icon: '⚡', tier: 3, col: 1, maxLevel: 5, requires: ['m_fire'], statBonus: { stat: 'critChance', valuePerLevel: 0.025, isPercent: true } },
      { id: 'm_cd', name: 'Aceleração Mágica', description: 'Aumenta a velocidade de conjuração de habilidades.', icon: '⏳', tier: 3, col: 2, maxLevel: 5, requires: ['m_shield'], statBonus: { stat: 'magicPower', valuePerLevel: 15 } },

      // Tier 4 (Ultimate)
      { id: 'm_ult', name: 'Apocalipse Elemental', description: 'Supremo: Concede +60 de Poder Mágico e +100 Mana.', icon: '🌟', tier: 4, col: 1, maxLevel: 1, requires: ['m_crit', 'm_cd'], statBonus: { stat: 'magicPower', valuePerLevel: 60 } },
    ]
  },
  necromancer: {
    className: 'necromancer',
    title: 'Árvore do Necromante',
    color: '#c040ff',
    icon: '💀',
    nodes: [
      { id: 'n_souls', name: 'Colheita de Almas', description: 'Aumenta o Poder Mágico e Vida ao derrotar inimigos.', icon: '💀', tier: 1, col: 1, maxLevel: 5, statBonus: { stat: 'magicPower', valuePerLevel: 7 } },
      { id: 'n_minions', name: 'Exército das Sombras', description: 'Fortalece os minions invocados.', icon: '🧟', tier: 1, col: 2, maxLevel: 5, statBonus: { stat: 'hp', valuePerLevel: 20 } },
      { id: 'n_drain', name: 'Vampirismo Astral', description: 'Recupera vida ao causar dano mágico.', icon: '🩸', tier: 2, col: 1, maxLevel: 5, requires: ['n_souls'], statBonus: { stat: 'magicPower', valuePerLevel: 10 } },
      { id: 'n_ult', name: 'Lorde dos Mortos', description: 'Supremo: Aumenta enormemente a força dos exércitos das sombras.', icon: '☠️', tier: 3, col: 1, maxLevel: 1, requires: ['n_drain', 'n_minions'], statBonus: { stat: 'magicPower', valuePerLevel: 50 } },
    ]
  }
}

export function getSkillTreeForClass(cls: CharacterClass): ClassSkillTree {
  return CLASS_SKILL_TREES[cls] || CLASS_SKILL_TREES['knight']
}
