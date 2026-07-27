import type { GameMap, Tile, TileType, Monster, Vec2, ContinentDef, IslandDef, BiomeDef } from './types'
import { createMonster } from './monsterFactory'

// ─── REGISTRO COMPLETO DOS 30 CONTINENTES IMPERIAIS ─────────────────────────

const CONTINENT_SPECS = [
  { name: 'Continente I: Eldoria Imperial', title: 'Reino Central dos Reis', color: '#38bdf8', portal: '#0284c7', minLvl: 1, theme: 'green', style: 'concentric' as const },
  { name: 'Continente II: Solaria Desértica', title: 'Império das Areias Douradas', color: '#facc15', portal: '#ca8a04', minLvl: 20, theme: 'desert', style: 'spiral' as const },
  { name: 'Continente III: Glaciaria Permafrost', title: 'Terras do Gelo Eterno', color: '#67e8f9', portal: '#0891b2', minLvl: 40, theme: 'snow', style: 'checkerboard' as const },
  { name: 'Continente IV: Infernalia Vulcânica', title: 'Forjas do Abismo Magmático', color: '#f97316', portal: '#c2410c', minLvl: 60, theme: 'volcano', style: 'clustered' as const },
  { name: 'Continente V: Sombra de Umbral', title: 'Reino dos Mortos-Vivos', color: '#a855f7', portal: '#7e22ce', minLvl: 80, theme: 'abyss', style: 'labyrinth' as const },
  { name: 'Continente VI: Silva Primordial', title: 'Florestas de Druidas Anciões', color: '#22c55e', portal: '#15803d', minLvl: 100, theme: 'forest', style: 'linear_valley' as const },
  { name: 'Continente VII: Aethelgard dos Céus', title: 'Ilhas Flutuantes Celestiais', color: '#e0e7ff', portal: '#6366f1', minLvl: 120, theme: 'sky', style: 'scattered_archipelago' as const },
  { name: 'Continente VIII: Arquipélago Tenebroso', title: 'Ilhas dos Piratas Fantasma', color: '#64748b', portal: '#334155', minLvl: 140, theme: 'ocean', style: 'scattered_archipelago' as const },
  { name: 'Continente IX: Ruínas do Titã', title: 'Cidades Perdidas de Bronze', color: '#d97706', portal: '#92400e', minLvl: 160, theme: 'ruins', style: 'labyrinth' as const },
  { name: 'Continente X: Pântano de Miasma', title: 'Lagos Venenosos Assombrados', color: '#84cc16', portal: '#4d7c0f', minLvl: 180, theme: 'swamp', style: 'clustered' as const },
  { name: 'Continente XI: Cristalina Astral', title: 'Cavernas de Quartzo Cósmico', color: '#ec4899', portal: '#be185d', minLvl: 200, theme: 'crystal', style: 'spiral' as const },
  { name: 'Continente XII: Badlands do Caos', title: 'Cânions Desolados de Fogo', color: '#ef4444', portal: '#b91c1c', minLvl: 220, theme: 'badlands', style: 'checkerboard' as const },
  { name: 'Continente XIII: Terras de Obsidiana', title: 'Bastião do Dragão Negro', color: '#334155', portal: '#0f172a', minLvl: 240, theme: 'obsidian', style: 'concentric' as const },
  { name: 'Continente XIV: Vale da Lua Negra', title: 'Santuário dos Lobisomens', color: '#8b5cf6', portal: '#5b21b6', minLvl: 260, theme: 'shadow', style: 'linear_valley' as const },
  { name: 'Continente XV: Mar de Coral Místico', title: 'Atóis de Sereias e Leviatãs', color: '#06b6d4', portal: '#0e7490', minLvl: 280, theme: 'coral', style: 'scattered_archipelago' as const },
  { name: 'Continente XVI: Tundra dos Titãs', title: 'Montanhas de Golems de Pedra', color: '#94a3b8', portal: '#475569', minLvl: 300, theme: 'mountain', style: 'linear_valley' as const },
  { name: 'Continente XVII: Oásis Solar', title: 'Jardins Suspensos dos Faraós', color: '#eab308', portal: '#a16207', minLvl: 320, theme: 'oasis', style: 'concentric' as const },
  { name: 'Continente XVIII: Santuário do Fênix', title: 'Ninhos de Fogo Celeste', color: '#f97316', portal: '#ea580c', minLvl: 340, theme: 'phoenix', style: 'spiral' as const },
  { name: 'Continente XIX: Abismo Sem Fim', title: 'Fenda Gravitacional Sombria', color: '#4c1d95', portal: '#2e1065', minLvl: 360, theme: 'void', style: 'labyrinth' as const },
  { name: 'Continente XX: Vale dos Ancestrais', title: 'Túmulos dos Reis Imortais', color: '#d97706', portal: '#78350f', minLvl: 380, theme: 'ancient', style: 'checkerboard' as const },
  { name: 'Continente XXI: Floresta da Névoa', title: 'Bosques Fantasmagóricos', color: '#10b981', portal: '#047857', minLvl: 400, theme: 'mist', style: 'clustered' as const },
  { name: 'Continente XXII: Pico do Trovão', title: 'Cumes Eletrizados de Raios', color: '#3b82f6', portal: '#1d4ed8', minLvl: 420, theme: 'storm', style: 'spiral' as const },
  { name: 'Continente XXIII: Cavernas de Esmeralda', title: 'Minas Infinitas de Gemas', color: '#10b981', portal: '#065f46', minLvl: 440, theme: 'emerald', style: 'labyrinth' as const },
  { name: 'Continente XXIV: Platô Sangrento', title: 'Campos de Batalha de Vampiros', color: '#dc2626', portal: '#991b1b', minLvl: 460, theme: 'blood', style: 'checkerboard' as const },
  { name: 'Continente XXV: Selva Sombraverde', title: 'Banhado dos Seres Répteis', color: '#15803d', minLvl: 480, portal: '#166534', theme: 'jungle', style: 'linear_valley' as const },
  { name: 'Continente XXVI: Domínio Temporal', title: 'Torres do Cronomante Supremo', color: '#6366f1', portal: '#4338ca', minLvl: 500, theme: 'time', style: 'concentric' as const },
  { name: 'Continente XXVII: Mar Neon das Estrelas', title: 'Costas Iluminadas por Auroras', color: '#f43f5e', portal: '#be123c', minLvl: 520, theme: 'aurora', style: 'scattered_archipelago' as const },
  { name: 'Continente XXVIII: Vulcão de Diamantes', title: 'Cratera Prismática Cintilante', color: '#38bdf8', portal: '#0369a1', minLvl: 540, theme: 'diamond', style: 'spiral' as const },
  { name: 'Continente XXIX: Necrópole Obscura', title: 'Criptas dos Lichs Supremas', color: '#581c87', portal: '#3b0764', minLvl: 560, theme: 'necropolis', style: 'labyrinth' as const },
  { name: 'Continente XXX: Trono Divino dos Deuses', title: 'Cume Supremo da Criação', color: '#fbbf24', portal: '#b45309', minLvl: 600, theme: 'divine', style: 'concentric' as const },
]

// Biome naming catalog generators (52 distinct biomes per continent)
const BIOME_PREFIXES = [
  'Vale de', 'Bosque de', 'Platô de', 'Santuário de', 'Cânion de', 'Caverna de',
  'Pico de', 'Costa de', 'Deserto de', 'Garganta de', 'Abismo de', 'Planície de',
  'Floresta de', 'Jardim de', 'Cratera de', 'Templo de', 'Oásis de', 'Mina de'
]

const BIOME_MODIFIERS = [
  'Esmeralda', 'Obsidiana', 'Fogo Sagrado', 'Gelo Eterno', 'Luz Cósmica', 'Sombras Ancestrais',
  'Cristais Prismáticos', 'Névoa Espessa', 'Trovão Divino', 'Sangue Imperial', 'Ventos Uivantes', 'Areia Dourada',
  'Coral Luminoso', 'Rios de Mana', 'Lava Ardente', 'Espinhos Negros', 'Estrelas Caídas', 'Titãs Imortais'
]

function generate52BiomesForContinent(continentNum: number, theme: string, minLvl: number): BiomeDef[] {
  const biomes: BiomeDef[] = []

  // Create an 8x7 matrix grid of 52 biomes (8 * 7 = 56 slots -> 52 biomes)
  let count = 0
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 8; col++) {
      if (count >= 52) break
      count++

      const pref = BIOME_PREFIXES[(count + continentNum * 3) % BIOME_PREFIXES.length]
      const mod = BIOME_MODIFIERS[(count * 2 + continentNum) % BIOME_MODIFIERS.length]
      const name = `${pref} ${mod} #${count}`

      const tilePair = getTilesByBiomeIdx(theme, count)
      const recLvl = minLvl + count * 2

      biomes.push({
        id: `c${continentNum}_b${count}`,
        name,
        type: `${theme}_zone_${count}`,
        primaryTile: tilePair.primary,
        accentTile: tilePair.accent,
        recommendedLevel: recLvl,
        description: `Região ${count} do Continente ${continentNum}. Lar de monstros do nível ${recLvl}+ com minérios raras e segredos.`,
        gridCoord: { x: col, y: row },
        layoutPattern: `Setor (${col + 1}, ${row + 1})`,
      })
    }
  }

  return biomes
}

function getTilesByBiomeIdx(theme: string, idx: number): { primary: TileType; accent: TileType } {
  const mod = idx % 6
  switch (theme) {
    case 'desert':
      return mod === 0 ? { primary: 'sand', accent: 'cobblestone' } : { primary: 'sand', accent: 'dirt' }
    case 'snow':
      return mod === 0 ? { primary: 'snow', accent: 'ice' } : { primary: 'snow', accent: 'cobblestone' }
    case 'volcano':
      return mod === 0 ? { primary: 'volcanic_rock', accent: 'obsidian' } : { primary: 'volcanic_rock', accent: 'lava' }
    case 'abyss':
      return mod === 0 ? { primary: 'abyss_floor', accent: 'dark_crystal' } : { primary: 'abyss_floor', accent: 'abyss_wall' }
    case 'sky':
      return mod === 0 ? { primary: 'sky_platform', accent: 'cloud_floor' } : { primary: 'cloud_floor', accent: 'sky_platform' }
    case 'crystal':
      return mod === 0 ? { primary: 'crystal_floor', accent: 'gem_node' } : { primary: 'crystal_floor', accent: 'cobblestone' }
    case 'ruins':
      return mod === 0 ? { primary: 'ruin_floor', accent: 'ancient_tile' } : { primary: 'ruin_floor', accent: 'ruin_wall' }
    case 'swamp':
      return mod === 0 ? { primary: 'dirt', accent: 'mushroom' } : { primary: 'dirt', accent: 'water' }
    default:
      return mod === 0 ? { primary: 'grass', accent: 'flower' } : { primary: 'grass', accent: 'cobblestone' }
  }
}

export const CONTINENTS_30: ContinentDef[] = CONTINENT_SPECS.map((c, idx) => {
  const continentNum = idx + 1
  const islands: IslandDef[] = []

  // Generate 20 distinct offshore islands per continent
  for (let i = 1; i <= 20; i++) {
    const angle = (i / 20) * Math.PI * 2
    const dist = 210 + (i % 3) * 35
    const islandX = Math.round(250 + Math.cos(angle) * dist)
    const islandY = Math.round(250 + Math.sin(angle) * dist)

    islands.push({
      id: `cont${continentNum}_isl${i}`,
      name: `Ilha ${i}: ${getIslandName(c.theme, i)}`,
      biomeName: getIslandBiome(c.theme, i),
      primaryTile: getTilesByBiomeIdx(c.theme, i).primary,
      accentTile: getTilesByBiomeIdx(c.theme, i).accent,
      floorsCount: 8 + (i % 5), // 8 to 12 floor deep dungeons
      secretDungeon: i % 2 === 0,
      coord: { x: islandX, y: islandY },
      hasRuins: i % 3 === 0,
      hasVolcano: c.theme === 'volcano' || i === 7,
      hasTemple: i % 4 === 0,
    })
  }

  const biomes = generate52BiomesForContinent(continentNum, c.theme, c.minLvl)

  return {
    id: `continent${continentNum}`,
    number: continentNum,
    name: c.name,
    title: c.title,
    description: `Vasto ${c.name} organizado no estilo ${c.style.toUpperCase()}. Possui 52 biomas únicos divididos por setores e 20 ilhas marítimas com dungeons ilimitadas.`,
    color: c.color,
    minLevel: c.minLvl,
    portalColor: c.portal,
    organizationStyle: c.style,
    biomes,
    islands,
    bgTheme: c.theme,
    primaryBiomes: [c.theme, 'ocean', 'dungeon', 'ruins'],
  }
})

function getIslandName(theme: string, idx: number): string {
  const suffixes = ['dos Ventos', 'do Sol', 'das Sombras', 'de Cristal', 'dos Titãs', 'da Névoa', 'do Dragão', 'do Caos', 'Perdida', 'Escondida']
  return `${theme.toUpperCase()} ${suffixes[idx % suffixes.length]}`
}

function getIslandBiome(theme: string, idx: number): string {
  const biomes = ['Costas Rochosas', 'Bosque Místico', 'Vale Encantado', 'Ruínas Antigas', 'Pico Gelado', 'Vulcão Ativo', 'Pântano Profundo', 'Templo Perdido']
  return biomes[idx % biomes.length]
}

// ─── GENERATOR PARA O MAPA DO SALÃO DOS 30 PORTAIS ───────────────────────────
export function generatePortalHallMap(): GameMap {
  const W = 45
  const H = 45
  const tiles: Tile[][] = []

  const NON_WALKABLE: TileType[] = ['house_wall', 'water', 'deepwater', 'lava']
  const makeTile = (type: TileType): Tile => ({ type, walkable: !NON_WALKABLE.includes(type), transparent: true })

  for (let y = 0; y < H; y++) {
    tiles[y] = []
    for (let x = 0; x < W; x++) {
      if (x === 0 || x === W - 1 || y === 0 || y === H - 1) {
        tiles[y][x] = makeTile('house_wall')
      } else if (Math.hypot(x - 22, y - 22) < 18) {
        tiles[y][x] = makeTile('cobblestone')
      } else {
        tiles[y][x] = makeTile('house_wall')
      }
    }
  }

  // Place 30 Continent Portals in an epic double circle in the hall
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2
    const radius = i < 15 ? 8 : 14
    const px = Math.round(22 + Math.cos(angle) * radius)
    const py = Math.round(22 + Math.sin(angle) * radius)

    if (tiles[py] && tiles[py][px]) {
      tiles[py][px] = makeTile('portal')
    }
  }

  // Exit portal back to Capital Real
  tiles[22][22] = makeTile('stairs_up')

  return {
    id: 'portal_hall',
    name: 'Salão Imperial dos 30 Continentes',
    width: W,
    height: H,
    tiles,
    monsters: [],
    spawnPoints: [{ x: 22 * 32, y: 22 * 32 }],
    ambience: 'city',
    musicTheme: 'city',
  }
}

// ─── GENERATOR ENORME DE CONTINENTES COM 52 BIOMAS ORGANIZADOS (500x500 TILES) ─
export function generateContinentMap(continentId: string): GameMap {
  const contDef = CONTINENTS_30.find(c => c.id === continentId) || CONTINENTS_30[0]
  const W = 500
  const H = 500
  const tiles: Tile[][] = []

  const NON_WALKABLE: TileType[] = ['deepwater', 'wall', 'house_wall', 'volcanic_rock', 'abyss_wall']
  const makeTile = (type: TileType): Tile => ({ type, walkable: !NON_WALKABLE.includes(type), transparent: true })

  // Fill outer ocean background
  for (let y = 0; y < H; y++) {
    tiles[y] = []
    for (let x = 0; x < W; x++) {
      tiles[y][x] = makeTile('deepwater')
    }
  }

  const cx = 250
  const cy = 250

  // Paint 52 Biomes according to continent's Organization Style
  for (let i = 0; i < contDef.biomes.length; i++) {
    const biome = contDef.biomes[i]
    let bx = cx
    let by = cy

    switch (contDef.organizationStyle) {
      case 'spiral': {
        const angle = i * 0.45
        const r = 20 + i * 3.5
        bx = Math.round(cx + Math.cos(angle) * r)
        by = Math.round(cy + Math.sin(angle) * r)
        break
      }
      case 'concentric': {
        const ring = Math.floor(i / 8) + 1
        const posInRing = i % 8
        const angle = (posInRing / 8) * Math.PI * 2
        const r = ring * 28
        bx = Math.round(cx + Math.cos(angle) * r)
        by = Math.round(cy + Math.sin(angle) * r)
        break
      }
      case 'checkerboard': {
        const gridX = i % 8
        const gridY = Math.floor(i / 8)
        bx = 80 + gridX * 42
        by = 80 + gridY * 42
        break
      }
      case 'clustered': {
        const cluster = Math.floor(i / 13)
        const angle = (cluster / 4) * Math.PI * 2
        const cRadius = 110
        const clusterCenterX = cx + Math.cos(angle) * cRadius
        const clusterCenterY = cy + Math.sin(angle) * cRadius
        const subAngle = ((i % 13) / 13) * Math.PI * 2
        bx = Math.round(clusterCenterX + Math.cos(subAngle) * 35)
        by = Math.round(clusterCenterY + Math.sin(subAngle) * 35)
        break
      }
      case 'linear_valley': {
        const step = (i - 26) * 7
        bx = Math.round(cx + step)
        by = Math.round(cy + Math.sin(i * 0.3) * 80)
        break
      }
      case 'scattered_archipelago': {
        const angle = (i / 52) * Math.PI * 2
        const r = 80 + (i % 4) * 32
        bx = Math.round(cx + Math.cos(angle) * r)
        by = Math.round(cy + Math.sin(angle) * r)
        break
      }
      case 'labyrinth': {
        const gridX = i % 8
        const gridY = Math.floor(i / 8)
        bx = 90 + gridX * 40 + (gridY % 2 === 0 ? 15 : 0)
        by = 90 + gridY * 40
        break
      }
    }

    bx = Math.max(30, Math.min(W - 30, bx))
    by = Math.max(30, Math.min(H - 30, by))

    // Paint Biome Zone (20x20 tile circular radius)
    const bRadius = 14
    for (let dy = -bRadius; dy <= bRadius; dy++) {
      for (let dx = -bRadius; dx <= bRadius; dx++) {
        if (dx * dx + dy * dy <= bRadius * bRadius) {
          const px = bx + dx
          const py = by + dy
          if (tiles[py] && tiles[py][px]) {
            const isAccent = (dx + dy) % 5 === 0
            tiles[py][px] = makeTile(isAccent ? biome.accentTile : biome.primaryTile)
          }
        }
      }
    }
  }

  // Place 20 Offshore Islands
  const monsters: Monster[] = []
  for (const isl of contDef.islands) {
    const ix = Math.max(20, Math.min(W - 20, isl.coord.x))
    const iy = Math.max(20, Math.min(H - 20, isl.coord.y))

    for (let dy = -8; dy <= 8; dy++) {
      for (let dx = -8; dx <= 8; dx++) {
        if (dx * dx + dy * dy <= 50 && tiles[iy + dy] && tiles[iy + dy][ix + dx]) {
          tiles[iy + dy][ix + dx] = makeTile(isl.primaryTile)
        }
      }
    }

    if (tiles[iy] && tiles[iy][ix]) {
      tiles[iy][ix] = makeTile(isl.secretDungeon ? 'haunted_portal' : 'dungeon_portal')
    }

    monsters.push(createMonster('demon', contDef.minLevel + 15, ix * 32, (iy + 2) * 32, 'champion'))
  }

  // Continental Central Exit Portal
  tiles[cy][cx] = makeTile('sky_portal')

  return {
    id: contDef.id,
    name: contDef.name,
    width: W,
    height: H,
    tiles,
    monsters,
    spawnPoints: [{ x: cx * 32, y: (cy + 2) * 32 }],
    ambience: contDef.bgTheme,
    musicTheme: contDef.bgTheme,
    minLevel: contDef.minLevel,
  }
}

// ─── GENERATOR DE ANDARES PROFUNDOS DAS ILHAS (8+ FLOORS) ───────────────────
export function generateIslandFloorMap(continentId: string, islandIdx: number, floorNum: number): GameMap {
  const W = 100 + floorNum * 5
  const H = 100 + floorNum * 5
  const tiles: Tile[][] = []

  const makeTile = (type: TileType): Tile => ({
    type,
    walkable: !['dungeon_wall', 'abyss_wall', 'ruin_wall', 'volcanic_rock'].includes(type),
    transparent: true,
  })

  const wallTile: TileType = floorNum > 6 ? 'abyss_wall' : floorNum > 3 ? 'ruin_wall' : 'dungeon_wall'
  const floorTile: TileType = floorNum > 6 ? 'abyss_floor' : floorNum > 3 ? 'ruin_floor' : 'dungeon_floor'

  for (let y = 0; y < H; y++) {
    tiles[y] = []
    for (let x = 0; x < W; x++) {
      if (x === 0 || x === W - 1 || y === 0 || y === H - 1) {
        tiles[y][x] = makeTile(wallTile)
      } else {
        tiles[y][x] = makeTile(floorTile)
      }
    }
  }

  // Stairs Up / Down
  tiles[10][10] = makeTile('stairs_up')
  if (floorNum < 12) {
    tiles[H - 10][W - 10] = makeTile('stairs_down')
  }

  const monsters: Monster[] = []
  const baseLvl = 20 + floorNum * 15
  monsters.push(createMonster('dragon', baseLvl, (W / 2) * 32, (H / 2) * 32, floorNum === 8 ? 'boss' : 'champion'))

  return {
    id: `${continentId}_isl${islandIdx}_f${floorNum}`,
    name: `Masmorra da Ilha ${islandIdx} — Profundeza ${floorNum}/8+`,
    width: W,
    height: H,
    tiles,
    monsters,
    spawnPoints: [{ x: 10 * 32, y: 12 * 32 }],
    ambience: 'dungeon',
    musicTheme: 'dungeon',
    minLevel: baseLvl,
  }
}
