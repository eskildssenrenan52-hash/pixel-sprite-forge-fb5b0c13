/**
 * Canvas Chroma Key Utility for Real-Time Solid Background Removal.
 * Automatically strips solid green (#00FF00) or specified hex backgrounds
 * from AI-generated 64px Gemini sprites and portraits in real time.
 */

const chromaCache = new Map<string, HTMLCanvasElement>()

/**
 * Loads an image from a URL, removes solid green (#00FF00) or specified background color,
 * and returns a cached HTMLCanvasElement containing the transparent sprite.
 */
export function loadChromaKeySprite(
  url: string,
  targetBgHex: string = '00ff00',
  tolerance: number = 50
): Promise<HTMLCanvasElement> {
  const cacheKey = `${url}_${targetBgHex}_${tolerance}`
  if (chromaCache.has(cacheKey)) {
    return Promise.resolve(chromaCache.get(cacheKey)!)
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.referrerPolicy = 'no-referrer'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context failure'))
        return
      }

      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, img.width, img.height)
      const data = imgData.data

      const targetR = parseInt(targetBgHex.substring(0, 2), 16) || 0
      const targetG = parseInt(targetBgHex.substring(2, 4), 16) || 255
      const targetB = parseInt(targetBgHex.substring(4, 6), 16) || 0

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const diff = Math.max(
          Math.abs(r - targetR),
          Math.abs(g - targetG),
          Math.abs(b - targetB)
        )

        // Green-screen condition or hex tolerance
        if (
          diff <= tolerance ||
          (targetG > 180 && g > r + 35 && g > b + 35) ||
          (r < 40 && g > 190 && b < 40)
        ) {
          data[i + 3] = 0 // Make fully transparent
        }
      }

      ctx.putImageData(imgData, 0, 0)
      chromaCache.set(cacheKey, canvas)
      resolve(canvas)
    }
    img.onerror = (err) => reject(err)
    img.src = url
  })
}

/**
 * Draws a chroma-keyed transparent image directly onto a target 2D Canvas Context.
 */
export async function drawChromaKeyedImage(
  ctx: CanvasRenderingContext2D,
  url: string,
  dx: number,
  dy: number,
  dw?: number,
  dh?: number,
  targetBgHex: string = '00ff00'
): Promise<void> {
  try {
    const transparentCanvas = await loadChromaKeySprite(url, targetBgHex)
    const w = dw ?? transparentCanvas.width
    const h = dh ?? transparentCanvas.height
    ctx.drawImage(transparentCanvas, dx, dy, w, h)
  } catch (err) {
    console.warn('ChromaKey draw error:', err)
  }
}
