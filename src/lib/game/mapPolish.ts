// @ts-nocheck
// ─────────────────────────────────────────────────────────────────────────────
//  MAP POLISH — camada de pós-processamento aplicada nos chunks do mapa.
//  Tudo é "assado" uma única vez por chunk (sem custo por frame):
//   1. cor média automática por tipo de tile (amostrada do próprio renderer)
//   2. transição suave entre biomas/tiles vizinhos (edge blending)
//   3. oclusão de ambiente + sombra projetada de paredes/árvores/rochas
//   4. variação determinística de luminosidade por tile (quebra a repetição)
//   5. detalhes finos (grãos, pedriscos, folhas) espalhados no chão
// ─────────────────────────────────────────────────────────────────────────────
import { drawTile } from './sprites'

const TILE = 32

// ─── hash determinístico ─────────────────────────────────────────────────────
function hash2(x: number, y: number, s = 0) {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) >>> 0
  h = (h ^ (h >>> 13)) >>> 0
  h = (h * 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

// ─── ruído suave (valor interpolado) para variação em escala macro ───────────
function smoothNoise(x: number, y: number, scale: number, seed = 0) {
  const fx = x / scale, fy = y / scale
  const x0 = Math.floor(fx), y0 = Math.floor(fy)
  const tx = fx - x0, ty = fy - y0
  const sx = tx * tx * (3 - 2 * tx)
  const sy = ty * ty * (3 - 2 * ty)
  const a = hash2(x0, y0, seed), b = hash2(x0 + 1, y0, seed)
  const c = hash2(x0, y0 + 1, seed), d = hash2(x0 + 1, y0 + 1, seed)
  return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy
}

// ─── cor média por tipo de tile (amostrada do renderer real) ─────────────────
const avgCache = new Map<string, { r: number; g: number; b: number; a: number } | null>()
let scratch: HTMLCanvasElement | null = null

export function avgColorOfType(type: string) {
  if (avgCache.has(type)) return avgCache.get(type)
  if (typeof document === 'undefined') return null
  try {
    if (!scratch) {
      scratch = document.createElement('canvas')
      scratch.width = TILE
      scratch.height = TILE
    }
    const c = scratch.getContext('2d', { willReadFrequently: true })
    if (!c) return null
    c.clearRect(0, 0, TILE, TILE)
    drawTile(c, type as never, 0, 0, 0)
    const d = c.getImageData(0, 0, TILE, TILE).data
    let r = 0, g = 0, b = 0, a = 0, n = 0
    for (let i = 0; i < d.length; i += 4) {
      const al = d[i + 3] / 255
      if (al < 0.05) continue
      r += d[i] * al; g += d[i + 1] * al; b += d[i + 2] * al; a += al; n++
    }
    const res = n === 0 ? null : { r: r / a, g: g / a, b: b / a, a: a / n }
    avgCache.set(type, res)
    return res
  } catch {
    avgCache.set(type, null)
    return null
  }
}

const BLOCK_SHADOW = new Set([
  'wall', 'dungeon_wall', 'dungeon_brick', 'house_wall', 'house_roof', 'tree',
  'pine_tree', 'frozen_tree', 'rock', 'ice_rock', 'snow_rock', 'mountain_rock',
  'volcanic_rock', 'obsidian', 'crystal_wall', 'ruin_wall', 'ruin_pillar',
  'abyss_wall', 'market_stall', 'fence', 'sarcophagus', 'rune_stone',
  'snowy_peak', 'vine_wall', 'crystal', 'dark_crystal',
])

function isSolid(tile: any) {
  if (!tile) return false
  return tile.walkable === false || BLOCK_SHADOW.has(tile.type)
}

// chão "orgânico" que aceita blend suave com o vizinho
function isGround(tile: any) {
  return !!tile && tile.walkable !== false
}

/**
 * Aplica o polimento visual em um chunk já desenhado.
 * ctx está no espaço local do chunk (0,0 = canto do chunk).
 */
export function polishChunk(
  ctx: CanvasRenderingContext2D,
  map: any,
  startTX: number,
  startTY: number,
  endTX: number,
  endTY: number,
) {
  const BLEND = 13
  const AO = 12

  for (let ty = startTY; ty < endTY; ty++) {
    for (let tx = startTX; tx < endTX; tx++) {
      const tile = map.tiles[ty]?.[tx]
      if (!tile) continue
      const ox = (tx - startTX) * TILE
      const oy = (ty - startTY) * TILE
      const solid = isSolid(tile)

      const N = map.tiles[ty - 1]?.[tx]
      const S = map.tiles[ty + 1]?.[tx]
      const W = map.tiles[ty]?.[tx - 1]
      const E = map.tiles[ty]?.[tx + 1]
      const dirs: Array<[any, 'n' | 's' | 'w' | 'e']> = [[N, 'n'], [S, 's'], [W, 'w'], [E, 'e']]

      // ── 1. transição suave entre tiles de chão diferentes ──
      if (!solid) {
        for (const [nb, d] of dirs) {
          if (!nb || nb.type === tile.type || !isGround(nb) || isSolid(nb)) continue
          const col = avgColorOfType(nb.type)
          if (!col) continue
          const rgb = `${Math.round(col.r)},${Math.round(col.g)},${Math.round(col.b)}`
          let g: CanvasGradient
          if (d === 'n') g = ctx.createLinearGradient(0, oy, 0, oy + BLEND)
          else if (d === 's') g = ctx.createLinearGradient(0, oy + TILE, 0, oy + TILE - BLEND)
          else if (d === 'w') g = ctx.createLinearGradient(ox, 0, ox + BLEND, 0)
          else g = ctx.createLinearGradient(ox + TILE, 0, ox + TILE - BLEND, 0)
          g.addColorStop(0, `rgba(${rgb},0.55)`)
          g.addColorStop(0.45, `rgba(${rgb},0.22)`)
          g.addColorStop(1, `rgba(${rgb},0)`)
          ctx.fillStyle = g
          ctx.fillRect(ox, oy, TILE, TILE)

          // borda irregular: mordidas determinísticas para não ficar linha reta
          ctx.fillStyle = `rgba(${rgb},0.35)`
          for (let i = 0; i < 5; i++) {
            const t = hash2(tx, ty, i * 7 + d.charCodeAt(0))
            const p = Math.floor(t * (TILE - 6))
            const depth = 3 + Math.floor(hash2(tx, ty, i * 13 + 5) * 8)
            if (d === 'n') ctx.fillRect(ox + p, oy, 6, depth)
            else if (d === 's') ctx.fillRect(ox + p, oy + TILE - depth, 6, depth)
            else if (d === 'w') ctx.fillRect(ox, oy + p, depth, 6)
            else ctx.fillRect(ox + TILE - depth, oy + p, depth, 6)
          }
        }
      }

      // ── 2. oclusão de ambiente / sombra de estruturas ──
      if (!solid) {
        for (const [nb, d] of dirs) {
          if (!isSolid(nb)) continue
          // sombra vinda do norte é mais forte (luz alta vindo do sul-oeste)
          const strength = d === 'n' ? 0.42 : d === 'w' ? 0.3 : 0.2
          const len = d === 'n' ? AO + 4 : AO
          let g: CanvasGradient
          if (d === 'n') g = ctx.createLinearGradient(0, oy, 0, oy + len)
          else if (d === 's') g = ctx.createLinearGradient(0, oy + TILE, 0, oy + TILE - len)
          else if (d === 'w') g = ctx.createLinearGradient(ox, 0, ox + len, 0)
          else g = ctx.createLinearGradient(ox + TILE, 0, ox + TILE - len, 0)
          g.addColorStop(0, `rgba(6,8,16,${strength})`)
          g.addColorStop(1, 'rgba(6,8,16,0)')
          ctx.fillStyle = g
          ctx.fillRect(ox, oy, TILE, TILE)
        }
        // cantos diagonais
        const diag: Array<[any, number, number]> = [
          [map.tiles[ty - 1]?.[tx - 1], ox, oy],
          [map.tiles[ty - 1]?.[tx + 1], ox + TILE, oy],
          [map.tiles[ty + 1]?.[tx - 1], ox, oy + TILE],
          [map.tiles[ty + 1]?.[tx + 1], ox + TILE, oy + TILE],
        ]
        for (const [nb, gx, gy] of diag) {
          if (!isSolid(nb)) continue
          const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 14)
          g.addColorStop(0, 'rgba(6,8,16,0.3)')
          g.addColorStop(1, 'rgba(6,8,16,0)')
          ctx.fillStyle = g
          ctx.fillRect(ox, oy, TILE, TILE)
        }
      }

      // ── 3. variação determinística de luz por tile ──
      const v = hash2(tx, ty, 91)
      const amount = (v - 0.5) * 0.16
      if (Math.abs(amount) > 0.012) {
        ctx.fillStyle = amount > 0
          ? `rgba(255,244,214,${amount})`
          : `rgba(10,14,26,${-amount})`
        ctx.fillRect(ox, oy, TILE, TILE)
      }

      // ── 4. detalhes finos no chão ──
      if (!solid) {
        const col = avgColorOfType(tile.type)
        if (col) {
          const dk = `rgba(${Math.round(col.r * 0.7)},${Math.round(col.g * 0.7)},${Math.round(col.b * 0.7)},0.5)`
          const lt = `rgba(${Math.min(255, Math.round(col.r * 1.35))},${Math.min(255, Math.round(col.g * 1.35))},${Math.min(255, Math.round(col.b * 1.3))},0.42)`
          const specks = 3
          for (let i = 0; i < specks; i++) {
            const hx = hash2(tx, ty, 200 + i)
            const hy = hash2(tx, ty, 300 + i)
            const px = ox + Math.floor(hx * (TILE - 3))
            const py = oy + Math.floor(hy * (TILE - 3))
            ctx.fillStyle = i % 2 === 0 ? dk : lt
            ctx.fillRect(px, py, 1 + (i % 2), 1)
          }
        }
      }

      // ── 5. topo iluminado em estruturas sólidas (volume) ──
      if (solid) {
        const g = ctx.createLinearGradient(0, oy, 0, oy + TILE)
        g.addColorStop(0, 'rgba(255,240,210,0.13)')
        g.addColorStop(0.45, 'rgba(255,240,210,0)')
        g.addColorStop(1, 'rgba(4,6,12,0.22)')
        ctx.fillStyle = g
        ctx.fillRect(ox, oy, TILE, TILE)
      }
    }
  }

  // ── 6. grão global sutil do chunk (textura de pintura) ──
  ctx.save()
  ctx.globalAlpha = 0.05
  for (let i = 0; i < 260; i++) {
    const gx = Math.floor(hash2(startTX + i, startTY, 7) * (endTX - startTX) * TILE)
    const gy = Math.floor(hash2(startTY + i, startTX, 11) * (endTY - startTY) * TILE)
    ctx.fillStyle = i % 2 ? '#ffffff' : '#000000'
    ctx.fillRect(gx, gy, 1, 1)
  }
  ctx.restore()
}