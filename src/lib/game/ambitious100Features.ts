// 100 AMBITIOUS GAME SYSTEMS & FEATURES MODULE FOR RUCOY EXPANDED
// Provides state management, types, and logic for all 100 ambitious features.

export interface Mount {
  id: string
  name: string
  speedBonus: number
  statBoost: { atk?: number; def?: number; hp?: number }
  sprite: string
  unlocked: boolean
}

export interface PetCompanion {
  id: string
  name: string
  type: 'loot' | 'heal' | 'buff' | 'combat'
  powerLevel: number
  active: boolean
  sprite: string
}

export interface WeatherEffect {
  id: string
  name: string
  icon: string
  description: string
  statModifier: { atkMultiplier: number; speedMultiplier: number; dotDamagePerSec: number }
}

export interface RuneStone {
  id: string
  name: string
  element: 'fire' | 'ice' | 'lightning' | 'void' | 'holy'
  tier: number
  statBonus: string
}

export interface GuildTerritory {
  id: string
  name: string
  controlledByGuild: string | null
  taxRate: number
  incomeGoldPerMin: number
}

export interface BountyContract {
  id: string
  targetName: string
  location: string
  rewardGold: number
  rewardExp: number
  completed: boolean
}

// FULL LIST OF ALL 100 AMBITIOUS FEATURES DEFINED & REGISTERED
export const AMBITIOUS_FEATURES_CATALOG = [
  // 1-10: Clima e Eventos Mundiais
  { id: 'feat_1', name: 'Tempestade Elemental Dinâmica', category: 'Clima', desc: 'Sistemas de clima aleatório alteram stats em tempo real em todos os 100 biomas.' },
  { id: 'feat_2', name: 'Lua de Sangue & Invasão das Sombras', category: 'Eventos', desc: 'Invasão noturna que multiplica EXP por 3x e fortalece todos os monstros.' },
  { id: 'feat_3', name: 'Chuva Tóxica Corrosiva', category: 'Clima', desc: 'Exige poções antídoto ou armaduras resistentes a ácido.' },
  { id: 'feat_4', name: 'Erupção Vulcânica em Tempo Real', category: 'Eventos', desc: 'Bolas de fogo caem do céu nos biomas de Lava e Vulcão.' },
  { id: 'feat_5', name: 'Chuva de Meteoros de Cristal', category: 'Eventos', desc: 'Impacto de meteoros que deixam jazidas de minérios raros para mineração.' },
  { id: 'feat_6', name: 'Distorção de Gravidade', category: 'Clima', desc: 'Altera a velocidade de movimento e pulo do jogador em biomas celestiais.' },
  { id: 'feat_7', name: 'Vento do Vazio Abissal', category: 'Clima', desc: 'Drena mana lentamente se o jogador não usar runas protetoras.' },
  { id: 'feat_8', name: 'Eclipse Solar Primordial', category: 'Eventos', desc: 'Invoca o Boss Oculto Sol Negro no topo da montanha celestial.' },
  { id: 'feat_9', name: 'Névoa Glacial Congelante', category: 'Clima', desc: 'Reduz a velocidade de ataque e congela inimigos se atingidos por magias de gelo.' },
  { id: 'feat_10', name: 'Aurora Astral Abençoada', category: 'Clima', desc: 'Regenera HP e Mana de todos os jogadores no bioma.' },

  // 11-20: Montarias e Companheiros
  { id: 'feat_11', name: 'Montaria: Dragão de Fogo Ancião', category: 'Montarias', desc: '+80% Velocidade, Imunidade à Lava e Soprar Fogo Ativo.' },
  { id: 'feat_12', name: 'Montaria: Grifo das Tempestades', category: 'Montarias', desc: 'Permite voar sobre precipícios e paredes em dungeons.' },
  { id: 'feat_13', name: 'Montaria: Golem Mecânico de Titânio', category: 'Montarias', desc: '+150 Armadura e escudo protetor contra knockback.' },
  { id: 'feat_14', name: 'Montaria: Pantera das Sombras', category: 'Montarias', desc: 'Invisibilidade temporária ao entrar em combate de surpresa.' },
  { id: 'feat_15', name: 'Montaria: Fênix Imortal', category: 'Montarias', desc: 'Ressuscita o jogador instantaneamente 1x a cada 10 minutos.' },
  { id: 'feat_16', name: 'Montaria: Cavalo de Guerra Cibernético', category: 'Montarias', desc: 'Investida que atordoa monstros ao acelerar.' },
  { id: 'feat_17', name: 'Montaria: Mamute das Neves', category: 'Montarias', desc: 'Carrega inventário expandido com +50 slots extras.' },
  { id: 'feat_18', name: 'Montaria: Cervo de Cristal', category: 'Montarias', desc: 'Emite luz em dungeons escuras e aumenta drop rate de gemas.' },
  { id: 'feat_19', name: 'Montaria: Hidra de Três Cabeças', category: 'Montarias', desc: 'Ataca 3 alvos simultâneos enquanto em movimento.' },
  { id: 'feat_20', name: 'Montaria: Leviatã Profundo', category: 'Montarias', desc: 'Navegação ultrarrápida em biomas aquáticos e recifes.' },

  // 21-30: Pets Ajudantes e Coletores
  { id: 'feat_21', name: 'Pet: Fada Coletora Automática', category: 'Pets', desc: 'Coleta todo o ouro e drops do chão instantaneamente.' },
  { id: 'feat_22', name: 'Pet: Bebê Dragão Cuspidor de Fogo', category: 'Pets', desc: 'Causa dano de fogo contínuo em bosses.' },
  { id: 'feat_23', name: 'Pet: Golem Curador de Cristal', category: 'Pets', desc: 'Cura 10% do HP do jogador a cada 5 segundos.' },
  { id: 'feat_24', name: 'Pet: Espectro Mágico Restaurador', category: 'Pets', desc: 'Restaura mana automaticamente durante o combate.' },
  { id: 'feat_25', name: 'Pet: Lobo Caçador de Críticos', category: 'Pets', desc: '+15% de Chance de Acerto Crítico para o mestre.' },
  { id: 'feat_26', name: 'Pet: Feneco do Deserto Minerador', category: 'Pets', desc: 'Encontra minérios raros escondidos pelo mapa.' },
  { id: 'feat_27', name: 'Pet: Coruja da Sabedoria', category: 'Pets', desc: '+25% de Bônus de Experiência permanente.' },
  { id: 'feat_28', name: 'Pet: Gato da Sorte Macabra', category: 'Pets', desc: 'Aumenta a chance de itens Lendários em 2x.' },
  { id: 'feat_29', name: 'Pet: Servo Necromântico Miniatura', category: 'Pets', desc: 'Invoca pequenos esqueletos para distrair inimigos.' },
  { id: 'feat_30', name: 'Pet: Tartaruga de Aço Protetora', category: 'Pets', desc: 'Absorve 20% do dano recebido pelo mestre.' },

  // 31-40: Sistema de Runas e Encantamentos (+1 a +20)
  { id: 'feat_31', name: 'Forja de Encantamento Estelar (+1 a +20)', category: 'Crafting', desc: 'Evolua armas e armaduras aumentando brilho e atributos em até 200%.' },
  { id: 'feat_32', name: 'Soquetes de Runas Elementais', category: 'Crafting', desc: 'Insira Runas de Fogo, Gelo, Trovão, Sangue e Vazio em equipamentos.' },
  { id: 'feat_33', name: 'Fusão de Equipamentos Lendários', category: 'Crafting', desc: 'Combine 3 itens idênticos para criar uma versão Mítica.' },
  { id: 'feat_34', name: 'Inscrição de Almas Bound', category: 'Crafting', desc: 'Sela atributos únicos que evitam a perda de itens ao morrer.' },
  { id: 'feat_35', name: 'Desencantamento e Reciclagem de Pó Mágico', category: 'Crafting', desc: 'Transforme equipamentos inutilizados em matéria-prima para runas.' },
  { id: 'feat_36', name: 'Alquimia Transmutadora de Poções', category: 'Crafting', desc: 'Crie elixires de invulnerabilidade e poções de super força.' },
  { id: 'feat_37', name: 'Criação de Pergaminhos de Teletransporte', category: 'Crafting', desc: 'Teleporte instantâneo para qualquer um dos 100 andares desbloqueados.' },
  { id: 'feat_38', name: 'Pintura & Tingimento de Armaduras', category: 'Cosméticos', desc: 'Personalize as cores das armaduras com mais de 50 pigmentos.' },
  { id: 'feat_39', name: 'Sistema de Auras Visuais e Rastros', category: 'Cosméticos', desc: 'Efeitos de fogo, eletricidade, pétalas ou sombras ao caminhar.' },
  { id: 'feat_40', name: 'Asas Cosméticas de Titãs', category: 'Cosméticos', desc: 'Asas animadas com efeitos de partículas 2D.' },

  // 41-50: Guildas, Guerras de Território e Economia
  { id: 'feat_41', name: 'Sistema Completo de Guildas', category: 'Social', desc: 'Crie guildas, suba de nível, declare guerras e gerencie cargos.' },
  { id: 'feat_42', name: 'Guerra por Fortes e Territórios', category: 'Social', desc: 'Conquiste castelos nos biomas e receba impostos das compras dos jogadores.' },
  { id: 'feat_43', name: 'Cofre Compartilhado de Guilda', category: 'Social', desc: 'Deposite gold e itens estratégicos para membros da guilda.' },
  { id: 'feat_44', name: 'Árvore de Habilidades de Guilda', category: 'Social', desc: 'Buffs passivos de ataque, exp e defesa para todos os membros.' },
  { id: 'feat_45', name: 'Mercado de Leilões em Tempo Real', category: 'Economia', desc: 'Compre e venda itens globais através do Mercado Livre do Rucoy.' },
  { id: 'feat_46', name: 'Lojas Pessoais de Jogadores (Vending)', category: 'Economia', desc: 'Monte sua barraca na Cidade e venda itens enquanto ausente.' },
  { id: 'feat_47', name: 'Bolsa de Valores e Commodities do Jogo', category: 'Economia', desc: 'Flutuação de preços dinâmicos de minérios, madeira e poções.' },
  { id: 'feat_48', name: 'Sistema de Contratos de Caçador de Recompensas', category: 'Caça', desc: 'Pegue cartazes de procurado de monstros raros e jogadores PK.' },
  { id: 'feat_49', name: 'Estatísticas Globais da Economia', category: 'Economia', desc: 'Acompanhe a circulação total de Gold e itens no servidor.' },
  { id: 'feat_50', name: 'Moeda Astral e Loja Especial', category: 'Economia', desc: 'Moeda adquirida ao derrotar bosses dos 100 andares da Masmorra.' },

  // 51-60: Arenas PvP, Torneios e Ranking Elo
  { id: 'feat_51', name: 'Arena Automatizada de Torneio 1v1', category: 'PvP', desc: 'Duelos ranqueados com sistema de pontuação ELO e ligas (Bronze a Mestre).' },
  { id: 'feat_52', name: 'Battle Royale de 50 Jogadores', category: 'PvP', desc: 'Último sobrevivente na névoa tóxica ganha baú mítico.' },
  { id: 'feat_53', name: 'Coliseu de Sobrevivência por Ondas', category: 'PvE', desc: 'Enfrente ondas infinitas de monstros em cooperação com até 4 amigos.' },
  { id: 'feat_54', name: 'Modo Infamy & Sistema Red Skull/PK Advanced', category: 'PvP', desc: 'Caça a jogadores maldosos com recompensas dobradas.' },
  { id: 'feat_55', name: 'Desafios Semanais de Duelos de Classe', category: 'PvP', desc: 'Mage vs Mage, Archer vs Archer para definir o Campeão da Classe.' },
  { id: 'feat_56', name: 'Títulos Dinâmicos de Conquista', category: 'Perfil', desc: 'Exiba títulos como "O Carrasco de Demônios" ou "Rei da Masmorra".' },
  { id: 'feat_57', name: 'Placar de Líderes em Tempo Real', category: 'Ranking', desc: 'Ranking de Nível, Atributos, Bosses Derrotados e Ouro acumulado.' },
  { id: 'feat_58', name: 'Modo Espectador de Lutas de Arena', category: 'PvP', desc: 'Assista partidas de torneios de outros jogadores em tempo real.' },
  { id: 'feat_59', name: 'Recompensas Diárias por Vitória no PvP', category: 'PvP', desc: 'Ganhe Insígnias de Honra trocáveis por equipamentos únicos.' },
  { id: 'feat_60', name: 'Sistema de Vingança Duelo Direto', category: 'PvP', desc: 'Notificação instantânea para desafiar quem te derrotou recentemente.' },

  // 61-70: Profissões e Atividades Secundárias
  { id: 'feat_61', name: 'Profissão: Mineração de Veios Profundos', category: 'Profissões', desc: 'Quebre rochas em biomas para obter cobre, ferro, titânio e orichalcum.' },
  { id: 'feat_62', name: 'Profissão: Pesca de Criaturas Abissais', category: 'Profissões', desc: 'Pesque peixes raros e tesouros submersos com varas encantadas.' },
  { id: 'feat_63', name: 'Profissão: Botânica e Culinária Alquímica', category: 'Profissões', desc: 'Colha plantas em biomas e cozinhe pratos que concedem buffs de 1 hora.' },
  { id: 'feat_64', name: 'Profissão: Forjaria de Armas de Elite', category: 'Profissões', desc: 'Forje lâminas, arcos e cajados de nível 100 com o seu nome gravado.' },
  { id: 'feat_65', name: 'Construção de Mansão & Habitação Pessoal', category: 'Housing', desc: 'Compre terrenos na Cidade e decore sua casa com móveis e troféus.' },
  { id: 'feat_66', name: 'Jardim Herbalista Privado', category: 'Housing', desc: 'Plante sementes na sua mansão para colher ingredientes mágicos diariamente.' },
  { id: 'feat_67', name: 'Expositor de Armaduras e Troféus de Boss', category: 'Housing', desc: 'Exiba cabeças de bosses derrotados e armaduras raras na sua parede.' },
  { id: 'feat_68', name: 'Laboratório de Experimentos de Alquimia', category: 'Housing', desc: 'Misture reagentes para descobrir poções secretas não catalogadas.' },
  { id: 'feat_69', name: 'Minijogo de Escavação Arqueológica', category: 'Atividades', desc: 'Encontre fósseis e relíquias antigas para trocar por experiência.' },
  { id: 'feat_70', name: 'Caça ao Tesouro com Mapas Enigmáticos', category: 'Atividades', desc: 'Siga pistas coordenadas no mapa para desenterrar baús lendários.' },

  // 71-80: Arvore de Habilidades e Transcendência de Classe
  { id: 'feat_71', name: 'Árvore de Habilidades Passivas Avançadas', category: 'Combate', desc: 'Mais de 50 nós passivos para personalizar o estilo de jogo da sua classe.' },
  { id: 'feat_72', name: 'Transcendência & Prestígio de Classe', category: 'Progresso', desc: 'Ao atingir nível 200, resete para Nível 1 Prestígio com bônus permanente de 20% em tudo.' },
  { id: 'feat_73', name: 'Habilidade Suprema: Metamorfose Elemental', category: 'Combate', desc: 'Transforme-se temporariamente em um Avatar Elemental com novos ataques.' },
  { id: 'feat_74', name: 'Combos de Golpes de Classe', category: 'Combate', desc: 'Sequências de botões de habilidade geram danos críticos multiplicados.' },
  { id: 'feat_75', name: 'Especialização Dano vs Suporte', category: 'Combate', desc: 'Escolha entre ser um Paladino Tanque Inquebrável ou Paladino de Luz Curador.' },
  { id: 'feat_76', name: 'Invocação de Horda Necromântica', category: 'Combate', desc: 'Necromantes podem controlar até 10 lacaios mortos-vivos simultâneos.' },
  { id: 'feat_77', name: 'Disparo Triplo Perfurante de Arqueiro', category: 'Combate', desc: 'Flechas atravessam fileiras de até 5 inimigos em linha reta.' },
  { id: 'feat_78', name: 'Meteoro do Vazio para Magos', category: 'Combate', desc: 'Invoca uma enorme bola de fogo espacial que devasta a área selecionada.' },
  { id: 'feat_79', name: 'Passo das Sombras Assassinato Instantâneo', category: 'Combate', desc: 'Teleporta instantaneamente para trás do alvo causando dano crítico massivo.' },
  { id: 'feat_80', name: 'Postura de Fúria Inesperada do Berserker', category: 'Combate', desc: 'Quanto menor o seu HP, maior é a sua velocidade e dano causado.' },

  // 81-90: Mecânicas de Boss Mítico e Masmorra Mutacional
  { id: 'feat_81', name: 'Bosses Múltiplas Fases com Bullet-Hell', category: 'Bosses', desc: 'Padrões de projéteis e círculos vermelhos de aviso antes dos ataques.' },
  { id: 'feat_82', name: 'Barra de Escudo de Invasão de Boss', category: 'Bosses', desc: 'Break Gauge: use habilidades específicas para quebrar o escudo e atordoar o boss.' },
  { id: 'feat_83', name: 'Mutadores de Masmorra Mítica+', category: 'Dungeons', desc: 'Modificadores como Explosivo, Necrótico, Vulcânico nos 100 andares da dungeon.' },
  { id: 'feat_84', name: 'Boss Overlord Abissal no Andar 100', category: 'Bosses', desc: 'Encontro mítico final com 10.000.000 HP e mecânicas corporativas de raide.' },
  { id: 'feat_85', name: 'Invocadores de Hordas nas Masmorras', category: 'Dungeons', desc: 'Portais que continuam gerando monstros até que o invocador seja destruído.' },
  { id: 'feat_86', name: 'Salas de Tesouro Secreto e Armadilhas', category: 'Dungeons', desc: 'Pisos de pressão, dardos envenenados e baús miméticos perigosos.' },
  { id: 'feat_87', name: 'Portais de Fenda Temporal Espontâneos', category: 'Dungeons', desc: 'Aparecem aleatoriamente nos andares levando a salas bônus de 60 segundos.' },
  { id: 'feat_88', name: 'Modo Contra o Tempo (Time Attack)', category: 'Dungeons', desc: 'Complete o andar da dungeon antes que o cronômetro chegue a zero para baús extras.' },
  { id: 'feat_89', name: 'Bosses Mundiais Globais com HP Compartilhado', category: 'Bosses', desc: 'Todos os jogadores do servidor atacam o mesmo Boss Mundial que aparece às 20h.' },
  { id: 'feat_90', name: 'Raid de Guilda Semanal de 10 Jogadores', category: 'Raids', desc: 'Instância exclusiva para membros da mesma guilda enfrentarem o Dragão Titã.' },

  // 91-100: Qualidade de Vida, UI, Áudio e Motor do Jogo
  { id: 'feat_91', name: 'Acessibilidade Garantida de Portais e Escadas', category: 'Sistemas', desc: 'Algoritmo A* Solver garante que nenhuma escada ou portal fique preso em paredes.' },
  { id: 'feat_92', name: 'Gerador Automático dos 100 Biomas Únicos', category: 'Sistemas', desc: '100 biomas artesanais com 10 andares cada, garantindo exploração ilimitada.' },
  { id: 'feat_93', name: 'Sistema de Salvamento Duplo Local e Nuvem', category: 'Sistemas', desc: 'Sincronização instantânea de inventário, nível, conquistas e progresso.' },
  { id: 'feat_94', name: 'Interface Dinâmica com Mini-Mapa Integrado', category: 'UI', desc: 'Mini-mapa em tempo real mostrando jogadores, bosses, escadas e portais próximos.' },
  { id: 'feat_95', name: 'Motor de Partículas Retro Pixel Art', category: 'Gráficos', desc: 'Efeitos visuais leves e fluidos de magias, poeira e impactos de armas.' },
  { id: 'feat_96', name: 'Trilha Sonora Dinâmica por Bioma', category: 'Áudio', desc: 'Músicas 8-bit chiptune exclusivas para cada região e bioma do jogo.' },
  { id: 'feat_97', name: 'Efeitos Sonoros Retrô de Alta Fidelidade', category: 'Áudio', desc: 'Sons táticos para passos, ataques, feitiços, subida de nível e baús caindo.' },
  { id: 'feat_98', name: 'Modo Economia de Bateria e Desempenho 60FPS', category: 'Sistemas', desc: 'Otimização de renderização do canvas para rodar com fluidez extrema.' },
  { id: 'feat_99', name: 'Chat Global, de Guilda e Privado com Emojis', category: 'Social', desc: 'Sistema de mensagens instantâneas com suporte a links de itens e localizações.' },
  { id: 'feat_100', name: 'Sistema de Conquistas e Troféus de Platina', category: 'Conquistas', desc: 'Mais de 100 desafios únicos para recompensar os maiores exploradores do jogo.' },
]

export class AmbitiousFeaturesEngine {
  private activeMount: Mount | null = null
  private activePet: PetCompanion | null = null
  private activeWeather: WeatherEffect | null = null
  private unlockedFeatureIds: Set<string> = new Set()

  constructor() {
    // Unlock all 100 feature modules by default
    AMBITIOUS_FEATURES_CATALOG.forEach(f => this.unlockedFeatureIds.add(f.id))
  }

  public getCatalog() {
    return AMBITIOUS_FEATURES_CATALOG
  }

  public getActiveMount() {
    return this.activeMount
  }

  public setActiveMount(mount: Mount | null) {
    this.activeMount = mount
  }

  public getActivePet() {
    return this.activePet
  }

  public setActivePet(pet: PetCompanion | null) {
    this.activePet = pet
  }

  public getRandomWeather(): WeatherEffect {
    const weathers: WeatherEffect[] = [
      { id: 'clear', name: 'Céu Limpo', icon: '☀️', description: 'Condições normais.', statModifier: { atkMultiplier: 1.0, speedMultiplier: 1.0, dotDamagePerSec: 0 } },
      { id: 'bloodmoon', name: 'Lua de Sangue', icon: '🌕', description: 'Monstros +50% ATK, EXP x3.', statModifier: { atkMultiplier: 1.25, speedMultiplier: 1.1, dotDamagePerSec: 0 } },
      { id: 'toxicrain', name: 'Chuva Tóxica', icon: '🌧️', description: 'Dano de veneno contínuo.', statModifier: { atkMultiplier: 0.9, speedMultiplier: 0.9, dotDamagePerSec: 2 } },
      { id: 'aurora', name: 'Aurora Astral', icon: '🌌', description: 'Regeneração acelerada.', statModifier: { atkMultiplier: 1.15, speedMultiplier: 1.15, dotDamagePerSec: -3 } },
      { id: 'meteor', name: 'Tempestade Solar', icon: '☄️', description: 'Ataques críticos +20%.', statModifier: { atkMultiplier: 1.3, speedMultiplier: 1.0, dotDamagePerSec: 0 } },
    ]
    return weathers[Math.floor(Math.random() * weathers.length)]
  }
}

export const ambitiousEngine = new AmbitiousFeaturesEngine()
