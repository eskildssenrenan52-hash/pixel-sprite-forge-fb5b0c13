// @ts-nocheck
// ─────────────────────────────────────────────────────────────────────────────
//  MEGA BIOMES  ·  50 biomas gigantes, com design geométrico único cada um,
//  paletas próprias e inimigos exclusivos. Todos os monstros são registrados
//  dinamicamente no registry extendido, então funcionam com o mesmo pipeline
//  procedural de renderização dos monstros existentes.
// ─────────────────────────────────────────────────────────────────────────────
import type { GameMap, Tile, TileType, Monster, MonsterType, EliteTier } from './types'
import { createMonster } from './monsterFactory'
import { registerExtendedMonster } from './extendedMonsters'

// ── 30 monstros exclusivos dos mega biomas ─────────────────────────────────
const MEGA_MONSTERS = [
  { id: 'mega_glass_stalker',  name: 'Espreitador de Vidro',   silhouette: 'humanoid', palette: { primary:'#a0f0ff', secondary:'#204060', accent:'#ffffff', eye:'#00ffff' }, element:'ice',       behavior:'phaser',  baseHp:80,  baseAtk:20, baseDef:6,  speed:2.6, aggroRange:210, isRanged:false },
  { id: 'mega_mirror_wight',   name: 'Espectro-Espelho',       silhouette: 'ghost',    palette: { primary:'#e0e0ff', secondary:'#606080', accent:'#ffffff', eye:'#ff00ff' }, element:'arcane',    behavior:'kiter',   baseHp:70,  baseAtk:22, baseDef:5,  speed:2.4, aggroRange:230, isRanged:true, attackRange:240 },
  { id: 'mega_prism_serpent',  name: 'Serpente Prismática',    silhouette: 'serpent',  palette: { primary:'#ff80c0', secondary:'#4020a0', accent:'#80ffff', eye:'#ffff00' }, element:'arcane',    behavior:'charger', baseHp:130, baseAtk:24, baseDef:9,  speed:3.0, aggroRange:200, isRanged:false, scale:1.3 },
  { id: 'mega_dust_djinn',     name: 'Djinn da Poeira',        silhouette: 'flying',   palette: { primary:'#d8b070', secondary:'#604020', accent:'#ffe090', eye:'#ff8000' }, element:'physical',  behavior:'kiter',   baseHp:90,  baseAtk:20, baseDef:6,  speed:3.0, aggroRange:230, isRanged:true, attackRange:250 },
  { id: 'mega_bone_scarab',    name: 'Escaravelho de Osso',    silhouette: 'insect',   palette: { primary:'#e8e0c0', secondary:'#a09060', accent:'#ff0000', eye:'#000000' }, element:'physical',  behavior:'swarmer', baseHp:35,  baseAtk:12, baseDef:5,  speed:3.2, aggroRange:150, isRanged:false },
  { id: 'mega_ember_wisp',     name: 'Fátua de Brasa',         silhouette: 'flying',   palette: { primary:'#ff8000', secondary:'#601000', accent:'#ffff00', eye:'#ffffff' }, element:'fire',      behavior:'turret',  baseHp:55,  baseAtk:18, baseDef:4,  speed:1.6, aggroRange:250, isRanged:true, attackRange:260 },
  { id: 'mega_moss_giant',     name: 'Gigante de Musgo',       silhouette: 'colossus', palette: { primary:'#3a6020', secondary:'#1a2810', accent:'#80c040', eye:'#ffff00' }, element:'nature',    behavior:'tank',    baseHp:280, baseAtk:26, baseDef:20, speed:1.0, aggroRange:170, isRanged:false, scale:1.9, weaknesses:{ fire:0.7 } },
  { id: 'mega_bog_hag',        name: 'Bruxa Encharcada',       silhouette: 'humanoid', palette: { primary:'#405030', secondary:'#204010', accent:'#80ff40', eye:'#ff8000' }, element:'poison',    behavior:'summoner',baseHp:110, baseAtk:20, baseDef:8,  speed:1.8, aggroRange:220, isRanged:true, attackRange:230 },
  { id: 'mega_reef_shark',     name: 'Tubarão do Recife',      silhouette: 'beast',    palette: { primary:'#4080b0', secondary:'#204060', accent:'#ffffff', eye:'#ff0000' }, element:'physical',  behavior:'charger', baseHp:130, baseAtk:24, baseDef:8,  speed:3.4, aggroRange:200, isRanged:false, scale:1.3 },
  { id: 'mega_tide_priest',    name: 'Sacerdote da Maré',      silhouette: 'humanoid', palette: { primary:'#60a0ff', secondary:'#204080', accent:'#a0ffff', eye:'#0080ff' }, element:'ice',       behavior:'healer',  baseHp:95,  baseAtk:18, baseDef:8,  speed:2.0, aggroRange:200, isRanged:true, attackRange:220 },
  { id: 'mega_dune_worm',      name: 'Verme das Dunas',        silhouette: 'serpent',  palette: { primary:'#d8b060', secondary:'#805030', accent:'#ffe090', eye:'#000000' }, element:'physical',  behavior:'phaser',  baseHp:180, baseAtk:26, baseDef:10, speed:2.0, aggroRange:180, isRanged:false, scale:1.6 },
  { id: 'mega_glow_moth',      name: 'Mariposa Luminosa',      silhouette: 'flying',   palette: { primary:'#a0ffe0', secondary:'#308070', accent:'#ffffff', eye:'#00ff80' }, element:'arcane',    behavior:'kiter',   baseHp:60,  baseAtk:16, baseDef:4,  speed:3.6, aggroRange:220, isRanged:true, attackRange:230 },
  { id: 'mega_iron_boar',      name: 'Javali de Ferro',        silhouette: 'beast',    palette: { primary:'#606060', secondary:'#202020', accent:'#ff8000', eye:'#ff0000' }, element:'physical',  behavior:'charger', baseHp:140, baseAtk:24, baseDef:14, speed:3.2, aggroRange:190, isRanged:false, resistances:{ physical:0.4 } },
  { id: 'mega_thorn_naga',     name: 'Naga Espinhenta',        silhouette: 'serpent',  palette: { primary:'#204020', secondary:'#101810', accent:'#80ff40', eye:'#ff0000' }, element:'nature',    behavior:'basic',   baseHp:120, baseAtk:22, baseDef:9,  speed:2.4, aggroRange:180, isRanged:false, scale:1.3 },
  { id: 'mega_sky_manta',      name: 'Manta Aérea',            silhouette: 'flying',   palette: { primary:'#80c0ff', secondary:'#2060a0', accent:'#ffffff', eye:'#ffff00' }, element:'lightning', behavior:'kiter',   baseHp:110, baseAtk:22, baseDef:8,  speed:3.2, aggroRange:240, isRanged:true, attackRange:260, scale:1.4 },
  { id: 'mega_rust_knight',    name: 'Cavaleiro Ferrugem',     silhouette: 'humanoid', palette: { primary:'#803010', secondary:'#301008', accent:'#ff8000', eye:'#ffff00' }, element:'physical',  behavior:'tank',    baseHp:170, baseAtk:22, baseDef:18, speed:1.4, aggroRange:170, isRanged:false, resistances:{ physical:0.5 } },
  { id: 'mega_salt_wraith',    name: 'Espectro do Sal',        silhouette: 'ghost',    palette: { primary:'#f0f0e0', secondary:'#606050', accent:'#ffffff', eye:'#0080ff' }, element:'ice',       behavior:'phaser',  baseHp:85,  baseAtk:20, baseDef:5,  speed:2.6, aggroRange:210, isRanged:false },
  { id: 'mega_lava_toad',      name: 'Sapo de Lava',           silhouette: 'beast',    palette: { primary:'#ff4000', secondary:'#601000', accent:'#ffcc00', eye:'#ffff00' }, element:'fire',      behavior:'swarmer', baseHp:55,  baseAtk:16, baseDef:5,  speed:2.6, aggroRange:150, isRanged:false, resistances:{ fire:0.8 } },
  { id: 'mega_star_seer',      name: 'Vidente das Estrelas',   silhouette: 'humanoid', palette: { primary:'#4020a0', secondary:'#1a1050', accent:'#ffffff', eye:'#ffff00' }, element:'arcane',    behavior:'turret',  baseHp:100, baseAtk:24, baseDef:6,  speed:1.4, aggroRange:280, isRanged:true, attackRange:300 },
  { id: 'mega_root_horror',    name: 'Horror das Raízes',      silhouette: 'plant',    palette: { primary:'#402010', secondary:'#201008', accent:'#80c040', eye:'#ff0000' }, element:'nature',    behavior:'summoner',baseHp:200, baseAtk:22, baseDef:14, speed:0.6, aggroRange:180, isRanged:false, scale:1.6 },
  { id: 'mega_ash_reaper',     name: 'Ceifador das Cinzas',    silhouette: 'humanoid', palette: { primary:'#302020', secondary:'#101010', accent:'#ff4000', eye:'#ff0000' }, element:'shadow',    behavior:'phaser',  baseHp:110, baseAtk:28, baseDef:8,  speed:3.2, aggroRange:220, isRanged:false, resistances:{ shadow:0.6 } },
  { id: 'mega_mist_lynx',      name: 'Lince da Neblina',       silhouette: 'beast',    palette: { primary:'#c0c0d0', secondary:'#404060', accent:'#ffffff', eye:'#00ff80' }, element:'ice',       behavior:'charger', baseHp:90,  baseAtk:22, baseDef:7,  speed:3.6, aggroRange:210, isRanged:false },
  { id: 'mega_iron_maw',       name: 'Mandíbula de Ferro',     silhouette: 'construct',palette: { primary:'#404040', secondary:'#1a1a1a', accent:'#ff0000', eye:'#ffff00' }, element:'physical',  behavior:'turret',  baseHp:220, baseAtk:26, baseDef:20, speed:0.0, aggroRange:250, isRanged:true, attackRange:270 },
  { id: 'mega_gold_sphinx',    name: 'Esfinge Dourada',        silhouette: 'colossus', palette: { primary:'#ffd000', secondary:'#805020', accent:'#ffffff', eye:'#ff0000' }, element:'arcane',    behavior:'summoner',baseHp:240, baseAtk:28, baseDef:14, speed:1.6, aggroRange:220, isRanged:true, attackRange:240, scale:1.7 },
  { id: 'mega_hex_slime',      name: 'Slime Hexagonal',        silhouette: 'blob',     palette: { primary:'#8040ff', secondary:'#402080', accent:'#ff80ff', eye:'#ffffff' }, element:'arcane',    behavior:'swarmer', baseHp:40,  baseAtk:12, baseDef:4,  speed:2.4, aggroRange:150, isRanged:false },
  { id: 'mega_storm_bull',     name: 'Touro da Tempestade',    silhouette: 'beast',    palette: { primary:'#404060', secondary:'#101020', accent:'#ffff00', eye:'#00ffff' }, element:'lightning', behavior:'charger', baseHp:180, baseAtk:26, baseDef:12, speed:3.4, aggroRange:200, isRanged:false, scale:1.4, resistances:{ lightning:0.6 } },
  { id: 'mega_dream_moth',     name: 'Mariposa do Sonho',      silhouette: 'flying',   palette: { primary:'#c080ff', secondary:'#402080', accent:'#ffffff', eye:'#ff00ff' }, element:'arcane',    behavior:'kiter',   baseHp:70,  baseAtk:18, baseDef:5,  speed:3.4, aggroRange:230, isRanged:true, attackRange:240 },
  { id: 'mega_slag_golem',     name: 'Golem de Escória',       silhouette: 'construct',palette: { primary:'#502010', secondary:'#200808', accent:'#ff4000', eye:'#ffff00' }, element:'fire',      behavior:'tank',    baseHp:260, baseAtk:26, baseDef:20, speed:1.0, aggroRange:160, isRanged:false, scale:1.7, resistances:{ fire:0.7, physical:0.4 } },
  { id: 'mega_ice_valkyrie',   name: 'Valquíria Gélida',       silhouette: 'humanoid', palette: { primary:'#a0e0ff', secondary:'#204060', accent:'#ffffff', eye:'#0080ff' }, element:'ice',       behavior:'basic',   baseHp:140, baseAtk:26, baseDef:12, speed:2.6, aggroRange:200, isRanged:false, resistances:{ ice:0.7 } },
  { id: 'mega_void_pilgrim',   name: 'Peregrino do Vazio',     silhouette: 'humanoid', palette: { primary:'#100020', secondary:'#000000', accent:'#a040ff', eye:'#ff00ff' }, element:'shadow',    behavior:'basic',   baseHp:150, baseAtk:26, baseDef:10, speed:2.0, aggroRange:210, isRanged:false, resistances:{ shadow:0.8 }, weaknesses:{ holy:0.9 } },
] as const

for (const m of MEGA_MONSTERS) {
  registerExtendedMonster({ ...m, biomes: ['forest' as any] })
}

// ── helpers ────────────────────────────────────────────────────────────────
const NON_WALKABLE: TileType[] = [
  'water','deepwater','wall','dungeon_wall','dungeon_brick','lava','tree','rock',
  'house_wall','house_roof','fountain','lamp_post','market_stall','fence',
  'ice','frozen_tree','ice_rock','volcanic_rock','obsidian','volcanic_vent',
  'crystal_wall','ruin_wall','sky_void','cobweb','abyss_wall','void',
  'pine_tree','snowy_peak','mountain_rock','ice_crystal_node',
  'ruin_pillar','vine_wall','sarcophagus','rune_stone','ancient_brazier','tower_wall',
]
const T = (t: TileType): Tile => ({ type: t, walkable: !NON_WALKABLE.includes(t), transparent: true })
function rngOf(seed: number) { let r = seed>>>0||1; return () => { r = (r*1664525+1013904223)>>>0; return r/0xffffffff } }
function hashStr(s: string) { let h = 2166136261>>>0; for (let i=0;i<s.length;i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h>>>0 }
function blank(W: number, H: number, base: TileType): Tile[][] {
  const t: Tile[][] = []
  for (let y=0;y<H;y++){ t[y]=[]; for (let x=0;x<W;x++) t[y][x]=T(base) }
  return t
}
function border(t: Tile[][], W: number, H: number, tt: TileType) {
  for (let x=0;x<W;x++){ t[0][x]=T(tt); t[H-1][x]=T(tt) }
  for (let y=0;y<H;y++){ t[y][0]=T(tt); t[y][W-1]=T(tt) }
}
function place(t: Tile[][], x: number, y: number, tt: TileType) {
  const H=t.length, W=t[0].length
  if (x>0&&y>0&&x<W-1&&y<H-1) t[y][x]=T(tt)
}
function disc(t: Tile[][], cx: number, cy: number, r: number, tt: TileType) {
  for (let dy=-r; dy<=r; dy++) for (let dx=-r; dx<=r; dx++)
    if (dx*dx+dy*dy<=r*r) place(t, cx+dx, cy+dy, tt)
}
function ring(t: Tile[][], cx: number, cy: number, r: number, tt: TileType, thick=1) {
  for (let a=0;a<360;a+=1){
    const rd=a*Math.PI/180
    for (let k=0;k<thick;k++){
      const rr=r+k
      place(t, Math.round(cx+Math.cos(rd)*rr), Math.round(cy+Math.sin(rd)*rr), tt)
    }
  }
}
function line(t: Tile[][], x1:number,y1:number,x2:number,y2:number, tt: TileType, w=1) {
  const dx=x2-x1, dy=y2-y1, steps=Math.max(1, Math.max(Math.abs(dx), Math.abs(dy)))
  for (let i=0;i<=steps;i++){
    const x=Math.round(x1+dx*i/steps), y=Math.round(y1+dy*i/steps)
    for (let a=-w;a<=w;a++) for (let b=-w;b<=w;b++) place(t, x+a, y+b, tt)
  }
}
function spawnPack(t: Tile[][], rand: ()=>number, n: number, baseLvl: number, pool: MonsterType[], eliteChance=0.05): Monster[] {
  const out: Monster[] = []
  const H=t.length, W=t[0].length
  for (let i=0;i<n;i++){
    const x=4+Math.floor(rand()*(W-8)), y=4+Math.floor(rand()*(H-8))
    if (!t[y]?.[x]?.walkable) continue
    const m = pool[Math.floor(rand()*pool.length)]
    const lvl = baseLvl + Math.floor(rand()*6)
    out.push(createMonster(m, lvl, x*32, y*32, (rand()<eliteChance?'elite':'normal') as EliteTier))
  }
  return out
}

// ── padrões geométricos (10 famílias) ──────────────────────────────────────
type Palette = { base: TileType; wall: TileType; deco: TileType; deco2: TileType; special: TileType }
type Pattern =
  | 'concentric_rings' | 'hex_grid' | 'voronoi_cells' | 'dendritic_rivers'
  | 'spiral_arms' | 'zigzag_paths' | 'chambered_maze' | 'mosaic_tiles'
  | 'columned_hall' | 'crossed_causeways'

function apply(pattern: Pattern, t: Tile[][], W: number, H: number, pal: Palette, seed: number) {
  const rand = rngOf(seed)
  const cx = W>>1, cy = H>>1
  switch (pattern) {
    case 'concentric_rings': {
      for (let r=12; r<Math.min(W,H)/2-4; r+=14) ring(t, cx, cy, r, pal.wall, 2)
      for (let r=6; r<Math.min(W,H)/2-4; r+=14) ring(t, cx, cy, r, pal.deco)
      disc(t, cx, cy, 5, pal.special)
      // aberturas cardinais
      for (let a=0;a<4;a++){ const ang=a*Math.PI/2; for (let d=0;d<Math.min(W,H)/2;d++) place(t, Math.round(cx+Math.cos(ang)*d), Math.round(cy+Math.sin(ang)*d), pal.base) }
      break
    }
    case 'hex_grid': {
      const s = 10
      for (let y=s; y<H-s; y+=Math.round(s*1.5)){
        const off = ((y/Math.round(s*1.5))%2===0) ? 0 : s
        for (let x=s+off; x<W-s; x+=s*2){
          ring(t, x, y, s-2, pal.wall)
          if (rand()<0.35) disc(t, x, y, 2, pal.deco2)
          else if (rand()<0.15) place(t, x, y, pal.special)
        }
      }
      break
    }
    case 'voronoi_cells': {
      const N = 22
      const seeds: {x:number;y:number;deco:boolean}[] = []
      for (let i=0;i<N;i++) seeds.push({ x: Math.floor(rand()*W), y: Math.floor(rand()*H), deco: rand()<0.4 })
      for (let y=0;y<H;y++) for (let x=0;x<W;x++){
        let best=Infinity, second=Infinity, bi=0
        for (let i=0;i<N;i++){ const dx=x-seeds[i].x, dy=y-seeds[i].y, d=dx*dx+dy*dy; if (d<best){ second=best; best=d; bi=i } else if (d<second) second=d }
        if (second-best < 12) place(t, x, y, pal.wall)
        else if (seeds[bi].deco && (x+y)%5===0) place(t, x, y, pal.deco)
      }
      break
    }
    case 'dendritic_rivers': {
      // rio central + afluentes
      let x=4, y=cy
      while (x<W-4){ for (let dy=-2;dy<=2;dy++) place(t, x, y+dy, pal.special); x++; y += Math.round((rand()-0.5)*2); y = Math.max(6, Math.min(H-6, y)) }
      for (let i=0;i<12;i++){
        let bx=10+Math.floor(rand()*(W-20)), by=cy, tgtY=(rand()<0.5?4:H-4)
        while (by!==tgtY){ for (let dx=-1;dx<=1;dx++) place(t, bx+dx, by, pal.special); by += (tgtY>by?1:-1); bx += Math.round((rand()-0.5)*2) }
      }
      // ilhas de deco
      for (let i=0;i<40;i++) disc(t, 4+Math.floor(rand()*(W-8)), 4+Math.floor(rand()*(H-8)), 2, pal.deco)
      break
    }
    case 'spiral_arms': {
      const arms = 4
      for (let a=0;a<arms;a++){
        const phase = a*(Math.PI*2/arms)
        for (let r=2;r<Math.min(W,H)/2-4;r+=0.4){
          const ang = phase + r*0.18
          place(t, Math.round(cx+Math.cos(ang)*r), Math.round(cy+Math.sin(ang)*r), pal.wall)
          if (r%6<0.5) place(t, Math.round(cx+Math.cos(ang+0.2)*r), Math.round(cy+Math.sin(ang+0.2)*r), pal.deco)
        }
      }
      disc(t, cx, cy, 4, pal.special)
      break
    }
    case 'zigzag_paths': {
      for (let y=8; y<H-8; y+=12){
        for (let x=4; x<W-4; x++){
          const off = Math.round(Math.sin(x*0.15)*3)
          place(t, x, y+off, pal.deco)
          if (x%14===0) place(t, x, y+off, pal.wall)
        }
      }
      for (let i=0;i<25;i++) disc(t, 6+Math.floor(rand()*(W-12)), 6+Math.floor(rand()*(H-12)), 2, pal.deco2)
      break
    }
    case 'chambered_maze': {
      const gs = 24
      for (let y=gs; y<H-gs; y+=gs){
        for (let x=0; x<W; x++) place(t, x, y, pal.wall)
      }
      for (let x=gs; x<W-gs; x+=gs){
        for (let y=0; y<H; y++) place(t, x, y, pal.wall)
      }
      // aberturas
      for (let y=gs; y<H-gs; y+=gs) for (let x=gs; x<W-gs; x+=gs){
        const gap = 3+Math.floor(rand()*4)
        for (let k=0;k<gap;k++){ place(t, x-gs/2+k, y, pal.base); place(t, x, y-gs/2+k, pal.base) }
        if (rand()<0.3) disc(t, x-gs/2, y-gs/2, 2, pal.deco)
        if (rand()<0.15) place(t, x-gs/2, y-gs/2, pal.special)
      }
      break
    }
    case 'mosaic_tiles': {
      const s = 8
      for (let y=0;y<H;y+=s) for (let x=0;x<W;x+=s){
        const r = rand()
        if (r<0.15) for (let dy=0;dy<s;dy++) for (let dx=0;dx<s;dx++) place(t, x+dx, y+dy, pal.deco)
        else if (r<0.25) for (let dy=0;dy<s;dy++) for (let dx=0;dx<s;dx++) place(t, x+dx, y+dy, pal.deco2)
        else if (r<0.30) for (let dy=0;dy<s;dy++) for (let dx=0;dx<s;dx++) place(t, x+dx, y+dy, pal.wall)
        // moldura
        for (let k=0;k<s;k++){ place(t, x+k, y, pal.wall); place(t, x, y+k, pal.wall) }
      }
      break
    }
    case 'columned_hall': {
      // corredor central com colunas alinhadas
      for (let y=6; y<H-6; y+=8){
        for (let x=10; x<W-10; x+=12){
          disc(t, x, y, 2, pal.wall)
          if (rand()<0.2) place(t, x, y, pal.special)
        }
      }
      // laterais decorativas
      for (let x=4; x<W-4; x++){ place(t, x, 3, pal.deco); place(t, x, H-4, pal.deco) }
      break
    }
    case 'crossed_causeways': {
      // vazio + caminhos elevados formando X e +
      for (let y=0;y<H;y++) for (let x=0;x<W;x++) place(t, x, y, pal.special)
      for (let x=0;x<W;x++){ for (let k=-2;k<=2;k++){ place(t, x, cy+k, pal.base); place(t, x, cy+k, pal.base) } }
      for (let y=0;y<H;y++){ for (let k=-2;k<=2;k++){ place(t, cx+k, y, pal.base) } }
      // diagonais
      for (let i=0;i<Math.min(W,H);i++){
        for (let k=-1;k<=1;k++){ place(t, i+k, i, pal.base); place(t, W-1-i+k, i, pal.base) }
      }
      // ilhas
      for (let i=0;i<18;i++) disc(t, 6+Math.floor(rand()*(W-12)), 6+Math.floor(rand()*(H-12)), 3, pal.deco)
      break
    }
  }
}

// ── 50 biomas ──────────────────────────────────────────────────────────────
interface MegaSpec {
  id: string
  name: string
  minLvl: number
  pattern: Pattern
  pal: Palette
  pool: MonsterType[]
  boss?: MonsterType
  W?: number
  H?: number
  packs?: number
  description?: string
}

// Paletas reutilizadas para máxima variedade visual.
const PAL: Record<string, Palette> = {
  glass:    { base:'crystal_floor', wall:'crystal_wall', deco:'crystal',       deco2:'gem_node',       special:'crystal_portal' },
  mirror:   { base:'ice',           wall:'ice_rock',    deco:'snow',          deco2:'frost_grass',    special:'ice_crystal_node' },
  prism:    { base:'crystal_floor', wall:'dark_crystal',deco:'crystal',       deco2:'gem_node',       special:'crystal' },
  dune:     { base:'sand',          wall:'stone',       deco:'dirt',          deco2:'ash',            special:'gold_ore_node' },
  bone:     { base:'ancient_tile',  wall:'ruin_wall',   deco:'broken_tile',   deco2:'sarcophagus',    special:'rune_stone' },
  ember:    { base:'ash',           wall:'obsidian',    deco:'magma_crust',   deco2:'volcanic_rock',  special:'lava' },
  moss:     { base:'grass',         wall:'ancient_bark',deco:'tall_grass',    deco2:'flower',         special:'mushroom' },
  bog:      { base:'dark_water',    wall:'mossy_stone', deco:'mushroom',      deco2:'tall_grass',     special:'root' },
  reef:     { base:'sand',          wall:'rock',        deco:'water',         deco2:'deepwater',      special:'chest' },
  tide:     { base:'water',         wall:'stone',       deco:'sand',          deco2:'flower',         special:'bridge' },
  glow:     { base:'grass',         wall:'canopy',      deco:'flower',        deco2:'mushroom',       special:'ancient_brazier' },
  iron:     { base:'stone',         wall:'wall',        deco:'dirt',          deco2:'iron_ore_node',  special:'chest' },
  thorn:    { base:'grass',         wall:'tree',        deco:'tall_grass',    deco2:'flower',         special:'garden' },
  sky:      { base:'cloud_floor',   wall:'sky_platform',deco:'sky_platform',  deco2:'cloud_floor',    special:'sky_portal' },
  rust:     { base:'dungeon_floor', wall:'dungeon_wall',deco:'dungeon_brick', deco2:'broken_tile',    special:'chest' },
  salt:     { base:'snow',          wall:'ice_rock',    deco:'ice',           deco2:'snow_rock',      special:'frozen_campfire' },
  ashland:  { base:'ash',           wall:'volcanic_rock',deco:'magma_crust',  deco2:'obsidian',       special:'volcanic_vent' },
  star:     { base:'abyss_floor',   wall:'abyss_wall',  deco:'dark_crystal',  deco2:'crystal',        special:'soul_fire' },
  jade:     { base:'grass',         wall:'mossy_stone', deco:'root',          deco2:'ancient_bark',   special:'ancient_brazier' },
  ashwood:  { base:'dirt',          wall:'ancient_bark',deco:'mushroom',      deco2:'root',           special:'canopy' },
  ravine:   { base:'stone',         wall:'rock',        deco:'dirt',          deco2:'sand',           special:'lava' },
  onyx:     { base:'obsidian',      wall:'volcanic_rock',deco:'ash',          deco2:'magma_crust',    special:'gem_node' },
  storm:    { base:'cloud_floor',   wall:'sky_platform',deco:'sky_platform',  deco2:'cloud_floor',    special:'sky_portal' },
  aurora:   { base:'snow',          wall:'ice_rock',    deco:'ice',           deco2:'frost_grass',    special:'ice_crystal_node' },
  amber:    { base:'sand',          wall:'stone',       deco:'flower',        deco2:'tall_grass',     special:'gold_ore_node' },
  cobalt:   { base:'stone',         wall:'wall',        deco:'iron_ore_node', deco2:'gold_ore_node',  special:'diamond_ore_node' },
  dream:    { base:'crystal_floor', wall:'dark_crystal',deco:'gem_node',      deco2:'crystal',        special:'crystal_portal' },
  slag:     { base:'magma_crust',   wall:'obsidian',    deco:'ash',           deco2:'volcanic_rock',  special:'lava' },
  valky:    { base:'snow',          wall:'snowy_peak',  deco:'ice',           deco2:'pine_tree',      special:'frozen_campfire' },
  void:     { base:'abyss_floor',   wall:'abyss_wall',  deco:'void',          deco2:'dark_crystal',   special:'soul_fire' },
}

// 50 specs — cada um casa um padrão único a uma paleta e pool de monstros.
const M = MEGA_MONSTERS.map(m => m.id) as unknown as MonsterType[]
// pools temáticos
const POOL = {
  glass:  [M[0], M[1], 'crystal_spider','prism_wraith'],
  prism:  [M[2], M[1], 'crystal_drake','crystal_sentinel'],
  desert: [M[3], M[4], 'sand_wraith' as any, 'mummy_lord'],
  ruins:  [M[4], 'stone_sentinel','tomb_guardian','ancient_scarab_swarm'],
  fire:   [M[5], 'magma_imp','molten_hound','lava_golem'],
  forest: [M[6], 'bramble_ent','treant','forest_guardian'],
  swamp:  [M[7], 'bog_witch','plague_toad','hydra_spawn'],
  reef:   [M[8], M[9], 'deep_kraken','siren','reef_crab'],
  moth:   [M[11], M[26], 'sky_drake','storm_harpy'],
  iron:   [M[12], 'flesh_construct','iron_maiden','dread_knight'],
  thorn:  [M[13], 'treant','venom_widow','bramble_ent'],
  sky:    [M[14], 'storm_harpy','cloud_giant','sky_drake'],
  rust:   [M[15], 'dread_knight','iron_maiden','lich_acolyte'],
  salt:   [M[16], 'frostbite_imp','ice_revenant' as any,'glacial_warden'],
  ashland:[M[20], 'ashen_ghoul','molten_hound','magma_serpent'],
  star:   [M[18], 'void_stalker','soul_eater','abyssal_eye'],
  moss:   [M[19], 'treant','bramble_ent','forest_guardian'],
  mist:   [M[21], 'wind_dancer','banshee','wight'],
  maw:    [M[22], 'flesh_construct','iron_maiden','arcane_construct'],
  gold:   [M[23], 'ancient_scarab_swarm','mummy_lord','cursed_pharaoh'],
  hex:    [M[24], 'crystal_spider','hex_slime' as any, M[0]],
  storm:  [M[25], 'storm_harpy','sky_drake','cloud_giant'],
  dream:  [M[26], M[1], 'prism_wraith','crystal_drake'],
  slag:   [M[27], 'lava_golem','magma_imp','obsidian_juggernaut'],
  valky:  [M[28], 'frostbite_imp','glacial_warden','banshee'],
  void:   [M[29], 'void_stalker','void_horror','abyssal_eye'],
  bone:   ['skeleton','wight','bone_colossus',M[4]],
  bog:    ['plague_toad','swamp_leech','mire_lurker','bog_witch'],
  ember:  ['magma_imp','flame_serpent','phoenix_chick','molten_hound'],
  jade:   ['treant','bramble_ent','venom_widow','forest_guardian'],
  ashwood:['bramble_ent','shadow_assassin','venom_widow','gravewalker'],
  ravine: ['orc','troll','sand_titan','rock_worm'],
  onyx:   ['obsidian_juggernaut','lava_golem','magma_serpent','flame_serpent'],
  aurora: ['ice_valkyrie' as any,'glacial_warden','frostbite_imp','banshee'],
  amber:  ['scorpion' as any,'sand_titan','mummy_lord',M[3]],
  cobalt: ['gem_golem','crystal_sentinel','arcane_construct','iron_maiden'],
  tide:   ['reef_crab','tidal_serpent','siren','deep_kraken'],
}

const SPECS: MegaSpec[] = [
  { id:'mega_glasscoast',  name:'Costa de Vidro',        minLvl:12, pattern:'concentric_rings',  pal: PAL.glass,   pool: POOL.glass,   description:'Anéis cristalinos concêntricos'  },
  { id:'mega_mirrorlake',  name:'Lago Espelhado',        minLvl:14, pattern:'concentric_rings',  pal: PAL.mirror,  pool: POOL.glass,   description:'Anéis gelados espelhados'         },
  { id:'mega_prismvale',   name:'Vale Prismático',       minLvl:18, pattern:'spiral_arms',       pal: PAL.prism,   pool: POOL.prism,   description:'Braços espirais de cristal'       },
  { id:'mega_dreamgrove',  name:'Bosque dos Sonhos',     minLvl:24, pattern:'spiral_arms',       pal: PAL.dream,   pool: POOL.dream,   description:'Espirais oníricas cristalinas'    },
  { id:'mega_hexhive',     name:'Colmeia Hexagonal',     minLvl:16, pattern:'hex_grid',          pal: PAL.glass,   pool: POOL.hex,     description:'Grade hexagonal cristalina'       },
  { id:'mega_cobalthive',  name:'Colmeia Cobalto',       minLvl:26, pattern:'hex_grid',          pal: PAL.cobalt,  pool: POOL.cobalt,  description:'Câmaras hexagonais de minério'    },
  { id:'mega_amberhive',   name:'Colmeia Âmbar',         minLvl:14, pattern:'hex_grid',          pal: PAL.amber,   pool: POOL.amber,   description:'Favos áureos no deserto'          },
  { id:'mega_voronoi_isles',name:'Ilhas Voronoi',        minLvl:15, pattern:'voronoi_cells',     pal: PAL.reef,    pool: POOL.reef,    description:'Células orgânicas de recife'      },
  { id:'mega_voronoi_stars',name:'Estrelas Voronoi',     minLvl:32, pattern:'voronoi_cells',     pal: PAL.star,    pool: POOL.star,    description:'Cadeias estelares fragmentadas'   },
  { id:'mega_voronoi_dune',name:'Dunas Voronoi',         minLvl:19, pattern:'voronoi_cells',     pal: PAL.dune,    pool: POOL.desert,  description:'Dunas particionadas'              },
  { id:'mega_dendritic_rivers',name:'Rios Dendríticos',  minLvl:11, pattern:'dendritic_rivers',  pal: PAL.bog,     pool: POOL.bog,     description:'Delta pantanoso ramificado'       },
  { id:'mega_dendritic_lava',name:'Rios de Lava',        minLvl:22, pattern:'dendritic_rivers',  pal: PAL.slag,    pool: POOL.slag,    description:'Rede de rios de magma'            },
  { id:'mega_dendritic_veins',name:'Veias Ferruginosas', minLvl:20, pattern:'dendritic_rivers',  pal: PAL.iron,    pool: POOL.iron,    description:'Veias metálicas ramificadas'      },
  { id:'mega_dendritic_roots',name:'Raízes Dendríticas', minLvl:25, pattern:'dendritic_rivers',  pal: PAL.ashwood, pool: POOL.moss,    description:'Raízes que se ramificam'          },
  { id:'mega_zigzag_dunes', name:'Dunas Onduladas',      minLvl:13, pattern:'zigzag_paths',      pal: PAL.dune,    pool: POOL.desert,  description:'Trilhas sinuosas nas dunas'       },
  { id:'mega_zigzag_moss',  name:'Trilhas de Musgo',     minLvl:9,  pattern:'zigzag_paths',      pal: PAL.moss,    pool: POOL.forest,  description:'Passagens serpenteantes'          },
  { id:'mega_zigzag_storm', name:'Correntes Elétricas',  minLvl:24, pattern:'zigzag_paths',      pal: PAL.storm,   pool: POOL.storm,   description:'Descargas em zigue-zague'         },
  { id:'mega_chamber_bone', name:'Câmaras Ósseas',       minLvl:17, pattern:'chambered_maze',    pal: PAL.bone,    pool: POOL.bone,    description:'Labirinto quadriculado de ossos'  },
  { id:'mega_chamber_rust', name:'Câmaras de Ferrugem',  minLvl:20, pattern:'chambered_maze',    pal: PAL.rust,    pool: POOL.rust,    description:'Câmaras enferrujadas'             },
  { id:'mega_chamber_gold', name:'Câmaras Douradas',     minLvl:28, pattern:'chambered_maze',    pal: PAL.gold||PAL.amber, pool: POOL.gold, description:'Salas douradas ancestrais'   },
  { id:'mega_chamber_moss', name:'Câmaras Verdes',       minLvl:12, pattern:'chambered_maze',    pal: PAL.jade,    pool: POOL.jade,    description:'Salas cobertas de musgo'          },
  { id:'mega_mosaic_temple',name:'Templo Mosaico',       minLvl:19, pattern:'mosaic_tiles',      pal: PAL.bone,    pool: POOL.ruins,   description:'Piso em mosaico ancestral'        },
  { id:'mega_mosaic_prism', name:'Mosaico Prismático',   minLvl:23, pattern:'mosaic_tiles',      pal: PAL.prism,   pool: POOL.prism,   description:'Ladrilhos cristalinos'            },
  { id:'mega_mosaic_aurora',name:'Mosaico Auroral',      minLvl:26, pattern:'mosaic_tiles',      pal: PAL.aurora,  pool: POOL.aurora,  description:'Mosaico de gelo e luz'            },
  { id:'mega_columned_iron',name:'Salão Colunado',       minLvl:21, pattern:'columned_hall',     pal: PAL.iron,    pool: POOL.iron,    description:'Hall de colunas metálicas'        },
  { id:'mega_columned_moth',name:'Salão das Mariposas',  minLvl:16, pattern:'columned_hall',     pal: PAL.glow,    pool: POOL.moth,    description:'Colunas bioluminescentes'         },
  { id:'mega_columned_star',name:'Salão Estelar',        minLvl:34, pattern:'columned_hall',     pal: PAL.star,    pool: POOL.star,    description:'Colunas ancoradas no vazio'       },
  { id:'mega_columned_sky', name:'Salão Celestial',      minLvl:29, pattern:'columned_hall',     pal: PAL.sky,     pool: POOL.sky,     description:'Colunas nas nuvens'               },
  { id:'mega_causeway_isles',name:'Passarelas do Recife',minLvl:18, pattern:'crossed_causeways', pal: PAL.reef,    pool: POOL.reef,    description:'Cruzamentos sobre o mar'          },
  { id:'mega_causeway_sky', name:'Passarelas Celestes',  minLvl:24, pattern:'crossed_causeways', pal: PAL.sky,     pool: POOL.sky,     description:'Passarelas entre nuvens'          },
  { id:'mega_causeway_lava',name:'Passarelas de Lava',   minLvl:27, pattern:'crossed_causeways', pal: PAL.slag,    pool: POOL.slag,    description:'Pontes sobre magma'               },
  { id:'mega_causeway_void',name:'Passarelas do Vazio',  minLvl:36, pattern:'crossed_causeways', pal: PAL.void,    pool: POOL.void,    description:'Pontes cósmicas no vazio'         },
  { id:'mega_ember_rings',  name:'Anéis de Brasa',       minLvl:20, pattern:'concentric_rings',  pal: PAL.ember,   pool: POOL.ember,   description:'Anéis de fogo concêntricos'       },
  { id:'mega_salt_rings',   name:'Anéis Salinos',        minLvl:14, pattern:'concentric_rings',  pal: PAL.salt,    pool: POOL.salt,    description:'Círculos de sal endurecido'       },
  { id:'mega_bog_rings',    name:'Anéis do Pântano',     minLvl:15, pattern:'concentric_rings',  pal: PAL.bog,     pool: POOL.bog,     description:'Círculos pantanosos'              },
  { id:'mega_spiral_ember', name:'Espiral de Brasa',     minLvl:22, pattern:'spiral_arms',       pal: PAL.ember,   pool: POOL.ember,   description:'Braços incandescentes'            },
  { id:'mega_spiral_bone',  name:'Espiral Óssea',        minLvl:24, pattern:'spiral_arms',       pal: PAL.bone,    pool: POOL.bone,    description:'Espiral macabra'                  },
  { id:'mega_spiral_moth',  name:'Espiral das Mariposas',minLvl:17, pattern:'spiral_arms',       pal: PAL.glow,    pool: POOL.moth,    description:'Espiral luminescente'             },
  { id:'mega_hex_ember',    name:'Colmeia de Brasa',     minLvl:23, pattern:'hex_grid',          pal: PAL.ember,   pool: POOL.ember,   description:'Favos ígneos'                     },
  { id:'mega_hex_thorn',    name:'Colmeia Espinhenta',   minLvl:15, pattern:'hex_grid',          pal: PAL.thorn,   pool: POOL.thorn,   description:'Favos vegetais'                   },
  { id:'mega_hex_void',     name:'Colmeia do Vazio',     minLvl:34, pattern:'hex_grid',          pal: PAL.void,    pool: POOL.void,    description:'Favos cósmicos'                   },
  { id:'mega_voronoi_moss', name:'Ilhas de Musgo',       minLvl:10, pattern:'voronoi_cells',     pal: PAL.moss,    pool: POOL.moss,    description:'Manchas verdes fragmentadas'      },
  { id:'mega_voronoi_maw',  name:'Fragmentos Metálicos', minLvl:27, pattern:'voronoi_cells',     pal: PAL.iron,    pool: POOL.maw,     description:'Fragmentos de sucata'             },
  { id:'mega_zigzag_mist',  name:'Trilhas de Neblina',   minLvl:18, pattern:'zigzag_paths',      pal: PAL.salt,    pool: POOL.mist,    description:'Serpentinas na neblina'           },
  { id:'mega_zigzag_valky', name:'Trilhas de Guerra',    minLvl:26, pattern:'zigzag_paths',      pal: PAL.valky,   pool: POOL.valky,   description:'Trilhas guerreiras geladas'       },
  { id:'mega_chamber_ravine',name:'Câmaras do Cânion',   minLvl:16, pattern:'chambered_maze',    pal: PAL.ravine,  pool: POOL.ravine,  description:'Grade cavada em rocha'            },
  { id:'mega_chamber_onyx', name:'Câmaras de Ônix',      minLvl:30, pattern:'chambered_maze',    pal: PAL.onyx,    pool: POOL.onyx,    description:'Câmaras vulcânicas negras'        },
  { id:'mega_mosaic_gold',  name:'Mosaico Dourado',      minLvl:25, pattern:'mosaic_tiles',      pal: PAL.amber,   pool: POOL.gold,    description:'Mosaico ancestral dourado'        },
  { id:'mega_columned_valky',name:'Salão das Valquírias',minLvl:32, pattern:'columned_hall',     pal: PAL.valky,   pool: POOL.valky,   description:'Colunas gélidas dos guerreiros'   },
  { id:'mega_causeway_tide',name:'Passarelas da Maré',   minLvl:19, pattern:'crossed_causeways', pal: PAL.tide,    pool: POOL.tide,    description:'Pontes sobre marés vivas'         },
]

const SPEC_MAP = new Map(SPECS.map(s => [s.id, s]))

export function isMegaBiome(id: string): boolean { return SPEC_MAP.has(id) }

export function generateMegaBiome(id: string): GameMap | null {
  const spec = SPEC_MAP.get(id)
  if (!spec) return null
  const W = spec.W ?? 240, H = spec.H ?? 240
  const t = blank(W, H, spec.pal.base)
  const seed = hashStr(spec.id)
  border(t, W, H, spec.pal.wall)
  apply(spec.pattern, t, W, H, spec.pal, seed)

  // limpa uma clareira de spawn no centro
  const cx = W>>1, cy = H>>1
  for (let dy=-5; dy<=5; dy++) for (let dx=-5; dx<=5; dx++) place(t, cx+dx, cy+dy, spec.pal.base)

  const rand = rngOf(seed ^ 0xabcdef)
  const packs = spec.packs ?? 48
  const monsters = spawnPack(t, rand, packs, spec.minLvl, spec.pool, 0.08)

  return {
    id: spec.id,
    name: spec.name,
    width: W,
    height: H,
    tiles: t,
    monsters,
    npcs: [],
    spawns: [],
    spawnPoints: [{ x: cx * 32, y: cy * 32 }],
    playerSpawn: { x: cx * 32, y: cy * 32 },
  } as GameMap
}

export function getAllMegaBiomes(): { id: string; name: string; minLvl: number; description?: string }[] {
  return SPECS.map(s => ({ id: s.id, name: s.name, minLvl: s.minLvl, description: s.description }))
}

export function getAllMegaBiomeSpecs() {
  return SPECS
}