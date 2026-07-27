import type { GameMap, Tile, TileType, Monster, MonsterType, EliteTier } from './types'
import { makeTile } from './data'
import { createMonster } from './monsterFactory'

export interface BiomeDefinition {
  id: string
  name: string
  minLevel: number
  category: 'forest' | 'desert' | 'volcano' | 'tundra' | 'swamp' | 'crystal' | 'abyss' | 'ruins' | 'sky' | 'ocean' | 'jungle' | 'underdark' | 'shadow' | 'celestial'
  primaryTile: TileType
  accentTile: TileType
  wallTile: TileType
  decoratorTile?: TileType
  portalTile: TileType
  weather: 'none' | 'rain' | 'storm' | 'snow' | 'fog' | 'sandstorm' | 'ash_fall' | 'aurora'
  ambience: string
  musicTheme: string
  mobPool: MonsterType[]
  bossType: MonsterType
}

// ════════════════════════════════════════════════════════════════════════════
// 100 UNIQUE BIOMES REGISTRY (With periodic repeating Forest, Desert & Lava)
// ════════════════════════════════════════════════════════════════════════════
export const ALL_100_BIOMES: BiomeDefinition[] = [
  // ── 1-10: FORESTS & WOODLANDS (Repeating Cycle I) ──
  { id: 'b1_whispering_woods', name: 'Bosque dos Sussurros I', minLevel: 1, category: 'forest', primaryTile: 'grass', accentTile: 'tall_grass', wallTile: 'tree', decoratorTile: 'flower', portalTile: 'forest_portal', weather: 'rain', ambience: 'forest', musicTheme: 'town', mobPool: ['slime', 'goblin', 'wolf'], bossType: 'goblin' },
  { id: 'b2_mushroom_glade', name: 'Clareira dos Cogumelos', minLevel: 3, category: 'forest', primaryTile: 'grass', accentTile: 'dirt', wallTile: 'tree', decoratorTile: 'mushroom', portalTile: 'forest_portal', weather: 'none', ambience: 'forest', musicTheme: 'forest', mobPool: ['slime', 'spider'], bossType: 'spider' },
  { id: 'b3_wild_wolf_thicket', name: 'Mata dos Lobos Selvagens', minLevel: 5, category: 'forest', primaryTile: 'grass', accentTile: 'dark_water', wallTile: 'pine_tree', decoratorTile: 'root', portalTile: 'forest_portal', weather: 'fog', ambience: 'forest', musicTheme: 'forest', mobPool: ['wolf', 'goblin'], bossType: 'wolf' },
  { id: 'b4_ancient_bark_forest', name: 'Floresta de Casca Ancestral II', minLevel: 8, category: 'forest', primaryTile: 'ancient_bark', accentTile: 'mossy_stone', wallTile: 'tree', decoratorTile: 'canopy', portalTile: 'forest_portal', weather: 'storm', ambience: 'forest', musicTheme: 'forest', mobPool: ['treant', 'witch'], bossType: 'treant' },
  { id: 'b5_emerald_canopy', name: 'Dosseis de Esmeralda III', minLevel: 12, category: 'forest', primaryTile: 'grass', accentTile: 'mossy_stone', wallTile: 'tree', decoratorTile: 'flower', portalTile: 'forest_portal', weather: 'rain', ambience: 'forest', musicTheme: 'forest', mobPool: ['treant', 'spider', 'wolf'], bossType: 'treant' },
  { id: 'b6_birch_grove', name: 'Bosque de Bétulas Prateadas', minLevel: 15, category: 'forest', primaryTile: 'grass', accentTile: 'dirt', wallTile: 'tree', decoratorTile: 'flower', portalTile: 'forest_portal', weather: 'none', ambience: 'forest', musicTheme: 'forest', mobPool: ['goblin', 'orc'], bossType: 'orc' },
  { id: 'b7_fairy_circle_woods', name: 'Anel das Fadas Iluminado', minLevel: 18, category: 'forest', primaryTile: 'frost_grass', accentTile: 'grass', wallTile: 'pine_tree', decoratorTile: 'mushroom', portalTile: 'forest_portal', weather: 'aurora', ambience: 'forest', musicTheme: 'forest', mobPool: ['witch', 'ghost'], bossType: 'witch' },
  { id: 'b8_shadowed_vales', name: 'Vale das Sombras Florestais IV', minLevel: 22, category: 'forest', primaryTile: 'ancient_bark', accentTile: 'dirt', wallTile: 'tree', decoratorTile: 'cobweb', portalTile: 'forest_portal', weather: 'fog', ambience: 'forest', musicTheme: 'forest', mobPool: ['spider', 'ghost', 'treant'], bossType: 'treant' },
  { id: 'b9_ironwood_thicket', name: 'Floresta de Pau-Ferro', minLevel: 26, category: 'forest', primaryTile: 'grass', accentTile: 'stone', wallTile: 'pine_tree', decoratorTile: 'rock', portalTile: 'forest_portal', weather: 'rain', ambience: 'forest', musicTheme: 'forest', mobPool: ['orc', 'troll'], bossType: 'troll' },
  { id: 'b10_sylvan_sanctuary', name: 'Santuário Silvestre V', minLevel: 30, category: 'forest', primaryTile: 'mossy_stone', accentTile: 'grass', wallTile: 'tree', decoratorTile: 'rune_stone', portalTile: 'forest_portal', weather: 'none', ambience: 'forest', musicTheme: 'forest', mobPool: ['treant', 'witch', 'dragon'], bossType: 'dragon' },

  // ── 11-20: ARID DESERTS & BADLANDS (Repeating Cycle I) ──
  { id: 'b11_golden_dunes', name: 'Dunas Douradas I', minLevel: 10, category: 'desert', primaryTile: 'sand', accentTile: 'dirt', wallTile: 'rock', decoratorTile: 'rock', portalTile: 'desert_portal', weather: 'sandstorm', ambience: 'desert', musicTheme: 'desert', mobPool: ['orc', 'zombie'], bossType: 'orc' },
  { id: 'b12_sun_canyon', name: 'Garganta do Sol Flamejante', minLevel: 14, category: 'desert', primaryTile: 'sand', accentTile: 'stone', wallTile: 'rock', decoratorTile: 'ancient_tile', portalTile: 'desert_portal', weather: 'sandstorm', ambience: 'desert', musicTheme: 'desert', mobPool: ['orc', 'mage_enemy'], bossType: 'mage_enemy' },
  { id: 'b13_oasis_haven', name: 'Oásis Escondido II', minLevel: 18, category: 'desert', primaryTile: 'sand', accentTile: 'water', wallTile: 'tree', decoratorTile: 'flower', portalTile: 'desert_portal', weather: 'none', ambience: 'desert', musicTheme: 'desert', mobPool: ['orc', 'archer_enemy'], bossType: 'archer_enemy' },
  { id: 'b14_scorpion_waste', name: 'Deserto dos Escorpiões III', minLevel: 22, category: 'desert', primaryTile: 'sand', accentTile: 'dirt', wallTile: 'rock', decoratorTile: 'rock', portalTile: 'desert_portal', weather: 'sandstorm', ambience: 'desert', musicTheme: 'desert', mobPool: ['spider', 'zombie'], bossType: 'spider' },
  { id: 'b15_glass_sand_plateau', name: 'Platô de Vidro Vulcanizado IV', minLevel: 26, category: 'desert', primaryTile: 'sand', accentTile: 'obsidian', wallTile: 'volcanic_rock', decoratorTile: 'crystal', portalTile: 'desert_portal', weather: 'sandstorm', ambience: 'desert', musicTheme: 'desert', mobPool: ['demon', 'mage_enemy'], bossType: 'demon' },
  { id: 'b16_pharaoh_necropolis', name: 'Necrópole dos Faraós', minLevel: 30, category: 'desert', primaryTile: 'ancient_tile', accentTile: 'sand', wallTile: 'ruin_wall', decoratorTile: 'sarcophagus', portalTile: 'desert_portal', weather: 'sandstorm', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['skeleton', 'ghost', 'knight_enemy'], bossType: 'knight_enemy' },
  { id: 'b17_sunken_sand_temple', name: 'Templo de Areia Submerso V', minLevel: 34, category: 'desert', primaryTile: 'ancient_tile', accentTile: 'sand', wallTile: 'ruin_wall', decoratorTile: 'ruin_pillar', portalTile: 'desert_portal', weather: 'none', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['knight_enemy', 'mage_enemy'], bossType: 'mage_enemy' },
  { id: 'b18_red_rock_gorge', name: 'Garganta de Rocha Vermelha VI', minLevel: 38, category: 'desert', primaryTile: 'dirt', accentTile: 'sand', wallTile: 'rock', decoratorTile: 'rock', portalTile: 'desert_portal', weather: 'sandstorm', ambience: 'desert', musicTheme: 'desert', mobPool: ['troll', 'orc'], bossType: 'troll' },
  { id: 'b19_quicksand_basin', name: 'Bacia das Areias Movediças VII', minLevel: 42, category: 'desert', primaryTile: 'sand', accentTile: 'dirt', wallTile: 'rock', decoratorTile: 'ancient_tile', portalTile: 'desert_portal', weather: 'sandstorm', ambience: 'desert', musicTheme: 'desert', mobPool: ['demon', 'zombie'], bossType: 'demon' },
  { id: 'b20_solaris_plateau', name: 'Platô do Apogeu Solar VIII', minLevel: 46, category: 'desert', primaryTile: 'sand', accentTile: 'ancient_tile', wallTile: 'ruin_wall', decoratorTile: 'rune_stone', portalTile: 'desert_portal', weather: 'sandstorm', ambience: 'desert', musicTheme: 'desert', mobPool: ['dragon', 'knight_enemy'], bossType: 'dragon' },

  // ── 21-30: VOLCANIC LAVA & MAGMA (Repeating Cycle I) ──
  { id: 'b21_basalt_hills', name: 'Colinas de Basalto I', minLevel: 20, category: 'volcano', primaryTile: 'volcanic_rock', accentTile: 'ash', wallTile: 'obsidian', decoratorTile: 'rock', portalTile: 'volcano_portal', weather: 'ash_fall', ambience: 'volcano', musicTheme: 'volcano', mobPool: ['demon', 'orc'], bossType: 'demon' },
  { id: 'b22_magma_crater', name: 'Cratera Magmática II', minLevel: 25, category: 'volcano', primaryTile: 'magma_crust', accentTile: 'lava', wallTile: 'obsidian', decoratorTile: 'volcanic_vent', portalTile: 'volcano_portal', weather: 'ash_fall', ambience: 'volcano', musicTheme: 'volcano', mobPool: ['demon', 'dragon'], bossType: 'dragon' },
  { id: 'b23_infernal_forge_depths', name: 'Forja Infernal Profunda III', minLevel: 30, category: 'volcano', primaryTile: 'obsidian', accentTile: 'magma_crust', wallTile: 'volcanic_rock', decoratorTile: 'mystic_forge', portalTile: 'volcano_portal', weather: 'ash_fall', ambience: 'volcano', musicTheme: 'volcano', mobPool: ['knight_enemy', 'demon'], bossType: 'knight_enemy' },
  { id: 'b24_burning_lava_river', name: 'Rio de Lava Ardente IV', minLevel: 35, category: 'volcano', primaryTile: 'lava', accentTile: 'magma_crust', wallTile: 'obsidian', decoratorTile: 'volcanic_vent', portalTile: 'volcano_portal', weather: 'ash_fall', ambience: 'volcano', musicTheme: 'volcano', mobPool: ['demon', 'dragon'], bossType: 'dragon' },
  { id: 'b25_brimstone_peaks', name: 'Picos de Enxofre V', minLevel: 40, category: 'volcano', primaryTile: 'volcanic_rock', accentTile: 'ash', wallTile: 'obsidian', decoratorTile: 'volcanic_vent', portalTile: 'volcano_portal', weather: 'ash_fall', ambience: 'volcano', musicTheme: 'volcano', mobPool: ['dragon', 'demon'], bossType: 'dragon' },
  { id: 'b26_obsidian_ravine', name: 'Ravina de Obsidiana VI', minLevel: 45, category: 'volcano', primaryTile: 'obsidian', accentTile: 'volcanic_rock', wallTile: 'obsidian', decoratorTile: 'lava', portalTile: 'volcano_portal', weather: 'ash_fall', ambience: 'volcano', musicTheme: 'volcano', mobPool: ['demon', 'dragon'], bossType: 'demon' },
  { id: 'b27_flame_lord_altar', name: 'Altar do Lorde das Chamas VII', minLevel: 50, category: 'volcano', primaryTile: 'magma_crust', accentTile: 'obsidian', wallTile: 'volcanic_rock', decoratorTile: 'rune_altar', portalTile: 'volcano_portal', weather: 'ash_fall', ambience: 'volcano', musicTheme: 'volcano', mobPool: ['demon', 'dragon', 'witch'], bossType: 'dragon' },
  { id: 'b28_sulfur_geysers', name: 'Gêiseres de Enxofre VIII', minLevel: 55, category: 'volcano', primaryTile: 'ash', accentTile: 'volcanic_rock', wallTile: 'obsidian', decoratorTile: 'volcanic_vent', portalTile: 'volcano_portal', weather: 'ash_fall', ambience: 'volcano', musicTheme: 'volcano', mobPool: ['demon', 'witch'], bossType: 'witch' },
  { id: 'b29_hellfire_rift', name: 'Fenda do Fogo Infernal IX', minLevel: 60, category: 'volcano', primaryTile: 'lava', accentTile: 'magma_crust', wallTile: 'obsidian', decoratorTile: 'volcanic_vent', portalTile: 'volcano_portal', weather: 'ash_fall', ambience: 'volcano', musicTheme: 'volcano', mobPool: ['demon', 'dragon'], bossType: 'dragon' },
  { id: 'b30_dragon_roost_peak', name: 'Pico do Ninho dos Dragões X', minLevel: 65, category: 'volcano', primaryTile: 'obsidian', accentTile: 'lava', wallTile: 'volcanic_rock', decoratorTile: 'rune_stone', portalTile: 'volcano_portal', weather: 'ash_fall', ambience: 'volcano', musicTheme: 'volcano', mobPool: ['dragon'], bossType: 'dragon' },

  // ── 31-40: FROZEN TUNDRA & GLACIERS ──
  { id: 'b31_frostbite_pass', name: 'Passagem do Congelamento I', minLevel: 15, category: 'tundra', primaryTile: 'snow', accentTile: 'frost_grass', wallTile: 'pine_tree', decoratorTile: 'snow_rock', portalTile: 'mountain_portal', weather: 'snow', ambience: 'tundra', musicTheme: 'tundra', mobPool: ['wolf', 'ghost'], bossType: 'wolf' },
  { id: 'b32_crystal_glacier', name: 'Glacial de Cristais Azuis II', minLevel: 20, category: 'tundra', primaryTile: 'ice', accentTile: 'crystal_floor', wallTile: 'ice_rock', decoratorTile: 'ice_crystal_node', portalTile: 'mountain_portal', weather: 'aurora', ambience: 'tundra', musicTheme: 'tundra', mobPool: ['troll', 'witch'], bossType: 'troll' },
  { id: 'b33_eternal_snow_peak', name: 'Pico das Neves Eternas III', minLevel: 25, category: 'tundra', primaryTile: 'snowy_peak', accentTile: 'snow', wallTile: 'mountain_rock', decoratorTile: 'frozen_campfire', portalTile: 'mountain_portal', weather: 'snow', ambience: 'tundra', musicTheme: 'tundra', mobPool: ['troll', 'dragon'], bossType: 'dragon' },
  { id: 'b34_frost_wolf_cavern', name: 'Caverna dos Lobos de Gelo IV', minLevel: 30, category: 'tundra', primaryTile: 'snow', accentTile: 'ice_rock', wallTile: 'ice_rock', decoratorTile: 'snow_rock', portalTile: 'mountain_portal', weather: 'snow', ambience: 'tundra', musicTheme: 'tundra', mobPool: ['wolf', 'ghost'], bossType: 'wolf' },
  { id: 'b35_blizzard_canyon', name: 'Canyon do Nevasca V', minLevel: 35, category: 'tundra', primaryTile: 'snow', accentTile: 'snowy_peak', wallTile: 'mountain_rock', decoratorTile: 'pine_tree', portalTile: 'mountain_portal', weather: 'snow', ambience: 'tundra', musicTheme: 'tundra', mobPool: ['troll', 'knight_enemy'], bossType: 'troll' },
  { id: 'b36_ice_spire_sanctuary', name: 'Agulhas de Gelo VI', minLevel: 40, category: 'tundra', primaryTile: 'crystal_floor', accentTile: 'ice', wallTile: 'ice_rock', decoratorTile: 'ice_crystal_node', portalTile: 'mountain_portal', weather: 'aurora', ambience: 'tundra', musicTheme: 'tundra', mobPool: ['witch', 'ghost'], bossType: 'witch' },
  { id: 'b37_frozen_fjord', name: 'Forde Glacial VII', minLevel: 45, category: 'tundra', primaryTile: 'ice', accentTile: 'dark_water', wallTile: 'ice_rock', decoratorTile: 'ice_rock', portalTile: 'mountain_portal', weather: 'fog', ambience: 'tundra', musicTheme: 'tundra', mobPool: ['witch', 'troll'], bossType: 'troll' },
  { id: 'b38_aurora_borealis_fields', name: 'Campos da Aurora VIII', minLevel: 50, category: 'tundra', primaryTile: 'frost_grass', accentTile: 'crystal_floor', wallTile: 'pine_tree', decoratorTile: 'rune_stone', portalTile: 'mountain_portal', weather: 'aurora', ambience: 'tundra', musicTheme: 'tundra', mobPool: ['dragon', 'mage_enemy'], bossType: 'dragon' },
  { id: 'b39_yeti_mountain_highlands', name: 'Alturas dos Yeti IX', minLevel: 55, category: 'tundra', primaryTile: 'snowy_peak', accentTile: 'ice', wallTile: 'mountain_rock', decoratorTile: 'mountain_rock', portalTile: 'mountain_portal', weather: 'snow', ambience: 'tundra', musicTheme: 'tundra', mobPool: ['troll', 'dragon'], bossType: 'troll' },
  { id: 'b40_crystal_ice_palace', name: 'Palácio de Gelo Cristalino X', minLevel: 60, category: 'tundra', primaryTile: 'crystal_floor', accentTile: 'ice', wallTile: 'ice_rock', decoratorTile: 'rune_altar', portalTile: 'mountain_portal', weather: 'aurora', ambience: 'tundra', musicTheme: 'tundra', mobPool: ['dragon', 'knight_enemy'], bossType: 'dragon' },

  // ── 41-50: SWAMPS & BOGS ──
  { id: 'b41_mist_swamp', name: 'Pântano da Névoa I', minLevel: 8, category: 'swamp', primaryTile: 'dirt', accentTile: 'dark_water', wallTile: 'tree', decoratorTile: 'root', portalTile: 'forest_portal', weather: 'fog', ambience: 'swamp', musicTheme: 'swamp', mobPool: ['zombie', 'spider'], bossType: 'zombie' },
  { id: 'b42_undead_bog', name: 'Charco dos Mortos-Vivos II', minLevel: 12, category: 'swamp', primaryTile: 'dark_water', accentTile: 'dirt', wallTile: 'tree', decoratorTile: 'cobweb', portalTile: 'forest_portal', weather: 'fog', ambience: 'swamp', musicTheme: 'swamp', mobPool: ['zombie', 'ghost', 'vampire'], bossType: 'vampire' },
  { id: 'b43_poison_spore_marsh', name: 'Pântano dos Esporos Tóxicos III', minLevel: 16, category: 'swamp', primaryTile: 'dirt', accentTile: 'dark_water', wallTile: 'tree', decoratorTile: 'mushroom', portalTile: 'forest_portal', weather: 'rain', ambience: 'swamp', musicTheme: 'swamp', mobPool: ['spider', 'witch'], bossType: 'witch' },
  { id: 'b44_witch_bayou', name: 'Igarapé das Bruxas IV', minLevel: 20, category: 'swamp', primaryTile: 'dark_water', accentTile: 'mossy_stone', wallTile: 'tree', decoratorTile: 'ancient_brazier', portalTile: 'forest_portal', weather: 'fog', ambience: 'swamp', musicTheme: 'swamp', mobPool: ['witch', 'ghost'], bossType: 'witch' },
  { id: 'b45_sunken_grotto_swamp', name: 'Gruta Submersa no Charco V', minLevel: 24, category: 'swamp', primaryTile: 'dirt', accentTile: 'dark_water', wallTile: 'mossy_stone', decoratorTile: 'root', portalTile: 'forest_portal', weather: 'fog', ambience: 'swamp', musicTheme: 'swamp', mobPool: ['zombie', 'spider'], bossType: 'zombie' },
  { id: 'b46_rotting_canopy_bog', name: 'Pântano da Copa Podre VI', minLevel: 28, category: 'swamp', primaryTile: 'ancient_bark', accentTile: 'dark_water', wallTile: 'tree', decoratorTile: 'canopy', portalTile: 'forest_portal', weather: 'rain', ambience: 'swamp', musicTheme: 'swamp', mobPool: ['treant', 'zombie'], bossType: 'treant' },
  { id: 'b47_black_water_fens', name: 'Mangue de Água Negra VII', minLevel: 32, category: 'swamp', primaryTile: 'dark_water', accentTile: 'dirt', wallTile: 'tree', decoratorTile: 'cobweb', portalTile: 'forest_portal', weather: 'fog', ambience: 'swamp', musicTheme: 'swamp', mobPool: ['vampire', 'witch'], bossType: 'vampire' },
  { id: 'b48_serpent_mire', name: 'Lodaçal das Serpentes VIII', minLevel: 36, category: 'swamp', primaryTile: 'dirt', accentTile: 'dark_water', wallTile: 'tree', decoratorTile: 'root', portalTile: 'forest_portal', weather: 'rain', ambience: 'swamp', musicTheme: 'swamp', mobPool: ['spider', 'zombie'], bossType: 'spider' },
  { id: 'b49_graveyard_swamp', name: 'Cemitério dos Pântanos IX', minLevel: 40, category: 'swamp', primaryTile: 'dirt', accentTile: 'broken_tile', wallTile: 'ruin_wall', decoratorTile: 'sarcophagus', portalTile: 'forest_portal', weather: 'fog', ambience: 'swamp', musicTheme: 'swamp', mobPool: ['skeleton', 'ghost', 'vampire'], bossType: 'vampire' },
  { id: 'b50_abyssal_bog_depths', name: 'Profundezas do Charco Abissal X', minLevel: 44, category: 'swamp', primaryTile: 'dark_water', accentTile: 'abyss_floor', wallTile: 'abyss_wall', decoratorTile: 'soul_fire', portalTile: 'forest_portal', weather: 'fog', ambience: 'abyss', musicTheme: 'abyss', mobPool: ['vampire', 'demon'], bossType: 'demon' },

  // ── 51-60: CRYSTAL CAVERNS & GEM GROTTOS ──
  { id: 'b51_quartz_grotto', name: 'Gruta de Quartzo Translucido I', minLevel: 15, category: 'crystal', primaryTile: 'crystal_floor', accentTile: 'stone', wallTile: 'crystal_wall', decoratorTile: 'crystal', portalTile: 'crystal_portal', weather: 'none', ambience: 'crystal', musicTheme: 'crystal', mobPool: ['slime', 'witch'], bossType: 'witch' },
  { id: 'b52_amethyst_mine', name: 'Mina de Ametista II', minLevel: 20, category: 'crystal', primaryTile: 'crystal_floor', accentTile: 'dark_crystal', wallTile: 'crystal_wall', decoratorTile: 'gem_node', portalTile: 'crystal_portal', weather: 'none', ambience: 'crystal', musicTheme: 'crystal', mobPool: ['witch', 'mage_enemy'], bossType: 'mage_enemy' },
  { id: 'b53_sapphire_chasm', name: 'Abismo de Safira III', minLevel: 25, category: 'crystal', primaryTile: 'crystal_floor', accentTile: 'ice', wallTile: 'crystal_wall', decoratorTile: 'crystal', portalTile: 'crystal_portal', weather: 'aurora', ambience: 'crystal', musicTheme: 'crystal', mobPool: ['ghost', 'witch'], bossType: 'witch' },
  { id: 'b54_emerald_matrix', name: 'Matriz de Esmeraldas IV', minLevel: 30, category: 'crystal', primaryTile: 'crystal_floor', accentTile: 'frost_grass', wallTile: 'crystal_wall', decoratorTile: 'gem_node', portalTile: 'crystal_portal', weather: 'none', ambience: 'crystal', musicTheme: 'crystal', mobPool: ['treant', 'witch'], bossType: 'treant' },
  { id: 'b55_ruby_magma_chamber', name: 'Câmara de Rubis Flamejantes V', minLevel: 35, category: 'crystal', primaryTile: 'crystal_floor', accentTile: 'magma_crust', wallTile: 'crystal_wall', decoratorTile: 'volcanic_vent', portalTile: 'crystal_portal', weather: 'ash_fall', ambience: 'crystal', musicTheme: 'crystal', mobPool: ['demon', 'mage_enemy'], bossType: 'demon' },
  { id: 'b56_prismatic_geode', name: 'Geodo Prismático VI', minLevel: 40, category: 'crystal', primaryTile: 'crystal_floor', accentTile: 'cloud_floor', wallTile: 'crystal_wall', decoratorTile: 'crystal', portalTile: 'crystal_portal', weather: 'aurora', ambience: 'crystal', musicTheme: 'crystal', mobPool: ['witch', 'dragon'], bossType: 'dragon' },
  { id: 'b57_diamond_vein_vault', name: 'Cofre dos Diamantes VII', minLevel: 45, category: 'crystal', primaryTile: 'crystal_floor', accentTile: 'ancient_tile', wallTile: 'crystal_wall', decoratorTile: 'diamond_ore_node', portalTile: 'crystal_portal', weather: 'none', ambience: 'crystal', musicTheme: 'crystal', mobPool: ['knight_enemy', 'mage_enemy'], bossType: 'knight_enemy' },
  { id: 'b58_arcane_crystal_spire', name: 'Agulha de Cristal Arcano VIII', minLevel: 50, category: 'crystal', primaryTile: 'crystal_floor', accentTile: 'sky_platform', wallTile: 'crystal_wall', decoratorTile: 'rune_stone', portalTile: 'crystal_portal', weather: 'aurora', ambience: 'crystal', musicTheme: 'crystal', mobPool: ['mage_enemy', 'dragon'], bossType: 'mage_enemy' },
  { id: 'b59_starlight_geode_sanctuary', name: 'Geodo Estelar IX', minLevel: 55, category: 'crystal', primaryTile: 'crystal_floor', accentTile: 'cloud_floor', wallTile: 'crystal_wall', decoratorTile: 'rune_altar', portalTile: 'crystal_portal', weather: 'aurora', ambience: 'crystal', musicTheme: 'crystal', mobPool: ['dragon', 'witch'], bossType: 'dragon' },
  { id: 'b60_crystal_titan_throne', name: 'Trono do Titã de Cristal X', minLevel: 60, category: 'crystal', primaryTile: 'crystal_floor', accentTile: 'abyss_floor', wallTile: 'crystal_wall', decoratorTile: 'rune_altar', portalTile: 'crystal_portal', weather: 'aurora', ambience: 'crystal', musicTheme: 'crystal', mobPool: ['dragon', 'demon'], bossType: 'dragon' },

  // ── 61-70: ABYSS & UNDERDARK ──
  { id: 'b61_shadow_fissure', name: 'Fenda das Sombras I', minLevel: 25, category: 'abyss', primaryTile: 'abyss_floor', accentTile: 'stone', wallTile: 'abyss_wall', decoratorTile: 'dark_crystal', portalTile: 'abyss_portal', weather: 'fog', ambience: 'abyss', musicTheme: 'abyss', mobPool: ['ghost', 'vampire'], bossType: 'vampire' },
  { id: 'b62_soul_flame_catacombs', name: 'Catacumbas da Chama de Alma II', minLevel: 30, category: 'abyss', primaryTile: 'abyss_floor', accentTile: 'broken_tile', wallTile: 'abyss_wall', decoratorTile: 'soul_fire', portalTile: 'abyss_portal', weather: 'fog', ambience: 'abyss', musicTheme: 'abyss', mobPool: ['skeleton', 'vampire'], bossType: 'vampire' },
  { id: 'b63_void_trench', name: 'Trincheira do Vazio III', minLevel: 35, category: 'abyss', primaryTile: 'void', accentTile: 'abyss_floor', wallTile: 'abyss_wall', decoratorTile: 'dark_crystal', portalTile: 'abyss_portal', weather: 'fog', ambience: 'abyss', musicTheme: 'abyss', mobPool: ['demon', 'ghost'], bossType: 'demon' },
  { id: 'b64_velvet_mist_pit', name: 'Poço da Névoa Aveludada IV', minLevel: 40, category: 'abyss', primaryTile: 'abyss_floor', accentTile: 'dark_water', wallTile: 'abyss_wall', decoratorTile: 'cobweb', portalTile: 'abyss_portal', weather: 'fog', ambience: 'abyss', musicTheme: 'abyss', mobPool: ['spider', 'vampire'], bossType: 'vampire' },
  { id: 'b65_demon_lord_sanctuary', name: 'Santuário do Lorde Demônio V', minLevel: 45, category: 'abyss', primaryTile: 'abyss_floor', accentTile: 'magma_crust', wallTile: 'abyss_wall', decoratorTile: 'ancient_brazier', portalTile: 'abyss_portal', weather: 'fog', ambience: 'abyss', musicTheme: 'abyss', mobPool: ['demon', 'dragon'], bossType: 'demon' },
  { id: 'b66_flesh_construct_pits', name: 'Poço dos Construtos VI', minLevel: 50, category: 'abyss', primaryTile: 'abyss_floor', accentTile: 'obsidian', wallTile: 'abyss_wall', decoratorTile: 'sarcophagus', portalTile: 'abyss_portal', weather: 'fog', ambience: 'abyss', musicTheme: 'abyss', mobPool: ['zombie', 'demon'], bossType: 'demon' },
  { id: 'b67_eldritch_ravine', name: 'Ravina Eldritch VII', minLevel: 55, category: 'abyss', primaryTile: 'void', accentTile: 'crystal_floor', wallTile: 'abyss_wall', decoratorTile: 'dark_crystal', portalTile: 'abyss_portal', weather: 'fog', ambience: 'abyss', musicTheme: 'abyss', mobPool: ['witch', 'demon'], bossType: 'demon' },
  { id: 'b68_blood_moon_altar', name: 'Altar da Lua de Sangue VIII', minLevel: 60, category: 'abyss', primaryTile: 'abyss_floor', accentTile: 'ancient_tile', wallTile: 'abyss_wall', decoratorTile: 'rune_altar', portalTile: 'abyss_portal', weather: 'fog', ambience: 'abyss', musicTheme: 'abyss', mobPool: ['vampire', 'dragon'], bossType: 'vampire' },
  { id: 'b69_phantom_abyss_depths', name: 'Profundezas Fantasma IX', minLevel: 65, category: 'abyss', primaryTile: 'abyss_floor', accentTile: 'void', wallTile: 'abyss_wall', decoratorTile: 'soul_fire', portalTile: 'abyss_portal', weather: 'fog', ambience: 'abyss', musicTheme: 'abyss', mobPool: ['ghost', 'demon'], bossType: 'demon' },
  { id: 'b70_abyssal_overlord_vault', name: 'Cofre do Soberano Abissal X', minLevel: 70, category: 'abyss', primaryTile: 'abyss_floor', accentTile: 'crystal_floor', wallTile: 'abyss_wall', decoratorTile: 'rune_altar', portalTile: 'abyss_portal', weather: 'fog', ambience: 'abyss', musicTheme: 'abyss', mobPool: ['demon', 'dragon', 'vampire'], bossType: 'dragon' },

  // ── 71-80: ANCIENT RUINS & TEMPLES ──
  { id: 'b71_fallen_empire_ruins', name: 'Ruínas do Império Caído I', minLevel: 20, category: 'ruins', primaryTile: 'ancient_tile', accentTile: 'ruin_floor', wallTile: 'ruin_wall', decoratorTile: 'ruin_pillar', portalTile: 'ruins_portal', weather: 'rain', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['knight_enemy', 'mage_enemy'], bossType: 'knight_enemy' },
  { id: 'b72_sun_god_colonnade', name: 'Colunata do Deus Sol II', minLevel: 25, category: 'ruins', primaryTile: 'ancient_tile', accentTile: 'sand', wallTile: 'ruin_wall', decoratorTile: 'ruin_pillar', portalTile: 'ruins_portal', weather: 'none', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['archer_enemy', 'knight_enemy'], bossType: 'knight_enemy' },
  { id: 'b73_overgrown_monastery', name: 'Monastério Encoberto de Vinhas III', minLevel: 30, category: 'ruins', primaryTile: 'ruin_floor', accentTile: 'mossy_stone', wallTile: 'vine_wall', decoratorTile: 'broken_tile', portalTile: 'ruins_portal', weather: 'rain', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['ghost', 'knight_enemy'], bossType: 'knight_enemy' },
  { id: 'b74_rune_carved_cathedral', name: 'Catedral das Runas Rúnicas IV', minLevel: 35, category: 'ruins', primaryTile: 'ancient_tile', accentTile: 'crystal_floor', wallTile: 'ruin_wall', decoratorTile: 'rune_stone', portalTile: 'ruins_portal', weather: 'none', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['mage_enemy', 'knight_enemy'], bossType: 'mage_enemy' },
  { id: 'b75_cursed_mausoleum', name: 'Mausoléu Amaldiçoado V', minLevel: 40, category: 'ruins', primaryTile: 'broken_tile', accentTile: 'abyss_floor', wallTile: 'ruin_wall', decoratorTile: 'sarcophagus', portalTile: 'ruins_portal', weather: 'fog', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['skeleton', 'vampire'], bossType: 'vampire' },
  { id: 'b76_forgotten_library', name: 'Biblioteca Esquecida VI', minLevel: 45, category: 'ruins', primaryTile: 'ancient_tile', accentTile: 'ruin_floor', wallTile: 'ruin_wall', decoratorTile: 'ancient_brazier', portalTile: 'ruins_portal', weather: 'none', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['mage_enemy', 'ghost'], bossType: 'mage_enemy' },
  { id: 'b77_colosseum_halls', name: 'Salões do Coliseu Antigo VII', minLevel: 50, category: 'ruins', primaryTile: 'ancient_tile', accentTile: 'cobblestone', wallTile: 'ruin_wall', decoratorTile: 'ruin_pillar', portalTile: 'ruins_portal', weather: 'none', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['knight_enemy', 'troll'], bossType: 'knight_enemy' },
  { id: 'b78_astral_observatory_ruins', name: 'Observatório Astral VIII', minLevel: 55, category: 'ruins', primaryTile: 'ancient_tile', accentTile: 'sky_platform', wallTile: 'ruin_wall', decoratorTile: 'rune_stone', portalTile: 'ruins_portal', weather: 'aurora', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['mage_enemy', 'dragon'], bossType: 'dragon' },
  { id: 'b79_labyrinth_of_monoliths', name: 'Labirinto de Monólitos IX', minLevel: 60, category: 'ruins', primaryTile: 'ruin_floor', accentTile: 'ancient_tile', wallTile: 'ruin_wall', decoratorTile: 'rune_stone', portalTile: 'ruins_portal', weather: 'storm', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['knight_enemy', 'demon'], bossType: 'demon' },
  { id: 'b80_ancient_emperor_tomb', name: 'Tumba do Imperador Ancião X', minLevel: 65, category: 'ruins', primaryTile: 'ancient_tile', accentTile: 'crystal_floor', wallTile: 'ruin_wall', decoratorTile: 'rune_altar', portalTile: 'ruins_portal', weather: 'none', ambience: 'ruins', musicTheme: 'ruins', mobPool: ['knight_enemy', 'dragon', 'mage_enemy'], bossType: 'dragon' },

  // ── 81-90: CELESTIAL SKY & CLOUD ISLANDS ──
  { id: 'b81_floating_nimbus_islands', name: 'Ilhas Flutuantes do Limbo I', minLevel: 30, category: 'sky', primaryTile: 'cloud_floor', accentTile: 'sky_platform', wallTile: 'sky_void', decoratorTile: 'rune_stone', portalTile: 'sky_portal', weather: 'aurora', ambience: 'sky', musicTheme: 'sky', mobPool: ['mage_enemy', 'ghost'], bossType: 'mage_enemy' },
  { id: 'b82_aurora_sky_citadel', name: 'Cidadae Celeste da Aurora II', minLevel: 35, category: 'sky', primaryTile: 'sky_platform', accentTile: 'cloud_floor', wallTile: 'sky_void', decoratorTile: 'rune_altar', portalTile: 'sky_portal', weather: 'aurora', ambience: 'sky', musicTheme: 'sky', mobPool: ['mage_enemy', 'dragon'], bossType: 'dragon' },
  { id: 'b83_starlight_archipelago', name: 'Arquipélago Estelar III', minLevel: 40, category: 'sky', primaryTile: 'cloud_floor', accentTile: 'crystal_floor', wallTile: 'sky_void', decoratorTile: 'crystal', portalTile: 'sky_portal', weather: 'aurora', ambience: 'sky', musicTheme: 'sky', mobPool: ['mage_enemy', 'ghost'], bossType: 'mage_enemy' },
  { id: 'b84_tempest_cloud_spire', name: 'Agulha da Tempestade IV', minLevel: 45, category: 'sky', primaryTile: 'cloud_floor', accentTile: 'sky_platform', wallTile: 'sky_void', decoratorTile: 'rune_stone', portalTile: 'sky_portal', weather: 'storm', ambience: 'sky', musicTheme: 'sky', mobPool: ['dragon', 'mage_enemy'], bossType: 'dragon' },
  { id: 'b85_valkyrie_sanctuary', name: 'Santuário das Valquírias V', minLevel: 50, category: 'sky', primaryTile: 'sky_platform', accentTile: 'ancient_tile', wallTile: 'sky_void', decoratorTile: 'rune_altar', portalTile: 'sky_portal', weather: 'aurora', ambience: 'sky', musicTheme: 'sky', mobPool: ['knight_enemy', 'mage_enemy'], bossType: 'knight_enemy' },
  { id: 'b86_celestial_breeze_gardens', name: 'Jardins Celestiais VI', minLevel: 55, category: 'sky', primaryTile: 'cloud_floor', accentTile: 'garden', wallTile: 'sky_void', decoratorTile: 'flower', portalTile: 'sky_portal', weather: 'none', ambience: 'sky', musicTheme: 'sky', mobPool: ['mage_enemy', 'dragon'], bossType: 'dragon' },
  { id: 'b87_sun_piercer_pinnacle', name: 'Pináculo Perfurador do Sol VII', minLevel: 60, category: 'sky', primaryTile: 'sky_platform', accentTile: 'cloud_floor', wallTile: 'sky_void', decoratorTile: 'ancient_brazier', portalTile: 'sky_portal', weather: 'aurora', ambience: 'sky', musicTheme: 'sky', mobPool: ['dragon', 'knight_enemy'], bossType: 'dragon' },
  { id: 'b88_etherial_star_forge', name: 'Forja Estelar Etérea VIII', minLevel: 65, category: 'sky', primaryTile: 'sky_platform', accentTile: 'crystal_floor', wallTile: 'sky_void', decoratorTile: 'mystic_forge', portalTile: 'sky_portal', weather: 'aurora', ambience: 'sky', musicTheme: 'sky', mobPool: ['mage_enemy', 'demon'], bossType: 'demon' },
  { id: 'b89_nebula_vault_depths', name: 'Cofre da Nebulosa IX', minLevel: 70, category: 'sky', primaryTile: 'cloud_floor', accentTile: 'crystal_floor', wallTile: 'sky_void', decoratorTile: 'rune_stone', portalTile: 'sky_portal', weather: 'aurora', ambience: 'sky', musicTheme: 'sky', mobPool: ['dragon', 'mage_enemy'], bossType: 'dragon' },
  { id: 'b90_sky_god_throne_realm', name: 'Trono do Deus dos Céus X', minLevel: 75, category: 'sky', primaryTile: 'sky_platform', accentTile: 'cloud_floor', wallTile: 'sky_void', decoratorTile: 'rune_altar', portalTile: 'sky_portal', weather: 'aurora', ambience: 'sky', musicTheme: 'sky', mobPool: ['dragon', 'knight_enemy', 'mage_enemy'], bossType: 'dragon' },

  // ── 91-100: REPEATING FORESTS, DESERTS, LAVA & OCEAN/JUNGLE SPECIALS ──
  { id: 'b91_coral_reef_coast', name: 'Recife de Corais Sagrados', minLevel: 10, category: 'ocean', primaryTile: 'sand', accentTile: 'water', wallTile: 'rock', decoratorTile: 'flower', portalTile: 'ocean_portal', weather: 'rain', ambience: 'grassland', musicTheme: 'town', mobPool: ['goblin', 'orc'], bossType: 'orc' },
  { id: 'b92_pirate_reef_haven', name: 'Refúgio dos Piratas Assombrados', minLevel: 15, category: 'ocean', primaryTile: 'sand', accentTile: 'deepwater', wallTile: 'rock', decoratorTile: 'chest', portalTile: 'ocean_portal', weather: 'storm', ambience: 'grassland', musicTheme: 'town', mobPool: ['ghost', 'zombie'], bossType: 'ghost' },
  { id: 'b93_dense_bamboo_jungle', name: 'Jungle de Bambus Impenetrável', minLevel: 20, category: 'jungle', primaryTile: 'grass', accentTile: 'mossy_stone', wallTile: 'tree', decoratorTile: 'root', portalTile: 'forest_portal', weather: 'rain', ambience: 'forest', musicTheme: 'forest', mobPool: ['spider', 'orc'], bossType: 'spider' },
  { id: 'b94_repeating_forest_vi', name: 'Floresta de Névoa Densa VI', minLevel: 25, category: 'forest', primaryTile: 'grass', accentTile: 'tall_grass', wallTile: 'tree', decoratorTile: 'mushroom', portalTile: 'forest_portal', weather: 'fog', ambience: 'forest', musicTheme: 'forest', mobPool: ['wolf', 'treant'], bossType: 'treant' },
  { id: 'b95_repeating_desert_ix', name: 'Deserto de Espelhos Dourados IX', minLevel: 30, category: 'desert', primaryTile: 'sand', accentTile: 'dirt', wallTile: 'rock', decoratorTile: 'ancient_tile', portalTile: 'desert_portal', weather: 'sandstorm', ambience: 'desert', musicTheme: 'desert', mobPool: ['orc', 'zombie'], bossType: 'orc' },
  { id: 'b96_repeating_volcano_xi', name: 'Cratera do Caos Infernal XI', minLevel: 35, category: 'volcano', primaryTile: 'magma_crust', accentTile: 'lava', wallTile: 'obsidian', decoratorTile: 'volcanic_vent', portalTile: 'volcano_portal', weather: 'ash_fall', ambience: 'volcano', musicTheme: 'volcano', mobPool: ['demon', 'dragon'], bossType: 'dragon' },
  { id: 'b97_clockwork_forge_realm', name: 'Forja Mecânica de Engrenagens', minLevel: 40, category: 'underdark', primaryTile: 'cobblestone', accentTile: 'iron_ore_node', wallTile: 'house_wall', decoratorTile: 'mystic_forge', portalTile: 'dungeon_portal', weather: 'none', ambience: 'dungeon', musicTheme: 'dungeon', mobPool: ['knight_enemy', 'mage_enemy'], bossType: 'knight_enemy' },
  { id: 'b98_shattered_mirror_dimension', name: 'Dimensão dos Espelhos Partidos', minLevel: 50, category: 'celestial', primaryTile: 'crystal_floor', accentTile: 'sky_platform', wallTile: 'crystal_wall', decoratorTile: 'crystal', portalTile: 'celestial_portal', weather: 'aurora', ambience: 'sky', musicTheme: 'sky', mobPool: ['ghost', 'mage_enemy'], bossType: 'mage_enemy' },
  { id: 'b99_twilight_moonlit_meadow', name: 'Prado do Luar de Crepúsculo', minLevel: 60, category: 'forest', primaryTile: 'frost_grass', accentTile: 'grass', wallTile: 'pine_tree', decoratorTile: 'flower', portalTile: 'celestial_portal', weather: 'aurora', ambience: 'forest', musicTheme: 'forest', mobPool: ['witch', 'ghost'], bossType: 'witch' },
  { id: 'b100_cosmic_sanctuary_apex', name: 'Santuário Cósmico Supremo X', minLevel: 100, category: 'celestial', primaryTile: 'sky_platform', accentTile: 'crystal_floor', wallTile: 'sky_void', decoratorTile: 'rune_altar', portalTile: 'celestial_portal', weather: 'aurora', ambience: 'sky', musicTheme: 'sky', mobPool: ['dragon', 'demon', 'knight_enemy'], bossType: 'dragon' },
]

// Fast lookup helper
export function find100Biome(id: string): BiomeDefinition | undefined {
  const cleanId = id.split('_f')[0].split('_floor')[0].toLowerCase()
  const direct = ALL_100_BIOMES.find(b => b.id === cleanId || cleanId.startsWith(b.id))
  if (direct) return direct

  const aliases: Record<string, string> = {
    forest: 'b1_whispering_woods',
    deepforest: 'b1_whispering_woods',
    desert: 'b11_golden_dunes',
    volcano: 'b21_magma_crater',
    tundra: 'b31_frostbite_pass',
    snow: 'b31_frostbite_pass',
    swamp: 'b41_poison_bog',
    abyss: 'b61_void_abyss',
    sky: 'b81_cloud_haven',
    ocean: 'b91_coral_reef_coast',
  }
  if (aliases[cleanId]) {
    return ALL_100_BIOMES.find(b => b.id === aliases[cleanId])
  }
  return undefined
}

// ════════════════════════════════════════════════════════════════════════════
// GUARANTEED ACCESSIBILITY SOLVER FOR PORTALS & STAIRS
// ════════════════════════════════════════════════════════════════════════════
export function ensureMapAccessibility(map: GameMap): GameMap {
  const { width, height, tiles, spawnPoints } = map
  const floorTileType: TileType = tiles[Math.floor(height / 2)]?.[Math.floor(width / 2)]?.type || 'floor'

  const isPassableTile = (t: Tile) => {
    if (!t) return false
    const nonWalkable = [
      'wall', 'dungeon_wall', 'dungeon_brick', 'lava', 'tree', 'rock',
      'house_wall', 'house_roof', 'fountain', 'fence', 'deepwater', 'water',
      'ice_rock', 'volcanic_rock', 'obsidian', 'crystal_wall', 'abyss_wall', 'void',
      'pine_tree', 'snowy_peak', 'mountain_rock', 'tower_wall', 'vine_wall', 'sarcophagus',
      'portal', 'crystal_portal', 'haunted_portal', 'sky_portal',
      'mountain_portal', 'ruins_portal', 'tower_portal', 'forest_portal',
      'desert_portal', 'volcano_portal', 'abyss_portal', 'dungeon_portal',
      'ocean_portal', 'celestial_portal', 'rune_altar'
    ]
    return !nonWalkable.includes(t.type)
  }

  const portalTileTypes = [
    'portal', 'crystal_portal', 'haunted_portal', 'sky_portal',
    'mountain_portal', 'ruins_portal', 'tower_portal', 'forest_portal',
    'desert_portal', 'volcano_portal', 'abyss_portal', 'dungeon_portal',
    'ocean_portal', 'celestial_portal', 'stairs_up', 'stairs_down', 'rune_altar'
  ]

  const spawnTileX = Math.max(2, Math.min(width - 3, Math.floor((spawnPoints[0]?.x ?? (width * 16)) / 32)))
  const spawnTileY = Math.max(2, Math.min(height - 3, Math.floor((spawnPoints[0]?.y ?? (height * 16)) / 32)))

  // Guarantee spawn area is walkable floor (5x5)
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const sx = spawnTileX + dx
      const sy = spawnTileY + dy
      if (tiles[sy]?.[sx] && !isPassableTile(tiles[sy][sx])) {
        tiles[sy][sx] = makeTile(floorTileType)
      }
    }
  }

  // Find all portal/stair tile locations
  const portalCoords: { x: number; y: number; type: string }[] = []
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const tile = tiles[y][x]
      if (tile && portalTileTypes.includes(tile.type)) {
        portalCoords.push({ x, y, type: tile.type })
      }
    }
  }

  // Clear 3x3 surrounding walkable floor around EVERY portal / stair
  for (const p of portalCoords) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const px = Math.max(1, Math.min(width - 2, p.x + dx))
        const py = Math.max(1, Math.min(height - 2, p.y + dy))
        if (dx === 0 && dy === 0) continue
        if (tiles[py]?.[px] && !isPassableTile(tiles[py][px])) {
          tiles[py][px] = makeTile(floorTileType)
        }
      }
    }
  }

  // BFS Reachability Check from Spawn
  const visited = Array.from({ length: height }, () => new Uint8Array(width))
  const queue: [number, number][] = [[spawnTileX, spawnTileY]]
  visited[spawnTileY][spawnTileX] = 1

  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
  let head = 0

  while (head < queue.length) {
    const [cx, cy] = queue[head++]
    for (const [dx, dy] of dirs) {
      const nx = cx + dx
      const ny = cy + dy
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny][nx] && tiles[ny]?.[nx]) {
        if (isPassableTile(tiles[ny][nx]) || portalTileTypes.includes(tiles[ny][nx].type)) {
          visited[ny][nx] = 1
          queue.push([nx, ny])
        }
      }
    }
  }

  // If any portal/stair is unreachable, carve a 3-tile wide open corridor directly from spawn to it!
  for (const p of portalCoords) {
    if (!visited[p.y][p.x]) {
      let currX = spawnTileX
      let currY = spawnTileY
      let safety = 0
      while ((currX !== p.x || currY !== p.y) && safety < 1000) {
        safety++
        if (currX !== p.x) currX += currX < p.x ? 1 : -1
        else if (currY !== p.y) currY += currY < p.y ? 1 : -1

        for (let cy = -1; cy <= 1; cy++) {
          for (let cx = -1; cx <= 1; cx++) {
            const tx = Math.max(1, Math.min(width - 2, currX + cx))
            const ty = Math.max(1, Math.min(height - 2, currY + cy))
            if (tiles[ty]?.[tx] && !portalTileTypes.includes(tiles[ty][tx].type)) {
              if (!isPassableTile(tiles[ty][tx])) {
                tiles[ty][tx] = makeTile(floorTileType)
              }
            }
          }
        }
      }
    }
  }

  return map
}

function buildCategoryTiles(biomeDef: BiomeDefinition, W: number, H: number, randN: () => number, floor: number): Tile[][] {
  const tiles: Tile[][] = []
  const cat = biomeDef.category

  // Initialize canvas with border walls and primary floor
  for (let y = 0; y < H; y++) {
    tiles[y] = []
    for (let x = 0; x < W; x++) {
      if (x <= 1 || y <= 1 || x >= W - 2 || y >= H - 2) {
        tiles[y][x] = makeTile(biomeDef.wallTile)
      } else {
        tiles[y][x] = makeTile(biomeDef.primaryTile)
      }
    }
  }

  if (cat === 'forest' || cat === 'jungle') {
    // FORESTS & JUNGLES: Organic tree clumps, clearing pockets, rivers & winding dirt paths
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        const n1 = Math.sin(x * 0.14) * Math.cos(y * 0.14)
        const n2 = Math.sin(x * 0.04 + floor) * Math.sin(y * 0.04 + floor)
        if (n1 + n2 > 0.38) {
          tiles[y][x] = makeTile(biomeDef.wallTile)
        } else if ((x * 7 + y * 13) % 17 === 0) {
          tiles[y][x] = makeTile(biomeDef.accentTile)
        } else if ((x + y) % 21 === 0 && biomeDef.decoratorTile) {
          tiles[y][x] = makeTile(biomeDef.decoratorTile)
        }
      }
    }

    // River bend with wooden bridges
    const riverY = Math.floor(H * 0.45 + Math.sin(floor * 1.5) * 10)
    for (let x = 4; x < W - 4; x++) {
      const ry = Math.floor(riverY + Math.sin(x * 0.08) * 6)
      for (let dy = -1; dy <= 1; dy++) {
        const py = ry + dy
        if (py > 2 && py < H - 2) {
          tiles[py][x] = makeTile('dark_water')
        }
      }
    }
    // Wooden / cobblestone bridges across the river
    for (let bx = 20; bx < W - 20; bx += 30) {
      const ry = Math.floor(riverY + Math.sin(bx * 0.08) * 6)
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const py = ry + dy
          if (py > 2 && py < H - 2 && bx + dx > 2 && bx + dx < W - 2) {
            tiles[py][bx + dx] = makeTile('cobblestone')
          }
        }
      }
    }

    // Druidic Campsites and stone circles
    for (let i = 0; i < 4; i++) {
      const cx = Math.floor(20 + randN() * (W - 40))
      const cy = Math.floor(20 + randN() * (H - 40))
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          if (cy + dy > 2 && cy + dy < H - 2 && cx + dx > 2 && cx + dx < W - 2) {
            tiles[cy + dy][cx + dx] = makeTile('dirt')
          }
        }
      }
      tiles[cy][cx] = makeTile('campfire')
      if (tiles[cy - 1]?.[cx]) tiles[cy - 1][cx] = makeTile('mossy_stone')
      if (tiles[cy + 1]?.[cx]) tiles[cy + 1][cx] = makeTile('mossy_stone')
      if (tiles[cy]?.[cx - 1]) tiles[cy][cx - 1] = makeTile('flower')
      if (tiles[cy]?.[cx + 1]) tiles[cy][cx + 1] = makeTile('flower')
    }
  } else if (cat === 'desert') {
    // DESERTS: Sandstone canyon ridges, dune trails & buried ruin vaults
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        const ridge = Math.abs(Math.sin(x * 0.07 + y * 0.035) + Math.cos(y * 0.07 - x * 0.035))
        if (ridge > 1.32) {
          tiles[y][x] = makeTile(biomeDef.wallTile)
        } else if ((x + y) % 15 === 0) {
          tiles[y][x] = makeTile(biomeDef.accentTile)
        }
      }
    }
    // Oasis Lake
    const ox = Math.floor(W * 0.35 + randN() * W * 0.3)
    const oy = Math.floor(H * 0.35 + randN() * H * 0.3)
    for (let dy = -6; dy <= 6; dy++) {
      for (let dx = -6; dx <= 6; dx++) {
        if (dx * dx + dy * dy <= 32 && oy + dy > 2 && oy + dy < H - 2 && ox + dx > 2 && ox + dx < W - 2) {
          tiles[oy + dy][ox + dx] = makeTile('water')
        }
      }
    }
    // Oasis palm shoreline
    for (let angle = 0; angle < Math.PI * 2; angle += 0.8) {
      const px = Math.round(ox + Math.cos(angle) * 7)
      const py = Math.round(oy + Math.sin(angle) * 7)
      if (py > 2 && py < H - 2 && px > 2 && px < W - 2) {
        tiles[py][px] = makeTile('grass')
      }
    }
  } else if (cat === 'volcano') {
    // VOLCANO: Obsidian basalt island networks over winding lava rivers
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        const lava1 = Math.abs(y - (H / 2 + Math.sin(x * 0.07) * 20))
        const lava2 = Math.abs(x - (W / 2 + Math.cos(y * 0.07) * 20))
        if (lava1 < 3.5 || lava2 < 3.5) {
          tiles[y][x] = makeTile('lava')
        } else if ((x * x + y * y) % 27 === 0) {
          tiles[y][x] = makeTile(biomeDef.wallTile)
        } else if ((x + y) % 11 === 0) {
          tiles[y][x] = makeTile(biomeDef.accentTile)
        }
      }
    }
    // Obsidian stone bridges over lava
    const midY = Math.floor(H / 2)
    const midX = Math.floor(W / 2)
    for (let x = 12; x < W - 12; x += 22) {
      for (let dy = -3; dy <= 3; dy++) {
        if (tiles[midY + dy]?.[x]) tiles[midY + dy][x] = makeTile('obsidian')
      }
    }
    for (let y = 12; y < H - 12; y += 22) {
      for (let dx = -3; dx <= 3; dx++) {
        if (tiles[y]?.[midX + dx]) tiles[y][midX + dx] = makeTile('obsidian')
      }
    }
  } else if (cat === 'tundra') {
    // TUNDRA: Frozen mountain passes, glacial ice lakes & snowy pine groves
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        const iceVal = Math.sin(x * 0.09) + Math.cos(y * 0.09)
        if (iceVal > 1.0) {
          tiles[y][x] = makeTile('ice')
        } else if (iceVal < -1.15) {
          tiles[y][x] = makeTile(biomeDef.wallTile)
        } else if ((x * 3 + y * 5) % 15 === 0) {
          tiles[y][x] = makeTile(biomeDef.accentTile)
        }
      }
    }
    // Cozy frozen campfires
    for (let i = 0; i < 3; i++) {
      const cx = Math.floor(18 + randN() * (W - 36))
      const cy = Math.floor(18 + randN() * (H - 36))
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (cy + dy > 2 && cy + dy < H - 2 && cx + dx > 2 && cx + dx < W - 2) {
            tiles[cy + dy][cx + dx] = makeTile('snow')
          }
        }
      }
      tiles[cy][cx] = makeTile('frozen_campfire')
    }
  } else if (cat === 'swamp') {
    // SWAMP: Dark water channels, muddy islets & mossy roots
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        const waterVal = Math.sin(x * 0.11) * Math.sin(y * 0.11)
        if (waterVal > 0.25) {
          tiles[y][x] = makeTile('dark_water')
        } else if (waterVal < -0.35) {
          tiles[y][x] = makeTile(biomeDef.wallTile)
        } else if ((x + y) % 11 === 0) {
          tiles[y][x] = makeTile(biomeDef.accentTile)
        }
      }
    }
  } else if (cat === 'crystal') {
    // CRYSTAL CAVERNS: Geometric crystal pillars & rich gem chambers
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        if (x % 8 === 0 && y % 8 === 0) {
          for (let cy = -1; cy <= 1; cy++) {
            for (let cx = -1; cx <= 1; cx++) {
              if (y + cy > 2 && y + cy < H - 2 && x + cx > 2 && x + cx < W - 2) {
                tiles[y + cy][x + cx] = makeTile('crystal_wall')
              }
            }
          }
        } else if ((x + y) % 9 === 0) {
          tiles[y][x] = makeTile('crystal_floor')
        }
      }
    }
  } else if (cat === 'abyss' || cat === 'underdark' || cat === 'shadow') {
    // ABYSS & UNDERDARK: Void chasms and dark crystal bridges
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        const voidVal = Math.sin(x * 0.08 + floor) + Math.cos(y * 0.08 - floor)
        if (voidVal > 1.15) {
          tiles[y][x] = makeTile('void')
        } else if (voidVal < -1.2) {
          tiles[y][x] = makeTile(biomeDef.wallTile)
        } else if ((x * 5 + y * 7) % 17 === 0) {
          tiles[y][x] = makeTile(biomeDef.accentTile)
        }
      }
    }
    // Dark crystal bridge crossings across void
    const midY = Math.floor(H / 2)
    for (let x = 10; x < W - 10; x++) {
      if (tiles[midY]?.[x]) tiles[midY][x] = makeTile('dark_crystal')
    }
  } else if (cat === 'ruins') {
    // RUINS: Temple rooms, ruin walls & pillar halls
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        if ((x % 11 === 0 || y % 11 === 0) && !((x % 11 >= 4 && x % 11 <= 6) || (y % 11 >= 4 && y % 11 <= 6))) {
          tiles[y][x] = makeTile(biomeDef.wallTile)
        } else if (x % 11 === 5 && y % 11 === 5) {
          tiles[y][x] = makeTile('ruin_pillar')
        } else if ((x + y) % 13 === 0) {
          tiles[y][x] = makeTile(biomeDef.accentTile)
        }
      }
    }
  } else if (cat === 'sky' || cat === 'celestial') {
    // SKY & CELESTIAL: Floating platform islands separated by sky void
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        const dx = (x - W / 2)
        const dy = (y - H / 2)
        const islandDist = Math.sin(dx * 0.09) * Math.cos(dy * 0.09)
        if (islandDist < -0.15) {
          tiles[y][x] = makeTile('sky_void')
        } else if ((x + y) % 9 === 0) {
          tiles[y][x] = makeTile('sky_platform')
        }
      }
    }
    // Cloud bridges connecting islands
    const midY = Math.floor(H / 2)
    const midX = Math.floor(W / 2)
    for (let x = 5; x < W - 5; x++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (tiles[midY + dy]?.[x]) tiles[midY + dy][x] = makeTile('cloud_floor')
      }
    }
    for (let y = 5; y < H - 5; y++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (tiles[y]?.[midX + dx]) tiles[y][midX + dx] = makeTile('cloud_floor')
      }
    }
  } else {
    // DEFAULT BIOME
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        const n = Math.sin(x * 0.1) * Math.cos(y * 0.1)
        if (n > 0.5) {
          tiles[y][x] = makeTile(biomeDef.wallTile)
        } else if ((x + y) % 11 === 0) {
          tiles[y][x] = makeTile(biomeDef.accentTile)
        }
      }
    }
  }

  return tiles
}

export function generate100BiomeMap(biomeBaseId: string, floorLevel: number): GameMap {
  const biomeDef = find100Biome(biomeBaseId) || ALL_100_BIOMES[0]
  const floor = Math.max(1, Math.min(10, floorLevel))

  const W = 120 + floor * 8
  const H = 120 + floor * 8
  let rng = (biomeDef.id.length * 31337 + floor * 77777) % 2147483647
  const randN = () => { rng = (rng * 16807) % 2147483647; return rng / 2147483647 }

  const tiles = buildCategoryTiles(biomeDef, W, H, randN, floor)

  // 1. SPAWN SANCTUARY PAD (7x7 Ornate Plaza)
  const cx = Math.floor(W / 2)
  const cy = Math.floor(H / 2)
  const padTile: TileType = biomeDef.category === 'sky' || biomeDef.category === 'celestial'
    ? 'cloud_floor'
    : biomeDef.category === 'crystal'
    ? 'crystal_floor'
    : biomeDef.category === 'ruins'
    ? 'ancient_tile'
    : 'cobblestone'

  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      if (tiles[cy + dy]?.[cx + dx]) {
        tiles[cy + dy][cx + dx] = makeTile(padTile)
      }
    }
  }
  // Decorative corner braziers / pillars
  if (tiles[cy - 3]?.[cx - 3]) tiles[cy - 3][cx - 3] = makeTile('ancient_brazier')
  if (tiles[cy - 3]?.[cx + 3]) tiles[cy - 3][cx + 3] = makeTile('ancient_brazier')
  if (tiles[cy + 3]?.[cx - 3]) tiles[cy + 3][cx - 3] = makeTile('ancient_brazier')
  if (tiles[cy + 3]?.[cx + 3]) tiles[cy + 3][cx + 3] = makeTile('ancient_brazier')

  // Entry stair/portal on Spawn Sanctuary
  if (tiles[cy - 2]?.[cx]) {
    if (floor > 1) {
      tiles[cy - 2][cx] = makeTile('stairs_down')
    } else {
      tiles[cy - 2][cx] = makeTile(biomeDef.portalTile)
    }
  }

  // 2. EXIT SANCTUARY / BOSS ARENA (Far from spawn)
  const angle = (randN() * Math.PI * 2)
  const dist = Math.floor(W * 0.35)
  const stairUpX = Math.max(16, Math.min(W - 16, Math.round(cx + Math.cos(angle) * dist)))
  const stairUpY = Math.max(16, Math.min(H - 16, Math.round(cy + Math.sin(angle) * dist)))

  const arenaRadius = floor === 10 ? 6 : 3
  for (let dy = -arenaRadius; dy <= arenaRadius; dy++) {
    for (let dx = -arenaRadius; dx <= arenaRadius; dx++) {
      if (tiles[stairUpY + dy]?.[stairUpX + dx]) {
        tiles[stairUpY + dy][stairUpX + dx] = makeTile(padTile)
      }
    }
  }

  if (floor === 10) {
    // Floor 10 APEX BOSS SANCTUARY: Ornate braziers, pillars, chests & Rune Altar
    if (tiles[stairUpY - 5]?.[stairUpX - 5]) tiles[stairUpY - 5][stairUpX - 5] = makeTile('ruin_pillar')
    if (tiles[stairUpY - 5]?.[stairUpX + 5]) tiles[stairUpY - 5][stairUpX + 5] = makeTile('ruin_pillar')
    if (tiles[stairUpY + 5]?.[stairUpX - 5]) tiles[stairUpY + 5][stairUpX - 5] = makeTile('ruin_pillar')
    if (tiles[stairUpY + 5]?.[stairUpX + 5]) tiles[stairUpY + 5][stairUpX + 5] = makeTile('ruin_pillar')

    if (tiles[stairUpY - 4]?.[stairUpX - 2]) tiles[stairUpY - 4][stairUpX - 2] = makeTile('ancient_brazier')
    if (tiles[stairUpY - 4]?.[stairUpX + 2]) tiles[stairUpY - 4][stairUpX + 2] = makeTile('ancient_brazier')

    // Reward Chests
    if (tiles[stairUpY]?.[stairUpX - 3]) tiles[stairUpY][stairUpX - 3] = makeTile('chest')
    if (tiles[stairUpY]?.[stairUpX + 3]) tiles[stairUpY][stairUpX + 3] = makeTile('chest')

    // Central Victory Altar
    if (tiles[stairUpY]?.[stairUpX]) tiles[stairUpY][stairUpX] = makeTile('rune_altar')
  } else {
    // Normal Floor Exit Staircase / Portal
    if (tiles[stairUpY]?.[stairUpX - 2]) tiles[stairUpY][stairUpX - 2] = makeTile('ancient_brazier')
    if (tiles[stairUpY]?.[stairUpX + 2]) tiles[stairUpY][stairUpX + 2] = makeTile('ancient_brazier')

    if (tiles[stairUpY]?.[stairUpX]) {
      tiles[stairUpY][stairUpX] = makeTile('stairs_up')
    }
  }

  // 3. SCATTER LANDMARK POIs (Campsites, Mining Pockets, Treasure Vaults)
  const landmarkCount = 3 + floor
  for (let l = 0; l < landmarkCount; l++) {
    const lx = 14 + Math.floor(randN() * (W - 28))
    const ly = 14 + Math.floor(randN() * (H - 28))
    if (Math.hypot(lx - cx, ly - cy) < 12 || Math.hypot(lx - stairUpX, ly - stairUpY) < 12) continue

    const landmarkType = l % 3
    if (landmarkType === 0) {
      // Mining Pocket
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (tiles[ly + dy]?.[lx + dx]) tiles[ly + dy][lx + dx] = makeTile('dirt')
        }
      }
      if (tiles[ly]?.[lx]) tiles[ly][lx] = makeTile('iron_ore_node')
      if (tiles[ly - 1]?.[lx]) tiles[ly - 1][lx] = makeTile('gold_ore_node')
      if (tiles[ly + 1]?.[lx]) tiles[ly + 1][lx] = makeTile('mythril_ore_node')
      if (tiles[ly]?.[lx - 1]) tiles[ly][lx - 1] = makeTile('diamond_ore_node')
    } else if (landmarkType === 1) {
      // Campsite / Rest Spot
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (tiles[ly + dy]?.[lx + dx]) tiles[ly + dy][lx + dx] = makeTile('dirt')
        }
      }
      if (tiles[ly]?.[lx]) tiles[ly][lx] = makeTile('campfire')
      if (tiles[ly - 1]?.[lx]) tiles[ly - 1][lx] = makeTile('mossy_stone')
      if (tiles[ly + 1]?.[lx]) tiles[ly + 1][lx] = makeTile('mossy_stone')
      if (tiles[ly]?.[lx + 1]) tiles[ly][lx + 1] = makeTile('chest')
    } else {
      // Treasure Vault Alcove
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (tiles[ly + dy]?.[lx + dx]) tiles[ly + dy][lx + dx] = makeTile('ancient_tile')
        }
      }
      if (tiles[ly]?.[lx]) tiles[ly][lx] = makeTile('chest')
      if (tiles[ly - 1]?.[lx - 1]) tiles[ly - 1][lx - 1] = makeTile('ancient_brazier')
      if (tiles[ly - 1]?.[lx + 1]) tiles[ly - 1][lx + 1] = makeTile('ancient_brazier')
    }
  }

  // 4. ORE NODES & TREASURES SCATTER
  for (let i = 0; i < 20 + floor * 5; i++) {
    const ox = 10 + Math.floor(randN() * (W - 20))
    const oy = 10 + Math.floor(randN() * (H - 20))
    if (tiles[oy]?.[ox]?.walkable) {
      const roll = randN()
      if (roll < 0.35) tiles[oy][ox] = makeTile('iron_ore_node')
      else if (roll < 0.65) tiles[oy][ox] = makeTile('gold_ore_node')
      else if (roll < 0.85) tiles[oy][ox] = makeTile('mythril_ore_node')
      else tiles[oy][ox] = makeTile('diamond_ore_node')
    }
  }

  // 5. MONSTERS
  const monsters: Monster[] = []
  const baseLvl = biomeDef.minLevel + (floor - 1) * 5
  const mobCount = 25 + floor * 6

  for (let i = 0; i < mobCount; i++) {
    const mx = 10 + Math.floor(randN() * (W - 20))
    const my = 10 + Math.floor(randN() * (H - 20))
    if (!tiles[my]?.[mx]?.walkable || Math.hypot(mx - cx, my - cy) < 10) continue

    const t = biomeDef.mobPool[Math.floor(randN() * biomeDef.mobPool.length)] || 'skeleton'
    const lvl = baseLvl + Math.floor(randN() * 4)
    const elite: EliteTier = randN() < 0.15 + floor * 0.02
      ? 'champion'
      : randN() < 0.35 + floor * 0.03
      ? 'elite'
      : 'normal'
    monsters.push(createMonster(t, lvl, mx * 32, my * 32, elite))
  }

  // BOSS MONSTER ON FLOOR 10
  if (floor === 10) {
    monsters.push(createMonster(biomeDef.bossType, baseLvl + 25, stairUpX * 32, (stairUpY - 2) * 32, 'boss'))
  }

  const map: GameMap = {
    id: floor === 1 ? biomeDef.id : `${biomeDef.id}_f${floor}`,
    name: `${biomeDef.name} — Andar ${floor}`,
    width: W,
    height: H,
    tiles,
    monsters,
    spawnPoints: [{ x: cx * 32, y: (cy + 1) * 32 }],
    ambience: biomeDef.ambience,
    musicTheme: biomeDef.musicTheme,
    minLevel: baseLvl
  }

  return ensureMapAccessibility(map)
}

// ════════════════════════════════════════════════════════════════════════════
// 100-FLOOR MEGA DUNGEON / MASMORRA GENERATOR (Floors 1..100)
// ════════════════════════════════════════════════════════════════════════════
export function generate100FloorDungeonMap(
  floorLevel: number,
  dungeonType: 'dungeon' | 'catacombs' | 'masmorra' | 'endless' = 'dungeon'
): GameMap {
  const floor = Math.max(1, Math.min(100, floorLevel))
  const W = 110 + Math.min(70, floor * 2)
  const H = 110 + Math.min(70, floor * 2)
  const tiles: Tile[][] = []

  let rng = (floor * 99999 + 31337 + dungeonType.length * 7) % 2147483647
  const randN = () => { rng = (rng * 16807) % 2147483647; return rng / 2147483647 }

  // Dynamic Theme according to Floor Level & Dungeon Type
  let wallTile: TileType = 'dungeon_wall'
  let floorTile: TileType = 'dungeon_floor'
  let accentTile: TileType = 'broken_tile'
  let mapTitleName = 'Masmorra do Abismo'

  if (dungeonType === 'catacombs') {
    mapTitleName = 'Catacumbas dos Ancestrais'
    wallTile = floor > 75 ? 'abyss_wall' : floor > 50 ? 'ruin_wall' : floor > 25 ? 'dungeon_brick' : 'ruin_wall'
    floorTile = floor > 75 ? 'abyss_floor' : floor > 50 ? 'ancient_tile' : floor > 25 ? 'ruin_floor' : 'ancient_tile'
    accentTile = floor > 50 ? 'cobweb' : 'sarcophagus'
  } else if (dungeonType === 'masmorra') {
    mapTitleName = 'Masmorra Imperial'
    wallTile = floor > 75 ? 'volcanic_rock' : floor > 50 ? 'house_wall' : 'dungeon_brick'
    floorTile = floor > 75 ? 'magma_crust' : floor > 50 ? 'cobblestone' : 'dungeon_floor'
    accentTile = 'fence'
  } else if (dungeonType === 'endless') {
    mapTitleName = 'Torre Infinita dos Desafios'
    wallTile = 'tower_wall'
    floorTile = 'tower_floor'
    accentTile = 'rune_stone'
  } else {
    wallTile = floor > 75 ? 'abyss_wall' : floor > 50 ? 'volcanic_rock' : floor > 25 ? 'dungeon_brick' : 'dungeon_wall'
    floorTile = floor > 75 ? 'abyss_floor' : floor > 50 ? 'magma_crust' : floor > 25 ? 'ruin_floor' : 'dungeon_floor'
    accentTile = floor > 75 ? 'dark_crystal' : floor > 50 ? 'obsidian' : floor > 25 ? 'ancient_tile' : 'broken_tile'
  }

  // Fill dungeon with wall tiles
  for (let y = 0; y < H; y++) {
    tiles[y] = []
    for (let x = 0; x < W; x++) {
      tiles[y][x] = makeTile(wallTile)
    }
  }

  // Procedural Multi-Room Layout Generation
  const roomCount = 14 + Math.floor(randN() * 10)
  const rooms: { x: number; y: number; w: number; h: number; type: 'spawn' | 'hall' | 'treasury' | 'exit' }[] = []

  for (let i = 0; i < roomCount; i++) {
    const isTreasury = i > 0 && i < roomCount - 1 && randN() < 0.25
    const rw = isTreasury ? 8 + Math.floor(randN() * 4) : 9 + Math.floor(randN() * 12)
    const rh = isTreasury ? 8 + Math.floor(randN() * 4) : 9 + Math.floor(randN() * 12)
    const rx = 6 + Math.floor(randN() * (W - rw - 12))
    const ry = 6 + Math.floor(randN() * (H - rh - 12))

    const type = i === 0 ? 'spawn' : i === roomCount - 1 ? 'exit' : isTreasury ? 'treasury' : 'hall'
    rooms.push({ x: rx, y: ry, w: rw, h: rh, type })

    // Carve room floor
    for (let dy = 0; dy < rh; dy++) {
      for (let dx = 0; dx < rw; dx++) {
        const tileType = (dx === 0 || dy === 0 || dx === rw - 1 || dy === rh - 1) && (dx + dy) % 3 === 0
          ? accentTile
          : floorTile
        tiles[ry + dy][rx + dx] = makeTile(tileType)
      }
    }

    // Add room decorations (pillars, braziers, cobwebs)
    if (type === 'hall' && rw >= 10 && rh >= 10) {
      // Four corner decorative pillars/braziers
      if (tiles[ry + 2]?.[rx + 2]) tiles[ry + 2][rx + 2] = makeTile(floor > 50 ? 'ancient_brazier' : 'ruin_pillar')
      if (tiles[ry + 2]?.[rx + rw - 3]) tiles[ry + 2][rx + rw - 3] = makeTile(floor > 50 ? 'ancient_brazier' : 'ruin_pillar')
      if (tiles[ry + rh - 3]?.[rx + 2]) tiles[ry + rh - 3][rx + 2] = makeTile(floor > 50 ? 'ancient_brazier' : 'ruin_pillar')
      if (tiles[ry + rh - 3]?.[rx + rw - 3]) tiles[ry + rh - 3][rx + rw - 3] = makeTile(floor > 50 ? 'ancient_brazier' : 'ruin_pillar')
    } else if (type === 'treasury') {
      // Center brazier + ore nodes
      const midX = Math.floor(rx + rw / 2)
      const midY = Math.floor(ry + rh / 2)
      tiles[midY][midX] = makeTile(floor > 75 ? 'soul_fire' : 'ancient_brazier')
      if (tiles[midY - 1]?.[midX - 1]) tiles[midY - 1][midX - 1] = makeTile('gold_ore_node')
      if (tiles[midY - 1]?.[midX + 1]) tiles[midY - 1][midX + 1] = makeTile('mythril_ore_node')
      if (tiles[midY + 1]?.[midX - 1]) tiles[midY + 1][midX - 1] = makeTile('iron_ore_node')
      if (tiles[midY + 1]?.[midX + 1]) tiles[midY + 1][midX + 1] = makeTile(floor > 50 ? 'diamond_ore_node' : 'gold_ore_node')
    }
  }

  // Connect rooms with corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    const r1 = rooms[i]
    const r2 = rooms[i + 1]
    const c1x = Math.floor(r1.x + r1.w / 2)
    const c1y = Math.floor(r1.y + r1.h / 2)
    const c2x = Math.floor(r2.x + r2.w / 2)
    const c2y = Math.floor(r2.y + r2.h / 2)

    let cx = c1x, cy = c1y
    while (cx !== c2x) {
      cx += cx < c2x ? 1 : -1
      for (let w = -1; w <= 1; w++) {
        if (tiles[cy + w] && cx >= 0 && cx < W) {
          tiles[cy + w][cx] = makeTile(floorTile)
        }
      }
    }
    while (cy !== c2y) {
      cy += cy < c2y ? 1 : -1
      for (let w = -1; w <= 1; w++) {
        if (tiles[cy] && cx + w >= 0 && cx + w < W) {
          tiles[cy][cx + w] = makeTile(floorTile)
        }
      }
    }
  }

  // Entry Room (Spawn)
  const spawnRoom = rooms[0]
  const spawnX = Math.floor(spawnRoom.x + spawnRoom.w / 2)
  const spawnY = Math.floor(spawnRoom.y + spawnRoom.h / 2)

  // Clear 5x5 safe spawn floor around center
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      if (tiles[spawnY + dy]?.[spawnX + dx]) {
        tiles[spawnY + dy][spawnX + dx] = makeTile(floorTile)
      }
    }
  }

  // Place Return Portal/Stair 3 tiles north of spawn
  if (tiles[spawnY - 3]) {
    if (floor > 1) {
      tiles[spawnY - 3][spawnX] = makeTile('stairs_down')
    } else {
      tiles[spawnY - 3][spawnX] = makeTile('dungeon_portal')
    }
  }

  // Exit Room (Stairs Up to Next Floor or Floor 100 Boss Altar)
  const exitRoom = rooms[rooms.length - 1]
  const exitX = Math.floor(exitRoom.x + exitRoom.w / 2)
  const exitY = Math.floor(exitRoom.y + exitRoom.h / 2)

  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      if (tiles[exitY + dy]?.[exitX + dx]) {
        tiles[exitY + dy][exitX + dx] = makeTile(floorTile)
      }
    }
  }

  if (tiles[exitY]) {
    if (floor < 100) {
      tiles[exitY][exitX] = makeTile('stairs_up')
    } else {
      // Floor 100 Overlord Boss Altar
      tiles[exitY][exitX] = makeTile('rune_altar')
    }
  }

  // Additional Ore nodes across halls
  for (let i = 0; i < 12 + Math.floor(floor * 1.5); i++) {
    const rx = rooms[Math.floor(randN() * rooms.length)]
    const ox = rx.x + 1 + Math.floor(randN() * (rx.w - 2))
    const oy = rx.y + 1 + Math.floor(randN() * (rx.h - 2))
    if (tiles[oy]?.[ox]?.walkable) {
      const roll = randN()
      if (roll < 0.3) tiles[oy][ox] = makeTile('iron_ore_node')
      else if (roll < 0.6) tiles[oy][ox] = makeTile('gold_ore_node')
      else if (roll < 0.85) tiles[oy][ox] = makeTile('mythril_ore_node')
      else tiles[oy][ox] = makeTile('diamond_ore_node')
    }
  }

  // Monsters Population
  const monsters: Monster[] = []
  const baseLvl = 5 + Math.floor(floor * 1.5)
  const mobTypes: MonsterType[] = floor > 80
    ? ['demon', 'dragon', 'vampire', 'witch']
    : floor > 50
    ? ['knight_enemy', 'vampire', 'demon', 'ghost']
    : floor > 25
    ? ['skeleton', 'orc', 'knight_enemy', 'spider']
    : ['goblin', 'skeleton', 'zombie', 'spider']

  for (let i = 1; i < rooms.length; i++) {
    const r = rooms[i]
    const count = r.type === 'treasury' ? 6 + Math.floor(randN() * 4) : 4 + Math.floor(randN() * 5)
    for (let m = 0; m < count; m++) {
      const mx = r.x + 1 + Math.floor(randN() * (r.w - 2))
      const my = r.y + 1 + Math.floor(randN() * (r.h - 2))
      const mobType = mobTypes[Math.floor(randN() * mobTypes.length)]
      const lvl = baseLvl + Math.floor(randN() * 4)
      const elite: EliteTier = r.type === 'treasury'
        ? (randN() < 0.5 ? 'champion' : 'elite')
        : (randN() < 0.22 ? 'champion' : randN() < 0.45 ? 'elite' : 'normal')
      monsters.push(createMonster(mobType, lvl, mx * 32, my * 32, elite))
    }
  }

  // Floor Bosses every 10 floors
  if (floor % 10 === 0 || floor === 100) {
    const bossMob = floor === 100 ? 'dragon' : floor > 70 ? 'demon' : floor > 40 ? 'knight_enemy' : 'vampire'
    monsters.push(createMonster(bossMob, baseLvl + 25, exitX * 32, (exitY - 2) * 32, 'boss'))
  }

  const mapIdPrefix = dungeonType === 'catacombs' ? 'catacombs' : dungeonType === 'masmorra' ? 'masmorra' : dungeonType === 'endless' ? 'endless' : 'dungeon'
  const map: GameMap = {
    id: `${mapIdPrefix}${floor}`,
    name: `${mapTitleName} — Andar ${floor}/100`,
    width: W,
    height: H,
    tiles,
    monsters,
    spawnPoints: [{ x: spawnX * 32, y: (spawnY + 2) * 32 }],
    ambience: dungeonType === 'catacombs' ? 'catacombs' : dungeonType === 'endless' ? 'tower' : 'dungeon',
    musicTheme: dungeonType === 'endless' ? 'boss' : 'dungeon',
    minLevel: baseLvl
  }

  return ensureMapAccessibility(map)
}
