import { supabase, isSupabaseConfigured } from './supabase'

const DEFAULT_THEMES = {
  'Animais': [
    'Cachorro', 'Gato', 'Elefante', 'Girafa', 'Leão', 'Tigre', 'Urso', 'Panda',
    'Coelho', 'Tartaruga', 'Peixe', 'Tubarão', 'Baleia', 'Golfinho', 'Pinguim',
    'Águia', 'Coruja', 'Papagaio', 'Flamingo', 'Pavão'
  ],
  'Objetos': [
    'Cadeira', 'Mesa', 'Lâmpada', 'Relógio', 'Telefone', 'Computador', 'Livro',
    'Caneta', 'Óculos', 'Guarda-chuva', 'Chave', 'Mochila', 'Bola', 'Bicicleta',
    'Carro', 'Avião', 'Barco', 'Trem', 'Foguete', 'Helicóptero'
  ],
  'Alimentos': [
    'Pizza', 'Hambúrguer', 'Sorvete', 'Bolo', 'Maçã', 'Banana', 'Morango',
    'Melancia', 'Uva', 'Laranja', 'Pão', 'Queijo', 'Ovo', 'Café', 'Suco',
    'Chocolate', 'Donut', 'Cupcake', 'Pipoca', 'Batata Frita'
  ],
  'Natureza': [
    'Árvore', 'Flor', 'Sol', 'Lua', 'Estrela', 'Nuvem', 'Montanha', 'Rio',
    'Mar', 'Praia', 'Cachoeira', 'Arco-íris', 'Raio', 'Neve', 'Chuva',
    'Vulcão', 'Ilha', 'Deserto', 'Floresta', 'Jardim'
  ],
  'Profissões': [
    'Médico', 'Professor', 'Bombeiro', 'Policial', 'Chef', 'Artista', 'Músico',
    'Atleta', 'Cientista', 'Astronauta', 'Piloto', 'Marinheiro', 'Fazendeiro',
    'Construtor', 'Eletricista', 'Encanador', 'Padeiro', 'Jardineiro', 'Veterinário', 'Dentista'
  ],
  'Esportes': [
    'Futebol', 'Basquete', 'Vôlei', 'Tênis', 'Natação', 'Corrida', 'Ciclismo',
    'Skate', 'Surf', 'Boxe', 'Karatê', 'Judô', 'Ginástica', 'Dança', 'Yoga',
    'Escalada', 'Esqui', 'Patinação', 'Golf', 'Baseball'
  ],
  'Emoções': [
    'Feliz', 'Triste', 'Bravo', 'Surpreso', 'Assustado', 'Apaixonado',
    'Cansado', 'Animado', 'Entediado', 'Confuso', 'Orgulhoso', 'Envergonhado',
    'Nervoso', 'Calmo', 'Ansioso', 'Relaxado', 'Frustrado', 'Aliviado', 'Curioso', 'Sonolento'
  ],
  'Lugares': [
    'Casa', 'Escola', 'Hospital', 'Parque', 'Shopping', 'Cinema', 'Teatro',
    'Museu', 'Biblioteca', 'Restaurante', 'Praia', 'Montanha', 'Cidade',
    'Fazenda', 'Castelo', 'Igreja', 'Estádio', 'Aeroporto', 'Estação', 'Ponte'
  ]
}

// Verificar se há sessão ativa
async function hasActiveSession(): Promise<boolean> {
  // Se Supabase não está configurado, retornar false
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.warn('Erro ao verificar sessão:', error.message)
      return false
    }
    return !!session
  } catch (error) {
    console.warn('Erro ao verificar sessão:', error)
    return false
  }
}

// Salvar temas do usuário no Supabase
export async function saveUserThemes(userId: string, themes: Record<string, string[]>) {
  // Se Supabase não está configurado, não fazer nada
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado - temas não serão salvos')
    return
  }

  try {
    // Verificar se há sessão ativa antes de tentar salvar
    const hasSession = await hasActiveSession()
    if (!hasSession) {
      console.warn('Tentativa de salvar temas sem sessão ativa')
      return
    }

    const { error } = await supabase
      .from('user_themes')
      .upsert({
        user_id: userId,
        themes_data: themes,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
    
    if (error) {
      console.error('Erro ao salvar temas no Supabase:', error)
      throw error
    }
  } catch (error) {
    console.error('Erro ao salvar temas:', error)
    throw error
  }
}

// Carregar temas do usuário do Supabase
export async function loadUserThemes(userId: string): Promise<Record<string, string[]>> {
  // Se Supabase não está configurado, retornar temas padrão
  if (!isSupabaseConfigured()) {
    return DEFAULT_THEMES
  }

  try {
    // Verificar se há sessão ativa antes de tentar carregar
    const hasSession = await hasActiveSession()
    if (!hasSession) {
      console.warn('Tentativa de carregar temas sem sessão ativa - usando temas padrão')
      return DEFAULT_THEMES
    }

    const { data, error } = await supabase
      .from('user_themes')
      .select('themes_data')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (error) {
      console.error('Erro ao carregar temas do Supabase:', error)
      return DEFAULT_THEMES
    }
    
    return data?.themes_data || DEFAULT_THEMES
  } catch (error) {
    console.error('Erro ao carregar temas:', error)
    return DEFAULT_THEMES
  }
}

// Salvar histórico de jogo do usuário
export async function saveGameHistory(userId: string, gameData: any) {
  // Se Supabase não está configurado, não fazer nada
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado - histórico não será salvo')
    return
  }

  try {
    // Verificar se há sessão ativa antes de tentar salvar
    const hasSession = await hasActiveSession()
    if (!hasSession) {
      console.warn('Tentativa de salvar histórico sem sessão ativa')
      return
    }

    const { error } = await supabase
      .from('game_history')
      .insert({
        user_id: userId,
        game_data: gameData,
        created_at: new Date().toISOString(),
      })
    
    if (error) {
      console.error('Erro ao salvar histórico:', error)
      throw error
    }
  } catch (error) {
    console.error('Erro ao salvar histórico:', error)
    throw error
  }
}

// Carregar histórico de jogo do usuário
export async function loadGameHistory(userId: string) {
  // Se Supabase não está configurado, retornar array vazio
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    // Verificar se há sessão ativa antes de tentar carregar
    const hasSession = await hasActiveSession()
    if (!hasSession) {
      console.warn('Tentativa de carregar histórico sem sessão ativa')
      return []
    }

    const { data, error } = await supabase
      .from('game_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao carregar histórico:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
    return []
  }
}

// Limpar dados locais (para modo visitante)
export function clearLocalData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('custom_themes')
    localStorage.removeItem('game_history')
    localStorage.removeItem('players')
    localStorage.removeItem('game_state')
  }
}

// Obter temas padrão
export function getDefaultThemes() {
  return DEFAULT_THEMES
}
