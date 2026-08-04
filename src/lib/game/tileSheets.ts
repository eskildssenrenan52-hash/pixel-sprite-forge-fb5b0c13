/**
 * Tilesets de pixel art gerados por IA.
 * Grid FIXO: 4 colunas x 4 linhas, célula de 256px (imagem 1024x1024).
 * NUNCA alterar TS_COLS/TS_ROWS/TS_CELL — o alinhamento depende disso.
 */
import groundSheet from '@/assets/tiles/tiles_ground.png.asset.json'
import aridSheet from '@/assets/tiles/tiles_arid.png.asset.json'
import liquidSheet from '@/assets/tiles/tiles_liquid.png.asset.json'
import objectSheet from '@/assets/tiles/tiles_objects.png.asset.json'
import verdantSheet from '@/assets/tiles/tiles_verdant.png.asset.json'
import stoneworkSheet from '@/assets/tiles/tiles_stonework.png.asset.json'
import arcaneSheet from '@/assets/tiles/tiles_arcane.png.asset.json'
import floraSheet from '@/assets/tiles/tiles_flora.png.asset.json'

export const TS_COLS = 4
export const TS_ROWS = 4
export const TS_CELL = 256

const SHEETS = {
  g: groundSheet.url,
  a: aridSheet.url,
  l: liquidSheet.url,
  o: objectSheet.url,
  v: verdantSheet.url,
  s: stoneworkSheet.url,
  c: arcaneSheet.url,
  f: floraSheet.url,
} as const

type SheetKey = keyof typeof SHEETS
type Variant = [SheetKey, number]

/**
 * Variações por tipo de tile. Cada tile do mundo escolhe uma variação de forma
 * determinística (hash da posição), então o mapa fica variado sem "piscar".
 */
const TILE_VARIANTS: Record<string, Variant[]> = {
  // ── Vegetação / chão orgânico ──
  grass:        [['v', 0], ['g', 0], ['v', 3], ['g', 1], ['v', 0], ['g', 3]],
  tall_grass:   [['v', 1], ['g', 4], ['v', 4], ['g', 3]],
  fern_grass:   [['v', 1], ['v', 4]],
  autumn_grass: [['v', 2], ['v', 0]],
  clover:       [['v', 3], ['v', 0]],
  dry_grass:    [['v', 14], ['a', 1]],
  jungle_floor: [['v', 4], ['v', 5], ['v', 6]],
  vine_floor:   [['v', 5], ['v', 4]],
  reed_marsh:   [['v', 7], ['v', 8]],
  peat:         [['v', 9], ['v', 8]],
  farmland:     [['v', 15], ['v', 9]],
  flower:       [['v', 12], ['v', 13], ['g', 5], ['g', 6]],
  garden:       [['v', 12], ['v', 13]],
  frost_grass:  [['a', 6]],
  dirt:         [['v', 11], ['g', 8], ['g', 9], ['v', 9], ['g', 15]],
  mud:          [['v', 8], ['g', 9]],
  road:         [['v', 11], ['g', 12], ['g', 11]],
  snow_path:    [['a', 5]],
  cobblestone:  [['s', 4], ['g', 13], ['s', 5], ['g', 14]],
  limestone:    [['s', 3], ['s', 6]],
  marble:       [['s', 6], ['s', 3]],
  mosaic:       [['s', 7], ['s', 6]],
  broken_tile:  [['s', 7], ['g', 11], ['s', 3]],
  gravel:       [['s', 1], ['s', 12]],
  red_rock:     [['s', 2], ['s', 1]],
  slate:        [['s', 12], ['s', 1]],
  basalt:       [['s', 13], ['s', 12]],
  sulfur:       [['s', 14], ['a', 12]],
  toxic_sludge: [['s', 15], ['l', 7]],
  catacomb_floor: [['s', 9], ['s', 8]],
  bone_gravel:  [['s', 10], ['s', 9]],

  // ── Áridos / frios / vulcânicos ──
  sand:         [['a', 0], ['a', 1], ['s', 0], ['a', 2], ['a', 0]],
  salt_flat:    [['c', 15], ['a', 3], ['c', 15], ['a', 0]],
  snow:         [['a', 4], ['a', 5], ['a', 4]],
  snowy_peak:   [['a', 4]],
  ice:          [['a', 7], ['c', 3]],
  aurora_ice:   [['c', 3], ['a', 7]],
  stone:        [['s', 12], ['a', 8], ['a', 9], ['s', 1], ['a', 11]],
  floor:        [['s', 5], ['a', 8]],
  mossy_stone:  [['v', 10], ['a', 10], ['a', 9]],
  ash:          [['c', 9], ['a', 12], ['a', 15]],
  obsidian:     [['c', 6], ['a', 13]],
  magma_crust:  [['c', 7], ['c', 11], ['a', 14]],
  ember_rock:   [['c', 11], ['c', 7]],
  scorched:     [['c', 10], ['a', 15]],

  // ── Líquidos / exóticos ──
  water:        [['l', 0], ['l', 1]],
  deepwater:    [['l', 2]],
  dark_water:   [['l', 3], ['l', 4]],
  tar_pit:      [['c', 14], ['l', 4]],
  lava:         [['c', 8], ['l', 5], ['l', 6]],
  slime_pool:   [['c', 13], ['l', 7]],
  crystal_floor:[['c', 0], ['l', 8], ['c', 2], ['l', 9]],
  amethyst_floor:[['c', 1], ['c', 0]],
  emerald_floor:[['c', 2], ['c', 0]],
  ancient_tile: [['s', 7], ['l', 10], ['l', 11]],
  ruin_floor:   [['s', 3], ['l', 11], ['s', 7]],
  dungeon_floor:[['s', 8], ['l', 12]],
  abyss_floor:  [['c', 4], ['l', 13]],
  void:         [['c', 5], ['c', 4]],
  void_nebula:  [['c', 4], ['c', 5]],
  starfield:    [['c', 5]],
  bone_field:   [['s', 11], ['l', 14], ['s', 9]],
  mushroom_moss:[['c', 12], ['l', 15]],

  // ── Objetos ──
  tree:         [['f', 0], ['o', 0], ['f', 0], ['o', 1], ['f', 5]],
  sakura_tree:  [['f', 5], ['f', 0]],
  dead_tree:    [['f', 1], ['o', 1]],
  palm_tree:    [['f', 2], ['o', 14]],
  jungle_tree:  [['f', 3], ['f', 0]],
  ancient_bark: [['f', 1], ['o', 1], ['o', 2]],
  pine_tree:    [['f', 4], ['o', 3], ['o', 5]],
  frozen_tree:  [['f', 4], ['o', 4]],
  rock:         [['f', 6], ['o', 6], ['f', 7], ['o', 7]],
  mountain_rock:[['f', 6], ['o', 8], ['o', 6]],
  snow_rock:    [['f', 8], ['o', 8]],
  ice_rock:     [['f', 8], ['o', 11]],
  volcanic_rock:[['f', 10], ['o', 9]],
  crystal:      [['f', 9], ['o', 10]],
  dark_crystal: [['f', 10], ['o', 10]],
  ice_crystal_node: [['f', 9], ['o', 11]],
  mushroom:     [['f', 11], ['o', 12]],
  bush:         [['f', 12], ['o', 13]],
  cactus:       [['f', 13], ['o', 14]],
  ruin_pillar:  [['f', 14], ['o', 15]],
  gravestone:   [['f', 15], ['o', 15]],
}

const imageCache = new Map<string, HTMLImageElement>()
let sheetsVersion = 0

/** Muda sempre que uma folha termina de carregar (para invalidar chunks). */
export function getTileSheetsVersion() {
  return sheetsVersion
}

function loadSheet(url: string): HTMLImageElement | null {
  if (typeof Image === 'undefined') return null
  let img = imageCache.get(url)
  if (!img) {
    img = new Image()
    img.onload = () => { sheetsVersion++ }
    img.src = url
    imageCache.set(url, img)
  }
  return img
}

/** Pré-carrega todas as folhas (chamar cedo, ex.: no loader do jogo). */
export function preloadTileSheets() {
  for (const url of Object.values(SHEETS)) loadSheet(url)
}

function hash2(x: number, y: number, s = 0) {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) >>> 0
  h = (h ^ (h >>> 13)) >>> 0
  h = (h * 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

export function hasTileSprite(type: string) {
  return !!TILE_VARIANTS[type]
}

/**
 * Desenha o tile a partir do tileset de IA.
 * Retorna false quando não existe sprite ou a imagem ainda não carregou —
 * nesse caso o renderizador procedural antigo assume.
 */
export function drawTileSprite(
  ctx: CanvasRenderingContext2D,
  type: string,
  tileX: number,
  tileY: number,
  size: number,
): boolean {
  const variants = TILE_VARIANTS[type]
  if (!variants) return false
  const pick = variants[Math.floor(hash2(tileX, tileY, 1337) * variants.length) % variants.length]
  const img = loadSheet(SHEETS[pick[0]])
  if (!img || !img.complete || img.naturalWidth === 0) return false
  const sx = (pick[1] % TS_COLS) * TS_CELL
  const sy = Math.floor(pick[1] / TS_COLS) * TS_CELL
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(img, sx + 1, sy + 1, TS_CELL - 2, TS_CELL - 2, 0, 0, size, size)
  // leve variação de brilho por tile para quebrar a repetição
  const v = hash2(tileX, tileY, 77)
  if (v > 0.62) {
    ctx.fillStyle = `rgba(255,246,220,${(v - 0.62) * 0.22})`
    ctx.fillRect(0, 0, size, size)
  } else if (v < 0.34) {
    ctx.fillStyle = `rgba(8,12,24,${(0.34 - v) * 0.24})`
    ctx.fillRect(0, 0, size, size)
  }
  return true
}
