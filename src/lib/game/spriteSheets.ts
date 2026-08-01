/**
 * Sprite sheets gerados por IA (pixel art) com grid FIXO.
 * NUNCA alterar COLS/ROWS/CELL: o alinhamento do grid depende disso.
 */
import classes1 from '@/assets/sheets/classes_1.png.asset.json'
import classes2 from '@/assets/sheets/classes_2.png.asset.json'
import skins1 from '@/assets/sheets/skins_1.png.asset.json'
import skins2 from '@/assets/sheets/skins_2.png.asset.json'
import aurora1 from '@/assets/sheets/pack_aurora_1.png.asset.json'
import aurora2 from '@/assets/sheets/pack_aurora_2.png.asset.json'
import inferno1 from '@/assets/sheets/pack_inferno_1.png.asset.json'
import inferno2 from '@/assets/sheets/pack_inferno_2.png.asset.json'
import dummy from '@/assets/sheets/training_dummy.png.asset.json'
import { ALL_100_CLASSES } from './hundredClassesData'

export const SHEET_COLS = 10
export const SHEET_ROWS = 5
export const SHEET_CELL = 192 // 10 x 192 = 1920, 5 x 192 = 960
export const SHEET_PER_IMAGE = SHEET_COLS * SHEET_ROWS // 50

export const CLASS_SHEETS = [classes1.url, classes2.url]
export const SKIN_SHEETS = [skins1.url, skins2.url]

/** Pacotes temáticos de skin: cobrem TODAS as 100 classes (50 por imagem). */
export const PACK_SHEETS: Record<number, string[]> = {
  1: [aurora1.url, aurora2.url],
  2: [inferno1.url, inferno2.url],
}

export const SKIN_PACKS = [
  { id: 1, skinIndex: 100, name: 'Aurora Celestial', color: '#ffe9a8' },
  { id: 2, skinIndex: 200, name: 'Inferno Obsidiana', color: '#ff5a1f' },
]

/**
 * 10 pacotes temáticos adicionais: recolorização determinística das folhas
 * de classe (grid idêntico, nenhum alinhamento é alterado).
 */
export interface TintTheme {
  id: number
  skinIndex: number
  name: string
  color: string
  filter: string
  blend: GlobalCompositeOperation
  alpha: number
  /** Gradiente vertical opcional (topo -> base) aplicado sobre o sprite. */
  gradient?: [string, string]
  /** Intensidade do gradiente. */
  gradientAlpha?: number
  /** Modo de mesclagem do gradiente. */
  gradientBlend?: GlobalCompositeOperation
}

export const TINT_PACKS: TintTheme[] = [
  { id: 3,  skinIndex: 300,  name: 'Esmeralda Silvestre', color: '#22c55e', filter: 'hue-rotate(95deg) saturate(1.5) brightness(1.02)', blend: 'overlay', alpha: 0.32,
    gradient: ['#d9f99d', '#14532d'], gradientAlpha: 0.4, gradientBlend: 'overlay' },
  { id: 4,  skinIndex: 400,  name: 'Safira Abissal',      color: '#2563eb', filter: 'hue-rotate(190deg) saturate(1.4)',                  blend: 'overlay', alpha: 0.38,
    gradient: ['#93c5fd', '#1e1b4b'], gradientAlpha: 0.46, gradientBlend: 'multiply' },
  { id: 5,  skinIndex: 500,  name: 'Ametista Arcana',     color: '#a855f7', filter: 'hue-rotate(255deg) saturate(1.45) brightness(1.05)', blend: 'overlay', alpha: 0.36,
    gradient: ['#f0abfc', '#312e81'], gradientAlpha: 0.42, gradientBlend: 'screen' },
  { id: 6,  skinIndex: 600,  name: 'Rubi Sangrento',      color: '#dc2626', filter: 'hue-rotate(-25deg) saturate(1.6) contrast(1.08)',    blend: 'overlay', alpha: 0.4,
    gradient: ['#fca5a5', '#450a0a'], gradientAlpha: 0.48, gradientBlend: 'multiply' },
  { id: 7,  skinIndex: 700,  name: 'Ouro Imperial',       color: '#f5c518', filter: 'hue-rotate(35deg) saturate(1.5) brightness(1.12)',   blend: 'overlay', alpha: 0.34,
    gradient: ['#fffbeb', '#92400e'], gradientAlpha: 0.44, gradientBlend: 'overlay' },
  { id: 8,  skinIndex: 800,  name: 'Gelo Polar',          color: '#7dd3fc', filter: 'hue-rotate(160deg) saturate(0.85) brightness(1.18)', blend: 'lighten', alpha: 0.3,
    gradient: ['#ffffff', '#0369a1'], gradientAlpha: 0.38, gradientBlend: 'screen' },
  { id: 9,  skinIndex: 900,  name: 'Sombra Vazia',        color: '#111827', filter: 'saturate(0.35) brightness(0.62) contrast(1.25)',     blend: 'multiply', alpha: 0.45,
    gradient: ['#6b7280', '#000000'], gradientAlpha: 0.5, gradientBlend: 'multiply' },
  { id: 10, skinIndex: 1000, name: 'Bronze Antigo',       color: '#b45309', filter: 'sepia(0.65) saturate(1.35) brightness(0.98)',        blend: 'overlay', alpha: 0.35,
    gradient: ['#fcd34d', '#3f2412'], gradientAlpha: 0.42, gradientBlend: 'multiply' },
  { id: 11, skinIndex: 1100, name: 'Néon Espectral',      color: '#22d3ee', filter: 'hue-rotate(140deg) saturate(2) contrast(1.15) brightness(1.1)', blend: 'color-dodge', alpha: 0.22,
    gradient: ['#f0fdfa', '#0e7490'], gradientAlpha: 0.34, gradientBlend: 'screen' },
  { id: 12, skinIndex: 1200, name: 'Rosa Floral',         color: '#f472b6', filter: 'hue-rotate(300deg) saturate(1.5) brightness(1.08)',  blend: 'overlay', alpha: 0.34,
    gradient: ['#fff1f2', '#9d174d'], gradientAlpha: 0.42, gradientBlend: 'overlay' },

  // ─── 8 novos pacotes, cada um com identidade visual própria ───────────────
  { id: 13, skinIndex: 1300, name: 'Crepúsculo Solar',   color: '#fb923c', filter: 'hue-rotate(20deg) saturate(1.6) brightness(1.06)', blend: 'overlay', alpha: 0.3,
    gradient: ['#fde68a', '#b91c1c'], gradientAlpha: 0.42, gradientBlend: 'overlay' },
  { id: 14, skinIndex: 1400, name: 'Maré Abissal',       color: '#0ea5e9', filter: 'hue-rotate(175deg) saturate(1.3) brightness(0.95) contrast(1.1)', blend: 'multiply', alpha: 0.26,
    gradient: ['#67e8f9', '#083344'], gradientAlpha: 0.45, gradientBlend: 'overlay' },
  { id: 15, skinIndex: 1500, name: 'Toxina Venenosa',    color: '#84cc16', filter: 'hue-rotate(75deg) saturate(2) contrast(1.2)', blend: 'color-dodge', alpha: 0.2,
    gradient: ['#bef264', '#365314'], gradientAlpha: 0.4, gradientBlend: 'overlay' },
  { id: 16, skinIndex: 1600, name: 'Prata Espelhada',    color: '#e2e8f0', filter: 'saturate(0.12) brightness(1.22) contrast(1.3)', blend: 'lighten', alpha: 0.28,
    gradient: ['#ffffff', '#475569'], gradientAlpha: 0.35, gradientBlend: 'overlay' },
  { id: 17, skinIndex: 1700, name: 'Cinzas Vulcânicas',  color: '#7f1d1d', filter: 'saturate(0.6) brightness(0.78) contrast(1.35) sepia(0.25)', blend: 'multiply', alpha: 0.4,
    gradient: ['#f97316', '#171717'], gradientAlpha: 0.5, gradientBlend: 'overlay' },
  { id: 18, skinIndex: 1800, name: 'Aurora Boreal',      color: '#34d399', filter: 'hue-rotate(130deg) saturate(1.7) brightness(1.12)', blend: 'screen', alpha: 0.22,
    gradient: ['#a78bfa', '#22d3ee'], gradientAlpha: 0.44, gradientBlend: 'overlay' },
  { id: 19, skinIndex: 1900, name: 'Realeza Púrpura',    color: '#7c3aed', filter: 'hue-rotate(270deg) saturate(1.55) brightness(0.98)', blend: 'overlay', alpha: 0.4,
    gradient: ['#f5c518', '#4c1d95'], gradientAlpha: 0.4, gradientBlend: 'overlay' },
  { id: 20, skinIndex: 2000, name: 'Vazio Estelar',      color: '#1e1b4b', filter: 'saturate(0.5) brightness(0.7) contrast(1.4) hue-rotate(215deg)', blend: 'multiply', alpha: 0.42,
    gradient: ['#c4b5fd', '#020617'], gradientAlpha: 0.5, gradientBlend: 'overlay' },
]

export const ALL_SKIN_PACKS = [...SKIN_PACKS, ...TINT_PACKS.map(t => ({ id: t.id, skinIndex: t.skinIndex, name: t.name, color: t.color }))]

export function tintThemeForSkin(skinIndex: number): TintTheme | null {
  return TINT_PACKS.find(t => t.skinIndex === skinIndex) ?? null
}

export const TRAINING_DUMMY_URL = dummy.url

/** Ordem das classes-base das folhas de skins (5 classes por folha, 10 skins por linha). */
export const SKIN_SHEET_CLASS_ORDER = [
  'knight', 'archer', 'mage', 'necromancer', 'paladin',
  'berserker', 'assassin', 'druid', 'monk', 'samurai',
]

export interface SheetFrame {
  url: string
  sx: number
  sy: number
  size: number
  tint?: number
}

function frame(urls: string[], index: number): SheetFrame | null {
  if (index < 0 || index >= urls.length * SHEET_PER_IMAGE) return null
  const sheet = Math.floor(index / SHEET_PER_IMAGE)
  const local = index % SHEET_PER_IMAGE
  return {
    url: urls[sheet],
    sx: (local % SHEET_COLS) * SHEET_CELL,
    sy: Math.floor(local / SHEET_COLS) * SHEET_CELL,
    size: SHEET_CELL,
  }
}

export function classFrame(classId: string): SheetFrame | null {
  const index = ALL_100_CLASSES.findIndex((c: { id: string }) => c.id === classId)
  return frame(CLASS_SHEETS, index)
}

/** skinIndex 0..9 (tiers Aprendiz -> Supremo Ancestral). */
export function skinFrame(classId: string, skinIndex: number): SheetFrame | null {
  const theme = tintThemeForSkin(skinIndex)
  if (theme) {
    const f = classFrame(classId)
    return f ? { ...f, tint: theme.skinIndex } : null
  }
  if (skinIndex >= 100) return packFrame(classId, Math.floor(skinIndex / 100))
  const row = SKIN_SHEET_CLASS_ORDER.indexOf(classId)
  if (row < 0) return null
  const clamped = Math.max(0, Math.min(SHEET_COLS - 1, skinIndex))
  return frame(SKIN_SHEETS, row * SHEET_COLS + clamped)
}

/** Pacotes temáticos: mesmo índice de classe do grid principal (10x5, 192px). */
export function packFrame(classId: string, packId: number): SheetFrame | null {
  const urls = PACK_SHEETS[packId]
  if (!urls) return null
  const index = ALL_100_CLASSES.findIndex((c: { id: string }) => c.id === classId)
  return frame(urls, index)
}

const imageCache = new Map<string, HTMLImageElement>()
const tintCache = new Map<string, HTMLCanvasElement>()

export function loadSheetImage(url: string): HTMLImageElement {
  let img = imageCache.get(url)
  if (!img) {
    img = new Image()
    img.src = url
    imageCache.set(url, img)
  }
  return img
}

/** Gera (e memoiza) uma versão recolorizada de uma folha inteira. */
function getTintedSheet(url: string, skinIndex: number): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null
  const key = `${url}#${skinIndex}`
  const cached = tintCache.get(key)
  if (cached) return cached
  const theme = tintThemeForSkin(skinIndex)
  const img = loadSheetImage(url)
  if (!theme || !img.complete || img.naturalWidth === 0) return null

  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.imageSmoothingEnabled = false
  ctx.filter = theme.filter
  ctx.drawImage(img, 0, 0)
  ctx.filter = 'none'
  ctx.globalCompositeOperation = theme.blend
  ctx.globalAlpha = theme.alpha
  ctx.fillStyle = theme.color
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalAlpha = 1
  if (theme.gradient) {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
    grad.addColorStop(0, theme.gradient[0])
    grad.addColorStop(1, theme.gradient[1])
    ctx.globalCompositeOperation = theme.gradientBlend ?? 'overlay'
    ctx.globalAlpha = theme.gradientAlpha ?? 0.4
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 1
  }
  // Mantém a transparência original do sprite
  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(img, 0, 0)
  ctx.globalCompositeOperation = 'source-over'

  tintCache.set(key, canvas)
  return canvas
}

/** Desenha o sprite do sheet no canvas (pixel art, sem suavização). */
export function drawSheetSprite(
  ctx: CanvasRenderingContext2D,
  f: SheetFrame,
  dx: number,
  dy: number,
  dSize: number,
): boolean {
  if (f.tint) {
    const tinted = getTintedSheet(f.url, f.tint)
    if (tinted) {
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(tinted, f.sx, f.sy, f.size, f.size, dx, dy, dSize, dSize)
      return true
    }
  }
  const img = loadSheetImage(f.url)
  if (!img.complete || img.naturalWidth === 0) return false
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(img, f.sx, f.sy, f.size, f.size, dx, dy, dSize, dSize)
  return true
}
