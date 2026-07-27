/**
 * Sprite sheets gerados por IA (pixel art) com grid FIXO.
 * NUNCA alterar COLS/ROWS/CELL: o alinhamento do grid depende disso.
 */
import classes1 from '@/assets/sheets/classes_1.png.asset.json'
import classes2 from '@/assets/sheets/classes_2.png.asset.json'
import skins1 from '@/assets/sheets/skins_1.png.asset.json'
import skins2 from '@/assets/sheets/skins_2.png.asset.json'
import { ALL_100_CLASSES } from './hundredClassesData'

export const SHEET_COLS = 10
export const SHEET_ROWS = 5
export const SHEET_CELL = 192 // 10 x 192 = 1920, 5 x 192 = 960
export const SHEET_PER_IMAGE = SHEET_COLS * SHEET_ROWS // 50

export const CLASS_SHEETS = [classes1.url, classes2.url]
export const SKIN_SHEETS = [skins1.url, skins2.url]

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
  const row = SKIN_SHEET_CLASS_ORDER.indexOf(classId)
  if (row < 0) return null
  const clamped = Math.max(0, Math.min(SHEET_COLS - 1, skinIndex))
  return frame(SKIN_SHEETS, row * SHEET_COLS + clamped)
}

const imageCache = new Map<string, HTMLImageElement>()

export function loadSheetImage(url: string): HTMLImageElement {
  let img = imageCache.get(url)
  if (!img) {
    img = new Image()
    img.src = url
    imageCache.set(url, img)
  }
  return img
}

/** Desenha o sprite do sheet no canvas (pixel art, sem suavização). */
export function drawSheetSprite(
  ctx: CanvasRenderingContext2D,
  f: SheetFrame,
  dx: number,
  dy: number,
  dSize: number,
): boolean {
  const img = loadSheetImage(f.url)
  if (!img.complete || img.naturalWidth === 0) return false
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(img, f.sx, f.sy, f.size, f.size, dx, dy, dSize, dSize)
  return true
}
