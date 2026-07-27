import { useState } from 'react'
import type { Player, CharacterClass } from '@/lib/game/types'
import { CLASS_SKILL_TREES, getSkillTreeForClass, type SkillNode } from '@/lib/game/skillTreeData'
import { Overlay, ModalHeader, ModalFooter } from './QuestPanel'

interface SkillTreeModalProps {
  player: Player
  onClose: () => void
  onUpdatePlayer?: (updater: (p: Player) => Player) => void
}

const SUPPORTED_CLASSES: CharacterClass[] = ['knight', 'archer', 'mage', 'necromancer']

export default function SkillTreeModal({ player, onClose, onUpdatePlayer }: SkillTreeModalProps) {
  const [selectedClass, setSelectedClass] = useState<CharacterClass>(player.class || 'knight')

  // Get current class skill tree definition
  const treeDef = getSkillTreeForClass(selectedClass)

  // Get saved skill tree allocations from player object or initialize empty
  const playerTreeAllocations: Record<string, number> = (player as any).skillTree?.[selectedClass] || {}

  // Calculate total points earned for class based on class level
  const classLvl = player.classProgress?.[selectedClass]?.level || player.level || 1
  const totalPointsEarned = Math.max(1, classLvl * 2)

  // Calculate spent points
  const pointsSpent = Object.values(playerTreeAllocations).reduce((acc, curr) => acc + (curr || 0), 0)
  const pointsAvailable = Math.max(0, totalPointsEarned - pointsSpent)

  // Allocate 1 point to skill node
  const handleAllocate = (node: SkillNode) => {
    if (pointsAvailable <= 0) return
    const currentLvl = playerTreeAllocations[node.id] || 0
    if (currentLvl >= node.maxLevel) return

    // Check requirements
    if (node.requires && node.requires.length > 0) {
      const meetsReqs = node.requires.every(reqId => (playerTreeAllocations[reqId] || 0) > 0)
      if (!meetsReqs) return
    }

    const nextLvl = currentLvl + 1

    if (onUpdatePlayer) {
      onUpdatePlayer((p) => {
        const currentTree = (p as any).skillTree || {}
        const currentClassTree = currentTree[selectedClass] || {}
        const updatedClassTree = { ...currentClassTree, [node.id]: nextLvl }

        // Recalculate stat bonuses
        return {
          ...p,
          skillTree: {
            ...currentTree,
            [selectedClass]: updatedClassTree
          }
        }
      })
    }
  }

  // Reset all allocated points for selected class
  const handleReset = () => {
    if (onUpdatePlayer) {
      onUpdatePlayer((p) => {
        const currentTree = (p as any).skillTree || {}
        return {
          ...p,
          skillTree: {
            ...currentTree,
            [selectedClass]: {}
          }
        }
      })
    }
  }

  // Group nodes by tier
  const maxTier = Math.max(...treeDef.nodes.map(n => n.tier), 4)
  const tiers = Array.from({ length: maxTier }, (_, i) => i + 1)

  return (
    <Overlay onBgClick={onClose} title="Árvore de Habilidades" storageKey="skilltree">
      <div className="rcy-modal rcy-modal--wide rcy-pixel" style={{ minWidth: '620px', maxWidth: '780px' }}>
        <ModalHeader
          title={`ÁRVORE DE HABILIDADES — ${treeDef.title.toUpperCase()}`}
          subtitle={`Pontos Disponíveis: ${pointsAvailable} / ${totalPointsEarned}  ·  Classe Nv ${classLvl}`}
          accent={treeDef.color}
          onClose={onClose}
        />

        {/* Class Tabs Switcher */}
        <div style={{ display: 'flex', gap: '6px', padding: '8px 12px', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {SUPPORTED_CLASSES.map(clsKey => {
            const clsDef = CLASS_SKILL_TREES[clsKey]
            const isSelected = clsKey === selectedClass
            return (
              <button
                key={clsKey}
                onClick={() => setSelectedClass(clsKey)}
                className="rcy-btn"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  background: isSelected ? clsDef.color : 'rgba(30, 30, 45, 0.8)',
                  color: isSelected ? '#000' : 'var(--rcy-text)',
                  border: isSelected ? `2px solid #fff` : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: isSelected ? `0 0 10px ${clsDef.color}aa` : 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{clsDef.icon}</span>
                <span>{clsDef.title.replace('Árvore do ', '')}</span>
              </button>
            )
          })}
        </div>

        <div className="rcy-modal__body" style={{ padding: '16px', position: 'relative', minHeight: '380px' }}>
          {/* SVG Connection Lines Overlay */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {treeDef.nodes.map(node => {
              if (!node.requires || node.requires.length === 0) return null
              const currentLvl = playerTreeAllocations[node.id] || 0
              const isUnlocked = currentLvl > 0

              return node.requires.map(reqId => {
                const reqNode = treeDef.nodes.find(n => n.id === reqId)
                if (!reqNode) return null

                // Calculate approximate grid positions
                const fromX = (reqNode.col * 220) - 70
                const fromY = (reqNode.tier * 85) + 10
                const toX = (node.col * 220) - 70
                const toY = (node.tier * 85) + 10

                const reqLvl = playerTreeAllocations[reqId] || 0
                const lineActive = reqLvl > 0

                return (
                  <line
                    key={`${reqId}->${node.id}`}
                    x1={`${fromX}px`}
                    y1={`${fromY}px`}
                    x2={`${toX}px`}
                    y2={`${toY}px`}
                    stroke={lineActive ? treeDef.color : '#444455'}
                    strokeWidth={lineActive ? '3' : '1.5'}
                    strokeDasharray={lineActive ? 'none' : '4 4'}
                    style={{ transition: 'stroke 0.3s' }}
                  />
                )
              })
            })}
          </svg>

          {/* Skill Tiers Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative', zIndex: 2 }}>
            {tiers.map(tierNum => {
              const tierNodes = treeDef.nodes.filter(n => n.tier === tierNum)
              if (tierNodes.length === 0) return null

              return (
                <div key={tierNum} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="rcy-section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: treeDef.color }}>
                    <span>TIER {tierNum}</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {tierNodes.map(node => {
                      const lvl = playerTreeAllocations[node.id] || 0
                      const isMax = lvl >= node.maxLevel

                      // Check requirements
                      const reqsMet = !node.requires || node.requires.every(reqId => (playerTreeAllocations[reqId] || 0) > 0)
                      const canBuy = reqsMet && pointsAvailable > 0 && !isMax

                      return (
                        <div
                          key={node.id}
                          className="rcy-frame"
                          style={{
                            padding: '10px',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            background: lvl > 0 ? 'rgba(25, 30, 45, 0.9)' : reqsMet ? 'rgba(15, 18, 28, 0.75)' : 'rgba(10, 10, 15, 0.5)',
                            border: lvl > 0 ? `1px solid ${treeDef.color}` : canBuy ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
                            boxShadow: lvl > 0 ? `inset 0 0 12px ${treeDef.color}33` : 'none',
                            opacity: reqsMet ? 1 : 0.5,
                            borderRadius: '6px',
                            position: 'relative'
                          }}
                        >
                          {/* Skill Icon */}
                          <div
                            className="rcy-slot"
                            style={{
                              width: '44px',
                              height: '44px',
                              minWidth: '44px',
                              fontSize: '22px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: lvl > 0 ? `${treeDef.color}22` : '#111',
                              border: `1px solid ${lvl > 0 ? treeDef.color : '#333'}`,
                              boxShadow: lvl > 0 ? `0 0 8px ${treeDef.color}aa` : 'none'
                            }}
                          >
                            <span>{node.icon}</span>
                            <span className="rcy-slot__badge" style={{ background: lvl > 0 ? treeDef.color : '#333', color: lvl > 0 ? '#000' : '#888' }}>
                              {lvl}/{node.maxLevel}
                            </span>
                          </div>

                          {/* Skill Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: lvl > 0 ? treeDef.color : 'var(--rcy-text)', textShadow: '1px 1px 0 #000' }}>
                              {node.name}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--rcy-text-mute)', marginTop: '2px', lineHeight: '1.2' }}>
                              {node.description}
                            </div>
                            <div style={{ fontSize: '9px', color: treeDef.color, marginTop: '4px', fontWeight: 'bold' }}>
                              +{node.statBonus.valuePerLevel * (lvl || 1)}{node.statBonus.isPercent ? '%' : ''} {node.statBonus.stat.toUpperCase()}
                            </div>
                          </div>

                          {/* Upgrade Button */}
                          <button
                            onClick={() => handleAllocate(node)}
                            disabled={!canBuy}
                            className="rcy-btn"
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              background: canBuy ? treeDef.color : 'rgba(255,255,255,0.05)',
                              color: canBuy ? '#000' : 'rgba(255,255,255,0.2)',
                              border: canBuy ? '1px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                              cursor: canBuy ? 'pointer' : 'not-allowed',
                              boxShadow: canBuy ? `0 0 8px ${treeDef.color}` : 'none'
                            }}
                            title={canBuy ? 'Alocar 1 Ponto' : !reqsMet ? 'Requisitos não atingidos' : isMax ? 'Nível Máximo' : 'Sem pontos'}
                          >
                            +
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleReset}
            className="rcy-btn"
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 'bold',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Resetar Árvore
          </button>
          <ModalFooter hint="Clique no botão [+] para alocar pontos de habilidade" />
        </div>
      </div>
    </Overlay>
  )
}
