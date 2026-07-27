import type { GameMap } from './types'
import { generate100BiomeMap, ensureMapAccessibility } from './new100Biomes'

export function generateBiomeFloorMap(biomeBaseId: string, floorLevel: number): GameMap {
  const map = generate100BiomeMap(biomeBaseId, floorLevel)
  return ensureMapAccessibility(map)
}
