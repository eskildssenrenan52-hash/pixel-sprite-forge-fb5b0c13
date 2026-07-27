import type { PhysicalObject, Vec2, GameMap, Particle, Monster, Player, DamageNumber } from './types'

export function createPhysicsObject(
  id: string,
  x: number,
  y: number,
  label: string = 'Objeto',
  shape: 'box' | 'circle' = 'box',
  color: string = '#78350f'
): PhysicalObject {
  return {
    id,
    x,
    y,
    vx: 0,
    vy: 0,
    mass: 1.5,
    friction: 0.88,
    bounce: 0.4,
    radius: 14,
    color,
    shape,
    destructible: true,
    hp: 30,
    label
  }
}

export function createExplosiveBarrel(id: string, x: number, y: number): PhysicalObject {
  return {
    id,
    x,
    y,
    vx: 0,
    vy: 0,
    mass: 2.0,
    friction: 0.85,
    bounce: 0.3,
    radius: 15,
    color: '#dc2626',
    shape: 'box',
    destructible: true,
    hp: 20,
    label: 'Barril Explosivo'
  }
}

export function createRollingBoulder(id: string, x: number, y: number): PhysicalObject {
  return {
    id,
    x,
    y,
    vx: 0,
    vy: 0,
    mass: 5.0,
    friction: 0.95,
    bounce: 0.6,
    radius: 18,
    color: '#64748b',
    shape: 'circle',
    destructible: false,
    hp: 999,
    label: 'Rocha Rolante'
  }
}

export function createWoodenCrate(id: string, x: number, y: number): PhysicalObject {
  return {
    id,
    x,
    y,
    vx: 0,
    vy: 0,
    mass: 1.2,
    friction: 0.82,
    bounce: 0.2,
    radius: 13,
    color: '#b45309',
    shape: 'box',
    destructible: true,
    hp: 15,
    label: 'Caixote de Madeira'
  }
}

export function applyImpulse(obj: PhysicalObject, impulseX: number, impulseY: number) {
  obj.vx += impulseX / obj.mass
  obj.vy += impulseY / obj.mass
}

export function updatePhysicsObjects(
  objects: PhysicalObject[],
  map: GameMap,
  particles: Particle[],
  player?: Player,
  monsters?: Monster[],
  damageNumbers?: DamageNumber[]
): PhysicalObject[] {
  const activeObjects: PhysicalObject[] = []

  for (const obj of objects) {
    if (obj.hp !== undefined && obj.hp <= 0) {
      // Object destroyed - create particle burst
      const isExplosive = obj.label?.includes('Explosivo')
      const particleCount = isExplosive ? 24 : 10
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          id: `p_phys_${Date.now()}_${i}`,
          x: obj.x,
          y: obj.y,
          vx: (Math.random() - 0.5) * (isExplosive ? 12 : 6),
          vy: (Math.random() - 0.5) * (isExplosive ? 12 : 6),
          life: 30 + Math.random() * 20,
          maxLife: 50,
          size: 3 + Math.random() * 4,
          color: isExplosive ? (i % 2 === 0 ? '#ef4444' : '#f59e0b') : obj.color,
          type: isExplosive ? 'fire' : 'spark'
        })
      }

      // Explosive barrel AoE damage to surrounding monsters
      if (isExplosive && monsters && damageNumbers) {
        for (const m of monsters) {
          if (m.isDead) continue
          const dx = m.position.x + 16 - obj.x
          const dy = m.position.y + 16 - obj.y
          const dist = Math.hypot(dx, dy)
          if (dist < 90) {
            const expDmg = Math.round(150 * (1 - dist / 90))
            m.hp = Math.max(0, m.hp - expDmg)
            damageNumbers.push({
              id: `dmg_exp_${Date.now()}_${Math.random()}`,
              value: expDmg,
              x: m.position.x + 16,
              y: m.position.y - 10,
              timer: 60,
              type: 'crit',
            })
          }
        }
      }
      continue
    }

    // Player pushing physics object
    if (player) {
      const px = player.position.x + 16
      const py = player.position.y + 16
      const dx = obj.x - px
      const dy = obj.y - py
      const dist = Math.hypot(dx, dy)
      if (dist < obj.radius + 16 && dist > 0) {
        const pushForce = player.isMoving ? 1.8 : 0.8
        obj.vx += (dx / dist) * pushForce
        obj.vy += (dy / dist) * pushForce
      }
    }

    // Heavy rolling objects crashing into monsters
    if (monsters && damageNumbers && (Math.abs(obj.vx) > 1.5 || Math.abs(obj.vy) > 1.5)) {
      const speed = Math.hypot(obj.vx, obj.vy)
      for (const m of monsters) {
        if (m.isDead) continue
        const dx = m.position.x + 16 - obj.x
        const dy = m.position.y + 16 - obj.y
        const dist = Math.hypot(dx, dy)
        if (dist < obj.radius + 14) {
          const crushDmg = Math.round(speed * obj.mass * 8)
          if (crushDmg > 5) {
            m.hp = Math.max(0, m.hp - crushDmg)
            damageNumbers.push({
              id: `dmg_crush_${Date.now()}_${Math.random()}`,
              value: crushDmg,
              x: m.position.x + 16,
              y: m.position.y - 12,
              timer: 60,
              type: 'physical',
            })
          }
        }
      }
    }

    // Apply friction
    obj.vx *= obj.friction
    obj.vy *= obj.friction

    if (Math.abs(obj.vx) < 0.05) obj.vx = 0
    if (Math.abs(obj.vy) < 0.05) obj.vy = 0

    // Proposed new position
    let nextX = obj.x + obj.vx
    let nextY = obj.y + obj.vy

    // Map collision check
    const tileX = Math.floor(nextX / 32)
    const tileY = Math.floor(nextY / 32)

    if (
      tileX < 0 || tileX >= map.width ||
      tileY < 0 || tileY >= map.height ||
      !map.tiles[tileY]?.[tileX]?.walkable
    ) {
      // Bounce off wall
      obj.vx = -obj.vx * obj.bounce
      obj.vy = -obj.vy * obj.bounce
      nextX = obj.x
      nextY = obj.y
    }

    obj.x = nextX
    obj.y = nextY

    activeObjects.push(obj)
  }

  // Inter-object physics collisions
  for (let i = 0; i < activeObjects.length; i++) {
    for (let j = i + 1; j < activeObjects.length; j++) {
      const a = activeObjects[i]
      const b = activeObjects[j]

      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy)
      const minDist = a.radius + b.radius

      if (dist < minDist && dist > 0) {
        const overlap = minDist - dist
        const nx = dx / dist
        const ny = dy / dist

        // Separate objects
        a.x -= nx * overlap * 0.5
        a.y -= ny * overlap * 0.5
        b.x += nx * overlap * 0.5
        b.y += ny * overlap * 0.5

        // Elastic momentum exchange
        const kx = a.vx - b.vx
        const ky = a.vy - b.vy
        const p = 2 * (nx * kx + ny * ky) / (a.mass + b.mass)

        a.vx -= p * b.mass * nx
        a.vy -= p * b.mass * ny
        b.vx += p * a.mass * nx
        b.vy += p * a.mass * ky
      }
    }
  }

  return activeObjects
}
