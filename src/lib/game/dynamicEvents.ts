import type { GameState, Monster, Particle, Projectile, TileType } from './types'
import { createMonster } from './monsterFactory'

export type DynamicEventType =
  | 'blood_moon'
  | 'blizzard'
  | 'sandstorm'
  | 'volcanic_eruption'
  | 'toxic_surge'
  | 'celestial_shower'
  | 'goblin_raid'

export interface DynamicEventDef {
  type: DynamicEventType
  name: string
  description: string
  color: string
  bannerBg: string
  durationTicks: number
  compatibleBiomes: string[]
}

export const DYNAMIC_EVENTS: Record<DynamicEventType, DynamicEventDef> = {
  blood_moon: {
    type: 'blood_moon',
    name: '🔴 Eclipse da Lua de Sangue!',
    description: 'Os monstros estão enfurecidos, ganham vampirismo e 50% de velocidade, mas soltam tesouros lendários!',
    color: '#ef4444',
    bannerBg: 'rgba(127, 29, 29, 0.85)',
    durationTicks: 1800, // 30s
    compatibleBiomes: ['abyss', 'dungeon', 'ruins', 'catacombs', 'city'],
  },
  blizzard: {
    type: 'blizzard',
    name: '❄️ Nevasca Devastadora!',
    description: 'Uma nevasca intensa congela a visibilidade. Golems de Gelo despertaram do permafrost!',
    color: '#38bdf8',
    bannerBg: 'rgba(12, 74, 110, 0.85)',
    durationTicks: 1800,
    compatibleBiomes: ['tundra', 'mountain', 'snow', 'city'],
  },
  sandstorm: {
    type: 'sandstorm',
    name: '🌪️ Tempestade de Areia Solar!',
    description: 'Ventos uivantes cobrem o horizonte. Vermes das Dunas surgiram do deserto!',
    color: '#facc15',
    bannerBg: 'rgba(113, 63, 18, 0.85)',
    durationTicks: 1800,
    compatibleBiomes: ['desert', 'badlands', 'city'],
  },
  volcanic_eruption: {
    type: 'volcanic_eruption',
    name: '🔥 Erupção Vulcânica Ativa!',
    description: 'Meteoros de magma estão caindo dos céus! Cuidado com o chão escaldante!',
    color: '#f97316',
    bannerBg: 'rgba(124, 45, 18, 0.85)',
    durationTicks: 1800,
    compatibleBiomes: ['volcano', 'magma', 'dungeon'],
  },
  toxic_surge: {
    type: 'toxic_surge',
    name: '☣️ Surto de Esporos Tóxicos!',
    description: 'Névoa venenosa infecta o ar. Cogumelos Gigantes e Pragas se espalham!',
    color: '#22c55e',
    bannerBg: 'rgba(20, 83, 45, 0.85)',
    durationTicks: 1800,
    compatibleBiomes: ['swamp', 'bog', 'deepforest'],
  },
  celestial_shower: {
    type: 'celestial_shower',
    name: '⭐ Chuva de Estrelas Cadentes!',
    description: 'Fragmentos estelares caem no solo, contendo diamantes puros e minérios cosmicos!',
    color: '#a855f7',
    bannerBg: 'rgba(88, 28, 135, 0.85)',
    durationTicks: 1800,
    compatibleBiomes: ['sky', 'celestial', 'mountain', 'city'],
  },
  goblin_raid: {
    type: 'goblin_raid',
    name: '💰 Invasão dos Goblins do Tesouro!',
    description: 'Hordas de Goblins de Ouro surgiram carregando sacos cheios de gemas e moedas!',
    color: '#eab308',
    bannerBg: 'rgba(113, 63, 18, 0.85)',
    durationTicks: 1500,
    compatibleBiomes: ['forest', 'city', 'dungeon', 'ruins'],
  },
}

export function updateDynamicEvents(state: GameState): {
  event: DynamicEventDef | null
  eventTimer: number
  hazardParticles: Particle[]
  hazardSpawns: Monster[]
  chatMessage?: string
} {
  const tick = state.tick
  const currentMap = state.currentMap
  if (!currentMap) {
    return { event: null, eventTimer: 0, hazardParticles: [], hazardSpawns: [] }
  }

  // Active event from runtime state or trigger new event every ~90 seconds
  let activeEvent: DynamicEventDef | null = (state as any)._activeDynamicEvent ?? null
  let eventTimer: number = (state as any)._dynamicEventTimer ?? 0

  let hazardParticles: Particle[] = []
  let hazardSpawns: Monster[] = []
  let chatMessage: string | undefined = undefined

  if (activeEvent) {
    eventTimer--
    if (eventTimer <= 0) {
      chatMessage = `✨ O evento [${activeEvent.name}] terminou!`
      activeEvent = null
      eventTimer = 0
    } else {
      // Periodic hazard ticks during active event
      if (tick % 60 === 0) {
        if (activeEvent.type === 'volcanic_eruption') {
          // Falling meteors around player
          const px = state.player?.position.x ?? 400
          const py = state.player?.position.y ?? 400
          const mx = px + (Math.random() - 0.5) * 400
          const my = py + (Math.random() - 0.5) * 400
          for (let i = 0; i < 15; i++) {
            hazardParticles.push({
              id: `p_meteor_${tick}_${i}`,
              x: mx + (Math.random() - 0.5) * 20,
              y: my + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3 - 2,
              life: 30 + Math.random() * 20,
              maxLife: 50,
              size: 4 + Math.random() * 4,
              color: '#ff4500',
              type: 'fire',
            })
          }
        } else if (activeEvent.type === 'goblin_raid' && tick % 180 === 0) {
          // Spawn Treasure Goblins near player
          const px = state.player?.position.x ?? 400
          const py = state.player?.position.y ?? 400
          const gx = Math.round((px + (Math.random() - 0.5) * 300) / 32) * 32
          const gy = Math.round((py + (Math.random() - 0.5) * 300) / 32) * 32
          hazardSpawns.push(createMonster('goblin', (state.player?.level ?? 1) + 2, gx, gy, 'elite'))
        }
      }
    }
  } else {
    // Check if new event should trigger (every ~2700 ticks / 45s with 20% chance)
    if (tick % 1800 === 0 && Math.random() < 0.35) {
      const mapId = currentMap.id.toLowerCase()
      const possibleEvents = Object.values(DYNAMIC_EVENTS).filter(e =>
        e.compatibleBiomes.some(b => mapId.includes(b))
      )
      const selected = possibleEvents.length > 0
        ? possibleEvents[Math.floor(Math.random() * possibleEvents.length)]
        : DYNAMIC_EVENTS.blood_moon

      activeEvent = selected
      eventTimer = selected.durationTicks
      chatMessage = `🚨 EVENTO DINÂMICO INICIADO: ${selected.name} — ${selected.description}`
    }
  }

  return {
    event: activeEvent,
    eventTimer,
    hazardParticles,
    hazardSpawns,
    chatMessage,
  }
}
