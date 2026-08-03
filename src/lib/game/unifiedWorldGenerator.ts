import type { GameMap, Tile, TileType, Monster, MonsterType, EliteTier } from './types'
import { createMonster } from './monsterFactory'
import { ALL_100_BIOMES } from './new100Biomes'
import { getAllMegaBiomeSpecs } from './megaBiomes'

const NON_WALKABLE: TileType[] = [
  'water', 'deepwater', 'wall', 'dungeon_wall', 'dungeon_brick', 'lava', 'tree', 'rock',
  'house_wall', 'house_roof', 'fountain', 'lamp_post', 'market_stall', 'fence',
  'ice', 'frozen_tree', 'ice_rock', 'volcanic_rock', 'obsidian', 'volcanic_vent',
  'crystal_wall', 'ruin_wall', 'sky_void', 'cobweb', 'abyss_wall', 'void',
  'pine_tree', 'snowy_peak', 'mountain_rock', 'ice_crystal_node',
  'ruin_pillar', 'vine_wall', 'sarcophagus', 'rune_stone', 'ancient_brazier', 'tower_wall',
]

const TILE_CACHE: Partial<Record<TileType, Tile>> = {}

function makeTile(type: TileType): Tile {
  let cached = TILE_CACHE[type]
  if (!cached) {
    cached = Object.freeze({ type, walkable: !NON_WALKABLE.includes(type), transparent: true })
    TILE_CACHE[type] = cached
  }
  return cached
}

/** Constrói um salão fechado com paredes e uma entrada voltada para o centro,
 *  com o portal indicado no meio. */
function buildPortalHall(tiles: Tile[][], px: number, py: number, portal: TileType, radius: number) {
  if (!tiles[py]?.[px]) return
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const row = tiles[py + dy]
      if (!row || !row[px + dx]) continue
      const isEdge = Math.abs(dx) === radius || Math.abs(dy) === radius
      row[px + dx] = makeTile(isEdge ? 'house_wall' : 'ancient_tile')
    }
  }
  // Entrada apontando para a praça central
  const vx = CENTER - px
  const vy = CENTER - py
  const horizontal = Math.abs(vx) >= Math.abs(vy)
  const ex = horizontal ? px + Math.sign(vx) * radius : px
  const ey = horizontal ? py : py + Math.sign(vy) * radius
  if (tiles[ey]?.[ex]) tiles[ey][ex] = makeTile('cobblestone')
  if (horizontal) {
    if (tiles[ey - 1]?.[ex]) tiles[ey - 1][ex] = makeTile('cobblestone')
    if (tiles[ey + 1]?.[ex]) tiles[ey + 1][ex] = makeTile('cobblestone')
  } else {
    if (tiles[ey]?.[ex - 1]) tiles[ey][ex - 1] = makeTile('cobblestone')
    if (tiles[ey]?.[ex + 1]) tiles[ey][ex + 1] = makeTile('cobblestone')
  }
  // Lamparinas nos cantos internos + portal no centro
  const c = radius - 1
  for (const [ox, oy] of [[-c, -c], [c, -c], [-c, c], [c, c]] as [number, number][]) {
    if (tiles[py + oy]?.[px + ox]) tiles[py + oy][px + ox] = makeTile('lamp_post')
  }
  tiles[py][px] = makeTile(portal)
}

/** Casa/estabelecimento com paredes, telhado e uma porta voltada ao centro. */
/** Abre um caminho caminhável de 1 tile (4-conectado) entre dois pontos,
 *  atravessando qualquer parede que esteja bloqueando. Nunca sobrescreve
 *  portais, escadas ou a fonte central. */
const CARVE_KEEP = new Set<string>([
  'fountain', 'stairs_down', 'stairs_up',
])
function carvePath(tiles: Tile[][], x0: number, y0: number, x1: number, y1: number) {
  let x = x0, y = y0
  let guard = 0
  while ((x !== x1 || y !== y1) && guard++ < 2000) {
    const t = tiles[y]?.[x]
    if (t && !CARVE_KEEP.has(t.type) && !t.type.includes('portal')) {
      tiles[y][x] = makeTile('cobblestone')
    }
    if (x !== x1 && (Math.abs(x1 - x) >= Math.abs(y1 - y) || y === y1)) x += Math.sign(x1 - x)
    else if (y !== y1) y += Math.sign(y1 - y)
  }
}
function buildHouse(tiles: Tile[][], x0: number, y0: number, w: number, h: number) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      if (!tiles[y]?.[x]) continue
      const isEdge = x === x0 || y === y0 || x === x0 + w - 1 || y === y0 + h - 1
      tiles[y][x] = makeTile(isEdge ? 'house_wall' : 'house_roof')
    }
  }
  const doorX = Math.round(x0 + w / 2)
  const doorY = CENTER > y0 ? y0 + h - 1 : y0
  if (tiles[doorY]?.[doorX]) tiles[doorY][doorX] = makeTile('floor')
  // Lamparinas ladeando a porta
  if (tiles[doorY]?.[doorX - 2]) tiles[doorY][doorX - 2] = makeTile('lamp_post')
  if (tiles[doorY]?.[doorX + 2]) tiles[doorY][doorX + 2] = makeTile('lamp_post')
}

function hashStr(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Pseudo-random noise & smooth interpolation for realistic organic Voronoi biomes
function pseudoNoise(x: number, y: number, seed: number = 2026): number {
  const n = Math.sin(x * 0.05 + y * 0.07 + seed) * 43758.5453
  return n - Math.floor(n)
}

function smoothNoise(x: number, y: number, seed: number = 2026): number {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j

  const smoothX = fx * fx * (3 - 2 * fx)
  const smoothY = fy * fy * (3 - 2 * fy)

  const n00 = pseudoNoise(i, j, seed)
  const n10 = pseudoNoise(i + 1, j, seed)
  const n01 = pseudoNoise(i, j + 1, seed)
  const n11 = pseudoNoise(i + 1, j + 1, seed)

  const nx0 = n00 * (1 - smoothX) + n10 * smoothX
  const nx1 = n01 * (1 - smoothX) + n11 * smoothX

  return nx0 * (1 - smoothY) + nx1 * smoothY
}

function fbm(x: number, y: number, octaves = 4, seed = 2026): number {
  let val = 0
  let amp = 0.5
  let freq = 1.0
  for (let i = 0; i < octaves; i++) {
    val += smoothNoise(x * freq, y * freq, seed + i * 100) * amp
    freq *= 2.0
    amp *= 0.5
  }
  return val
}

export type WeatherType = 'none' | 'rain' | 'storm' | 'snow' | 'fog' | 'sandstorm' | 'ash_fall' | 'aurora'

// ─────────────────────────────────────────────────────────────────────────────
// MOSAICO DE BIOMAS ESTILO RUCOY ONLINE
// O mundo é um tabuleiro de blocos RETANGULARES de tamanho parecido (mas com
// larguras/alturas irregulares), com bordas bem recortadas. Um mesmo bioma
// nunca aparece em mais de 2 blocos vizinhos em linha/coluna.
// ─────────────────────────────────────────────────────────────────────────────
export const GREAT_LANDS = [
  { side: 'west' as const, id: 'greenwood', name: 'Bosque Esmeralda', weather: 'rain' as WeatherType },
  { side: 'east' as const, id: 'goldsands', name: 'Dunas Douradas', weather: 'sandstorm' as WeatherType },
  { side: 'north' as const, id: 'frostreach', name: 'Confins Gelados', weather: 'snow' as WeatherType },
  { side: 'south' as const, id: 'emberwaste', name: 'Ermos de Brasa', weather: 'ash_fall' as WeatherType },
]

export type BiomeKindId =
  | 'greenwood' | 'goldsands' | 'frostreach' | 'emberwaste'
  | 'mirebog' | 'plains' | 'ruins' | 'crystal'
  | 'bloomvale' | 'jungle' | 'saltflats' | 'boneyard' | 'slagfields' | 'voidlands'

export const BIOME_KINDS: { id: BiomeKindId; name: string; weather: WeatherType }[] = [
  { id: 'greenwood',  name: 'Bosque Esmeralda',  weather: 'rain' },
  { id: 'bloomvale',  name: 'Vale Florido',      weather: 'none' },
  { id: 'goldsands',  name: 'Dunas Douradas',    weather: 'sandstorm' },
  { id: 'frostreach', name: 'Confins Gelados',   weather: 'snow' },
  { id: 'emberwaste', name: 'Ermos de Brasa',    weather: 'ash_fall' },
  { id: 'mirebog',    name: 'Pântano Sombrio',   weather: 'fog' },
  { id: 'plains',     name: 'Campos Abertos',    weather: 'none' },
  { id: 'ruins',      name: 'Ruínas Antigas',    weather: 'none' },
  { id: 'crystal',    name: 'Ermo Cristalino',   weather: 'aurora' },
  { id: 'jungle',     name: 'Selva Umbrosa',     weather: 'rain' },
  { id: 'saltflats',  name: 'Salinas Brancas',   weather: 'sandstorm' },
  { id: 'boneyard',   name: 'Necrópole de Ossos', weather: 'fog' },
  { id: 'slagfields', name: 'Planalto de Escória', weather: 'ash_fall' },
  { id: 'voidlands',  name: 'Ermo do Vazio',     weather: 'storm' },
]

/** Cortes irregulares do tabuleiro (blocos ~40-58 tiles). */
function buildCuts(seed: number, axis: number): number[] {
  const cuts = [0]
  let p = 0
  let i = 0
  while (p < W - 24) {
    const r = pseudoNoise(i * 13 + axis * 91, axis * 7, seed + 31)
    p += Math.round(40 + r * 20)
    if (p >= W) break
    cuts.push(p)
    i++
  }
  cuts.push(W)
  return cuts
}

/**
 * CADEIA DE BIOMAS (estilo Rucoy Online).
 * A ordem é a mesma da progressão de nível: cada bioma só pode encostar no
 * bioma anterior e no seguinte da cadeia — ou seja, NENHUM bioma faz fronteira
 * com mais de 2 biomas diferentes. Isso é garantido por construção: cada bloco
 * do mosaico recebe um índice da cadeia e blocos vizinhos nunca diferem em
 * mais de 1 índice.
 */
export const BIOME_CHAIN: BiomeKindId[] = [
  'greenwood', 'bloomvale', 'plains', 'jungle', 'mirebog',
  'goldsands', 'saltflats', 'ruins', 'boneyard',
  'frostreach', 'crystal', 'slagfields', 'emberwaste', 'voidlands',
]

let cutsCache: { seed: number; xs: number[]; ys: number[]; grid: BiomeKindId[][] } | null = null

function getMosaic(seed: number) {
  if (cutsCache && cutsCache.seed === seed) return cutsCache
  const xs = buildCuts(seed, 0)
  const ys = buildCuts(seed, 1)
  const cols = xs.length - 1
  const rows = ys.length - 1
  const maxIdx = BIOME_CHAIN.length - 1

  // 1) Campo escalar: cresce de forma irregular a partir do bloco central
  //    (a Capital fica no bioma inicial da cadeia, como em Rucoy).
  const cCenter = (cols - 1) / 2
  const rCenter = (rows - 1) / 2
  const maxDist = Math.max(1, Math.hypot(cCenter, rCenter))
  const level: number[][] = []
  for (let r = 0; r < rows; r++) {
    level.push([])
    for (let c = 0; c < cols; c++) {
      const dist = Math.hypot(c - cCenter, r - rCenter) / maxDist
      const jitter = (pseudoNoise(c * 17 + 3, r * 23 + 5, seed + 512) - 0.5) * 0.42
      const v = Math.min(1, Math.max(0, dist + jitter))
      level[r][c] = Math.round(v * maxIdx)
    }
  }

  // 2) Relaxação: blocos vizinhos nunca diferem em mais de 1 índice da cadeia.
  //    Garante grau <= 2 de vizinhança para todo bioma.
  for (let pass = 0; pass < 24; pass++) {
    let changed = false
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const neigh = [
          level[r][c - 1], level[r][c + 1],
          level[r - 1]?.[c], level[r + 1]?.[c],
          level[r - 1]?.[c - 1], level[r - 1]?.[c + 1],
          level[r + 1]?.[c - 1], level[r + 1]?.[c + 1],
        ].filter((v): v is number => typeof v === 'number')
        for (const n of neigh) {
          if (level[r][c] - n > 1) { level[r][c] = n + 1; changed = true }
          else if (n - level[r][c] > 1) { level[r][c] = n - 1; changed = true }
        }
      }
    }
    if (!changed) break
  }

  const grid: BiomeKindId[][] = level.map(row =>
    row.map(v => BIOME_CHAIN[Math.min(maxIdx, Math.max(0, v))]),
  )
  cutsCache = { seed, xs, ys, grid }
  return cutsCache
}

function cellIndex(cuts: number[], v: number): number {
  for (let i = 0; i < cuts.length - 1; i++) {
    if (v >= cuts[i] && v < cuts[i + 1]) return i
  }
  return Math.max(0, cuts.length - 2)
}

/** Bioma do mosaico numa posição (com as bordas recortadas já aplicadas). */
function mosaicKindAt(x: number, y: number, seed: number): BiomeKindId {
  const { xs, ys, grid } = getMosaic(seed)
  // Distorção das bordas: recorte bem irregular entre blocos vizinhos
  const wx = x + (fbm(x * 0.055, y * 0.055, 4, seed + 301) - 0.5) * 26
    + (fbm(x * 0.17, y * 0.17, 2, seed + 55) - 0.5) * 9
  const wy = y + (fbm(x * 0.05, y * 0.05, 4, seed + 811) - 0.5) * 26
    + (fbm(x * 0.19, y * 0.19, 2, seed + 77) - 0.5) * 9
  const cx = Math.min(Math.max(wx, 0), W - 1)
  const cy = Math.min(Math.max(wy, 0), H - 1)
  const c = cellIndex(xs, cx)
  const r = cellIndex(ys, cy)
  return grid[r]?.[c] ?? 'plains'
}

export function getGreatLandAt(tileX: number, tileY: number) {
  const dx = tileX - CENTER
  const dy = tileY - CENTER
  if (Math.hypot(dx, dy) < 28) return null
  const id = mosaicKindAt(tileX, tileY, 2026)
  const kind = BIOME_KINDS.find(k => k.id === id)!
  const side = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'west' : 'east') : (dy < 0 ? 'north' : 'south')
  return { side: side as 'west' | 'east' | 'north' | 'south', id: kind.id, name: kind.name, weather: kind.weather }
}

// ─────────────────────────────────────────────────────────────────────────────
// NÍVEIS FIXOS POR BIOMA (a faixa não muda com a distância da Capital)
// ─────────────────────────────────────────────────────────────────────────────
export const BIOME_LEVEL_RANGES: Record<BiomeKindId, { min: number; max: number }> = {
  greenwood:  { min: 1,   max: 5 },
  bloomvale:  { min: 6,   max: 10 },
  plains:     { min: 11,  max: 16 },
  jungle:     { min: 17,  max: 24 },
  mirebog:    { min: 25,  max: 34 },
  goldsands:  { min: 35,  max: 46 },
  saltflats:  { min: 47,  max: 58 },
  ruins:      { min: 59,  max: 72 },
  boneyard:   { min: 73,  max: 88 },
  frostreach: { min: 89,  max: 106 },
  crystal:    { min: 107, max: 126 },
  slagfields: { min: 127, max: 148 },
  emberwaste: { min: 149, max: 172 },
  voidlands:  { min: 173, max: 200 },
}

/** Faixa fixa de nível do bioma numa posição do mundo. */
export function getBiomeLevelRange(tileX: number, tileY: number) {
  if (Math.hypot(tileX - CENTER, tileY - CENTER) <= 28) return { min: 1, max: 1 }
  const id = mosaicKindAt(tileX, tileY, 2026)
  return BIOME_LEVEL_RANGES[id] ?? BIOME_LEVEL_RANGES.plains
}

/** Nível fixo de um monstro nessa posição, determinístico dentro da faixa do bioma. */
export function getBiomeFixedLevel(tileX: number, tileY: number, salt = 0): number {
  const { min, max } = getBiomeLevelRange(tileX, tileY)
  if (max <= min) return min
  const h = hashStr(`lvl_${tileX}_${tileY}_${salt}`)
  return min + (h % (max - min + 1))
}

/** Reescreve todo o continente (fora da Capital e fora da orla) no mosaico de
 *  biomas retangulares irregulares. Preserva água/orla, portais, escadas e
 *  qualquer tile já construído da cidade. */
const GREAT_LANDS_KEEP = new Set<TileType>([
  'deepwater', 'fountain', 'stairs_down', 'stairs_up',
  'cobblestone', 'house_wall', 'house_roof', 'house_door',
])

function applyFourGreatLands(tiles: Tile[][], seed: number) {
  const INNER = 30      // raio protegido da Capital
  const OUTER = 196     // além disso é orla/oceano gerado organicamente
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - CENTER
      const dy = y - CENTER
      const dist = Math.hypot(dx, dy)
      if (dist < INNER || dist > OUTER) continue
      const cur = tiles[y][x]
      if (!cur || GREAT_LANDS_KEEP.has(cur.type)) continue
      if (cur.type.includes('portal') && dist < 40) continue

      const land = mosaicKindAt(x, y, seed)

      const d = fbm(x * 0.11, y * 0.11, 4, seed + 40) - 0.5   // detalhe fino
      const m = fbm(x * 0.028, y * 0.028, 3, seed + 91) - 0.5 // macro
      let t: TileType = 'grass'

      if (land === 'greenwood') {
        // BOSQUE ESMERALDA — bosques densos, clareiras e trilhas de terra
        const trail = Math.abs(dy - Math.sin(x * 0.06) * 14) < 1.6 || Math.abs(dy + Math.sin(x * 0.045) * 22) < 1.4
        if (trail) t = 'dirt'
        else if (m > 0.14 && d > 0.02) t = 'tree'
        else if (m > 0.14) t = 'tall_grass'
        else if (m < -0.16 && d < -0.14) t = 'dark_water'
        else if (d > 0.16) t = 'tree'
        else if (d < -0.18) t = 'flower'
        else if (d < -0.10) t = 'tall_grass'
        else t = 'grass'
      } else if (land === 'goldsands') {
        // DUNAS DOURADAS — cristas de duna, oásis e ruínas soterradas
        const dune = Math.abs(Math.sin(x * 0.07 + y * 0.035))
        const oasis = m < -0.22
        const ruinBlock = (Math.floor(x / 34) + Math.floor(y / 34)) % 3 === 0
        if (oasis && d < -0.10) t = 'water'
        else if (oasis) t = 'grass'
        else if (ruinBlock && x % 34 < 12 && y % 34 < 12) {
          t = (x % 6 === 0 && y % 6 === 0) ? 'ruin_pillar' : (d > 0.08 ? 'broken_tile' : 'sand')
        } else if (dune > 0.955) t = 'rock'
        else if (d > 0.20) t = 'rock'
        else if (d < -0.16) t = 'dirt'
        else t = 'sand'
      } else if (land === 'frostreach') {
        // CONFINS GELADOS — lagos congelados, cinturões de pinheiros e cristais
        const lake = m < -0.20
        const pineBelt = Math.abs(Math.sin(y * 0.09)) > 0.93
        if (lake && d < 0.05) t = 'ice'
        else if (pineBelt && d > -0.10) t = 'pine_tree'
        else if (d > 0.20) t = 'pine_tree'
        else if (d > 0.10) t = 'snow_rock'
        else if (d < -0.20) t = 'ice_crystal_node'
        else if (m > 0.20) t = 'mountain_rock'
        else t = 'snow'
      } else if (land === 'emberwaste') {
        // ERMOS DE BRASA — rios de lava, campos de cinza e cristas de obsidiana
        const lavaRiver = Math.abs(dx - Math.sin(y * 0.05) * 26) < 1.8 || Math.abs(dx + Math.cos(y * 0.035) * 40) < 1.5
        if (lavaRiver) t = 'lava'
        else if (m > 0.18 && d > 0.06) t = 'volcanic_rock'
        else if (m < -0.18) t = 'ash'
        else if (d > 0.22) t = 'obsidian'
        else if (d < -0.20) t = 'volcanic_vent'
        else t = 'magma_crust'
      } else if (land === 'mirebog') {
        // PÂNTANO SOMBRIO — poças escuras, juncos e árvores retorcidas
        if (m < -0.14 && d < 0.05) t = 'dark_water'
        else if (d > 0.20) t = 'tree'
        else if (d > 0.06) t = 'tall_grass'
        else if (d < -0.18) t = 'dirt'
        else t = 'mossy_stone'
      } else if (land === 'plains') {
        // CAMPOS ABERTOS — pradarias amplas com bosques esparsos
        if (d > 0.26) t = 'tree'
        else if (d > 0.14) t = 'tall_grass'
        else if (m < -0.22 && d < -0.10) t = 'water'
        else if (d < -0.20) t = 'flower'
        else t = 'grass'
      } else if (land === 'ruins') {
        // RUÍNAS ANTIGAS — quarteirões de pedra quebrada e colunas
        const block = (x % 16 < 11) && (y % 16 < 11)
        if (block && (x % 16 === 0 || y % 16 === 0)) t = 'ruin_pillar'
        else if (block && d > 0.12) t = 'ancient_tile'
        else if (block) t = 'broken_tile'
        else if (d > 0.20) t = 'rock'
        else if (d < -0.18) t = 'dirt'
        else t = 'ruin_floor'
      } else {
        // ERMO CRISTALINO — planaltos pálidos com veios de cristal
        if (d > 0.24) t = 'crystal'
        else if (d > 0.10) t = 'rock'
        else if (m < -0.20) t = 'ice'
        else if (d < -0.20) t = 'ice_crystal_node'
        else t = 'crystal_floor'
      }

      tiles[y][x] = makeTile(t)
    }
  }
}

export interface BiomeRegion {
  id: string
  name: string
  centerX: number
  centerY: number
  radius: number
  minLevel: number
  primaryTile: TileType
  accentTile: TileType
  wallTile?: TileType
  decoratorTile?: TileType
  weather?: WeatherType
  mobPool: MonsterType[]
  category?: string
  pattern?: string
}

export const WORLD_MAP_SIZE = 480
const W = WORLD_MAP_SIZE
const H = WORLD_MAP_SIZE
const CENTER = W / 2 // 240

// Helper to determine sector angle by biome category/theme
function getCategorySectorAngle(cat: string, id: string): number {
  const lc = (cat + '_' + id).toLowerCase()
  if (lc.includes('volcan') || lc.includes('fire') || lc.includes('ember') || lc.includes('slag') || lc.includes('ashland') || lc.includes('lava')) return 0.12 * Math.PI
  if (lc.includes('desert') || lc.includes('dune') || lc.includes('sand') || lc.includes('amber') || lc.includes('ravine') || lc.includes('canyon')) return 0.37 * Math.PI
  if (lc.includes('ocean') || lc.includes('reef') || lc.includes('tide') || lc.includes('coral') || lc.includes('beach') || lc.includes('isles')) return 0.62 * Math.PI
  if (lc.includes('swamp') || lc.includes('bog') || lc.includes('moss') || lc.includes('jade') || lc.includes('ashwood') || lc.includes('witch')) return 0.87 * Math.PI
  if (lc.includes('forest') || lc.includes('jungle') || lc.includes('wood') || lc.includes('thorn') || lc.includes('glow')) return 1.12 * Math.PI
  if (lc.includes('tundra') || lc.includes('snow') || lc.includes('glacier') || lc.includes('ice') || lc.includes('valky') || lc.includes('salt') || lc.includes('aurora')) return 1.37 * Math.PI
  if (lc.includes('sky') || lc.includes('celestial') || lc.includes('cloud') || lc.includes('moth') || lc.includes('star')) return 1.62 * Math.PI
  // Abyss / Crystal / Ruins / Void / Default
  return 1.87 * Math.PI
}

// Distance-based exponential level scaling formula (Capital Real at CENTER = 240,240)
export function getDistanceScaledLevel(distFromCapital: number, baseMinLevel = 1): number {
  if (distFromCapital <= 28) return 1 // Safe Capital Real zone
  const norm = distFromCapital - 28
  // Steep power growth:
  // norm 15 (dist ~43) -> level ~8
  // norm 35 (dist ~63) -> level ~32
  // norm 65 (dist ~93) -> level ~95
  // norm 100 (dist ~128) -> level ~210
  // norm 140 (dist ~168) -> level ~380
  // norm 180+ (dist ~208+) -> level ~620+
  const scaled = Math.round(1 + Math.pow(norm / 4.8, 1.85))
  return Math.max(baseMinLevel, scaled)
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD ALL 150+ BIOMES INTO THE OPEN WORLD REGIONS REGISTRY (2D GRID JITTERED)
// ─────────────────────────────────────────────────────────────────────────────
function buildAllOpenWorldRegions(): BiomeRegion[] {
  const list: BiomeRegion[] = [
    {
      id: 'city',
      name: 'Capital Real de Rucoy',
      centerX: CENTER,
      centerY: CENTER,
      radius: 24,
      minLevel: 1,
      primaryTile: 'cobblestone',
      accentTile: 'garden',
      decoratorTile: 'fountain',
      weather: 'none',
      mobPool: [],
      category: 'hub'
    }
  ]

  // Combine 100 Biomes + 50 Mega Biomes
  const rawList: Array<{
    id: string
    name: string
    minLevel: number
    primaryTile: TileType
    accentTile: TileType
    wallTile?: TileType
    decoratorTile?: TileType
    weather?: WeatherType
    mobPool: MonsterType[]
    category: string
    pattern?: string
  }> = []

  // Add 100 Biomes from new100Biomes
  for (const b of ALL_100_BIOMES) {
    rawList.push({
      id: b.id,
      name: b.name,
      minLevel: b.minLevel,
      primaryTile: b.primaryTile,
      accentTile: b.accentTile,
      wallTile: b.wallTile,
      decoratorTile: b.decoratorTile,
      weather: b.weather,
      mobPool: b.mobPool as MonsterType[],
      category: b.category,
    })
  }

  // Add 50 Mega Biomes from megaBiomes
  const megaSpecs = getAllMegaBiomeSpecs()
  for (const s of megaSpecs) {
    rawList.push({
      id: s.id,
      name: s.name,
      minLevel: s.minLvl,
      primaryTile: s.pal.base,
      accentTile: s.pal.deco,
      wallTile: s.pal.wall,
      decoratorTile: s.pal.special,
      weather: s.pal.base === 'ice' || s.pal.base === 'snow' ? 'snow' : (s.pal.base === 'ash' ? 'ash_fall' : 'none'),
      mobPool: s.pool as MonsterType[],
      category: 'mega_' + s.pattern,
      pattern: s.pattern,
    })
  }

  // 12x13 2D grid covering map bounds (480x480) with pseudo-random jitter
  const COLS = 12
  const ROWS = 13
  const cellW = (W - 32) / COLS // ~37.3 tiles
  const cellH = (H - 32) / ROWS // ~34.4 tiles

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i]
    const h = hashStr(item.id)

    // Deterministic cell index permutation
    const cellIdx = (i * 37 + h) % (COLS * ROWS)
    const col = cellIdx % COLS
    const row = Math.floor(cellIdx / COLS)

    const cellCenterX = 16 + col * cellW + cellW / 2
    const cellCenterY = 16 + row * cellH + cellH / 2

    // Organic jitter offset within cell
    const jx = (((h % 100) / 100) - 0.5) * (cellW * 0.65)
    const jy = ((((h >> 8) % 100) / 100) - 0.5) * (cellH * 0.65)

    let cx = Math.round(Math.max(22, Math.min(W - 22, cellCenterX + jx)))
    let cy = Math.round(Math.max(22, Math.min(H - 22, cellCenterY + jy)))

    // Keep clear distance from Capital Real center (240, 240)
    const distFromCenter = Math.hypot(cx - CENTER, cy - CENTER)
    if (distFromCenter < 32) {
      const pushAng = Math.atan2(cy - CENTER, cx - CENTER) || (h % 6.28)
      cx = Math.round(CENTER + Math.cos(pushAng) * 36)
      cy = Math.round(CENTER + Math.sin(pushAng) * 36)
    }

    // Nível da região = faixa fixa do bioma onde ela caiu
    const scaledLevel = getBiomeLevelRange(cx, cy).min

    list.push({
      id: item.id,
      name: item.name,
      centerX: cx,
      centerY: cy,
      radius: Math.round(14 + (h % 6)),
      minLevel: scaledLevel,
      primaryTile: item.primaryTile,
      accentTile: item.accentTile,
      wallTile: item.wallTile,
      decoratorTile: item.decoratorTile,
      weather: item.weather,
      mobPool: item.mobPool,
      category: item.category,
      pattern: item.pattern
    })
  }

  return list
}

let _allRegionsCache: BiomeRegion[] | null = null

export function getOpenWorldRegions(): BiomeRegion[] {
  if (!_allRegionsCache) {
    _allRegionsCache = buildAllOpenWorldRegions()
  }
  return _allRegionsCache
}

export const OPEN_WORLD_REGIONS: BiomeRegion[] = new Proxy([] as BiomeRegion[], {
  get(_target, prop, receiver) {
    const list = getOpenWorldRegions()
    const val = Reflect.get(list, prop, receiver)
    return typeof val === 'function' ? val.bind(list) : val
  },
  ownKeys() {
    return Reflect.ownKeys(getOpenWorldRegions())
  },
  getOwnPropertyDescriptor(_target, prop) {
    return Reflect.getOwnPropertyDescriptor(getOpenWorldRegions(), prop)
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// SPATIAL BUCKET GRID FOR O(1) LOOKUPS ACROSS ALL 151 BIOMES
// ─────────────────────────────────────────────────────────────────────────────
const GRID_CELL_SIZE = 30
const BUCKET_COLS = Math.ceil(W / GRID_CELL_SIZE)
const BUCKET_ROWS = Math.ceil(H / GRID_CELL_SIZE)

type RegionGrid = BiomeRegion[][][]

function buildRegionGrid(): RegionGrid {
  const grid: RegionGrid = []
  const allRegs = getOpenWorldRegions()
  for (let gy = 0; gy < BUCKET_ROWS; gy++) {
    grid[gy] = []
    for (let gx = 0; gx < BUCKET_COLS; gx++) {
      grid[gy][gx] = []
      const cellMinX = gx * GRID_CELL_SIZE
      const cellMaxX = (gx + 1) * GRID_CELL_SIZE
      const cellMinY = gy * GRID_CELL_SIZE
      const cellMaxY = (gy + 1) * GRID_CELL_SIZE

      for (const reg of allRegs) {
        const searchDist = reg.radius + 45
        if (
          reg.centerX >= cellMinX - searchDist &&
          reg.centerX <= cellMaxX + searchDist &&
          reg.centerY >= cellMinY - searchDist &&
          reg.centerY <= cellMaxY + searchDist
        ) {
          grid[gy][gx].push(reg)
        }
      }
    }
  }
  return grid
}

let _regionGridCache: RegionGrid | null = null

function getRegionGrid(): RegionGrid {
  if (!_regionGridCache) {
    _regionGridCache = buildRegionGrid()
  }
  return _regionGridCache
}

let cachedUnifiedWorldMap: GameMap | null = null

// ─────────────────────────────────────────────────────────────────────────────
// MAIN UNIFIED WORLD GENERATOR (150+ BIOMES, ORGANIC COASTLINE, NO SQUARE WALLS)
// ─────────────────────────────────────────────────────────────────────────────
export function generateUnifiedWorld(seed = 2026): GameMap {
  if (cachedUnifiedWorldMap) return cachedUnifiedWorldMap

  const tiles: Tile[][] = []
  for (let y = 0; y < H; y++) {
    tiles[y] = []
    for (let x = 0; x < W; x++) {
      tiles[y][x] = makeTile('deepwater')
    }
  }

  // 1. Organic Terrain & Biome Assignment Loop
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dxCenter = x - CENTER
      const dyCenter = y - CENTER
      const distFromCenter = Math.hypot(dxCenter, dyCenter)
      const angle = Math.atan2(dyCenter, dxCenter)

      // Multi-octave FBM noise for organic coastline shapes (No square wall box!)
      const coastNoise = fbm(Math.cos(angle) * 2.8 + x * 0.005, Math.sin(angle) * 2.8 + y * 0.005, 4, seed)
      const maxContinentRadius = 205 + coastNoise * 36 // Organic coastline between ~170 and ~241 tiles

      // A) Outer Ocean & Islands (No square border!)
      if (distFromCenter > maxContinentRadius + 10) {
        // Island noise for offshore archipelagos
        const islandNoise = fbm(x * 0.045, y * 0.045, 3, seed + 777)
        if (islandNoise > 0.68) {
          // Offshore island
          tiles[y][x] = makeTile(islandNoise > 0.74 ? 'sand' : 'grass')
          continue
        }

        // Sky sector / Abyss sector / Ocean
        if (angle < -0.2 * Math.PI && angle > -0.8 * Math.PI) {
          tiles[y][x] = makeTile('sky_void')
        } else if (angle > 0.7 * Math.PI || angle < -0.9 * Math.PI) {
          tiles[y][x] = makeTile('void')
        } else {
          tiles[y][x] = makeTile('deepwater')
        }
        continue
      }

      // B) Coastal Shoreline
      if (distFromCenter > maxContinentRadius) {
        const shoreType = coastNoise > 0.3 ? 'sand' : (coastNoise < -0.2 ? 'water' : 'rock')
        tiles[y][x] = makeTile(shoreType)
        continue
      }

      // C) Capital City Hub Plaza (Center 240, 240)
      if (distFromCenter < 24) {
        const rx = x - CENTER
        const ry = y - CENTER
        const ang = Math.atan2(ry, rx)
        // Ruas radiais (8 avenidas) + 2 anéis viários
        const onAvenue = Math.abs(Math.sin(ang * 4)) < 0.06
        const onRing = Math.abs(distFromCenter - 9) < 1.2 || Math.abs(distFromCenter - 19) < 1.2

        if (distFromCenter < 3) {
          // Grande fonte central
          tiles[y][x] = makeTile(distFromCenter < 1.2 ? 'fountain' : 'garden')
        } else if (onAvenue || onRing || distFromCenter < 5) {
          tiles[y][x] = makeTile('cobblestone')
        } else if (distFromCenter < 12) {
          // Praça cívica ajardinada com lamparinas nos cantos dos quarteirões
          if ((x % 5 === 0) && (y % 5 === 0)) tiles[y][x] = makeTile('lamp_post')
          else tiles[y][x] = makeTile((x + y) % 4 === 0 ? 'garden' : 'cobblestone')
        } else if (distFromCenter < 19) {
          // Distrito comercial: bancas de mercado alinhadas em quarteirões
          if (x % 3 === 0 && y % 3 === 0) tiles[y][x] = makeTile('market_stall')
          else tiles[y][x] = makeTile('cobblestone')
        } else {
          // Cinturão verde com cercas
          if ((x + y) % 7 === 0) tiles[y][x] = makeTile('fence')
          else tiles[y][x] = makeTile((x * y) % 3 === 0 ? 'garden' : 'grass')
        }
        continue
      }

      // D) Organic Biome Assignment via Domain-Warped Voronoi
      const wx = x + fbm(x * 0.02, y * 0.02, 3, seed) * 36 - 18
      const wy = y + fbm(x * 0.02 + 50, y * 0.02 + 50, 3, seed + 10) * 36 - 18

      const gx = Math.min(BUCKET_COLS - 1, Math.max(0, Math.floor(wx / GRID_CELL_SIZE)))
      const gy = Math.min(BUCKET_ROWS - 1, Math.max(0, Math.floor(wy / GRID_CELL_SIZE)))
      const rGrid = getRegionGrid()
      const candidates = rGrid[gy][gx].length > 0 ? rGrid[gy][gx] : getOpenWorldRegions()

      let b1 = candidates[0] || getOpenWorldRegions()[0]
      let b2 = b1
      let minD1 = Infinity
      let minD2 = Infinity

      for (let i = 0; i < candidates.length; i++) {
        const reg = candidates[i]
        if (reg.id === 'city') continue
        const d = Math.hypot(wx - reg.centerX, wy - reg.centerY)
        if (d < minD1) {
          minD2 = minD1
          b2 = b1
          minD1 = d
          b1 = reg
        } else if (d < minD2) {
          minD2 = d
          b2 = reg
        }
      }

      // Soft Organic Border Blending (Smooth transitions between biomes)
      const edgeFactor = minD2 - minD1
      if (edgeFactor < 10.0) {
        const mixNoise = fbm(x * 0.12, y * 0.12, 2, seed + 33)
        if (mixNoise > 0.52) {
          tiles[y][x] = makeTile(b2.accentTile || b2.primaryTile)
          continue
        }
      }

      // E) Custom Procedural Structures Unique to Biome Type
      const cat = (b1.category || '').toLowerCase()
      const primary = b1.primaryTile
      const accent = b1.accentTile
      const deco = b1.decoratorTile || 'rock'

      const featureNoise = fbm(x * 0.1, y * 0.1, 3, seed + hashStr(b1.id))

      // Mega Biome Mathematical Patterns
      if (b1.pattern) {
        const relX = x - b1.centerX
        const relY = y - b1.centerY
        const r = Math.hypot(relX, relY)

        if (b1.pattern === 'concentric_rings') {
          if (Math.round(r) % 6 === 0) {
            tiles[y][x] = makeTile(b1.wallTile || accent)
            continue
          }
        } else if (b1.pattern === 'hex_grid') {
          if ((Math.abs(relX) % 8 === 0) || (Math.abs(relY) % 8 === 0)) {
            tiles[y][x] = makeTile(b1.wallTile || accent)
            continue
          }
        } else if (b1.pattern === 'spiral_arms') {
          const ang = Math.atan2(relY, relX)
          if (Math.abs(Math.sin(ang * 3 + r * 0.2)) > 0.82) {
            tiles[y][x] = makeTile(b1.wallTile || accent)
            continue
          }
        } else if (b1.pattern === 'dendritic_rivers') {
          if (Math.abs(relY - Math.sin(relX * 0.15) * 6) < 1.8) {
            tiles[y][x] = makeTile(deco || 'water')
            continue
          }
        } else if (b1.pattern === 'chambered_maze') {
          if (relX % 12 === 0 || relY % 12 === 0) {
            if ((relX + relY) % 5 !== 0) {
              tiles[y][x] = makeTile(b1.wallTile || 'dungeon_wall')
              continue
            }
          }
        }
      }

      // Category-Specific Procedural Features & Blocks
      if (cat.includes('forest') || cat.includes('jungle')) {
        if (featureNoise > 0.44) {
          tiles[y][x] = makeTile('tree')
        } else if (featureNoise > 0.36) {
          tiles[y][x] = makeTile(accent || 'tall_grass')
        } else if (featureNoise < -0.32) {
          tiles[y][x] = makeTile('dirt')
        } else if (featureNoise < -0.42 && (x + y) % 7 === 0) {
          tiles[y][x] = makeTile('flower')
        } else {
          tiles[y][x] = makeTile(primary)
        }
      } else if (cat.includes('desert') || cat.includes('canyon') || cat.includes('badlands')) {
        const duneRidge = Math.abs(Math.sin(x * 0.08 + y * 0.04))
        if (duneRidge > 0.88) {
          tiles[y][x] = makeTile('rock')
        } else if (featureNoise > 0.35) {
          tiles[y][x] = makeTile(accent || 'dirt')
        } else if (featureNoise < -0.40 && Math.hypot(x - b1.centerX, y - b1.centerY) < 6) {
          tiles[y][x] = makeTile('water') // Oasis pool
        } else {
          tiles[y][x] = makeTile(primary)
        }
      } else if (cat.includes('volcan') || cat.includes('fire') || cat.includes('lava') || cat.includes('ash')) {
        const lavaRiver = Math.abs(y - (b1.centerY + Math.sin((x - b1.centerX) * 0.1) * 8))
        if (lavaRiver < 2.0) {
          tiles[y][x] = makeTile('lava')
        } else if (featureNoise > 0.38) {
          tiles[y][x] = makeTile('volcanic_rock')
        } else if (featureNoise < -0.35) {
          tiles[y][x] = makeTile('ash')
        } else {
          tiles[y][x] = makeTile(primary)
        }
      } else if (cat.includes('tundra') || cat.includes('glacier') || cat.includes('snow') || cat.includes('ice')) {
        if (featureNoise > 0.40) {
          tiles[y][x] = makeTile('pine_tree')
        } else if (featureNoise > 0.28) {
          tiles[y][x] = makeTile('ice')
        } else if (featureNoise < -0.38) {
          tiles[y][x] = makeTile('ice_crystal_node')
        } else {
          tiles[y][x] = makeTile(primary)
        }
      } else if (cat.includes('swamp') || cat.includes('bog')) {
        if (featureNoise > 0.32) {
          tiles[y][x] = makeTile('dark_water')
        } else if (featureNoise < -0.36) {
          tiles[y][x] = makeTile('mossy_stone')
        } else if ((x * 3 + y * 7) % 19 === 0) {
          tiles[y][x] = makeTile('root')
        } else {
          tiles[y][x] = makeTile(primary)
        }
      } else if (cat.includes('crystal') || cat.includes('mine')) {
        if (featureNoise > 0.42) {
          tiles[y][x] = makeTile('crystal_wall')
        } else if (featureNoise < -0.35) {
          tiles[y][x] = makeTile('gem_node')
        } else if ((x + y) % 9 === 0) {
          tiles[y][x] = makeTile('rune_stone')
        } else {
          tiles[y][x] = makeTile(primary)
        }
      } else if (cat.includes('abyss') || cat.includes('void') || cat.includes('underdark')) {
        if (featureNoise > 0.42) {
          tiles[y][x] = makeTile('void')
        } else if (featureNoise < -0.38) {
          tiles[y][x] = makeTile('dark_crystal')
        } else if ((x * y) % 23 === 0) {
          tiles[y][x] = makeTile('soul_fire')
        } else {
          tiles[y][x] = makeTile(primary)
        }
      } else if (cat.includes('ruins') || cat.includes('temple')) {
        if ((x % 8 === 0) && (y % 8 === 0)) {
          tiles[y][x] = makeTile('ruin_pillar')
        } else if (featureNoise > 0.38) {
          tiles[y][x] = makeTile('broken_tile')
        } else if (featureNoise < -0.38) {
          tiles[y][x] = makeTile('ancient_tile')
        } else {
          tiles[y][x] = makeTile(primary)
        }
      } else if (cat.includes('sky') || cat.includes('celestial')) {
        if (featureNoise > 0.45) {
          tiles[y][x] = makeTile('sky_void')
        } else if (featureNoise < -0.35) {
          tiles[y][x] = makeTile('sky_platform')
        } else {
          tiles[y][x] = makeTile(primary)
        }
      } else {
        // General biome fallback with organic detail
        if (featureNoise > 0.42) {
          tiles[y][x] = makeTile(deco)
        } else if (featureNoise < -0.35) {
          tiles[y][x] = makeTile(accent)
        } else {
          tiles[y][x] = makeTile(primary)
        }
      }
    }
  }

  // 1.5 QUATRO GRANDES REGIÕES (estilo Rucoy Online): a Capital fica no centro
  // e cada lado (oeste, leste, norte, sul) é um bioma gigantesco e coeso, com
  // organização e estilo próprios.
  applyFourGreatLands(tiles, seed)

  // 2. Build Trade Roads Connecting Capital Real to Major Sector Biome Centers
  for (const reg of OPEN_WORLD_REGIONS) {
    if (reg.id === 'city') continue
    if (reg.minLevel % 5 === 0 || reg.radius > 20) {
      let curX = CENTER
      let curY = CENTER
      const targetX = reg.centerX
      const targetY = reg.centerY

      const steps = Math.max(Math.abs(targetX - curX), Math.abs(targetY - curY))
      for (let s = 0; s <= steps; s += 2) {
        const rx = Math.round(curX + ((targetX - curX) * s) / Math.max(1, steps))
        const ry = Math.round(curY + ((targetY - curY) * s) / Math.max(1, steps))

        if (rx > 3 && ry > 3 && rx < W - 4 && ry < H - 4) {
          if (tiles[ry] && tiles[ry][rx] && tiles[ry][rx].type !== 'deepwater' && tiles[ry][rx].type !== 'void' && tiles[ry][rx].type !== 'sky_void') {
            tiles[ry][rx] = makeTile('cobblestone')
          }
        }
      }
    }
  }

  // 3. Fast Portal Plaza in Capital Real Center (8 Biome Portals)
  const plazaPortalTypes: TileType[] = [
    'desert_portal',    // a=0 (254, 240) - Golden Dunes
    'volcano_portal',   // a=1 (250, 250) - Magma Crater
    'forest_portal',    // a=2 (240, 254) - Poison Bog
    'abyss_portal',     // a=3 (230, 250) - Void Abyss
    'mountain_portal',  // a=4 (226, 240) - Frostbite Pass
    'sky_portal',       // a=5 (230, 230) - Cloud Haven
    'forest_portal',    // a=6 (240, 226) - Whispering Woods
    'ocean_portal',     // a=7 (250, 230) - Coral Reef Coast
  ]
  const portalRadius = 14
  for (let a = 0; a < 8; a++) {
    const ang = (a * Math.PI) / 4
    const px = Math.round(CENTER + Math.cos(ang) * portalRadius)
    const py = Math.round(CENTER + Math.sin(ang) * portalRadius)
    buildPortalHall(tiles, px, py, plazaPortalTypes[a] || 'portal', 3)
  }

  // 3b. Rua de acesso ligando cada salão de portal à praça central
  for (let a = 0; a < 8; a++) {
    const ang = (a * Math.PI) / 4
    const px = Math.round(CENTER + Math.cos(ang) * portalRadius)
    const py = Math.round(CENTER + Math.sin(ang) * portalRadius)
    // Abre a rua da praça até a porta do salão, atravessando qualquer parede
    carvePath(tiles, CENTER, CENTER, px, py)
  }

  // 3c. Quarteirões de construções da cidade (casas, ferraria, guilda, banco)
  const cityBlocks: Array<{ x: number; y: number; w: number; h: number }> = [
    { x: CENTER - 22, y: CENTER - 11, w: 6, h: 5 },
    { x: CENTER - 22, y: CENTER + 6, w: 6, h: 5 },
    { x: CENTER + 16, y: CENTER - 11, w: 6, h: 5 },
    { x: CENTER + 16, y: CENTER + 6, w: 6, h: 5 },
    { x: CENTER - 11, y: CENTER - 22, w: 5, h: 6 },
    { x: CENTER + 6, y: CENTER - 22, w: 5, h: 6 },
    { x: CENTER - 11, y: CENTER + 16, w: 5, h: 6 },
    { x: CENTER + 6, y: CENTER + 16, w: 5, h: 6 },
  ]
  for (const b of cityBlocks) buildHouse(tiles, b.x, b.y, b.w, b.h)

  // 3d. Pátio de treinamento (nordeste da praça, fora dos salões de portal)
  const yardX = CENTER + 18, yardY = CENTER - 18
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      if (tiles[yardY + dy]?.[yardX + dx]) {
        const edge = Math.abs(dx) === 3 || Math.abs(dy) === 3
        tiles[yardY + dy][yardX + dx] = makeTile(edge && !(dx === 0 && dy === 3) ? 'fence' : 'dirt')
      }
    }
  }
  // Caminho da praça até a entrada do pátio de treino
  carvePath(tiles, CENTER, CENTER, yardX, yardY + 3)

  // 4. Special Destinations & Central Portals in Capital Real Center
  const specialPortals = [
    { x: CENTER - 8, y: CENTER, type: 'celestial_portal' as TileType }, // Templo das Bençãos
    { x: CENTER, y: CENTER - 8, type: 'haunted_portal' as TileType },   // Masmorra Infinitos Andares
    { x: CENTER, y: CENTER + 8, type: 'tower_portal' as TileType },     // Arena de Ondas Infinitas (Coliseu)
    { x: CENTER + 8, y: CENTER, type: 'crystal_portal' as TileType },   // Mercado Celestial
    { x: CENTER - 6, y: CENTER - 6, type: 'volcano_portal' as TileType }, // Santuário dos Dragões
    { x: CENTER + 6, y: CENTER - 6, type: 'sky_portal' as TileType },     // Salão dos 30 Continentes
    { x: CENTER - 6, y: CENTER + 6, type: 'haunted_portal' as TileType }, // Catacumbas
    { x: CENTER + 6, y: CENTER + 6, type: 'dungeon_portal' as TileType }, // Masmorra Imperial
    { x: CENTER - 3, y: CENTER, type: 'stairs_down' as TileType },        // Dungeon Principal
    { x: CENTER + 3, y: CENTER, type: 'tower_portal' as TileType },       // Torre Infinita
  ]

  for (const sp of specialPortals) {
    buildPortalHall(tiles, sp.x, sp.y, sp.type, 2)
  }

  // 4a. Garante rua aberta da praça central até cada portal especial
  for (const sp of specialPortals) {
    carvePath(tiles, CENTER, CENTER, sp.x, sp.y)
  }

  // 4a-bis. Reabre as ruas até os 8 salões externos (os salões especiais
  // construídos acima podem ter fechado o trecho interno da avenida)
  for (let a = 0; a < 8; a++) {
    const ang = (a * Math.PI) / 4
    carvePath(
      tiles,
      CENTER,
      CENTER,
      Math.round(CENTER + Math.cos(ang) * portalRadius),
      Math.round(CENTER + Math.sin(ang) * portalRadius),
    )
  }

  // 4b. Place Stairs/Portals in EVERY Biome Center on Open World Map
  for (const reg of OPEN_WORLD_REGIONS) {
    if (reg.id === 'city') continue
    const bx = reg.centerX
    const by = reg.centerY

    // Clear a 3x3 walkable pad around the stairs/portal
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = bx + dx
        const ny = by + dy
        if (nx > 2 && ny > 2 && nx < W - 3 && ny < H - 3 && tiles[ny] && tiles[ny][nx]) {
          tiles[ny][nx] = makeTile('cobblestone')
        }
      }
    }

    if (tiles[by] && tiles[by][bx]) {
      // Alternate between stairs_down and portal tile based on biome category
      if (reg.category === 'sky' || reg.category === 'celestial') {
        tiles[by][bx] = makeTile('sky_portal')
      } else if (reg.category === 'volcano') {
        tiles[by][bx] = makeTile('volcano_portal')
      } else if (reg.category === 'desert') {
        tiles[by][bx] = makeTile('desert_portal')
      } else {
        tiles[by][bx] = makeTile('stairs_down')
      }
    }
  }

  // 5. Spawn Monsters Across All 150 Biomes & Open Wilderness (Optimized Density)
  const monsters: Monster[] = []

  // 5a. Bonecos de treino no pátio da Capital (indestrutíveis, dão XP por golpe)
  const dummySpots: Array<[number, number]> = [
    [yardX - 1, yardY - 1],
    [yardX + 1, yardY - 1],
    [yardX, yardY + 1],
  ]
  dummySpots.forEach(([dxTile, dyTile], i) => {
    const dummy = createMonster('slime', 1, dxTile * 32, dyTile * 32, 'normal')
    const d = dummy as unknown as Record<string, unknown>
    d.id = `training_dummy_capital_${i}`
    d.type = 'training_dummy'
    d.name = 'Boneco de Treino'
    d.hp = 999999
    d.maxHp = 999999
    d.attack = 0
    d.defense = 0
    d.speed = 0
    d.xpReward = 0
    d.goldReward = 0
    d.aggroRange = 0
    d.attackRange = 0
    d.drops = []
    monsters.push(dummy)
  })

  // A) Biome-specific distributed packs (1 to 2 small clusters per biome max to prevent lag)
  for (const reg of OPEN_WORLD_REGIONS) {
    if (reg.id === 'city' || !reg.mobPool || reg.mobPool.length === 0) continue

    const hash = hashStr(reg.id)
    // 1 to 2 clusters per biome max
    const clusterCount = reg.radius > 18 ? 2 : 1

    for (let c = 0; c < clusterCount; c++) {
      const angle = (c * Math.PI) + (hash % 10) * 0.3
      const clusterDist = Math.max(4, reg.radius * 0.45)

      const ccx = Math.round(reg.centerX + Math.cos(angle) * clusterDist)
      const ccy = Math.round(reg.centerY + Math.sin(angle) * clusterDist)

      // Pack size per cluster (1 to 2 mobs max)
      const packSize = 1 + ((hash + c) % 2)

      for (let p = 0; p < packSize; p++) {
        const mobAng = (p / packSize) * Math.PI * 2 + ((hash + p) % 5) * 0.5
        const offset = 2 + p * 2
        const mx = Math.round(ccx + Math.cos(mobAng) * offset)
        const my = Math.round(ccy + Math.sin(mobAng) * offset)

        if (mx > 2 && my > 2 && mx < W - 3 && my < H - 3) {
          if (tiles[my] && tiles[my][mx] && tiles[my][mx].walkable) {
            const mobType = reg.mobPool[(c + p) % reg.mobPool.length]

            // Nível fixo definido pelo bioma daquela posição
            const tileLvl = getBiomeFixedLevel(mx, my, c * 7 + p)

            let tier: EliteTier = 'normal'
            if (c === 0 && p === 0 && reg.minLevel >= 20 && (hash % 4 === 0)) {
              tier = 'boss'
            } else if ((hash + c + p) % 7 === 0) {
              tier = 'champion'
            } else if ((hash + c + p) % 4 === 0) {
              tier = 'elite'
            }

            const mobLvl = Math.max(1, tileLvl + (tier === 'boss' ? 8 : tier === 'champion' ? 3 : 0))

            const monster = createMonster(
              mobType,
              mobLvl,
              mx * 32,
              my * 32,
              tier
            )
            monsters.push(monster)
          }
        }
      }
    }
  }

  // B) Open Wilderness Roaming Encounters (Step 28 for clean, performant density)
  const step = 28
  for (let wy = 16; wy < H - 16; wy += step) {
    for (let wx = 16; wx < W - 16; wx += step) {
      const distFromCity = Math.hypot(wx - CENTER, wy - CENTER)
      if (distFromCity <= 32) continue // Safe Capital Real zone

      // 30% chance per 28x28 sector to spawn a roaming mob
      if ((hashStr(`spawn_${wx}_${wy}`) % 100) > 30) continue

      // Jitter position
      const jx = wx + ((hashStr(`w_${wx}_${wy}`) % 11) - 5)
      const jy = wy + ((hashStr(`w_${wy}_${wx}`) % 11) - 5)

      if (jx > 2 && jy > 2 && jx < W - 3 && jy < H - 3) {
        if (tiles[jy] && tiles[jy][jx] && tiles[jy][jx].walkable) {
          let wildMob: MonsterType = 'slime'
          const wildLvl = getBiomeFixedLevel(jx, jy)

          if (wildLvl <= 5) {
            const types: MonsterType[] = ['slime', 'goblin', 'wolf']
            wildMob = types[hashStr(`${jx}_${jy}`) % types.length]
          } else if (wildLvl <= 22) {
            const types: MonsterType[] = ['orc', 'skeleton', 'spider', 'zombie']
            wildMob = types[hashStr(`${jx}_${jy}`) % types.length]
          } else if (wildLvl <= 52) {
            const types: MonsterType[] = ['troll', 'witch', 'knight_enemy', 'archer_enemy', 'mage_enemy', 'ghost']
            wildMob = types[hashStr(`${jx}_${jy}`) % types.length]
          } else if (wildLvl <= 95) {
            const types: MonsterType[] = ['demon', 'vampire', 'treant', 'mummy', 'cryomancer', 'pyromancer']
            wildMob = types[hashStr(`${jx}_${jy}`) % types.length]
          } else {
            const types: MonsterType[] = ['dragon', 'valkyrie', 'void_stalker', 'soul_eater', 'lava_golem', 'frost_wyrm']
            wildMob = types[hashStr(`${jx}_${jy}`) % types.length]
          }

          const hVal = hashStr(`e_${jx}_${jy}`)
          const isBoss = (hVal % 50) === 0 && wildLvl >= 36
          const isChamp = !isBoss && (hVal % 16) === 0
          const isElite = !isBoss && !isChamp && (hVal % 7) === 0
          const tier: EliteTier = isBoss ? 'boss' : isChamp ? 'champion' : isElite ? 'elite' : 'normal'

          const monster = createMonster(
            wildMob,
            wildLvl,
            jx * 32,
            jy * 32,
            tier
          )
          monsters.push(monster)
        }
      }
    }
  }

  cachedUnifiedWorldMap = {
    id: 'unified_world',
    name: 'Mundo Aberto de Rucoy — Capital & 150 Biomas',
    width: W,
    height: H,
    tiles,
    monsters,
    ambience: 'grassland',
    musicTheme: 'city',
    npcs: [
      { id: 'npc_merchant', name: 'Mercador Real', x: (CENTER + 3) * 32, y: (CENTER + 3) * 32, shopItems: [] },
      { id: 'npc_guide', name: 'Mestre Explorador', x: (CENTER - 3) * 32, y: (CENTER - 3) * 32, shopItems: [] },
      { id: 'npc_blacksmith', name: 'Ferreiro Aldric', x: (CENTER - 19) * 32, y: (CENTER - 7) * 32, shopItems: [] },
      { id: 'npc_banker', name: 'Banqueiro Real', x: (CENTER + 19) * 32, y: (CENTER - 7) * 32, shopItems: [] },
      { id: 'npc_alchemist', name: 'Alquimista Vera', x: (CENTER - 19) * 32, y: (CENTER + 10) * 32, shopItems: [] },
      { id: 'npc_guildmaster', name: 'Mestre da Guilda', x: (CENTER + 19) * 32, y: (CENTER + 10) * 32, shopItems: [] },
      { id: 'npc_trainer', name: 'Instrutor de Combate', x: (CENTER + 11) * 32, y: (CENTER - 14) * 32, shopItems: [] },
      { id: 'npc_stablemaster', name: 'Tratador de Montarias', x: (CENTER - 8) * 32, y: (CENTER + 19) * 32, shopItems: [] }
    ],
    spawns: [{ x: CENTER * 32, y: CENTER * 32 }],
    spawnPoints: [{ x: CENTER * 32, y: CENTER * 32 }],
    playerSpawn: { x: CENTER * 32, y: CENTER * 32 }
  } as GameMap

  return cachedUnifiedWorldMap
}

export function getBiomeSpawnPosition(biomeId: string): { x: number; y: number } {
  const reg = OPEN_WORLD_REGIONS.find(r => r.id === biomeId)
  if (reg) {
    return { x: reg.centerX * 32, y: reg.centerY * 32 }
  }
  return { x: CENTER * 32, y: CENTER * 32 }
}

let worldTextureCacheCanvas: HTMLCanvasElement | null = null

export function getOrCreateWorldMapTexture(): HTMLCanvasElement {
  if (worldTextureCacheCanvas) return worldTextureCacheCanvas

  const worldMap = generateUnifiedWorld()
  const canvas = document.createElement('canvas')
  canvas.width = worldMap.width // 480
  canvas.height = worldMap.height // 480
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const imgData = ctx.createImageData(worldMap.width, worldMap.height)
  const data = imgData.data

  const TILE_COLORS: Record<string, [number, number, number]> = {
    // Ocean & Waters
    deepwater: [2, 18, 38],
    water: [2, 132, 199],
    dark_water: [4, 120, 87],

    // Beaches & Coastlines
    sand: [234, 179, 8],

    // Meadows, Gardens & Grasslands
    grass: [34, 197, 94],
    garden: [22, 163, 74],
    forest_floor: [21, 128, 61],

    // Forest Canopies & Trees
    tree: [11, 101, 50],
    pine_tree: [6, 78, 38],
    frozen_tree: [125, 211, 252],

    // Capital Real & Roads
    cobblestone: [253, 224, 71],
    stone_path: [234, 179, 8],
    dirt_path: [217, 119, 6],
    path: [217, 119, 6],
    fountain: [59, 130, 246],
    lamp_post: [251, 191, 36],
    market_stall: [236, 72, 153],
    stairs_down: [15, 23, 42],
    portal: [168, 85, 247],

    // Mountains & Rocks
    rock: [100, 116, 139],
    mountain_rock: [71, 85, 105],
    volcanic_rock: [69, 10, 10],
    ice_rock: [56, 189, 248],

    // Snow & Ice Tundras
    snow: [248, 250, 252],
    snowy_peak: [255, 255, 255],
    ice: [56, 189, 248],
    ice_crystal_node: [186, 230, 253],

    // Volcanic & Magma Lands
    magma_crust: [220, 38, 38],
    obsidian: [127, 29, 29],
    lava: [239, 68, 68],
    volcanic_vent: [249, 115, 22],

    // Crystal & Abyssal Caverns
    crystal_floor: [192, 132, 252],
    crystal_wall: [168, 85, 247],
    abyss_floor: [88, 28, 135],
    abyss_wall: [59, 7, 100],
    void: [9, 9, 11],

    // Ancient Ruins & Deserts
    ancient_tile: [251, 146, 60],
    broken_tile: [217, 119, 6],
    ruin_wall: [194, 65, 12],
    ruin_pillar: [249, 115, 22],

    // Sky & Clouds
    sky_void: [56, 189, 248],
    sky_platform: [186, 230, 253],
    cloud_floor: [240, 249, 255],

    // General Structures
    wall: [148, 163, 184],
    house_wall: [202, 138, 4],
    house_roof: [180, 83, 9],
  }

  const defaultColor: [number, number, number] = [34, 197, 94]

  let idx = 0
  for (let y = 0; y < worldMap.height; y++) {
    const row = worldMap.tiles[y]
    for (let x = 0; x < worldMap.width; x++) {
      const tile = row ? row[x] : null
      const type = tile ? tile.type : 'deepwater'
      const rgb = TILE_COLORS[type] || defaultColor

      data[idx] = rgb[0]
      data[idx + 1] = rgb[1]
      data[idx + 2] = rgb[2]
      data[idx + 3] = 255
      idx += 4
    }
  }

  ctx.putImageData(imgData, 0, 0)
  worldTextureCacheCanvas = canvas
  return canvas
}
