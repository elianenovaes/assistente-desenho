import { supabase, isSupabaseConfigured } from './supabase'

// Função para fazer login
export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado')
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

// Função para criar conta
export async function signUp(email: string, password: string, name: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado')
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
        // Desabilita confirmação de email para facilitar o uso
        // Em produção, você pode habilitar isso no dashboard do Supabase
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
    throw new Error('Supabase não está configurado')
  }
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  
  if (error) throw error
  return data
}

// Função para atualizar senha
export async function updatePassword(newPassword: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado')
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
