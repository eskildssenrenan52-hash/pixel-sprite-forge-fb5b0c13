/**
 * Tilesets de pixel art gerados por IA.
 * Grid FIXO: 4 colunas x 4 linhas, célula de 256px (imagem 1024x1024).
 * NUNCA alterar TS_COLS/TS_ROWS/TS_CELL — o alinhamento depende disso.
 */
import groundSheet from '@/assets/tiles/tiles_ground.png.asset.json'
import aridSheet from '@/assets/tiles/tiles_arid.png.asset.json'
import liquidSheet from '@/assets/tiles/tiles_liquid.png.asset.json'
import objectSheet from '@/assets/tiles/tiles_objects.png.asset.json'

export const TS_COLS = 4
export const TS_ROWS = 4
export const TS_CELL = 256

const SHEETS = {
  g: groundSheet.url,
  a: aridSheet.url,
  l: liquidSheet.url,
  o: objectSheet.url,
} as const

type SheetKey = keyof typeof SHEETS
type Variant = [SheetKey, number]

/**
 * Variações por tipo de tile. Cada tile do mundo escolhe uma variação de forma
 * determinística (hash da posição), então o mapa fica variado sem "piscar".
 */
const TILE_VARIANTS: Record<string, Variant[]> = {
  // ── Vegetação / chão orgânico ──
  grass:        [['g', 0], ['g', 1], ['g', 3], ['g', 7], ['g', 0]],
  tall_grass:   [['g', 4], ['g', 3], ['g', 4]],
  flower:       [['g', 5], ['g', 6], ['g', 7]],
  garden:       [['g', 5], ['g', 7]],
  frost_grass:  [['a', 6]],
  dirt:         [['g', 8], ['g', 9], ['g', 11], ['g', 15]],
  mud:          [['g', 9]],
  road:         [['g', 12], ['g', 11]],
  snow_path:    [['a', 5]],
  cobblestone:  [['g', 13], ['g', 14], ['g', 13]],
  broken_tile:  [['g', 11], ['g', 10]],

  // ── Áridos / frios / vulcânicos ──
  sand:         [['a', 0], ['a', 1], ['a', 2], ['a', 0]],
  salt_flat:    [['a', 3], ['a', 3], ['a', 0]],
  snow:         [['a', 4], ['a', 5], ['a', 4]],
  snowy_peak:   [['a', 4]],
  ice:          [['a', 7]],
  stone:        [['a', 8], ['a', 9], ['a', 11]],
  floor:        [['a', 8]],
  mossy_stone:  [['a', 10], ['a', 9]],
  ash:          [['a', 12], ['a', 15]],
  obsidian:     [['a', 13]],
  magma_crust:  [['a', 14], ['a', 12]],
  scorched:     [['a', 15]],

  // ── Líquidos / exóticos ──
  water:        [['l', 0], ['l', 1]],
  deepwater:    [['l', 2]],
  dark_water:   [['l', 3], ['l', 4]],
  tar_pit:      [['l', 4]],
  lava:         [['l', 5], ['l', 6]],
  slime_pool:   [['l', 7]],
  crystal_floor:[['l', 8], ['l', 9]],
  ancient_tile: [['l', 10], ['l', 11]],
  ruin_floor:   [['l', 11], ['l', 10]],
  dungeon_floor:[['l', 12]],
  abyss_floor:  [['l', 13]],
  void:         [['l', 13]],
  bone_field:   [['l', 14]],
  mushroom_moss:[['l', 15]],

  // ── Objetos ──
  tree:         [['o', 0], ['o', 1], ['o', 0], ['o', 5]],
  ancient_bark: [['o', 1], ['o', 2]],
  pine_tree:    [['o', 3], ['o', 5]],
  frozen_tree:  [['o', 4], ['o', 3]],
  rock:         [['o', 6], ['o', 7], ['o', 6]],
  mountain_rock:[['o', 6], ['o', 8]],
  snow_rock:    [['o', 8]],
  ice_rock:     [['o', 8], ['o', 11]],
  volcanic_rock:[['o', 9]],
  crystal:      [['o', 10]],
  dark_crystal: [['o', 10]],
  ice_crystal_node: [['o', 11]],
  mushroom:     [['o', 12]],
  bush:         [['o', 13]],
  cactus:       [['o', 14]],
  ruin_pillar:  [['o', 15]],
}

const imageCache = new Map<string, HTMLImageElement>()

function loadSheet(url: string): HTMLImageElement | null {
  if (typeof Image === 'undefined') return null
  let img = imageCache.get(url)
  if (!img) {
    img = new Image()
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
