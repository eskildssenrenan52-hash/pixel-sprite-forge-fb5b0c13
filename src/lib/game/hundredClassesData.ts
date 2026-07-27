// @ts-nocheck
import type { CharacterClass, CharacterStats } from './types'

export interface SubskillDef {
  id: string
  name: string
  description: string
  icon: string
  color: string
  bonus: Partial<CharacterStats>
  effectType: 'lifesteal' | 'damage_boost' | 'cd_reduction' | 'crit_boost' | 'shield' | 'chain_lightning' | 'bleed' | 'freeze'
}

export const SUBSKILLS: Record<string, SubskillDef> = {
  vampiric_touch: {
    id: 'vampiric_touch',
    name: 'Toque Vampírico',
    description: 'Converte 20% do dano infligido em cura de HP instantânea.',
    icon: '🩸',
    color: '#ef4444',
    bonus: { attack: 5 },
    effectType: 'lifesteal',
  },
  overcharge: {
    id: 'overcharge',
    name: 'Sobrecarga Arcana',
    description: 'Aumenta o dano da habilidade em +40% ao custo de +15% de Mana.',
    icon: '⚡',
    color: '#eab308',
    bonus: { magicPower: 8 },
    effectType: 'damage_boost',
  },
  rapid_refresh: {
    id: 'rapid_refresh',
    name: 'Fluidez Tempo-Espacial',
    description: 'Reduz o tempo de recarga (cooldown) da habilidade em 30%.',
    icon: '⏳',
    color: '#3b82f6',
    bonus: { speed: 0.5 },
    effectType: 'cd_reduction',
  },
  critical_impact: {
    id: 'critical_impact',
    name: 'Impacto Devastador',
    description: 'Concede +25% de Chance Crítica e +50% Dano Crítico ao ativar.',
    icon: '💥',
    color: '#f97316',
    bonus: { critChance: 10, critDamage: 25 },
    effectType: 'crit_boost',
  },
  sanctuary_shield: {
    id: 'sanctuary_shield',
    name: 'Escudo Rúnico',
    description: 'Gera um escudo protetor equivalente a 25% do dano causado por 4s.',
    icon: '🛡️',
    color: '#10b981',
    bonus: { defense: 8 },
    effectType: 'shield',
  },
  thunder_chain: {
    id: 'thunder_chain',
    name: 'Descarga Elemental',
    description: 'Dispara faíscas que atingem até 3 alvos secundários próximos.',
    icon: '🌩️',
    color: '#a855f7',
    bonus: { magicPower: 6 },
    effectType: 'chain_lightning',
  },
  blood_rupture: {
    id: 'blood_rupture',
    name: 'Ruptura Sanguinária',
    description: 'Aplica sangramento nos inimigos causando 45% de dano extra em 3s.',
    icon: '🗡️',
    color: '#dc2626',
    bonus: { attack: 6 },
    effectType: 'bleed',
  },
  frost_shatter: {
    id: 'frost_shatter',
    name: 'Congelamento Profundo',
    description: 'Lentifica e congela alvos por 1.5s, causando +25% de dano bônus.',
    icon: '❄️',
    color: '#06b6d4',
    bonus: { magicPower: 5, defense: 4 },
    effectType: 'freeze',
  },
}

export interface ClassMeta {
  id: string
  name: string
  subclass: string
  description: string
  icon: string
  color: string
  primarySkillName: string
  primarySkillIcon: string
  startWeapon: string
  baseStats: CharacterStats
  skins: string[]
}

const DEFAULT_SKINS = (baseName: string) => [
  `${baseName} Aprendiz`,
  `${baseName} Nobre`,
  `${baseName} Mestre Rúnico`,
  `${baseName} Voraz`,
  `${baseName} Sombrio`,
  `${baseName} Celestial`,
  `${baseName} Infernal`,
  `${baseName} Guardião Dourado`,
  `${baseName} Caçador de Dragões`,
  `${baseName} Supremo Ancestral`,
]

export const ALL_100_CLASSES: ClassMeta[] = [
  {
    id: 'knight', name: 'Cavaleiro', subclass: 'Paladino Imperial',
    description: 'Guerreiro de infantaria pesada blindado com escudo e espada.',
    icon: '⚔️', color: '#f59e0b', primarySkillName: 'Combate Melee', primarySkillIcon: '⚔️', startWeapon: 'wooden_sword',
    baseStats: { maxHp: 140, maxMp: 50, attack: 14, defense: 12, speed: 4.6, critChance: 6, critDamage: 150, magicPower: 2, range: 48 },
    skins: DEFAULT_SKINS('Cavaleiro'),
  },
  {
    id: 'archer', name: 'Arqueiro', subclass: 'Mestre Atirador',
    description: 'Especialista em combate à distância com precisão e agilidade mortal.',
    icon: '🏹', color: '#10b981', primarySkillName: 'Tiro Rápido', primarySkillIcon: '🏹', startWeapon: 'wooden_bow',
    baseStats: { maxHp: 90, maxMp: 70, attack: 12, defense: 5, speed: 5.8, critChance: 16, critDamage: 175, magicPower: 4, range: 224 },
    skins: DEFAULT_SKINS('Arqueiro'),
  },
  {
    id: 'mage', name: 'Mago', subclass: 'Arquimago Elemental',
    description: 'Invocador de forças arcanas e devastação elemental massiva.',
    icon: '🪄', color: '#3b82f6', primarySkillName: 'Magia Arcana', primarySkillIcon: '✨', startWeapon: 'wooden_staff',
    baseStats: { maxHp: 70, maxMp: 140, attack: 6, defense: 3, speed: 4.8, critChance: 10, critDamage: 200, magicPower: 24, range: 256 },
    skins: DEFAULT_SKINS('Mago'),
  },
  {
    id: 'necromancer', name: 'Necromante', subclass: 'Senhor da Morte',
    description: 'Mestre da magia negra que comanda exércitos de mortos-vivos.',
    icon: '💀', color: '#a855f7', primarySkillName: 'Necromancia', primarySkillIcon: '☠️', startWeapon: 'bone_scythe',
    baseStats: { maxHp: 95, maxMp: 120, attack: 8, defense: 6, speed: 5.0, critChance: 8, critDamage: 180, magicPower: 20, range: 192 },
    skins: DEFAULT_SKINS('Necromante'),
  },
  {
    id: 'paladin', name: 'Paladino', subclass: 'Guardião Sagrado',
    description: 'Guerreiro da luz abençoado com auras de cura e defesa impenetrável.',
    icon: '🛡️', color: '#facc15', primarySkillName: 'Poder Sagrado', primarySkillIcon: '✝️', startWeapon: 'wooden_sword',
    baseStats: { maxHp: 160, maxMp: 85, attack: 12, defense: 15, speed: 4.4, critChance: 6, critDamage: 160, magicPower: 12, range: 48 },
    skins: DEFAULT_SKINS('Paladino'),
  },
  {
    id: 'berserker', name: 'Berserker', subclass: 'Fúria Sangrenta',
    description: 'Combatente feroz que converte dor em dano físico avassalador.',
    icon: '🪓', color: '#ef4444', primarySkillName: 'Fúria', primarySkillIcon: '🔥', startWeapon: 'wooden_sword',
    baseStats: { maxHp: 170, maxMp: 30, attack: 19, defense: 7, speed: 5.2, critChance: 14, critDamage: 195, magicPower: 0, range: 52 },
    skins: DEFAULT_SKINS('Berserker'),
  },
  {
    id: 'assassin', name: 'Assassino', subclass: 'Lâmina Oculta',
    description: 'Especialista em assassinatos rápidos, acertos críticos e esquivas.',
    icon: '🗡️', color: '#64748b', primarySkillName: 'Furtividade', primarySkillIcon: '👤', startWeapon: 'wooden_sword',
    baseStats: { maxHp: 75, maxMp: 60, attack: 15, defense: 4, speed: 6.6, critChance: 28, critDamage: 225, magicPower: 2, range: 44 },
    skins: DEFAULT_SKINS('Assassino'),
  },
  {
    id: 'druid', name: 'Druida', subclass: 'Ancestral da Floresta',
    description: 'Guardião da natureza capaz de curar aliados e mutar em feras.',
    icon: '🌿', color: '#22c55e', primarySkillName: 'Magia Natural', primarySkillIcon: '🍃', startWeapon: 'wooden_staff',
    baseStats: { maxHp: 100, maxMp: 125, attack: 8, defense: 8, speed: 5.0, critChance: 10, critDamage: 175, magicPower: 21, range: 200 },
    skins: DEFAULT_SKINS('Druida'),
  },
  {
    id: 'monk', name: 'Monge', subclass: 'Mestre do Ki',
    description: 'Lutador de artes marciais com punhos rápidos e equilíbrio espiritual.',
    icon: '👊', color: '#fb923c', primarySkillName: 'Artes Marciais', primarySkillIcon: '🥋', startWeapon: 'wooden_sword',
    baseStats: { maxHp: 110, maxMp: 85, attack: 13, defense: 9, speed: 6.2, critChance: 20, critDamage: 185, magicPower: 6, range: 46 },
    skins: DEFAULT_SKINS('Monge'),
  },
  {
    id: 'samurai', name: 'Samurai', subclass: 'Lâmina do Trovão',
    description: 'Guerreiro disciplinado mestre do corte da katana e contra-ataque.',
    icon: '⛩️', color: '#e11d48', primarySkillName: 'Bushido', primarySkillIcon: '⚔️', startWeapon: 'iron_sword',
    baseStats: { maxHp: 120, maxMp: 60, attack: 17, defense: 10, speed: 5.5, critChance: 22, critDamage: 215, magicPower: 3, range: 52 },
    skins: DEFAULT_SKINS('Samurai'),
  },
  {
    id: 'summoner', name: 'Invocador', subclass: 'Dominador de Espíritos',
    description: 'Comanda múltiplos golens e feras elementais no campo de batalha.',
    icon: '📜', color: '#8b5cf6', primarySkillName: 'Invocação', primarySkillIcon: '✨', startWeapon: 'wooden_staff',
    baseStats: { maxHp: 85, maxMp: 150, attack: 7, defense: 5, speed: 4.9, critChance: 8, critDamage: 170, magicPower: 19, range: 210 },
    skins: DEFAULT_SKINS('Invocador'),
  },
  {
    id: 'alchemist', name: 'Alquimista', subclass: 'Mestre das Poções',
    description: 'Especialista em elixires explosivos, venenos e transmutação.',
    icon: '🧪', color: '#84cc16', primarySkillName: 'Alquimia', primarySkillIcon: '⚗️', startWeapon: 'wooden_staff',
    baseStats: { maxHp: 95, maxMp: 110, attack: 10, defense: 7, speed: 5.1, critChance: 14, critDamage: 195, magicPower: 18, range: 180 },
    skins: DEFAULT_SKINS('Alquimista'),
  },
  {
    id: 'chronomancer', name: 'Cronomante', subclass: 'Senhor do Tempo',
    description: 'Manipula o fluxo do tempo acelerando aliados e paralisando inimigos.',
    icon: '⏳', color: '#0ea5e9', primarySkillName: 'Cronomancia', primarySkillIcon: '🕒', startWeapon: 'wooden_staff',
    baseStats: { maxHp: 80, maxMp: 160, attack: 8, defense: 5, speed: 5.3, critChance: 12, critDamage: 220, magicPower: 26, range: 240 },
    skins: DEFAULT_SKINS('Cronomante'),
  },
  {
    id: 'beastmaster', name: 'Domador de Feras', subclass: 'Rei Alfa',
    description: 'Caçador que se comunica com animais selvagens para atacar em matilha.',
    icon: '🐾', color: '#d97706', primarySkillName: 'Domínio Feral', primarySkillIcon: '🐺', startWeapon: 'wooden_bow',
    baseStats: { maxHp: 115, maxMp: 95, attack: 14, defense: 9, speed: 5.4, critChance: 15, critDamage: 185, magicPower: 8, range: 200 },
    skins: DEFAULT_SKINS('Domador de Feras'),
  },
  {
    id: 'ninja', name: 'Ninja', subclass: 'Sombra Silenciosa',
    description: 'Mestre das shurikens, clones de sombra e evasão absoluta.',
    icon: '🥷', color: '#334155', primarySkillName: 'Ninjutsu', primarySkillIcon: '🌀', startWeapon: 'wooden_sword',
    baseStats: { maxHp: 82, maxMp: 75, attack: 16, defense: 5, speed: 7.2, critChance: 30, critDamage: 235, magicPower: 4, range: 48 },
    skins: DEFAULT_SKINS('Ninja'),
  },
  {
    id: 'pyromancer', name: 'Piromante', subclass: 'Fênix Infernal',
    description: 'Mestre das chamas inextinguíveis e explosões de plasma.',
    icon: '🔥', color: '#f97316', primarySkillName: 'Pirokinese', primarySkillIcon: '💥', startWeapon: 'wooden_staff',
    baseStats: { maxHp: 78, maxMp: 150, attack: 7, defense: 4, speed: 4.8, critChance: 14, critDamage: 205, magicPower: 28, range: 260 },
    skins: DEFAULT_SKINS('Piromante'),
  },
  {
    id: 'cryomancer', name: 'Criomante', subclass: 'Imperador do Gelo',
    description: 'Congela campos inteiros de batalha criando estalactites e barreiras de gelo.',
    icon: '❄️', color: '#06b6d4', primarySkillName: 'Criomancia', primarySkillIcon: '🧊', startWeapon: 'wooden_staff',
    baseStats: { maxHp: 88, maxMp: 145, attack: 7, defense: 7, speed: 4.7, critChance: 12, critDamage: 195, magicPower: 26, range: 250 },
    skins: DEFAULT_SKINS('Criomante'),
  },
  {
    id: 'stormcaller', name: 'Invocador de Tempestades', subclass: 'Lorde do Trovão',
    description: 'Canaliza raios e tufões devastadores com alta velocidade.',
    icon: '⚡', color: '#6366f1', primarySkillName: 'Tempestade', primarySkillIcon: '🌩️', startWeapon: 'wooden_staff',
    baseStats: { maxHp: 80, maxMp: 155, attack: 7, defense: 4, speed: 5.3, critChance: 15, critDamage: 220, magicPower: 29, range: 280 },
    skins: DEFAULT_SKINS('Invocador de Tempestades'),
  },
  {
    id: 'geomancer', name: 'Geomante', subclass: 'Titã de Pedra',
    description: 'Controla terremotos, rochas pesadas e armaduras de minério puro.',
    icon: '⛰️', color: '#78350f', primarySkillName: 'Geomancia', primarySkillIcon: '🪨', startWeapon: 'wooden_staff',
    baseStats: { maxHp: 135, maxMp: 115, attack: 11, defense: 14, speed: 4.3, critChance: 8, critDamage: 175, magicPower: 23, range: 200 },
    skins: DEFAULT_SKINS('Geomante'),
  },
  {
    id: 'bard', name: 'Bardo', subclass: 'Virtuoso Celestial',
    description: 'Inspira aliados com hinos mágicos e perturba inimigos com notas sônicas.',
    icon: '🎵', color: '#ec4899', primarySkillName: 'Canção Harmônica', primarySkillIcon: '🎶', startWeapon: 'wooden_staff',
    baseStats: { maxHp: 95, maxMp: 135, attack: 8, defense: 6, speed: 5.5, critChance: 13, critDamage: 180, magicPower: 19, range: 220 },
    skins: DEFAULT_SKINS('Bardo'),
  },
  {
    id: 'gunner', name: 'Atirador de Elite', subclass: 'Pistoleiro Arcano',
    description: 'Usa munições reforçadas e tiros perfurantes de alto alcance.',
    icon: '🔫', color: '#475569', primarySkillName: 'Tiro de Precisão', primarySkillIcon: '🎯', startWeapon: 'wooden_bow',
    baseStats: { maxHp: 92, maxMp: 65, attack: 17, defense: 5, speed: 5.6, critChance: 24, critDamage: 215, magicPower: 2, range: 240 },
    skins: DEFAULT_SKINS('Atirador de Elite'),
  },
  {
    id: 'templar', name: 'Templário', subclass: 'Defensor da Fé',
    description: 'Inabalável em combate com marreta pesada e bênçãos defensivas.',
    icon: '✝️', color: '#fef08a', primarySkillName: 'Cruzada', primarySkillIcon: '🛡️', startWeapon: 'iron_sword',
    baseStats: { maxHp: 165, maxMp: 90, attack: 15, defense: 17, speed: 4.3, critChance: 7, critDamage: 170, magicPower: 12, range: 50 },
    skins: DEFAULT_SKINS('Templário'),
  },
  {
    id: 'warlock', name: 'Bruxo', subclass: 'Invocador do Abismo',
    description: 'Suga a energia vital dos inimigos através de maldições e pactos.',
    icon: '🔮', color: '#7e22ce', primarySkillName: 'Pacto Sombrio', primarySkillIcon: '👁️', startWeapon: 'wooden_staff',
    baseStats: { maxHp: 90, maxMp: 140, attack: 9, defense: 5, speed: 4.9, critChance: 13, critDamage: 210, magicPower: 25, range: 220 },
    skins: DEFAULT_SKINS('Bruxo'),
  },
  {
    id: 'valkyrie', name: 'Valquíria', subclass: 'Anjo da Guerra',
    description: 'Guerreira alada das alturas que se lança com lanças de luz divina.',
    icon: '🪽', color: '#facc15', primarySkillName: 'Asas Divinas', primarySkillIcon: '✨', startWeapon: 'iron_sword',
    baseStats: { maxHp: 145, maxMp: 85, attack: 17, defense: 13, speed: 5.7, critChance: 15, critDamage: 200, magicPower: 10, range: 80 },
    skins: DEFAULT_SKINS('Valquíria'),
  },
]

// 76 unique additional handcrafted classes (bringing the total to exactly 100)
const ADDITIONAL_CLASSES_DATA: Omit<ClassMeta, 'skins'>[] = [
  { id: 'dread_knight', name: 'Algoz das Sombras', subclass: 'Cavaleiro Abissal', description: 'Guerreiro da morte vestindo armadura negra com montante das sombras.', icon: '🗡️', color: '#334155', primarySkillName: 'Corte Abissal', primarySkillIcon: '🖤', startWeapon: 'iron_sword', baseStats: { maxHp: 160, maxMp: 60, attack: 18, defense: 14, speed: 4.5, critChance: 12, critDamage: 180, magicPower: 5, range: 50 } },
  { id: 'blood_mage', name: 'Mago Sanguíneo', subclass: 'Vampiro Arcano', description: 'Manipula o próprio sangue para canalizar explosões e roubo de vida massivo.', icon: '🩸', color: '#dc2626', primarySkillName: 'Esfera Carmim', primarySkillIcon: '💉', startWeapon: 'wooden_staff', baseStats: { maxHp: 110, maxMp: 130, attack: 8, defense: 6, speed: 5.0, critChance: 15, critDamage: 190, magicPower: 25, range: 210 } },
  { id: 'dragon_rider', name: 'Cavaleiro Dracônico', subclass: 'Lorde do Fogo', description: 'Guerreiro vestindo escamas de dragão armado com lança incandescente.', icon: '🐉', color: '#ea580c', primarySkillName: 'Chama Dracônica', primarySkillIcon: '🔥', startWeapon: 'iron_sword', baseStats: { maxHp: 150, maxMp: 80, attack: 17, defense: 12, speed: 5.2, critChance: 14, critDamage: 185, magicPower: 12, range: 60 } },
  { id: 'frost_warden', name: 'Monarca Glacial', subclass: 'Guardião do Inverno', description: 'Senhor da tundra que ergue barreiras de gelo e estalactites afiadas.', icon: '🧊', color: '#0284c7', primarySkillName: 'Lança Glacial', primarySkillIcon: '❄️', startWeapon: 'wooden_staff', baseStats: { maxHp: 120, maxMp: 140, attack: 9, defense: 11, speed: 4.8, critChance: 10, critDamage: 170, magicPower: 22, range: 230 } },
  { id: 'sun_archon', name: 'Arauto Solar', subclass: 'Luz Inviolável', description: 'Sacerdote guerreiro que canaliza o brilho do sol para cegar e purificar.', icon: '☀️', color: '#ca8a04', primarySkillName: 'Explosão Solar', primarySkillIcon: '✨', startWeapon: 'iron_sword', baseStats: { maxHp: 140, maxMp: 100, attack: 15, defense: 13, speed: 5.0, critChance: 12, critDamage: 175, magicPower: 18, range: 70 } },
  { id: 'void_slayer', name: 'Executor do Vazio', subclass: 'Lâmina Negativa', description: 'Usa a antimatéria para rasgar dimensões e exterminar alvos à distância.', icon: '🌌', color: '#9333ea', primarySkillName: 'Fenda do Vazio', primarySkillIcon: '🌀', startWeapon: 'iron_sword', baseStats: { maxHp: 90, maxMp: 150, attack: 16, defense: 5, speed: 6.0, critChance: 22, critDamage: 220, magicPower: 24, range: 180 } },
  { id: 'shadow_dancer', name: 'Dançarino das Sombras', subclass: 'Lâmina Espectral', description: 'Mestre da esquiva e assassinato gracioso com dardo e véu de névoa.', icon: '👤', color: '#475569', primarySkillName: 'Dança das Sombras', primarySkillIcon: '🗡️', startWeapon: 'wooden_sword', baseStats: { maxHp: 85, maxMp: 70, attack: 17, defense: 4, speed: 6.8, critChance: 26, critDamage: 230, magicPower: 3, range: 45 } },
  { id: 'light_paladin', name: 'Paladino do Alvorecer', subclass: 'Escudo Sagrado', description: 'Porta marreta abençoada e escudo dourado reluzente contra o mal.', icon: '✨', color: '#eab308', primarySkillName: 'Julgamento Divino', primarySkillIcon: '🛡️', startWeapon: 'iron_sword', baseStats: { maxHp: 165, maxMp: 90, attack: 14, defense: 16, speed: 4.3, critChance: 8, critDamage: 165, magicPower: 10, range: 48 } },
  { id: 'chrono_lord', name: 'Sábio do Tempo', subclass: 'Arquimago Temporal', description: 'Controla ampulhetas místicas para congelar ou acelerar a realidade.', icon: '⏱️', color: '#0284c7', primarySkillName: 'Dilação Temporal', primarySkillIcon: '⏳', startWeapon: 'wooden_staff', baseStats: { maxHp: 85, maxMp: 170, attack: 6, defense: 5, speed: 5.5, critChance: 14, critDamage: 210, magicPower: 27, range: 250 } },
  { id: 'soul_weaver', name: 'Tecelão de Almas', subclass: 'Invocador Espectral', description: 'Molda espíritos perdidos em escudos e rajadas de energia de almas.', icon: '👻', color: '#7c3aed', primarySkillName: 'Sinfonia das Almas', primarySkillIcon: '🔮', startWeapon: 'wooden_staff', baseStats: { maxHp: 95, maxMp: 145, attack: 7, defense: 7, speed: 5.1, critChance: 11, critDamage: 185, magicPower: 23, range: 220 } },
  { id: 'rune_master', name: 'Mestre Rúnico', subclass: 'Encantador Supremo', description: 'Inscreve runas antigas de poder cósmico no ar para destruir inimigos.', icon: '📜', color: '#d97706', primarySkillName: 'Runa Devastadora', primarySkillIcon: '✨', startWeapon: 'wooden_staff', baseStats: { maxHp: 100, maxMp: 135, attack: 10, defense: 9, speed: 4.9, critChance: 13, critDamage: 195, magicPower: 22, range: 200 } },
  { id: 'titan_guardian', name: 'Colosso de Granito', subclass: 'Titã Inabalável', description: 'Gigante de pedra impenetrável com defesa e HP fora do comum.', icon: '🗿', color: '#78350f', primarySkillName: 'Terremoto', primarySkillIcon: '🪨', startWeapon: 'iron_sword', baseStats: { maxHp: 210, maxMp: 40, attack: 12, defense: 20, speed: 3.8, critChance: 5, critDamage: 150, magicPower: 0, range: 40 } },
  { id: 'phoenix_sage', name: 'Sábio Fênix', subclass: 'Imortal das Chamas', description: 'Ressurge das cinzas em rajadas incandescentes e ilumina o campo.', icon: '🦅', color: '#f97316', primarySkillName: 'Renascer Solar', primarySkillIcon: '🔥', startWeapon: 'wooden_staff', baseStats: { maxHp: 115, maxMp: 130, attack: 9, defense: 8, speed: 5.2, critChance: 15, critDamage: 200, magicPower: 24, range: 210 } },
  { id: 'astral_walker', name: 'Viajante Estelar', subclass: 'Místico Celestial', description: 'Camina entre galáxias projetando meteoros e energia estelar.', icon: '⭐', color: '#3b82f6', primarySkillName: 'Chuva de Estrelas', primarySkillIcon: '🌟', startWeapon: 'wooden_staff', baseStats: { maxHp: 80, maxMp: 165, attack: 7, defense: 5, speed: 5.4, critChance: 16, critDamage: 225, magicPower: 28, range: 260 } },
  { id: 'storm_bringer', name: 'Lorde dos Raios', subclass: 'Fúria Elétrica', description: 'Canaliza coriscos gigantescos para eletrocutar hordas inteiras.', icon: '⚡', color: '#4f46e5', primarySkillName: 'Relâmpago Mestre', primarySkillIcon: '🌩️', startWeapon: 'wooden_staff', baseStats: { maxHp: 88, maxMp: 150, attack: 8, defense: 6, speed: 5.6, critChance: 18, critDamage: 215, magicPower: 26, range: 240 } },
  { id: 'glacier_lord', name: 'Imperador do Gelo', subclass: 'Soberano Absoluto', description: 'Guerreiro de neve armado com maça glacial congelando inimigos.', icon: '❄️', color: '#0891b2', primarySkillName: 'Zero Absoluto', primarySkillIcon: '🧊', startWeapon: 'iron_sword', baseStats: { maxHp: 150, maxMp: 90, attack: 15, defense: 14, speed: 4.4, critChance: 10, critDamage: 175, magicPower: 12, range: 55 } },
  { id: 'vampire_lord', name: 'Príncipe da Noite', subclass: 'Lorde Sanguinário', description: 'Nobre das trevas de asas de morcego armado com rapieira elegantemente fatal.', icon: '🦇', color: '#991b1b', primarySkillName: 'Banquete de Sangue', primarySkillIcon: '🩸', startWeapon: 'iron_sword', baseStats: { maxHp: 125, maxMp: 105, attack: 16, defense: 8, speed: 6.2, critChance: 20, critDamage: 205, magicPower: 14, range: 50 } },
  { id: 'mech_smith', name: 'Engenheiro de Vapor', subclass: 'Mestre Steampunk', description: 'Usa óculos bronzados e mochilas a vapor disparando tiros de trabuco.', icon: '⚙️', color: '#b45309', primarySkillName: 'Disparo de Vapor', primarySkillIcon: '💥', startWeapon: 'wooden_bow', baseStats: { maxHp: 120, maxMp: 80, attack: 15, defense: 10, speed: 5.2, critChance: 17, critDamage: 190, magicPower: 6, range: 220 } },
  { id: 'blade_dancer', name: 'Mestre das Katanas', subclass: 'Lâminas Gêmeas', description: 'Dansa com duas katanas afiadas retalhando múltiplos alvos por segundo.', icon: '⚔️', color: '#e11d48', primarySkillName: 'Corte Duplo', primarySkillIcon: '🗡️', startWeapon: 'iron_sword', baseStats: { maxHp: 105, maxMp: 70, attack: 18, defense: 6, speed: 6.4, critChance: 25, critDamage: 220, magicPower: 2, range: 48 } },
  { id: 'shadow_stalker', name: 'Caçador das Sombras', subclass: 'Atirador Oculto', description: 'Atira bestas mecânicas camuflado na escuridão das florestas.', icon: '🏹', color: '#1e293b', primarySkillName: 'Tiro Silencioso', primarySkillIcon: '🎯', startWeapon: 'wooden_bow', baseStats: { maxHp: 90, maxMp: 80, attack: 14, defense: 6, speed: 6.0, critChance: 22, critDamage: 210, magicPower: 4, range: 240 } },
  { id: 'celestial_oracle', name: 'Vidente das Estrelas', subclass: 'Oráculo Divino', description: 'Lê os astros para antever ataques e abençoar aliados com escudos.', icon: '🔮', color: '#a855f7', primarySkillName: 'Visão Celestial', primarySkillIcon: '⭐', startWeapon: 'wooden_staff', baseStats: { maxHp: 85, maxMp: 160, attack: 5, defense: 7, speed: 5.2, critChance: 12, critDamage: 180, magicPower: 25, range: 230 } },
  { id: 'blood_berserker', name: 'Berserker Voraz', subclass: 'Fúria Carmim', description: 'Guerreiro de machados duplos regado a sangue e fúria incontrolável.', icon: '🪓', color: '#b91c1c', primarySkillName: 'Lacerar Vital', primarySkillIcon: '💥', startWeapon: 'iron_sword', baseStats: { maxHp: 180, maxMp: 20, attack: 20, defense: 6, speed: 5.5, critChance: 18, critDamage: 210, magicPower: 0, range: 48 } },
  { id: 'abyssal_witch', name: 'Bruxa das Profundezas', subclass: 'Senhora dos Oceanos', description: 'Canaliza redemoinhos e criaturas marinhas das trevas oceânicas.', icon: '🌊', color: '#0284c7', primarySkillName: 'Maelstrom', primarySkillIcon: '🔱', startWeapon: 'wooden_staff', baseStats: { maxHp: 95, maxMp: 140, attack: 7, defense: 8, speed: 4.9, critChance: 13, critDamage: 185, magicPower: 23, range: 220 } },
  { id: 'spirit_shaman', name: 'Xamã dos Espíritos', subclass: 'Tote Ancestral', description: 'Ergue totens místicos e evoca espíritos dos animais guardiões.', icon: '🪵', color: '#15803d', primarySkillName: 'Totem Guardião', primarySkillIcon: '🐺', startWeapon: 'wooden_staff', baseStats: { maxHp: 110, maxMp: 120, attack: 11, defense: 9, speed: 5.0, critChance: 12, critDamage: 175, magicPower: 19, range: 200 } },
  { id: 'holy_cleric', name: 'Clérigo do Santuário', subclass: 'Curandeiro Sagrado', description: 'Porta cetro divino e cura instantaneamente ferimentos mortais.', icon: '✝️', color: '#facc15', primarySkillName: 'Bênção Suprema', primarySkillIcon: '✨', startWeapon: 'wooden_staff', baseStats: { maxHp: 130, maxMp: 130, attack: 8, defense: 12, speed: 4.6, critChance: 8, critDamage: 160, magicPower: 18, range: 190 } },
  { id: 'demon_hunter', name: 'Caçador de Demônios', subclass: 'Vingador de Prata', description: 'Empunha pistolas de prata e capas com estacas para banir o mal.', icon: '🔫', color: '#020617', primarySkillName: 'Disparo de Prata', primarySkillIcon: '🎯', startWeapon: 'wooden_bow', baseStats: { maxHp: 95, maxMp: 85, attack: 16, defense: 7, speed: 6.1, critChance: 23, critDamage: 215, magicPower: 5, range: 230 } },
  { id: 'pyro_mechanic', name: 'Artilheiro de Plasma', subclass: 'Mestre da Pólvora', description: 'Atira jorros de lança-chamas mecânico e granadas de napalm.', icon: '🔥', color: '#ea580c', primarySkillName: 'Jorro de Plasma', primarySkillIcon: '💣', startWeapon: 'wooden_bow', baseStats: { maxHp: 115, maxMp: 90, attack: 15, defense: 9, speed: 5.1, critChance: 16, critDamage: 195, magicPower: 14, range: 210 } },
  { id: 'poison_assassin', name: 'Mestre dos Venenos', subclass: 'Gota Mortal', description: 'Injeta neurotoxinas corrosivas que derretem barras de vida inimigas.', icon: '🧪', color: '#16a34a', primarySkillName: 'Dardo Peçonhento', primarySkillIcon: '☠️', startWeapon: 'wooden_sword', baseStats: { maxHp: 80, maxMp: 75, attack: 15, defense: 5, speed: 6.5, critChance: 24, critDamage: 220, magicPower: 8, range: 60 } },
  { id: 'ice_ranger', name: 'Arqueiro da Tundra', subclass: 'Atirador Congelante', description: 'Atira flechas de gelo puro que retardam e congelam alvos à distância.', icon: '🏹', color: '#38bdf8', primarySkillName: 'Flecha de Gelo', primarySkillIcon: '❄️', startWeapon: 'wooden_bow', baseStats: { maxHp: 88, maxMp: 90, attack: 13, defense: 6, speed: 5.9, critChance: 19, critDamage: 195, magicPower: 10, range: 250 } },
  { id: 'thunder_god', name: 'Deus do Trovão', subclass: 'Lorde Thor', description: 'Embala martelo divino Mjölnir invocando rajadas dos céus.', icon: '🔨', color: '#eab308', primarySkillName: 'Ira de Mjölnir', primarySkillIcon: '⚡', startWeapon: 'iron_sword', baseStats: { maxHp: 155, maxMp: 100, attack: 18, defense: 13, speed: 5.1, critChance: 16, critDamage: 200, magicPower: 16, range: 60 } },
  { id: 'sand_pharaoh', name: 'Faraó das Areias', subclass: 'Rei Múmia', description: 'Rei egípcio com Nemes dourado invocando tempestades de areia.', icon: '🛕', color: '#ca8a04', primarySkillName: 'Maldicão do Faraó', primarySkillIcon: '🏜️', startWeapon: 'wooden_staff', baseStats: { maxHp: 125, maxMp: 125, attack: 11, defense: 11, speed: 4.8, critChance: 11, critDamage: 180, magicPower: 21, range: 200 } },
  { id: 'gravity_bender', name: 'Manipulador da Gravidade', subclass: 'Distorção Espacial', description: 'Cria poços gravitacionais que atraem e esmagam todos ao redor.', icon: '🌌', color: '#7e22ce', primarySkillName: 'Singularidade', primarySkillIcon: '🌀', startWeapon: 'wooden_staff', baseStats: { maxHp: 85, maxMp: 160, attack: 6, defense: 6, speed: 5.3, critChance: 13, critDamage: 215, magicPower: 27, range: 240 } },
  { id: 'toxic_corruptor', name: 'Senhor da Peste', subclass: 'Névoa Tóxica', description: 'Espalha nuvens de esporos letais envenenando a terra inteira.', icon: '☣️', color: '#65a30d', primarySkillName: 'Esporo Pasmante', primarySkillIcon: '🟢', startWeapon: 'wooden_staff', baseStats: { maxHp: 100, maxMp: 130, attack: 8, defense: 8, speed: 4.9, critChance: 14, critDamage: 190, magicPower: 22, range: 210 } },
  { id: 'sound_weaver', name: 'Mestre da Ressonância', subclass: 'Sinfonia Sônica', description: 'Toca harpa de cristal projetando ondas de choque destruidoras.', icon: '🎼', color: '#f43f5e', primarySkillName: 'Onda Harmônica', primarySkillIcon: '🎶', startWeapon: 'wooden_staff', baseStats: { maxHp: 90, maxMp: 140, attack: 9, defense: 7, speed: 5.5, critChance: 15, critDamage: 185, magicPower: 20, range: 220 } },
  { id: 'star_knight', name: 'Cavaleiro das Estrelas', subclass: 'Astro Guerrero', description: 'Empunha lâmina de poeira estelar cintilante e capa de constelação.', icon: '⭐', color: '#2563eb', primarySkillName: 'Corte Cometário', primarySkillIcon: '🌠', startWeapon: 'iron_sword', baseStats: { maxHp: 135, maxMp: 95, attack: 16, defense: 12, speed: 5.3, critChance: 15, critDamage: 195, magicPower: 14, range: 55 } },
  { id: 'abyss_reaper', name: 'Ceifador do Vazio', subclass: 'Anjo da Morte', description: 'Empunha foice gigantesca ceifando almas em grande raio.', icon: '💀', color: '#1e1b4b', primarySkillName: 'Ceifa das Almas', primarySkillIcon: '☠️', startWeapon: 'bone_scythe', baseStats: { maxHp: 105, maxMp: 120, attack: 17, defense: 7, speed: 5.2, critChance: 22, critDamage: 225, magicPower: 18, range: 75 } },
  { id: 'forest_druid', name: 'Senhor das Enteídes', subclass: 'Espírito Feral', description: 'Evoca raízes gigantescas e golens de madeira viva.', icon: '🌳', color: '#16a34a', primarySkillName: 'Ira da Floresta', primarySkillIcon: '🍃', startWeapon: 'wooden_staff', baseStats: { maxHp: 130, maxMp: 120, attack: 10, defense: 11, speed: 4.7, critChance: 9, critDamage: 170, magicPower: 20, range: 200 } },
  { id: 'iron_colossus', name: 'Guardião do Aço', subclass: 'Titã Mecânico', description: 'Guerreiro de manoplas gigantes de titânio que esmagam o chão.', icon: '🦾', color: '#475569', primarySkillName: 'Impacto de Titânio', primarySkillIcon: '💥', startWeapon: 'iron_sword', baseStats: { maxHp: 190, maxMp: 50, attack: 16, defense: 18, speed: 4.0, critChance: 8, critDamage: 160, magicPower: 2, range: 45 } },
  { id: 'aether_weaver', name: 'Mestre do Éter', subclass: 'Arquimago Transcendente', description: 'Canaliza a essência cósmica primordial dissolvendo matéria.', icon: '✨', color: '#0284c7', primarySkillName: 'Rajada de Éter', primarySkillIcon: '🌌', startWeapon: 'wooden_staff', baseStats: { maxHp: 80, maxMp: 175, attack: 6, defense: 5, speed: 5.4, critChance: 15, critDamage: 230, magicPower: 29, range: 260 } },
  { id: 'dragon_slayer', name: 'Matador de Dragões', subclass: 'Algoz Scaled', description: 'Carrega espadão pesado capaz de partir couro de dragões míticos.', icon: '⚔️', color: '#991b1b', primarySkillName: 'Corte Dracônico', primarySkillIcon: '🐉', startWeapon: 'iron_sword', baseStats: { maxHp: 150, maxMp: 60, attack: 19, defense: 13, speed: 4.8, critChance: 17, critDamage: 205, magicPower: 2, range: 55 } },
  { id: 'blood_reaper', name: 'Colhedor de Sangue', subclass: 'Ceifador Carmim', description: 'Mestre da foice vampírica que converte abatimentos em poder berserk.', icon: '🩸', color: '#9f1239', primarySkillName: 'Goz Carmim', primarySkillIcon: '💉', startWeapon: 'bone_scythe', baseStats: { maxHp: 115, maxMp: 90, attack: 18, defense: 8, speed: 5.5, critChance: 21, critDamage: 215, magicPower: 12, range: 70 } },
  { id: 'mystic_swordsman', name: 'Espadachim Arcano', subclass: 'Lâmina Mística', description: 'Guerreiro mago que infunde feitiços diretamente em sua lâmina.', icon: '🗡️', color: '#2563eb', primarySkillName: 'Lâmina Arcana', primarySkillIcon: '✨', startWeapon: 'iron_sword', baseStats: { maxHp: 115, maxMp: 110, attack: 15, defense: 9, speed: 5.6, critChance: 18, critDamage: 200, magicPower: 16, range: 50 } },
  { id: 'magma_lord', name: 'Senhor do Magma', subclass: 'Titã Vulcânico', description: 'Bate com machado de rocha derretida deixando rastro de chamas.', icon: '🌋', color: '#c2410c', primarySkillName: 'Onda de Magma', primarySkillIcon: '🔥', startWeapon: 'iron_sword', baseStats: { maxHp: 160, maxMp: 70, attack: 18, defense: 12, speed: 4.6, critChance: 12, critDamage: 185, magicPower: 14, range: 55 } },
  { id: 'shadow_assassin', name: 'Fantasma do Anoitecer', subclass: 'Sombra Mortífera', description: 'Mestre da invisibilidade instantânea e golpe fatal pelas costas.', icon: '🥷', color: '#0f172a', primarySkillName: 'Ataque Fantasma', primarySkillIcon: '👤', startWeapon: 'wooden_sword', baseStats: { maxHp: 78, maxMp: 70, attack: 18, defense: 4, speed: 7.0, critChance: 32, critDamage: 240, magicPower: 2, range: 42 } },
  { id: 'frost_archmage', name: 'Arquimago da Geada', subclass: 'Soberano da Neve', description: 'Lança tempestades de neve e gelo perpétuo congelando o mapa.', icon: '❄️', color: '#0284c7', primarySkillName: 'Nevasca Suprema', primarySkillIcon: '🧊', startWeapon: 'wooden_staff', baseStats: { maxHp: 82, maxMp: 165, attack: 6, defense: 6, speed: 4.8, critChance: 14, critDamage: 210, magicPower: 28, range: 260 } },
  { id: 'storm_paladin', name: 'Paladino da Tempestade', subclass: 'Escudo do Trovão', description: 'Combina armadura sagrada com escudos eletrificados de defesa.', icon: '🛡️', color: '#4f46e5', primarySkillName: 'Baluarte elétrico', primarySkillIcon: '⚡', startWeapon: 'iron_sword', baseStats: { maxHp: 155, maxMp: 95, attack: 14, defense: 15, speed: 4.5, critChance: 10, critDamage: 170, magicPower: 14, range: 50 } },
  { id: 'nature_warden', name: 'Protetor da Faia', subclass: 'Arqueiro Feral', description: 'Dispara flechas guiadas por espíritos da floresta com precisão.', icon: '🍃', color: '#15803d', primarySkillName: 'Tiro Espiritual', primarySkillIcon: '🏹', startWeapon: 'wooden_bow', baseStats: { maxHp: 95, maxMp: 90, attack: 13, defense: 7, speed: 5.8, critChance: 18, critDamage: 190, magicPower: 11, range: 230 } },
  { id: 'void_summoner', name: 'Invocador das Sombras', subclass: 'Portal Abissal', description: 'Abre portais negros invocando demônios e parasitas do vazio.', icon: '🌀', color: '#6b21a8', primarySkillName: 'Invocação Obscura', primarySkillIcon: '👾', startWeapon: 'wooden_staff', baseStats: { maxHp: 85, maxMp: 155, attack: 7, defense: 6, speed: 5.0, critChance: 11, critDamage: 180, magicPower: 24, range: 220 } },
  { id: 'phoenix_knight', name: 'Cavaleiro Renascido', subclass: 'Lâmina de Fogo', description: 'Guerreiro de asas flamejantes que incinera alvos com golpes solares.', icon: '🦅', color: '#dc2626', primarySkillName: 'Corte Incandescente', primarySkillIcon: '🔥', startWeapon: 'iron_sword', baseStats: { maxHp: 140, maxMp: 85, attack: 17, defense: 11, speed: 5.4, critChance: 16, critDamage: 195, magicPower: 12, range: 55 } },
  { id: 'sun_blade', name: 'Lâmina do Sol Nascente', subclass: 'Samurai Solar', description: 'Mestre da katana radiante revestida com energia do astro rei.', icon: '🌅', color: '#ea580c', primarySkillName: 'Corte Solar', primarySkillIcon: '☀️', startWeapon: 'iron_sword', baseStats: { maxHp: 120, maxMp: 75, attack: 18, defense: 9, speed: 5.8, critChance: 23, critDamage: 220, magicPower: 8, range: 52 } },
  { id: 'ocean_king', name: 'Soberano dos Mares', subclass: 'Lorde Tritão', description: 'Empunha tridente de Poseidon invocando tsunamis e bolhas de água.', icon: '🔱', color: '#0284c7', primarySkillName: 'Tsunami Divino', primarySkillIcon: '🌊', startWeapon: 'iron_sword', baseStats: { maxHp: 145, maxMp: 110, attack: 15, defense: 12, speed: 5.1, critChance: 12, critDamage: 180, magicPower: 18, range: 70 } },
  { id: 'wind_runner', name: 'Corredor do Vento', subclass: 'Lâmina da Brisa', description: 'Guerreiro ultrarrápido que corta com tufões e rajadas de vento.', icon: '💨', color: '#10b981', primarySkillName: 'Corte Ciclone', primarySkillIcon: '🌀', startWeapon: 'wooden_sword', baseStats: { maxHp: 88, maxMp: 80, attack: 15, defense: 5, speed: 7.2, critChance: 22, critDamage: 205, magicPower: 6, range: 48 } },
  { id: 'earth_shaper', name: 'Moldador da Terra', subclass: 'Monolito Vivo', description: 'Guerreiro de clava de granito que molda trincheiras de rocha.', icon: '🪨', color: '#854d0e', primarySkillName: 'Muralha de Pedra', primarySkillIcon: '⛰️', startWeapon: 'iron_sword', baseStats: { maxHp: 170, maxMp: 60, attack: 14, defense: 17, speed: 4.1, critChance: 6, critDamage: 160, magicPower: 8, range: 45 } },
  { id: 'twilight_sage', name: 'Sábio do Crepúsculo', subclass: 'Equilíbrio Sombra/Luz', description: 'Combina feitiços de luz e escuridão em sinergia perfeita.', icon: '🌗', color: '#6b21a8', primarySkillName: 'Feixe Crepuscular', primarySkillIcon: '✨', startWeapon: 'wooden_staff', baseStats: { maxHp: 90, maxMp: 150, attack: 7, defense: 7, speed: 5.2, critChance: 14, critDamage: 200, magicPower: 25, range: 230 } },
  { id: 'spectral_archer', name: 'Arqueiro Espectral', subclass: 'Atirador de Almas', description: 'Dispara flechas intangíveis de almas que atravessam paredes.', icon: '👻', color: '#a855f7', primarySkillName: 'Flecha Fantasma', primarySkillIcon: '🏹', startWeapon: 'wooden_bow', baseStats: { maxHp: 82, maxMp: 100, attack: 14, defense: 5, speed: 6.0, critChance: 20, critDamage: 215, magicPower: 14, range: 260 } },
  { id: 'inferno_warlord', name: 'General do Inferno', subclass: 'Comandante de Magma', description: 'Carrega alabarda de fogo e comanda demônios em formação.', icon: '🔥', color: '#991b1b', primarySkillName: 'Formação Infernal', primarySkillIcon: '😈', startWeapon: 'iron_sword', baseStats: { maxHp: 160, maxMp: 70, attack: 17, defense: 13, speed: 4.7, critChance: 13, critDamage: 185, magicPower: 10, range: 65 } },
  { id: 'crystal_sorcerer', name: 'Feiticeiro dos Cristais', subclass: 'Mestre do Quartzo', description: 'Ergue prismas cristalinos que refletem raios laser destruidores.', icon: '💎', color: '#ec4899', primarySkillName: 'Prisma Prismático', primarySkillIcon: '✨', startWeapon: 'wooden_staff', baseStats: { maxHp: 85, maxMp: 155, attack: 8, defense: 8, speed: 5.0, critChance: 16, critDamage: 210, magicPower: 26, range: 240 } },
  { id: 'lunar_priestess', name: 'Sacerdotisa da Lua', subclass: 'Luz Prateada', description: 'Banhada pela luz prateada da lua, silencia e regenera mana.', icon: '🌙', color: '#a855f7', primarySkillName: 'Luz da Lua', primarySkillIcon: '✨', startWeapon: 'wooden_staff', baseStats: { maxHp: 95, maxMp: 145, attack: 6, defense: 8, speed: 5.3, critChance: 12, critDamage: 180, magicPower: 22, range: 220 } },
  { id: 'chaos_warrior', name: 'Guerreiro do Caos', subclass: 'Destruidor Aleatório', description: 'Espada serrilhada que causa efeitos e danos imprevisíveis.', icon: '🌀', color: '#d97706', primarySkillName: 'Golpe do Caos', primarySkillIcon: '💥', startWeapon: 'iron_sword', baseStats: { maxHp: 145, maxMp: 60, attack: 18, defense: 10, speed: 5.2, critChance: 25, critDamage: 230, magicPower: 6, range: 50 } },
  { id: 'death_knight', name: 'Cavaleiro da Morte', subclass: 'Runas Geladas', description: 'Guerreiro de gelo e peste empunhando espada rúnica profana.', icon: '☠️', color: '#0369a1', primarySkillName: 'Grip da Morte', primarySkillIcon: '🧊', startWeapon: 'iron_sword', baseStats: { maxHp: 165, maxMp: 70, attack: 17, defense: 14, speed: 4.4, critChance: 11, critDamage: 175, magicPower: 8, range: 55 } },
  { id: 'sky_captain', name: 'Capitão dos Céus', subclass: 'Corsário dos Ares', description: 'Lorde pirata voador com sabre de duelo e pistola de pederneira.', icon: '⚓', color: '#1e3a8a', primarySkillName: 'Disparo Aéreo', primarySkillIcon: '🗡️', startWeapon: 'iron_sword', baseStats: { maxHp: 110, maxMp: 75, attack: 16, defense: 8, speed: 6.0, critChance: 20, critDamage: 200, magicPower: 4, range: 55 } },
  { id: 'plague_doctor', name: 'Médico da Peste', subclass: 'Máscara de Bico', description: 'Usa máscara de corvo e seringas gigantes injetando viroses.', icon: '🎭', color: '#334155', primarySkillName: 'Injeção Letal', primarySkillIcon: '🧪', startWeapon: 'wooden_staff', baseStats: { maxHp: 100, maxMp: 120, attack: 10, defense: 9, speed: 5.2, critChance: 15, critDamage: 190, magicPower: 20, range: 180 } },
  { id: 'comet_caster', name: 'Invocador de Cometas', subclass: 'Cataclismo Estelar', description: 'Lança cometas flamejantes dos confins do espaço sideral.', icon: '☄️', color: '#f97316', primarySkillName: 'Impacto Cometário', primarySkillIcon: '🔥', startWeapon: 'wooden_staff', baseStats: { maxHp: 78, maxMp: 165, attack: 6, defense: 5, speed: 5.1, critChance: 17, critDamage: 235, magicPower: 29, range: 270 } },
  { id: 'volcanic_berserker', name: 'Berserker de Magma', subclass: 'Fúria Vulcânica', description: 'Luta com dois machados em brasa deixando poças de lava.', icon: '🌋', color: '#ea580c', primarySkillName: 'Machado Incandescente', primarySkillIcon: '🔥', startWeapon: 'iron_sword', baseStats: { maxHp: 175, maxMp: 25, attack: 19, defense: 7, speed: 5.4, critChance: 16, critDamage: 205, magicPower: 0, range: 50 } },
  { id: 'storm_ninja', name: 'Ninja dos Raios', subclass: 'Lâmina Elétrica', description: 'Arremessa shurikens eletrificadas e move-se na velocidade do som.', icon: '⚡', color: '#3b82f6', primarySkillName: 'Shuriken Elétrica', primarySkillIcon: '🌀', startWeapon: 'wooden_sword', baseStats: { maxHp: 82, maxMp: 80, attack: 16, defense: 5, speed: 7.4, critChance: 28, critDamage: 230, magicPower: 8, range: 50 } },
  { id: 'holy_champion', name: 'Campeão Divino', subclass: 'Cavaleiro da Luz', description: 'Guerreiro vestindo armadura reluzente com lança de raio solar.', icon: '✝️', color: '#fef08a', primarySkillName: 'Lança Luminosa', primarySkillIcon: '✨', startWeapon: 'iron_sword', baseStats: { maxHp: 150, maxMp: 90, attack: 16, defense: 14, speed: 4.8, critChance: 12, critDamage: 180, magicPower: 12, range: 65 } },
  { id: 'shadow_blade', name: 'Lâmina das Sombras', subclass: 'Assassino Noturno', description: 'Densa aura de sombra cobre suas duas katanas letais.', icon: '🗡️', color: '#020617', primarySkillName: 'Corte Obscuro', primarySkillIcon: '👤', startWeapon: 'iron_sword', baseStats: { maxHp: 82, maxMp: 65, attack: 18, defense: 5, speed: 6.7, critChance: 29, critDamage: 235, magicPower: 2, range: 46 } },
  { id: 'arcane_golem', name: 'Autômato Arcano', subclass: 'Golem de Mana', description: 'Constructo de pedra e cristais alimentado por núcleo de mana puro.', icon: '🤖', color: '#38bdf8', primarySkillName: 'Soco de Mana', primarySkillIcon: '💥', startWeapon: 'iron_sword', baseStats: { maxHp: 180, maxMp: 80, attack: 14, defense: 16, speed: 4.0, critChance: 8, critDamage: 165, magicPower: 15, range: 45 } },
  { id: 'sea_phantom', name: 'Pirata Fantasma', subclass: 'Ancoradouro Obscuro', description: 'Pirata amaldiçoado que atira ancras e pistolas fantasmagóricas.', icon: '🏴‍☠️', color: '#0f766e', primarySkillName: 'Ancora Maldita', primarySkillIcon: '⚓', startWeapon: 'iron_sword', baseStats: { maxHp: 125, maxMp: 70, attack: 15, defense: 9, speed: 5.5, critChance: 18, critDamage: 195, magicPower: 6, range: 60 } },
  { id: 'wild_shapeshifter', name: 'Metamorfo Feral', subclass: 'Garras Selvagens', description: 'Alterna instantaneamente entre forma humana, urso e pantera.', icon: '🐾', color: '#854d0e', primarySkillName: 'Garras Ferais', primarySkillIcon: '🐺', startWeapon: 'wooden_sword', baseStats: { maxHp: 135, maxMp: 85, attack: 16, defense: 10, speed: 6.0, critChance: 20, critDamage: 200, magicPower: 8, range: 48 } },
  { id: 'rune_knight', name: 'Cavaleiro Rúnico', subclass: 'Espada Gravada', description: 'Inscribe símbolos misticos na armadura e espada para aumentar atributos.', icon: '📜', color: '#d97706', primarySkillName: 'Escudo Rúnico', primarySkillIcon: '✨', startWeapon: 'iron_sword', baseStats: { maxHp: 145, maxMp: 95, attack: 15, defense: 13, speed: 4.7, critChance: 11, critDamage: 175, magicPower: 14, range: 50 } },
  { id: 'solar_priest', name: 'Sacerdote Solar', subclass: 'Celeste de Luz', description: 'Invoca pilares de fogo solar diretamente sobre os alvos.', icon: '☀️', color: '#f59e0b', primarySkillName: 'Pilar Solar', primarySkillIcon: '✨', startWeapon: 'wooden_staff', baseStats: { maxHp: 105, maxMp: 140, attack: 8, defense: 9, speed: 4.8, critChance: 10, critDamage: 175, magicPower: 22, range: 220 } },
  { id: 'abyssal_leviathan', name: 'Guardião do Abismo', subclass: 'Escalas Marinhas', description: 'Guerreiro coberto por escamas azuis impenetráveis.', icon: '🐉', color: '#0369a1', primarySkillName: 'Carapaça Abissal', primarySkillIcon: '🛡️', startWeapon: 'iron_sword', baseStats: { maxHp: 185, maxMp: 60, attack: 13, defense: 18, speed: 4.2, critChance: 6, critDamage: 155, magicPower: 8, range: 45 } },
  { id: 'chronos_guardian', name: 'Guardião Cronomântico', subclass: 'Escudo Relógio', description: 'Porta gigantesco relógio de bronze que retrocede o tempo ao receber dano.', icon: '⏱️', color: '#b45309', primarySkillName: 'Reversão Temporal', primarySkillIcon: '⏳', startWeapon: 'iron_sword', baseStats: { maxHp: 150, maxMp: 110, attack: 13, defense: 15, speed: 4.5, critChance: 9, critDamage: 165, magicPower: 16, range: 50 } },
  { id: 'galaxy_archmage', name: 'Arquimago da Galáxia', subclass: 'Cosmos Supremo', description: 'Cria galáxias espirais em miniatura que colidem destruindo tudo.', icon: '🌌', color: '#8b5cf6', primarySkillName: 'Colisão Galáctica', primarySkillIcon: '⭐', startWeapon: 'wooden_staff', baseStats: { maxHp: 80, maxMp: 180, attack: 5, defense: 5, speed: 5.3, critChance: 18, critDamage: 240, magicPower: 30, range: 280 } },
  { id: 'supreme_god', name: 'Deus Supremo Ancestral', subclass: 'Primeiro Escolhido', description: 'Encarnação divina primordial abençoada com atributos e aura dourada absoluta.', icon: '👑', color: '#fef08a', primarySkillName: 'Poder Primordial', primarySkillIcon: '⚡', startWeapon: 'iron_sword', baseStats: { maxHp: 200, maxMp: 200, attack: 22, defense: 18, speed: 6.5, critChance: 25, critDamage: 250, magicPower: 30, range: 100 } },
]

// Push all additional handcrafted unique classes
ADDITIONAL_CLASSES_DATA.forEach(cls => {
  ALL_100_CLASSES.push({
    ...cls,
    skins: DEFAULT_SKINS(cls.name),
  })
})

// Map of Class ID -> Meta
export const CLASS_META_MAP: Record<string, ClassMeta> = {}
ALL_100_CLASSES.forEach(c => {
  CLASS_META_MAP[c.id] = c
})

