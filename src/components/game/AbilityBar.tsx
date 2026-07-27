import { memo } from 'react'
import type { Player } from '@/lib/game/types'
import { getAbilityDef } from '@/lib/game/abilities'
import { SUBSKILLS } from '@/lib/game/hundredClassesData'

interface Props {
  player: Player
  onCast: (slot: number) => void
}

const HOTKEYS = ['1', '2', '3', '4']

function AbilityBar({ player, onCast }: Props) {
  // If player equipped abilities list exists, use those up to 4; otherwise use player.abilities
  const equippedIds = player.equippedAbilities && player.equippedAbilities.length > 0
    ? player.equippedAbilities.slice(0, 4)
    : player.abilities.map(a => a.id).slice(0, 4)

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 select-none pointer-events-auto rcy-pixel"
      style={{ bottom: 12, zIndex: 15 }}
    >
      <div
        className="rcy-frame"
        style={{
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(8, 10, 18, 0.94)',
          border: '1.5px solid rgba(255, 210, 74, 0.5)',
          borderRadius: 14,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      >
        {equippedIds.map((abId, idx) => {
          const abState = player.abilities.find(a => a.id === abId) || { id: abId, currentCooldown: 0 }
          const def = getAbilityDef(abId)
          if (!def) return null

          const subId = player.subskills?.[abId]
          const subDef = subId ? SUBSKILLS[subId] : null

          const locked = player.level < def.unlockLevel
          const cdPct = def.cooldown > 0 ? Math.min(1, abState.currentCooldown / def.cooldown) : 0
          const noMana = player.mp < def.manaCost
          const ready = !locked && abState.currentCooldown <= 0 && !noMana
          const click = () => { if (ready) onCast(idx) }

          return (
            <button
              key={abId}
              onClick={click}
              disabled={!ready}
              title={`${def.name}\n${def.description}${subDef ? `\n\nSubskill: ${subDef.name} (${subDef.effectType})` : ''}\nMana: ${def.manaCost} • CD: ${(def.cooldown / 60).toFixed(1)}s${locked ? `\nDesbloqueia Nv.${def.unlockLevel}` : ''}`}
              style={{
                position: 'relative',
                width: 54, height: 54,
                borderRadius: 10,
                border: ready ? `1.5px solid ${def.color}` : '1.5px solid rgba(255,255,255,0.12)',
                background: ready
                  ? `radial-gradient(circle at 50% 30%, ${def.color}22, rgba(12,14,24,0.95))`
                  : 'rgba(12,14,24,0.95)',
                color: ready ? def.color : '#5a6080',
                fontFamily: 'monospace',
                fontWeight: 800,
                fontSize: 20,
                cursor: ready ? 'pointer' : 'not-allowed',
                boxShadow: ready ? `0 0 14px ${def.color}55, inset 0 0 10px ${def.color}25` : 'none',
                opacity: locked ? 0.45 : 1,
                overflow: 'hidden',
                transition: 'transform 0.12s ease, border-color 0.15s, box-shadow 0.15s',
              }}
            >
              {/* icon text */}
              <div style={{ marginTop: 2 }}>{def.icon}</div>

              {/* hotkey badge */}
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  left: 3,
                  fontSize: 9,
                  fontWeight: 800,
                  color: ready ? '#fff' : '#6a7890',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: 3,
                  padding: '0 3px',
                }}
              >
                {HOTKEYS[idx]}
              </div>

              {/* subskill badge */}
              {subDef && (
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 3,
                    fontSize: 10,
                    background: 'rgba(234, 179, 8, 0.3)',
                    border: '1px solid #eab308',
                    borderRadius: 3,
                    padding: '0 2px',
                  }}
                  title={`Subskill: ${subDef.name}`}
                >
                  {subDef.icon}
                </div>
              )}

              {/* mana cost */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 3,
                  fontSize: 9,
                  fontWeight: 700,
                  color: noMana ? '#ff6060' : '#60a0ff',
                  textShadow: '1px 1px 0 #000',
                }}
              >
                {def.manaCost}m
              </div>

              {/* cooldown overlay */}
              {abState.currentCooldown > 0 && !locked && (
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    background: `rgba(0,0,0,0.72)`,
                    clipPath: `inset(0 0 ${(1 - cdPct) * 100}% 0)`,
                    pointerEvents: 'none',
                    fontSize: 13,
                    fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ffd24a',
                    textShadow: '0 0 6px rgba(0,0,0,0.9)',
                  }}
                >
                  {(abState.currentCooldown / 60).toFixed(1)}s
                </div>
              )}

              {/* lock icon */}
              {locked && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: '#5a6080', background: 'rgba(0,0,0,0.5)',
                }}>
                  🔒
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(AbilityBar) as unknown as typeof AbilityBar

