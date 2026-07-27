import type { Mercenary, MercenaryType, Player, Monster, GameMap, Vec2, Direction, DamageNumber, Particle } from './types'

export interface MercenaryCatalogItem {
  type: MercenaryType
  name: string
  title: string
  description: string
  costGold: number
  baseHp: number
  baseAtk: number
  baseDef: number
  baseSpd: number
  color: string
  portrait: string
  skills: string[]
}

export const MERCENARY_CATALOG: Record<MercenaryType, MercenaryCatalogItem> = {
  warrior: {
    type: 'warrior',
    name: 'Guardião Escudeiro',
    title: 'Tanque de Linha de Frente',
    description: 'Robusto e implacável. Protege o jogador, provoca inimigos e possui alta armadura.',
    costGold: 500,
    baseHp: 350,
    baseAtk: 32,
    baseDef: 28,
    baseSpd: 2.8,
    color: '#38bdf8',
    portrait: '🛡️',
    skills: ['Golpe Provocador', 'Escudo Inquebrável', 'Investida Imperial'],
  },
  ranger: {
    type: 'ranger',
    name: 'Atirador de Elite',
    title: 'Especialista em Longo Alcance',
    description: 'Ataca inimigos à distância com velocidade e alta chance de acerto crítico.',
    costGold: 750,
    baseHp: 220,
    baseAtk: 48,
    baseDef: 14,
    baseSpd: 3.5,
    color: '#22c55e',
    portrait: '🏹',
    skills: ['Tiro Quádruplo', 'Chuva de Flechas', 'Marca do Caçador'],
  },
  mage: {
    type: 'mage',
    name: 'Mago das Chamas Arcanas',
    title: 'Destruidor Mágico AoE',
    description: 'Lança feitiços devastadores de fogo e gelo causando dano massivo em área.',
    costGold: 1000,
    baseHp: 190,
    baseAtk: 65,
    baseDef: 10,
    baseSpd: 3.0,
    color: '#a855f7',
    portrait: '🔮',
    skills: ['Explosão Arcana', 'Tempestade de Meteoros', 'Barreira de Mana'],
  },
  cleric: {
    type: 'cleric',
    name: 'Sacerdote Sagrado',
    title: 'Suporte & Cura Divina',
    description: 'Restaura a vida do jogador constantemente e concede bênçãos de proteção.',
    costGold: 1200,
    baseHp: 260,
    baseAtk: 24,
    baseDef: 18,
    baseSpd: 3.2,
    color: '#facc15',
    portrait: '✨',
    skills: ['Cura Divina', 'Aura de Luz', 'Purificação'],
  },
  assassin: {
    type: 'assassin',
    name: 'Assassino da Névoa',
    title: 'Mestre do Golpe Crítico',
    description: 'Movimenta-se rapidamente, golpeando pontos vitais com altíssimo dano crítico.',
    costGold: 1500,
    baseHp: 240,
    baseAtk: 72,
    baseDef: 12,
    baseSpd: 4.2,
    color: '#f43f5e',
    portrait: '🗡️',
    skills: ['Passo das Sombras', 'Ataque Furtivo', 'Lâminas Envenenadas'],
  },
}

export function hireMercenary(player: Player, type: MercenaryType): { success: boolean; player: Player; message: string } {
  const cat = MERCENARY_CATALOG[type]
  if (!cat) return { success: false, player, message: 'Mercenário não encontrado!' }

  if (player.gold < cat.costGold) {
    return { success: false, player, message: `Ouro insuficiente! Necessário ${cat.costGold} ouro.` }
  }

  const existingMercs = player.mercenaries ?? []
  if (existingMercs.some(m => m.type === type)) {
    return { success: false, player, message: 'Você já contratou este tipo de mercenário!' }
  }

  const newMerc: Mercenary = {
    id: `merc_${type}_${Date.now()}`,
    name: cat.name,
    type,
    level: Math.max(1, Math.floor(player.level * 0.9)),
    xp: 0,
    xpToNext: 200,
    hp: cat.baseHp + Math.floor(player.level * 25),
    maxHp: cat.baseHp + Math.floor(player.level * 25),
    attack: cat.baseAtk + Math.floor(player.level * 4),
    defense: cat.baseDef + Math.floor(player.level * 2),
    speed: cat.baseSpd,
    position: { x: player.position.x - 32, y: player.position.y },
    direction: 'down',
    isMoving: false,
    isAttacking: false,
    attackCooldown: 0,
    targetMonsterId: null,
    costGold: cat.costGold,
    color: cat.color,
    skills: cat.skills,
    isSummoned: true,
    portrait: cat.portrait,
  }

  const updatedMercs = [...existingMercs, newMerc]
  const updatedPlayer: Player = {
    ...player,
    gold: player.gold - cat.costGold,
    mercenaries: updatedMercs,
    activeMercenaryId: newMerc.id,
  }

  return {
    success: true,
    player: updatedPlayer,
    message: `Mercenário ${cat.name} contratado com sucesso por ${cat.costGold} ouro!`,
  }
}

export function toggleSummonMercenary(player: Player, mercId: string): Player {
  const mercs = player.mercenaries ?? []
  const updatedMercs = mercs.map(m => {
    if (m.id === mercId) {
      return { ...m, isSummoned: !m.isSummoned }
    }
    return m
  })
  return { ...player, mercenaries: updatedMercs }
}

export function updateMercenariesAI(
  mercenaries: Mercenary[],
  player: Player,
  monsters: Monster[],
  damageNumbers: DamageNumber[],
  particles: Particle[]
): { mercenaries: Mercenary[]; updatedPlayer: Player } {
  let playerHp = player.hp
  const updatedMercs: Mercenary[] = []

  for (const merc of mercenaries) {
    if (!merc.isSummoned) {
      updatedMercs.push(merc)
      continue
    }

    let mX = merc.position.x
    let mY = merc.position.y
    let dir = merc.direction
    let isMoving = false
    let isAttacking = false
    let atkCooldown = Math.max(0, merc.attackCooldown - 1)
    let hp = merc.hp
    let xp = merc.xp
    let level = merc.level
    let xpToNext = merc.xpToNext
    let maxHp = merc.maxHp
    let attack = merc.attack

    // Check distance to player
    const pX = player.position.x
    const pY = player.position.y
    const distToPlayer = Math.hypot(mX - pX, mY - pY)

    // Teleport if too far
    if (distToPlayer > 500) {
      mX = pX - 24
      mY = pY - 24
    }

    // Cleric healing ability trigger
    if (merc.type === 'cleric' && atkCooldown === 0 && distToPlayer < 200 && playerHp < player.stats.maxHp) {
      const healAmt = Math.round(merc.attack * 1.8)
      playerHp = Math.min(player.stats.maxHp, playerHp + healAmt)
      atkCooldown = 90 // 1.5s
      isAttacking = true

      damageNumbers.push({
        id: `heal_merc_${Date.now()}_${Math.random()}`,
        value: healAmt,
        x: pX + 16,
        y: pY - 10,
        timer: 60,
        type: 'heal',
      })

      particles.push({
        id: `p_heal_${Date.now()}`,
        x: pX + 16,
        y: pY + 16,
        vx: 0,
        vy: -1.5,
        life: 30,
        maxLife: 30,
        size: 5,
        color: '#facc15',
        type: 'heal',
      })
    }

    // Find nearest target monster
    let target: Monster | null = null
    let minDist = 220
    for (const mob of monsters) {
      if (mob.isDead) continue
      const d = Math.hypot(mX - mob.position.x, mY - mob.position.y)
      if (d < minDist) {
        minDist = d
        target = mob
      }
    }

    if (target) {
      const dx = target.position.x - mX
      const dy = target.position.y - mY
      const range = merc.type === 'ranger' || merc.type === 'mage' ? 140 : 36

      if (minDist <= range) {
        // Attack monster
        if (atkCooldown === 0) {
          atkCooldown = merc.type === 'assassin' ? 25 : 45
          isAttacking = true

          const isCrit = Math.random() < 0.25
          const dmg = Math.round(attack * (isCrit ? 1.8 : 1.0))
          target.hp = Math.max(0, target.hp - dmg)

          damageNumbers.push({
            id: `dmg_merc_${Date.now()}_${Math.random()}`,
            value: dmg,
            x: target.position.x + 16,
            y: target.position.y - 12,
            timer: 50,
            type: isCrit ? 'crit' : 'magic',
          })

          // Give XP to mercenary if target died
          if (target.hp <= 0) {
            xp += Math.round(target.xpReward * 0.4)
            if (xp >= xpToNext) {
              level++
              xp -= xpToNext
              xpToNext = Math.round(xpToNext * 1.3)
              maxHp += 30
              hp = maxHp
              attack += 5
            }
          }
        }
      } else {
        // Move towards monster
        const speed = merc.speed
        mX += (dx / minDist) * speed
        mY += (dy / minDist) * speed
        isMoving = true
        dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')
      }
    } else if (distToPlayer > 48) {
      // Follow player
      const dx = pX - mX
      const dy = pY - mY
      const speed = merc.speed
      mX += (dx / distToPlayer) * speed
      mY += (dy / distToPlayer) * speed
      isMoving = true
      dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')
    }

    updatedMercs.push({
      ...merc,
      position: { x: mX, y: mY },
      direction: dir,
      isMoving,
      isAttacking,
      attackCooldown: atkCooldown,
      hp,
      maxHp,
      level,
      xp,
      xpToNext,
      attack,
    })
  }

  return {
    mercenaries: updatedMercs,
    updatedPlayer: { ...player, hp: playerHp },
  }
}
