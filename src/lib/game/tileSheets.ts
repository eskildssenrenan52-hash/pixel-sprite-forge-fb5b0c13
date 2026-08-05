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
import meadowSheet from '@/assets/tiles/tiles_meadow.png.asset.json'
import dunesSheet from '@/assets/tiles/tiles_dunes.png.asset.json'
import glacierSheet from '@/assets/tiles/tiles_glacier.png.asset.json'
import mireSheet from '@/assets/tiles/tiles_mire.png.asset.json'
import infernalSheet from '@/assets/tiles/tiles_infernal.png.asset.json'
import astralSheet from '@/assets/tiles/tiles_astral.png.asset.json'
import ruinworksSheet from '@/assets/tiles/tiles_ruinworks.png.asset.json'

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
  m: meadowSheet.url,
  d: dunesSheet.url,
  i: glacierSheet.url,
  r: mireSheet.url,
  n: infernalSheet.url,
  x: astralSheet.url,
  u: ruinworksSheet.url,
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

  // ══ 112 novos tiles de IA ══
  // meadow
  spring_grass:     [['m', 0], ['m', 12], ['m', 13]],
  wildflower_field: [['m', 1], ['m', 13]],
  wheat_field:      [['m', 2], ['m', 10]],
  mossy_forest_floor:[['m', 3], ['m', 5]],
  leaf_litter:      [['m', 4], ['m', 3]],
  pine_floor:       [['m', 5], ['m', 4]],
  bamboo_floor:     [['m', 6], ['m', 11]],
  rice_paddy:       [['m', 7]],
  hedge:            [['m', 8], ['m', 9]],
  hedge_maze:       [['m', 9], ['m', 8]],
  orchard:          [['m', 10], ['m', 11]],
  vineyard:         [['m', 11], ['m', 10]],
  wet_grass:        [['m', 12], ['m', 0]],
  clover_patch:     [['m', 13], ['m', 1]],
  bramble:          [['m', 14]],
  jungle_mud:       [['m', 15], ['r', 15]],
  // dunes
  cracked_clay:     [['d', 0], ['d', 10]],
  sandstone:        [['d', 1], ['d', 12]],
  dune_ripple:      [['d', 2], ['d', 11]],
  oasis_sand:       [['d', 3], ['d', 2]],
  savanna_grass:    [['d', 4], ['d', 10]],
  canyon_rock:      [['d', 5], ['d', 12]],
  terracotta:       [['d', 6], ['d', 13]],
  adobe_tile:       [['d', 7], ['d', 6]],
  salt_crust:       [['d', 8]],
  riverbed_pebbles: [['d', 9], ['d', 15]],
  tumbleweed_dirt:  [['d', 10], ['d', 4]],
  bleached_sand:    [['d', 11], ['d', 2]],
  mesa_rock:        [['d', 12], ['d', 5]],
  sandstone_brick:  [['d', 13], ['d', 1]],
  desert_road:      [['d', 14], ['d', 9]],
  sandy_gravel:     [['d', 15], ['d', 9]],
  // glacier
  deep_snow:        [['i', 0], ['i', 8]],
  snow_trail:       [['i', 1], ['i', 12]],
  glacier_ice:      [['i', 2], ['i', 3]],
  cracked_ice:      [['i', 3], ['i', 2]],
  frozen_lake:      [['i', 4], ['i', 3]],
  tundra_moss:      [['i', 5], ['i', 10]],
  frost_stone:      [['i', 6], ['i', 14]],
  icy_gravel:       [['i', 7], ['i', 15]],
  powder_snow:      [['i', 8], ['i', 0]],
  aurora_snow:      [['i', 9], ['i', 0]],
  frozen_mud:       [['i', 10], ['i', 5]],
  hail_ice:         [['i', 11], ['i', 7]],
  snowy_cobble:     [['i', 12], ['i', 1]],
  ice_brick:        [['i', 13], ['i', 2]],
  rime_rock:        [['i', 14], ['i', 6]],
  slush:            [['i', 15], ['i', 10]],
  // mire
  swamp_water:      [['r', 0], ['r', 13]],
  bog_peat:         [['r', 1], ['r', 15]],
  lilypad_water:    [['r', 2], ['r', 0]],
  rotting_log:      [['r', 3], ['r', 6]],
  marsh_reeds:      [['r', 4], ['r', 0]],
  poison_sludge:    [['r', 5], ['r', 13]],
  mangrove_roots:   [['r', 6], ['r', 3]],
  damp_moss:        [['r', 7], ['r', 1]],
  spore_floor:      [['r', 8], ['r', 9]],
  mushroom_cap:     [['r', 9], ['r', 8]],
  web_floor:        [['r', 10], ['r', 11]],
  dark_canopy_floor:[['r', 11], ['r', 7]],
  quicksand:        [['r', 12], ['r', 15]],
  algae_pond:       [['r', 13], ['r', 5]],
  tar_pool:         [['r', 14], ['r', 1]],
  wet_clay:         [['r', 15], ['r', 12]],
  // infernal
  black_ash:        [['n', 0], ['n', 7]],
  magma_cracks:     [['n', 1], ['n', 11]],
  basalt_columns:   [['n', 2], ['n', 15]],
  obsidian_glass:   [['n', 3], ['n', 2]],
  ember_field:      [['n', 4], ['n', 9]],
  lava_flow:        [['n', 5], ['n', 1]],
  sulfur_crust:     [['n', 6], ['n', 12]],
  charcoal_ground:  [['n', 7], ['n', 0]],
  pumice:           [['n', 8], ['n', 15]],
  cinder_rock:      [['n', 9], ['n', 4]],
  slag_heap:        [['n', 10], ['n', 9]],
  lava_plate:       [['n', 11], ['n', 1]],
  brimstone:        [['n', 12], ['n', 6]],
  steam_vent:       [['n', 13], ['n', 8]],
  hot_iron_plate:   [['n', 14], ['n', 10]],
  soot_stone:       [['n', 15], ['n', 2]],
  // astral
  blue_crystal_floor:[['x', 0], ['x', 13]],
  amethyst_shard:   [['x', 1], ['x', 13]],
  emerald_crystal:  [['x', 2], ['x', 0]],
  rose_quartz:      [['x', 3], ['x', 1]],
  rune_circle:      [['x', 4], ['x', 11]],
  starfield_void:   [['x', 5], ['x', 6]],
  nebula_void:      [['x', 6], ['x', 5]],
  abyss_pit:        [['x', 7], ['x', 12]],
  soulfire_ground:  [['x', 8], ['x', 12]],
  celestial_cloud:  [['x', 9], ['x', 15]],
  holy_tile:        [['x', 10], ['x', 15]],
  leyline_floor:    [['x', 11], ['x', 4]],
  shadow_mist:      [['x', 12], ['x', 7]],
  geode_floor:      [['x', 13], ['x', 0]],
  meteor_rock:      [['x', 14], ['x', 7]],
  sky_stone:        [['x', 15], ['x', 9]],
  // ruinworks
  dungeon_flagstone:[['u', 0], ['u', 1]],
  catacomb_crack:   [['u', 1], ['u', 14]],
  bone_floor:       [['u', 2], ['u', 1]],
  temple_mosaic:    [['u', 3], ['u', 4]],
  marble_palace:    [['u', 4], ['u', 3]],
  wood_plank:       [['u', 5]],
  iron_grate:       [['u', 6], ['u', 7]],
  rusty_plate:      [['u', 7], ['u', 6]],
  brick_road:       [['u', 8], ['u', 9]],
  plaza_cobble:     [['u', 9], ['u', 8]],
  rune_slab:        [['u', 10], ['u', 15]],
  mine_rail:        [['u', 11], ['u', 14]],
  gold_vein_rock:   [['u', 12], ['u', 13]],
  iron_vein_rock:   [['u', 13], ['u', 12]],
  rubble:           [['u', 14], ['u', 1]],
  mossy_brick:      [['u', 15], ['u', 9]],
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
