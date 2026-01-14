import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
