import { useState, useEffect, useRef } from 'react'
import type { CharacterClass } from '@/lib/game/types'
import { drawCharacter, SKIN_NAMES, SKIN_COUNT } from '@/lib/game/sprites'
import { playMusic, stopMusic, resumeAudio } from '@/lib/game/audio'
import LoginPanel from './LoginPanel'
import RegisterPanel from './RegisterPanel'
import CharacterCreationView from './CharacterCreationView'
import { supabase } from '@/integrations/supabase/client'
import type { Session } from '@supabase/supabase-js'
import { fetchCloudSlots, upsertCloudSlot, deleteCloudSlot, findFreeSlotIndex, type CloudSlot } from '@/lib/game/cloudSave'
import { getClassPortrait } from '@/lib/game/portraits'
import heroBg from '@/assets/title-hero.jpg'
import rucoyLogo from '@/assets/rucoy-logo.png'

interface Props {
  onStart: (name: string, cls: CharacterClass, skin: number) => void
  onLoad: () => boolean
}

const CLASS_INFO: Record<CharacterClass, { label: string; desc: string; stats: string[]; color: string }> = {
  knight:      { label: 'Cavaleiro',   desc: 'Guerreiro de combate corpo-a-corpo. Alta defesa e HP, mas lento e de curto alcance.',
                 stats: ['HP: +++','MP: +','Ataque: ++','Defesa: +++','Velocidade: +'],
                 color: '#c0c8d8' },
  archer:      { label: 'Arqueiro',    desc: 'Especialista em ataques a distancia. Rapido e com alto critico, mas fragil.',
                 stats: ['HP: ++','MP: ++','Ataque: +++','Defesa: +','Velocidade: +++'],
                 color: '#6a8040' },
  mage:        { label: 'Mago',        desc: 'Mestre das artes arcanas. Poder magico devastador, mas HP e defesa baixos.',
                 stats: ['HP: +','MP: +++','Magia: +++','Defesa: +','Alcance: +++'],
                 color: '#9040d0' },
  necromancer: { label: 'Necromante',  desc: 'Senhor dos mortos. Invoca minions para lutar e drena a vida dos inimigos.',
                 stats: ['HP: ++','MP: +++','Magia: +++','Invocação: +++','Defesa: ++'],
                 color: '#7a30b0' },
  paladin:     { label: 'Paladino',    desc: 'Guardião sagrado. Defesa massiva, cura aliada e ataques sagrados.',
                 stats: ['HP: +++','MP: ++','Ataque: ++','Defesa: +++','Cura: +++'],
                 color: '#f0d878' },
  berserker:   { label: 'Berserker',   desc: 'Furioso em batalha. Dano colossal mas defesa baixa.',
                 stats: ['HP: +++','MP: +','Ataque: +++','Defesa: +','Fúria: +++'],
                 color: '#c83030' },
  assassin:    { label: 'Assassino',   desc: 'Letal nas sombras. Crítico altíssimo, velocidade extrema, frágil.',
                 stats: ['HP: +','MP: ++','Ataque: +++','Crítico: +++','Velocidade: +++'],
                 color: '#404060' },
  druid:       { label: 'Druida',      desc: 'Filho da natureza. Magia natural, regeneração e formas selvagens.',
                 stats: ['HP: ++','MP: +++','Magia: +++','Regen: +++','Natureza: +++'],
                 color: '#3aa84a' },
  monk:        { label: 'Monge',       desc: 'Mestre das artes marciais. Velocidade e combos sem mana.',
                 stats: ['HP: ++','MP: ++','Ataque: ++','Velocidade: +++','Crítico: ++'],
                 color: '#ffd070' },
  samurai:     { label: 'Samurai',     desc: 'Espadachim disciplinado. Cortes precisos e críticos devastadores.',
                 stats: ['HP: ++','MP: +','Ataque: +++','Crítico: +++','Velocidade: ++'],
                 color: '#e0c060' },
  summoner:    { label: 'Invocador',   desc: 'Conjurador de espíritos. Comanda familiares e enxames arcanos.',
                 stats: ['HP: ++','MP: +++','Magia: +++','Invocação: +++','Defesa: +'],
                 color: '#80c0ff' },
  alchemist:   { label: 'Alquimista',  desc: 'Mestre das poções. Frascos explosivos, ácidos e elixires curativos.',
                 stats: ['HP: ++','MP: +++','Magia: ++','Suporte: +++','Versátil: +++'],
                 color: '#a8e060' },
  chronomancer:{ label: 'Cronomante',  desc: 'Manipula o tempo. Acelera-se, atrasa inimigos e abre fendas temporais.',
                 stats: ['HP: +','MP: +++','Magia: +++','Crítico: ++','Alcance: +++'],
                 color: '#80c0ff' },
  beastmaster: { label: 'Domador',     desc: 'Senhor das feras. Invoca companheiros e ruge com poder primordial.',
                 stats: ['HP: ++','MP: ++','Ataque: +++','Crítico: ++','Invocação: +++'],
                 color: '#a08040' },
  ninja:       { label: 'Ninja',       desc: 'Sombra ágil que se duplica e ataca em rajadas furtivas.',
                 stats: ['HP: +','MP: ++','Ataque: +++','Crítico: +++','Velocidade: +++'],
                 color: '#1a1a2e' },
  pyromancer:  { label: 'Piromante',   desc: 'Domador de chamas eternas. Queima inimigos em fenix flamejantes.',
                 stats: ['HP: ++','MP: +++','Magia: +++','Alcance: ++','Fogo: +++'],
                 color: '#ff5520' },
  cryomancer:  { label: 'Criomante',   desc: 'Senhor do gelo absoluto. Congela e estilhaça inimigos.',
                 stats: ['HP: ++','MP: +++','Magia: +++','Defesa: ++','Gelo: +++'],
                 color: '#80d4ff' },
  stormcaller: { label: 'Tempestuoso', desc: 'Invoca raios e furacões que devastam o campo de batalha.',
                 stats: ['HP: ++','MP: +++','Magia: +++','Alcance: +++','Raio: +++'],
                 color: '#a060ff' },
  geomancer:   { label: 'Geomante',    desc: 'Comanda terra e rochas. Pilares e terremotos massivos.',
                 stats: ['HP: +++','MP: ++','Magia: ++','Defesa: +++','Terra: +++'],
                 color: '#a07040' },
  bard:        { label: 'Bardo',       desc: 'Canta melodias mágicas que buffam aliados e ferem inimigos.',
                 stats: ['HP: ++','MP: +++','Magia: ++','Suporte: +++','Versátil: +++'],
                 color: '#e060c0' },
  gunner:      { label: 'Pistoleiro',  desc: 'Rajadas de balas e granadas explosivas a média distância.',
                 stats: ['HP: ++','MP: ++','Ataque: +++','Crítico: +++','Alcance: ++'],
                 color: '#808080' },
  templar:     { label: 'Templário',   desc: 'Cruzado sagrado com escudo flamejante e martelo divino.',
                 stats: ['HP: +++','MP: ++','Ataque: +++','Defesa: +++','Sagrado: +++'],
                 color: '#fff0a0' },
  warlock:     { label: 'Bruxo',       desc: 'Pactua com demônios. Magias sombrias drenam vida.',
                 stats: ['HP: ++','MP: +++','Magia: +++','Drenagem: +++','Sombra: +++'],
                 color: '#601890' },
  valkyrie:    { label: 'Valquíria',   desc: 'Guerreira alada divina. Lança e voo abençoado pelos deuses.',
                 stats: ['HP: +++','MP: ++','Ataque: +++','Defesa: ++','Sagrado: +++'],
                 color: '#ffe070' },
}

const CLASS_ORDER: CharacterClass[] = [
  'knight','paladin','templar','berserker','samurai','monk','beastmaster','valkyrie',
  'archer','assassin','ninja','gunner',
  'mage','pyromancer','cryomancer','stormcaller','geomancer','chronomancer',
  'druid','necromancer','warlock','summoner','alchemist','bard',
]


function ClassPreview({ cls, tick, scale = 2, skin = 0 }: { cls: CharacterClass; tick: number; scale?: number; skin?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const size = 32 * scale
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, size, size)
    drawCharacter(ctx, cls, 'down', true, false, tick, 0, 0, scale, skin)
  }, [cls, tick, scale, skin, size])
  return <canvas ref={canvasRef} width={size} height={size} style={{ imageRendering: 'pixelated' }} />
}

export default function TitleScreen({ onStart, onLoad }: Props) {
  const [name, setName] = useState('')
  const [classIdx, setClassIdx] = useState(0)
  const [skin, setSkin] = useState(0)
  const [screen, setScreen] = useState<'title' | 'select' | 'create' | 'auth' | 'register'>('auth')
  const [tick, setTick] = useState(0)
  const [error, setError] = useState('')
  const [musicStarted, setMusicStarted] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [username, setUsername] = useState<string>('')
  const [slots, setSlots] = useState<CloudSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  const selectedClass = CLASS_ORDER[classIdx]
  const info = CLASS_INFO[selectedClass]

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 50)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const startMusic = () => {
      if (!musicStarted) { resumeAudio(); playMusic('title'); setMusicStarted(true) }
    }
    window.addEventListener('click', startMusic, { once: true })
    window.addEventListener('keydown', startMusic, { once: true })
    return () => {
      window.removeEventListener('click', startMusic)
      window.removeEventListener('keydown', startMusic)
    }
  }, [musicStarted])

  useEffect(() => () => { stopMusic() }, [])

  // ── Supabase session (cross-device sync) ───────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) setScreen('title')
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s)
      if (s) {
        const u = (s.user?.user_metadata as any)?.username || s.user?.email?.split('@')[0] || 'Aventureiro'
        setUsername(u)
      } else {
        setUsername('')
        setSlots([])
      }
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  // Reload slots whenever we land on the title/select screen while logged in
  useEffect(() => {
    if (!session) return
    if (screen !== 'title' && screen !== 'select') return
    setSlotsLoading(true)
    fetchCloudSlots().then((s) => {
      setSlots(s)
      setSlotsLoading(false)
    })
  }, [session, screen])

  const handleLoggedIn = () => { setScreen('title'); setError('') }
  const handleRegistered = () => { setScreen('title'); setError('Conta criada! Verifique seu email se solicitado.') }
  const handleContinueAsGuest = () => { setScreen('title') }
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setSlots([])
    setScreen('auth')
  }

  // ── Load an existing cloud slot into the game ──────────────────────────────
  const handlePlaySlot = (slot: CloudSlot) => {
    try {
      let rawData = slot.save_data
      if (typeof rawData === 'string') {
        try { rawData = JSON.parse(rawData) } catch {}
      }
      if (typeof rawData === 'string') {
        try { rawData = JSON.parse(rawData) } catch {}
      }
      
      let playerObj = rawData?.player || (rawData?.name ? rawData : null)
      let mapId = rawData?.mapId || rawData?.currentMap?.id || 'unified_world'

      if (!playerObj) {
        playerObj = {
          name: slot.player_name || 'Guerreiro',
          class: (slot.character_class as CharacterClass) || 'knight',
          skin: slot.skin ?? 0,
          level: slot.level || 1,
          gold: slot.gold || 0,
          position: { x: 7680, y: 7680 },
        }
      }

      const formattedSave = { player: playerObj, mapId, version: 1 }
      localStorage.setItem('rucoy_save', JSON.stringify(formattedSave))
    } catch (e) {
      console.warn('[TitleScreen] save data parse error:', e)
    }
    const ok = onLoad()
    if (!ok) {
      onStart(slot.player_name || 'Guerreiro', (slot.character_class as CharacterClass) || 'knight', slot.skin ?? 0)
    }
  }

  const handleDeleteSlot = async (slot: CloudSlot) => {
    if (!confirm(`Apagar personagem "${slot.player_name}"? Esta ação é irreversível.`)) return
    const ok = await deleteCloudSlot(slot.id)
    if (ok) setSlots((cur) => cur.filter((s) => s.id !== slot.id))
  }

  // Background
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = bgCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < 100; i++) {
      const sx = ((i * 137.5 + tick * 0.1) % canvas.width)
      const sy = ((i * 97.3) % canvas.height)
      const b = 0.3 + Math.sin(tick * 0.05 + i) * 0.2
      ctx.fillStyle = `rgba(255,230,160,${b * 0.7})`
      ctx.fillRect(sx, sy, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1)
    }
  }, [tick])

  const handleStart = (customName?: string, customClass?: CharacterClass, customSkin?: number) => {
    const finalName = customName || name
    const finalClass = customClass || selectedClass
    const finalSkin = customSkin !== undefined ? customSkin : skin

    if (!finalName.trim()) { setError('Digite um nome.'); return }
    if (finalName.trim().length < 2) { setError('O nome deve ter pelo menos 2 caracteres.'); return }
    setError('')
    
    const pName = finalName.trim()
    
    // Initial save data
    const initialSave = {
      player: {
        name: pName,
        class: finalClass,
        skin: finalSkin,
        level: 1,
        gold: 0,
        position: { x: 7680, y: 7680 },
      },
      mapId: 'unified_world',
    }
    try {
      localStorage.setItem('rucoy_save', JSON.stringify(initialSave))
    } catch (e) {
      console.warn('[TitleScreen] localStorage setItem error:', e)
    }

    // Trigger game entry immediately!
    onStart(pName, finalClass, finalSkin)

    // Save cloud slot asynchronously in background without blocking
    if (session?.user) {
      findFreeSlotIndex().then((idx) => {
        upsertCloudSlot({
          userId: session.user.id,
          slotIndex: idx,
          playerName: pName,
          characterClass: finalClass,
          skin: finalSkin,
          level: 1,
          gold: 0,
          playtime: 0,
          saveData: initialSave,
        }).catch((e) => console.warn('[TitleScreen] background slot error', e))
      }).catch((e) => console.warn('[TitleScreen] slot index error', e))
    }
  }

  const prevClass = () => { setClassIdx(i => (i - 1 + CLASS_ORDER.length) % CLASS_ORDER.length); setSkin(0) }
  const nextClass = () => { setClassIdx(i => (i + 1) % CLASS_ORDER.length); setSkin(0) }

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#060810' }}>
      {/* Pixel-art hero background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
          filter: 'brightness(0.85) saturate(1.15)',
        }}
      />
      {/* Vignette + atmospheric tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      {/* Animated firefly sparks */}
      <canvas ref={bgCanvasRef} width={800} height={400} className="absolute inset-0 w-full h-full pointer-events-none" style={{ imageRendering: 'pixelated', objectFit: 'cover', mixBlendMode: 'screen' }} />

      {/* Auth Screen */}
      {screen === 'auth' && (
        <LoginPanel
          onLoggedIn={handleLoggedIn}
          onSwitchToRegister={() => setScreen('register')}
          onContinueAsGuest={handleContinueAsGuest}
        />
      )}

      {screen === 'register' && (
        <RegisterPanel
          onRegistered={handleRegistered}
          onSwitchToLogin={() => setScreen('auth')}
        />
      )}

      {screen !== 'auth' && screen !== 'register' && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-6 px-4 overflow-y-auto">
          <div className="text-center mb-4 relative">
            <img
              src={rucoyLogo}
              alt="Rucoy Offline"
              className="w-72 sm:w-96 mx-auto drop-shadow-2xl"
              style={{
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.85)) drop-shadow(0 0 32px rgba(240,192,64,0.3))',
                transform: `translateY(${Math.sin(tick * 0.04) * 4}px)`,
                transition: 'transform 0.1s',
              }}
            />
            <p className="text-sm mt-3 tracking-[0.3em] font-bold" style={{ color: '#f0d878', fontFamily: 'serif', textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>
              ⚔  RPG DE FANTASIA  ⚔
            </p>
            {session && (
              <p className="text-xs mt-2" style={{ color: '#c9a878', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                Logado como <span style={{ color: '#f0c040', fontWeight: 'bold' }}>{username || session.user.email}</span>
              </p>
            )}
          </div>

          {screen === 'title' ? (
            <div className="flex flex-col items-center gap-3 mt-2 w-full max-w-xs">
              <button
                onClick={() => setScreen(session ? 'select' : 'create')}
                className="w-full py-3 text-lg font-bold rounded transition-all duration-150 active:translate-y-0.5"
                style={{
                  background: 'linear-gradient(180deg, #f0c040 0%, #c9952a 50%, #8a6018 100%)',
                  border: '3px solid #4a2810',
                  color: '#2a1810',
                  fontFamily: 'serif',
                  textShadow: '0 1px 0 rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 0 #4a2810, 0 6px 14px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.4)',
                  letterSpacing: '0.05em',
                }}
              >
                ⚔  {session ? 'Selecionar Personagem' : 'Novo Personagem'}
              </button>
              <button
                onClick={() => { const ok = onLoad(); if (!ok) setError('Nenhum save encontrado.') }}
                className="w-full py-3 text-lg font-bold rounded transition-all duration-150 active:translate-y-0.5"
                style={{
                  background: 'linear-gradient(180deg, #4a7ac8 0%, #2a4a8a 50%, #1a2a50 100%)',
                  border: '3px solid #0a1228',
                  color: '#e8f0ff',
                  fontFamily: 'serif',
                  textShadow: '0 1px 0 rgba(0,0,0,0.5)',
                  boxShadow: '0 4px 0 #0a1228, 0 6px 14px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.3)',
                  letterSpacing: '0.05em',
                }}
              >
                ▶  Continuar (este dispositivo)
              </button>
              {session && (
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-sm font-bold rounded transition-all duration-150 active:translate-y-0.5"
                  style={{
                    background: 'linear-gradient(180deg, #6b2828 0%, #3a1414 100%)',
                    border: '2px solid #1a0808',
                    color: '#ffb0b0',
                    fontFamily: 'serif',
                    boxShadow: '0 3px 0 #1a0808, inset 0 1px 0 rgba(255,180,180,0.2)',
                  }}
                >
                  ✕  Desconectar
                </button>
              )}
              {!session && (
                <button
                  onClick={() => setScreen('auth')}
                  className="w-full py-2 text-sm font-bold rounded transition-all duration-150 active:translate-y-0.5"
                  style={{
                    background: 'linear-gradient(180deg, #4a3020 0%, #2a1810 100%)',
                    border: '2px solid #1a0e08',
                    color: '#c9a878',
                    fontFamily: 'serif',
                    boxShadow: '0 3px 0 #1a0e08, inset 0 1px 0 rgba(255,220,140,0.15)',
                  }}
                >
                  ⚙  Conectar Conta
                </button>
              )}
              {error && <p className="text-red-300 text-sm mt-1 font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{error}</p>}
              <div
                className="mt-6 text-xs text-center space-y-1 rounded px-4 py-2"
                style={{
                  background: 'rgba(20,12,6,0.7)',
                  border: '1px solid rgba(201,149,42,0.3)',
                  color: '#c9a878',
                  fontFamily: 'serif',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                }}
              >
                <p>⌨  WASD ou Setas para mover</p>
                <p>🗡  Clique nos inimigos para atacar</p>
              </div>
            </div>
          ) : screen === 'select' ? (
            <div
              className="rounded-xl p-5 w-full max-w-2xl"
              style={{
                background: 'linear-gradient(180deg, #3a2418 0%, #2a1810 50%, #1a0e08 100%)',
                border: '4px solid #c9952a',
                boxShadow: '0 0 0 2px #1a0e08, 0 0 0 6px #6b4220, 0 20px 60px rgba(0,0,0,0.85), inset 0 2px 0 rgba(255,220,140,0.15)',
              }}
            >
              <h3 className="text-lg font-bold mb-3 text-center" style={{ color: '#f0c040', fontFamily: 'serif' }}>Selecionar Personagem</h3>
              {slotsLoading ? (
                <p className="text-center text-sm py-6" style={{ color: '#c9a878' }}>Carregando personagens da nuvem...</p>
              ) : slots.length === 0 ? (
                <p className="text-center text-sm py-6" style={{ color: '#c9a878' }}>
                  Nenhum personagem nesta conta ainda. Crie um novo abaixo!
                </p>
              ) : (
                <div className="space-y-2 mb-3 max-h-[280px] overflow-y-auto pr-1">
                  {slots.map((slot) => {
                    const portrait = getClassPortrait(slot.character_class as CharacterClass)
                    const info = CLASS_INFO[slot.character_class as CharacterClass]
                    return (
                      <div
                        key={slot.id}
                        className="flex items-center gap-3 p-2 rounded"
                        style={{
                          background: 'rgba(0,0,0,0.45)',
                          border: `2px solid ${info?.color ?? '#6b4220'}55`,
                        }}
                      >
                        {portrait && (
                          <img src={portrait} alt={slot.character_class} width={64} height={64}
                            style={{ imageRendering: 'pixelated', border: `2px solid ${info?.color ?? '#6b4220'}`, borderRadius: 4 }} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-bold truncate" style={{ color: info?.color ?? '#e8d9b5', fontFamily: 'serif' }}>{slot.player_name}</div>
                          <div className="text-xs" style={{ color: '#c9a878' }}>
                            {info?.label ?? slot.character_class} • Nv. {slot.level} • {slot.gold}g
                          </div>
                        </div>
                        <button
                          onClick={() => handlePlaySlot(slot)}
                          className="px-3 py-2 rounded text-sm font-bold hover:brightness-125 transition-all"
                          style={{ background: 'linear-gradient(180deg,#4a7ac8,#1a2a50)', border: '2px solid #0a1228', color: '#e8f0ff' }}
                        >Jogar</button>
                        <button
                          onClick={() => handleDeleteSlot(slot)}
                          className="px-2 py-2 rounded text-xs font-bold"
                          style={{ background: 'rgba(120,30,30,0.6)', border: '2px solid #3a1414', color: '#ffb0b0' }}
                        >✕</button>
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="flex gap-2 pt-2 border-t" style={{ borderColor: '#6b422055' }}>
                <button onClick={() => { setScreen('title'); setError('') }} className="flex-1 py-2 rounded text-sm" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #2a3060', color: '#c9a878' }}>Voltar</button>
                <button onClick={() => setScreen('create')} className="flex-1 py-2 rounded text-sm font-bold" style={{ background: 'linear-gradient(135deg,#c9952a,#8a6018)', border: '2px solid #4a2810', color: '#2a1810' }}>+ Novo Personagem</button>
              </div>
              {error && <p className="text-red-300 text-xs mt-2 text-center">{error}</p>}
            </div>
          ) : (
            <CharacterCreationView
              name={name}
              setName={setName}
              error={error}
              setError={setError}
              onStart={handleStart}
              onBack={() => { setScreen(session ? 'select' : 'title'); setError('') }}
              tick={tick}
            />
          )}
        </div>
      )}
    </div>
  )
}
