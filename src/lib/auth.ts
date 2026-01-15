import { supabase, isSupabaseConfigured } from './supabase'

// Função para fazer login
export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  } catch (error: any) {
    // Melhor tratamento de erros de rede
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('NETWORK_ERROR')
    }
    throw error
  }
}

// Função para criar conta
export async function signUp(email: string, password: string, name: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) {
      console.error('Erro do Supabase:', error)
      throw error
    }
    
    // Verificar se o usuário foi criado
    if (!data.user) {
      throw new Error('Não foi possível criar a conta')
    }
    
    return data
  } catch (error: any) {
    console.error('Erro ao criar conta:', error)
    // Melhor tratamento de erros de rede
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('NETWORK_ERROR')
    }
    throw error
  }
}

// Função para fazer logout
export async function signOut() {
  if (!isSupabaseConfigured()) {
    return
  }
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Função para recuperar senha
export async function resetPassword(email: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    
    if (error) throw error
    return data
  } catch (error: any) {
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('NETWORK_ERROR')
    }
    throw error
  }
}

// Função para atualizar senha
export async function updatePassword(newPassword: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  
  if (error) throw error
  return data
}

// Função para obter usuário atual (NÃO lança erro se não houver usuário)
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.warn('Erro ao obter usuário:', error.message)
      return null
    }
    return user
  } catch (error) {
    console.warn('Erro ao verificar usuário:', error)
    return null
  }
}

// Função para verificar se usuário está autenticado
export async function isAuthenticated() {
  if (!isSupabaseConfigured()) {
    return false
  }
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  } catch (error) {
    console.warn('Erro ao verificar sessão:', error)
    return false
  }
}
