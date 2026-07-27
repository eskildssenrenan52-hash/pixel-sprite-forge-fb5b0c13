import type { WeatherType, LightSource, AmbientLighting, Vec2, Particle } from './types'

export interface WeatherEffectState {
  current: WeatherType
  timer: number
  duration: number
  intensity: number // 0.0 to 1.0
  particles: Particle[]
}

export function createInitialWeatherState(): WeatherEffectState {
  return {
    current: 'none',
    timer: 0,
    duration: 300,
    intensity: 0,
    particles: []
  }
}

export function updateWeatherAndLighting(
  weather: WeatherEffectState,
  mapId: string,
  tick: number,
  timeOfDay: number // 0.0 to 1.0 (0=noon, 0.5=sunset, 0.75=night, 1.0=dawn)
): { weather: WeatherEffectState; lighting: AmbientLighting } {
  // Random weather shift every ~45 seconds (2700 ticks)
  weather.timer++
  if (weather.timer >= weather.duration) {
    weather.timer = 0
    weather.duration = 1800 + Math.floor(Math.random() * 1800) // 30s to 60s
    
    // Choose weather based on biome theme
    const options: WeatherType[] = getBiomeWeatherOptions(mapId)
    weather.current = options[Math.floor(Math.random() * options.length)]
    weather.intensity = 0.4 + Math.random() * 0.6
  }

  // Calculate ambient lighting based on time of day, floor depth, and weather
  const isNight = timeOfDay > 0.4 && timeOfDay < 0.95
  const nightFactor = isNight ? Math.sin((timeOfDay - 0.4) / 0.55 * Math.PI) : 0
  
  let baseAmbientOpacity = 0.15 + nightFactor * 0.65
  let ambientRgb = '15, 23, 42' // dark slate blue
  let wetness = 0
  let fogDensity = 0
  let fogColor = 'rgba(200, 210, 230, 0.2)'

  switch (weather.current) {
    case 'rain':
      wetness = 0.8 * weather.intensity
      ambientRgb = '30, 41, 59'
      baseAmbientOpacity += 0.2
      break
    case 'thunderstorm':
      wetness = 1.0
      ambientRgb = '15, 23, 42'
      baseAmbientOpacity += 0.35
      if (Math.random() < 0.02) baseAmbientOpacity = 0.02
      break
    case 'snow':
      wetness = 0.3
      fogDensity = 0.3 * weather.intensity
      fogColor = 'rgba(240, 248, 255, 0.3)'
      ambientRgb = '51, 65, 85'
      break
    case 'acid_rain':
      wetness = 0.9
      ambientRgb = '20, 83, 45'
      baseAmbientOpacity += 0.25
      break
    case 'ashfall':
      fogDensity = 0.5 * weather.intensity
      fogColor = 'rgba(120, 113, 108, 0.4)'
      ambientRgb = '68, 64, 60'
      break
    case 'sandstorm':
      fogDensity = 0.7 * weather.intensity
      fogColor = 'rgba(217, 119, 6, 0.45)'
      ambientRgb = '120, 53, 15'
      baseAmbientOpacity += 0.15
      break
    case 'solar_flare':
      ambientRgb = '234, 88, 12'
      baseAmbientOpacity = 0.05
      break
    case 'fog':
      fogDensity = 0.6 * weather.intensity
      fogColor = 'rgba(148, 163, 184, 0.4)'
      break
    case 'void_tempest':
      ambientRgb = '88, 28, 135'
      baseAmbientOpacity += 0.4
      fogDensity = 0.4
      fogColor = 'rgba(168, 85, 247, 0.25)'
      break
  }

  // If in dungeon or catacombs, enforce dark ambient darkness
  if (mapId.startsWith('dungeon') || mapId.startsWith('catacombs') || mapId.startsWith('masmorra')) {
    baseAmbientOpacity = Math.max(0.65, baseAmbientOpacity)
    ambientRgb = '8, 12, 22'
    wetness = 0.5
  }

  const sunAngle = timeOfDay * Math.PI * 2
  const sunDirX = Math.cos(sunAngle)
  const sunDirY = Math.sin(sunAngle)

  const lighting: AmbientLighting = {
    color: `rgba(${ambientRgb}, ${Math.min(0.85, baseAmbientOpacity)})`,
    sunDirection: { x: sunDirX, y: sunDirY },
    shadowLength: 15 + nightFactor * 25,
    fogColor,
    fogDensity,
    wetness
  }

  return { weather, lighting }
}

function getBiomeWeatherOptions(mapId: string): WeatherType[] {
  if (mapId.includes('volcano')) return ['none', 'ashfall', 'solar_flare']
  if (mapId.includes('tundra') || mapId.includes('mountain') || mapId.includes('snow')) return ['none', 'snow', 'fog']
  if (mapId.includes('forest') || mapId.includes('jungle')) return ['none', 'rain', 'thunderstorm', 'fog']
  if (mapId.includes('abyss') || mapId.includes('dungeon')) return ['none', 'void_tempest', 'fog']
  if (mapId.includes('ruins')) return ['none', 'sandstorm', 'acid_rain']
  return ['none', 'rain', 'fog', 'thunderstorm', 'snow']
}

// ─── 3D Isometric Projected Entity Shadow ──────────────────────────────────────
export function draw3DProjectedShadow(
  ctx: CanvasRenderingContext2D,
  entityX: number,
  entityY: number,
  entityWidth: number,
  entityHeight: number,
  lights: LightSource[],
  ambient: AmbientLighting,
  camera: Vec2
) {
  const screenX = entityX - camera.x
  const screenY = entityY - camera.y

  let lightDx = ambient.sunDirection.x
  let lightDy = ambient.sunDirection.y
  let shadowLen = ambient.shadowLength

  // Find primary local point light (e.g., nearest brazier, torch, player light)
  let nearestLight: LightSource | null = null
  let minDist = 9999

  for (const l of lights) {
    const d = Math.hypot(entityX - l.x, entityY - l.y)
    if (d < l.radius && d < minDist) {
      minDist = d
      nearestLight = l
    }
  }

  if (nearestLight) {
    // Vector pointing away from light source
    const dx = entityX - nearestLight.x
    const dy = entityY - nearestLight.y
    const len = Math.hypot(dx, dy) || 1
    lightDx = dx / len
    lightDy = dy / len
    shadowLen = Math.min(36, 12 + (1 - minDist / nearestLight.radius) * 24)
  }

  ctx.save()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.42)'
  ctx.beginPath()

  // Projected shadow skew
  const projX = lightDx * shadowLen
  const projY = lightDy * shadowLen

  ctx.ellipse(
    screenX + entityWidth / 2 + projX * 0.45,
    screenY + entityHeight - 2 + projY * 0.25,
    entityWidth * 0.55,
    entityHeight * 0.2,
    Math.atan2(projY, projX),
    0,
    Math.PI * 2
  )
  ctx.fill()
  ctx.restore()
}

// ─── Wet Surface Reflection Shader Pass ───────────────────────────────────────
export function drawWetSurfaceReflection(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  drawEntityCallback: () => void,
  tick: number,
  wetness: number
) {
  if (wetness <= 0.1) return

  ctx.save()
  // Mirror vertically for wet reflection
  ctx.translate(screenX, screenY + 36)
  ctx.scale(1, -0.45) // Squished reflection
  ctx.translate(-screenX, -screenY)

  // Subtle ripple wave distortion using sine wave
  const ripple = Math.sin(tick * 0.1 + screenX * 0.05) * 2
  ctx.translate(ripple, 0)

  ctx.globalAlpha = Math.min(0.35, wetness * 0.38)
  drawEntityCallback()
  ctx.restore()
}

// ─── 3D Lighting & Shadow Rendering Engine ──────────────────────────────────
export function render3DLightingAndShadows(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lights: LightSource[],
  ambient: AmbientLighting,
  camera: Vec2
) {
  ctx.save()

  // 1. Render ambient light mask
  ctx.fillStyle = ambient.color
  ctx.fillRect(0, 0, width, height)

  // 2. Render Light Sources with destination-out blending to punch light through ambient darkness
  ctx.globalCompositeOperation = 'destination-out'

  for (const light of lights) {
    const screenX = light.x - camera.x
    const screenY = light.y - camera.y

    if (
      screenX + light.radius < 0 ||
      screenX - light.radius > width ||
      screenY + light.radius < 0 ||
      screenY - light.radius > height
    ) {
      continue
    }

    const rad = light.radius * (light.pulse ? 0.92 + Math.sin(Date.now() / 200) * 0.08 : 1.0)
    const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, rad)
    grad.addColorStop(0, `rgba(255, 255, 255, ${light.intensity})`)
    grad.addColorStop(0.5, `rgba(255, 255, 255, ${light.intensity * 0.5})`)
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(screenX, screenY, rad, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()

  // 3. Render Light Colors (additive blend for glowing lamps, magic, fire)
  ctx.save()
  ctx.globalCompositeOperation = 'screen'

  for (const light of lights) {
    const screenX = light.x - camera.x
    const screenY = light.y - camera.y

    if (
      screenX + light.radius < 0 ||
      screenX - light.radius > width ||
      screenY + light.radius < 0 ||
      screenY - light.radius > height
    ) {
      continue
    }

    const rad = light.radius
    const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, rad)
    grad.addColorStop(0, light.color)
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(screenX, screenY, rad, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()

  // 4. Render Wet Surface Reflectivity overlay
  if (ambient.wetness > 0) {
    ctx.save()
    ctx.globalCompositeOperation = 'overlay'
    ctx.fillStyle = `rgba(180, 220, 255, ${ambient.wetness * 0.15})`
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }

  // 5. Render Atmospheric Fog Overlay
  if (ambient.fogDensity > 0) {
    ctx.save()
    ctx.fillStyle = ambient.fogColor
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
}
