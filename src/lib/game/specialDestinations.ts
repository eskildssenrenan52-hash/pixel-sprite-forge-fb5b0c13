import type { GameMap, Tile, TileType, Monster, Vec2, NPC } from './types'
import { createMonster } from './monsterFactory'

function mkTile(type: TileType): Tile {
  const nonWalk: TileType[] = [
    'wall', 'dungeon_wall', 'house_wall', 'house_roof', 'fence', 'tree',
    'rock', 'deepwater', 'water', 'lava', 'obsidian', 'volcanic_rock', 'ruin_pillar'
  ]
  return {
    type,
    walkable: !nonWalk.includes(type),
    transparent: !['wall', 'dungeon_wall', 'house_wall', 'house_roof', 'tree', 'obsidian'].includes(type)
  }
}

// ─── 1. TEMPLO DAS BENÇÃOS ──────────────────────────────────────────────────
export function generateTempleBlessingsMap(): GameMap {
  const W = 48
  const H = 48
  const tiles: Tile[][] = []

  for (let y = 0; y < H; y++) {
    tiles[y] = []
    for (let x = 0; x < W; x++) {
      // Outer border walls
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) {
        tiles[y][x] = mkTile('wall')
      } else if (x === 1 || y === 1 || x === W - 2 || y === H - 2) {
        tiles[y][x] = mkTile('ruin_pillar')
      } else {
        // Grand Marble Temple Floor
        const distFromCenter = Math.hypot(x - 24, y - 24)
        if (distFromCenter <= 6) {
          tiles[y][x] = mkTile('crystal_floor')
        } else if (distFromCenter <= 18) {
          tiles[y][x] = mkTile('cobblestone')
        } else {
          tiles[y][x] = mkTile('ancient_tile')
        }
      }
    }
  }

  // Central Sacred Altar & Fountains
  tiles[24][24] = mkTile('fountain')

  // 4 Blessing Altars at Cardinal Positions
  tiles[16][24] = mkTile('rune_altar') // Sun Altar (+30% Damage)
  tiles[32][24] = mkTile('rune_altar') // Moon Altar (+40% XP)
  tiles[24][16] = mkTile('rune_altar') // Fortune Altar (+50% Gold)
  tiles[24][32] = mkTile('rune_altar') // Astral Altar (+25% Speed & Regen)

  // Decorative Pillars & Lamps
  const pillars: Vec2[] = [
    { x: 12, y: 12 }, { x: 36, y: 12 }, { x: 12, y: 36 }, { x: 36, y: 36 },
    { x: 18, y: 18 }, { x: 30, y: 18 }, { x: 18, y: 30 }, { x: 30, y: 30 },
  ]
  for (const p of pillars) {
    tiles[p.y][p.x] = mkTile('lamp_post')
  }

  // Exit Portal back to Capital Real
  tiles[42][24] = mkTile('sky_portal')

  return {
    id: 'temple_blessings',
    name: 'Templo Sagrado das Bençãos',
    width: W,
    height: H,
    tiles,
    monsters: [], // Peaceful holy zone
    spawnPoints: [{ x: 24 * 32, y: 40 * 32 }],
    ambience: 'sanctuary',
    musicTheme: 'sanctuary',
    minLevel: 1,
  }
}

// ─── 2. MASMORRA COM ANDARES INFINITOS ──────────────────────────────────────
export function generateInfiniteDungeonMap(floorNum: number): GameMap {
  const W = Math.min(80, 48 + Math.floor(floorNum * 0.5))
  const H = Math.min(80, 48 + Math.floor(floorNum * 0.5))
  const tiles: Tile[][] = []

  // Seeded style layout per floor
  for (let y = 0; y < H; y++) {
    tiles[y] = []
    for (let x = 0; x < W; x++) {
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) {
        tiles[y][x] = mkTile('dungeon_wall')
      } else {
        // Grid rooms & corridors
        const rx = Math.floor(x / 8)
        const ry = Math.floor(y / 8)
        const isWall = (x % 8 === 0 || y % 8 === 0) && (x % 24 !== 4 && y % 24 !== 4)
        if (isWall && x > 4 && y > 4 && x < W - 5 && y < H - 5) {
          tiles[y][x] = mkTile('dungeon_wall')
        } else {
          tiles[y][x] = mkTile((rx + ry) % 2 === 0 ? 'dungeon_brick' : 'cobblestone')
        }
      }
    }
  }

  // Spawn Point at Top Left Room
  const spawnX = 6
  const spawnY = 6
  tiles[spawnY][spawnX] = mkTile('cobblestone')
  tiles[spawnY][spawnX - 1] = mkTile('cobblestone')
  tiles[spawnY][spawnX + 1] = mkTile('cobblestone')

  // Exit portal back to Capital Real near spawn
  tiles[spawnY + 1][spawnX] = mkTile('crystal_portal')

  // Stairs/Portal DOWN to Next Infinite Floor at Bottom Right
  const exitX = W - 7
  const exitY = H - 7
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles[exitY + dy][exitX + dx] = mkTile('cobblestone')
    }
  }
  tiles[exitY][exitX] = mkTile('haunted_portal')

  // Spawn Monsters Scaling exponentially with Floor Level!
  const monsters: Monster[] = []
  const monsterTypes = ['skeleton', 'slime', 'goblin', 'orc', 'demon', 'void_fiend', 'dragon', 'vampire', 'ghost']
  const mobCount = Math.min(60, 15 + floorNum * 2)
  const monsterLvl = Math.max(1, Math.floor(floorNum * 6 + 10))

  for (let i = 0; i < mobCount; i++) {
    const mx = 10 + Math.floor(Math.random() * (W - 18))
    const my = 10 + Math.floor(Math.random() * (H - 18))
    if (!tiles[my] || !tiles[my][mx] || !tiles[my][mx].walkable) continue

    const type = monsterTypes[(i + floorNum) % monsterTypes.length] as any
    const isBoss = (i === 0 && floorNum % 5 === 0)
    const tier = isBoss ? 'boss' : (i % 4 === 0 ? 'elite' : 'normal')
    const finalLvl = isBoss ? monsterLvl + 20 : monsterLvl

    monsters.push(createMonster(type, finalLvl, mx * 32, my * 32, tier))
  }

  return {
    id: `infinite_dungeon_f${floorNum}`,
    name: `Masmorra Infinita — Andar ${floorNum}`,
    width: W,
    height: H,
    tiles,
    monsters,
    spawnPoints: [{ x: spawnX * 32, y: spawnY * 32 }],
    ambience: 'dungeon',
    musicTheme: 'dungeon',
    minLevel: Math.max(1, floorNum * 5),
  }
}

// ─── 3. MERCADO CELESTIAL ────────────────────────────────────────────────────
export function generateCelestialMarketMap(): GameMap {
  const W = 42
  const H = 42
  const tiles: Tile[][] = []

  for (let y = 0; y < H; y++) {
    tiles[y] = []
    for (let x = 0; x < W; x++) {
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) {
        tiles[y][x] = mkTile('wall')
      } else if (x === 1 || y === 1 || x === W - 2 || y === H - 2) {
        tiles[y][x] = mkTile('fence')
      } else {
        tiles[y][x] = mkTile('cobblestone')
      }
    }
  }

  // Market Stalls & Decorations
  const stalls: Vec2[] = [
    { x: 10, y: 10 }, { x: 18, y: 10 }, { x: 26, y: 10 }, { x: 34, y: 10 },
    { x: 10, y: 32 }, { x: 18, y: 32 }, { x: 26, y: 32 }, { x: 34, y: 32 },
  ]
  for (const s of stalls) {
    tiles[s.y][s.x] = mkTile('market_stall')
  }

  // Central Fountain
  tiles[21][21] = mkTile('fountain')

  // Portal Back to Town
  tiles[38][21] = mkTile('crystal_portal')

  return {
    id: 'celestial_market',
    name: 'Mercado Celestial Imperial',
    width: W,
    height: H,
    tiles,
    monsters: [],
    spawnPoints: [{ x: 21 * 32, y: 36 * 32 }],
    ambience: 'city',
    musicTheme: 'city',
    minLevel: 1,
  }
}

// ─── 4. SANTUÁRIO DOS DRAGÕES ────────────────────────────────────────────────
export function generateDragonSanctuaryMap(): GameMap {
  const W = 52
  const H = 52
  const tiles: Tile[][] = []

  for (let y = 0; y < H; y++) {
    tiles[y] = []
    for (let x = 0; x < W; x++) {
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) {
        tiles[y][x] = mkTile('obsidian')
      } else {
        const dist = Math.hypot(x - 26, y - 26)
        if (dist <= 8) {
          tiles[y][x] = mkTile('volcanic_rock')
        } else if (dist <= 18) {
          tiles[y][x] = (x + y) % 7 === 0 ? mkTile('lava') : mkTile('volcanic_rock')
        } else {
          tiles[y][x] = mkTile('obsidian')
        }
      }
    }
  }

  // Portal Back to Town
  tiles[46][26] = mkTile('volcano_portal')

  // Spawn Dragon Bosses and Dragon Mobs
  const monsters: Monster[] = [
    createMonster('dragon', 200, 26 * 32, 26 * 32, 'boss'),
    createMonster('dragon', 150, 18 * 32, 18 * 32, 'elite'),
    createMonster('dragon', 150, 34 * 32, 18 * 32, 'elite'),
    createMonster('dragon', 150, 18 * 32, 34 * 32, 'elite'),
    createMonster('dragon', 150, 34 * 32, 34 * 32, 'elite'),
  ]

  return {
    id: 'dragon_sanctuary',
    name: 'Santuário Sagrado dos Dragões',
    width: W,
    height: H,
    tiles,
    monsters,
    spawnPoints: [{ x: 26 * 32, y: 44 * 32 }],
    ambience: 'volcano',
    musicTheme: 'volcano',
    minLevel: 100,
  }
}
