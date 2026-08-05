import { useEffect, useRef, useState } from 'react'
import introAsset from '@/assets/intro_pixel.mp4.asset.json'

const SEEN_KEY = 'rucoy_intro_seen_v1'

interface IntroVideoProps {
  onFinish: () => void
}

/** Abertura cinematográfica em pixel art (64px / 4 fps) que termina na tela inicial. */
export default function IntroVideo({ onFinish }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [fadeOut, setFadeOut] = useState(false)

  const finish = () => {
    if (fadeOut) return
    setFadeOut(true)
    try { localStorage.setItem(SEEN_KEY, '1') } catch { /* ignore */ }
    setTimeout(onFinish, 450)
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => { /* autoplay bloqueado: o usuário pode pular */ })
    const onKey = () => finish()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      onClick={finish}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.45s ease',
      }}
    >
      <video
        ref={videoRef}
        src={introAsset.url}
        muted
        playsInline
        autoPlay
        onEnded={finish}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          imageRendering: 'pixelated',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '18px',
          right: '22px',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '10px',
          color: '#f8fafc',
          textShadow: '2px 2px 0 #000',
          opacity: 0.85,
        }}
      >
        TOQUE PARA PULAR ▶
      </div>
    </div>
  )
}

export function hasSeenIntro() {
  try { return localStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}
