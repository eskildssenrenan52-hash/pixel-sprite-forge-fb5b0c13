// @ts-nocheck

export interface GeminiPixelArtScene {
  biomeName: string
  themeColor: string
  secondaryColor: string
  accentColor: string
  skyGradient: [string, string]
  loreText: string
  tipText: string
}

export const BIOME_SCENES: Record<string, GeminiPixelArtScene> = {
  forest: {
    biomeName: 'Bosque dos Sussurros',
    themeColor: '#22c55e',
    secondaryColor: '#14532d',
    accentColor: '#86efac',
    skyGradient: ['#051c0d', '#14532d'],
    loreText: 'Dizem que as árvores milenares deste bosque guardam segredos antigos e cristais de mana pura.',
    tipText: '💡 Dica: Mantenha poções de vida no cinto rápido para sobreviver contra inimigos em bando!',
  },
  volcano: {
    biomeName: 'Cratera Magmática',
    themeColor: '#f97316',
    secondaryColor: '#450a0a',
    accentColor: '#fdba74',
    skyGradient: ['#300606', '#7c2d12'],
    loreText: 'Rios de lava incandescente fluem do coração da terra, onde os dragões anciões adormecem.',
    tipText: '💡 Dica: Equipe armaduras com resistência a Fogo ao explorar as profundezas vulcânicas.',
  },
  tundra: {
    biomeName: 'Picos Gelados da Tundra',
    themeColor: '#38bdf8',
    secondaryColor: '#0c4a6e',
    accentColor: '#bae6fd',
    skyGradient: ['#061a29', '#1e3a8a'],
    loreText: 'Ventos uivantes congelam o próprio tempo nas montanhas cobertas por neve eterna.',
    tipText: '💡 Dica: Use feitiços de Piromancia para derreter defesas congeladas dos golens de gelo.',
  },
  desert: {
    biomeName: 'Deserto das Dunas Douradas',
    themeColor: '#eab308',
    secondaryColor: '#713f12',
    accentColor: '#fef08a',
    skyGradient: ['#291405', '#713f12'],
    loreText: 'Tempestades de areia ocultam pirâmides seladas repletas de múmias e relíquias rúnicas.',
    tipText: '💡 Dica: Suba de nível a habilidade Esquiva para escapar de armadilhas de areia movediça.',
  },
  abyss: {
    biomeName: 'Abismo Sombrio',
    themeColor: '#a855f7',
    secondaryColor: '#3b0764',
    accentColor: '#d8b4fe',
    skyGradient: ['#1c0438', '#3b0764'],
    loreText: 'Energias arcanas corrompidas distorcem a realidade nesta fenda interdimensional.',
    tipText: '💡 Dica: Necromantes e Bruxos ganham bônus de dano mágico em zonas do Abismo!',
  },
  sky: {
    biomeName: 'Ilhas Suspensas das Nuvens',
    themeColor: '#e0e7ff',
    secondaryColor: '#312e81',
    accentColor: '#a5b4fc',
    skyGradient: ['#0f0d2e', '#312e81'],
    loreText: 'Plataformas flutuantes celestiais regidas por guardiões com asas de luz rúnica.',
    tipText: '💡 Dica: Complete as Missões Diárias (Q) para receber bastante Ouro e Rubis.',
  }
}

export function fetchGeminiPixelArtBg(biomeKey: string = 'forest'): GeminiPixelArtScene {
  return BIOME_SCENES[biomeKey] || BIOME_SCENES.forest
}
