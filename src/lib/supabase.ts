import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Criar cliente apenas se as credenciais estiverem disponíveis
// Durante o build, pode não haver credenciais, então criamos um cliente "dummy"
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Função para verificar se o Supabase está configurado
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseAnonKey !== 'placeholder-key')
}

// Tipos para o banco de dados
export interface UserTheme {
  id: string
  user_id: string
  category: string
  themes: string[]
  created_at: string
  updated_at: string
}

export interface UserGameData {
  id: string
  user_id: string
  game_history: any[]
  created_at: string
  updated_at: string
}
