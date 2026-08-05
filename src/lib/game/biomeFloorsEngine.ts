import type { GameMap } from './types'
import { generate100BiomeMap, ensureMapAccessibility } from './new100Biomes'

export function generateBiomeFloorMap(biomeBaseId: string, floorLevel: number): GameMap {
  const map = generate100BiomeMap(biomeBaseId, floorLevel)
  return ensureMapAccessibility(map)
}

/**
 * BIOMAS PROFUNDOS — os 10 novos biomas do mundo unificado.
 * Cada um tem 5 andares (`deep_<id>_1` .. `deep_<id>_5`), acessíveis pelas
 * escadarias espalhadas na região do bioma no mundo aberto.
 */
export const DEEP_FLOORS_PER_BIOME = 5

export interface DeepBiomeSpec {
  id: string
  name: string
  baseBiome: string   // bioma-modelo de `new100Biomes` usado como gerador
  minLevel: number
}

export const DEEP_BIOMES: DeepBiomeSpec[] = [
  { id: 'meadowlands',    name: 'Prados Floridos',    baseBiome: 'b2_mushroom_glade',     minLevel: 6 },
  { id: 'orchardvale',    name: 'Vale dos Pomares',   baseBiome: 'b5_emerald_canopy',     minLevel: 17 },
  { id: 'bamboogrove',    name: 'Bosque de Bambu',    baseBiome: 'b9_ironwood_thicket',   minLevel: 32 },
  { id: 'sporecaves',     name: 'Grutas de Esporos',  baseBiome: 'b8_shadowed_vales',     minLevel: 74 },
  { id: 'oasisbasin',     name: 'Bacia do Oásis',     baseBiome: 'b13_oasis_haven',       minLevel: 101 },
  { id: 'claylands',      name: 'Terras de Argila',   baseBiome: 'b18_red_rock_gorge',    minLevel: 132 },
  { id: 'templeruins',    name: 'Ruínas do Templo',   baseBiome: 'b17_sunken_sand_temple', minLevel: 186 },
  { id: 'glacierrift',    name: 'Fenda Glacial',      baseBiome: 'b31_frostbite_pass',    minLevel: 296 },
  { id: 'astralfields',   name: 'Campos Astrais',     baseBiome: 'b61_void_abyss',        minLevel: 374 },
  { id: 'obsidianwastes', name: 'Ermos de Obsidiana', baseBiome: 'b22_magma_crater',      minLevel: 461 },
]

export const DEEP_BIOME_IDS = DEEP_BIOMES.map(b => b.id)

export function getDeepBiome(id: string) {
  return DEEP_BIOMES.find(b => b.id === id) ?? null
}

/** `deep_<biome>_<floor>` → mapa do andar (1..5). */
export function generateDeepBiomeMap(mapId: string): GameMap | null {
  const match = mapId.match(/^deep_([a-z]+)_(\d+)$/)
  if (!match) return null
  const spec = getDeepBiome(match[1])
  if (!spec) return null
  const floor = Math.min(DEEP_FLOORS_PER_BIOME, Math.max(1, parseInt(match[2], 10) || 1))
  const map = generateBiomeFloorMap(spec.baseBiome, floor)
  map.id = mapId
  map.name = `${spec.name} — Andar ${floor}/${DEEP_FLOORS_PER_BIOME}`
  return map
}
