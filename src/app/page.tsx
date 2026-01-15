'use client'

import { useState, useEffect } from 'react'
import { GameScreen } from './components/GameScreen'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trophy, UserPlus, LogIn, Mail, Lock, AlertCircle, User, ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react'
import { signIn, signUp, signOut, resetPassword, getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { clearLocalData } from '@/lib/database'

export default function Home() {
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  
  // Campos de login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Campos de criação de conta
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  
  // Campo de recuperação de senha
  const [resetEmail, setResetEmail] = useState('')
  
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Scroll para o topo ao carregar a página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Verificar se usuário já está logado ao carregar
  useEffect(() => {
    checkUser()
    
    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUsername(session.user.user_metadata?.name || session.user.email || 'Usuário')
        setIsLoggedIn(true)
        setIsGuestMode(false)
      } else {
        setIsLoggedIn(false)
        setIsGuestMode(false)
        setUsername('')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        setUsername(user.user_metadata?.name || user.email || 'Usuário')
        setIsLoggedIn(true)
        setIsGuestMode(false)
      }
    } catch (error) {
      // Usuário não está logado
    }
  }

  // Validação de email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const showEmailError = email.length > 0 && !isValidEmail(email)
  const showSignupEmailError = signupEmail.length > 0 && !isValidEmail(signupEmail)
  const showResetEmailError = resetEmail.length > 0 && !isValidEmail(resetEmail)

  const handleLogin = async () => {
    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)
    
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha email e senha')
      setIsLoading(false)
      return
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Email inválido')
      setIsLoading(false)
      return
    }

    try {
      const data = await signIn(email, password)
      console.log('Login bem-sucedido:', data)
      setUsername(data.user?.user_metadata?.name || data.user?.email || 'Usuário')
      setIsLoggedIn(true)
      setIsGuestMode(false)
      setErrorMessage('')
    } catch (error: any) {
      console.error('Erro detalhado ao fazer login:', error)
      
      if (error.message === 'SUPABASE_NOT_CONFIGURED') {
        setErrorMessage('⚠️ Banco de dados não configurado. Use o modo visitante para testar o app ou configure o Supabase nas integrações.')
      } else if (error.message === 'NETWORK_ERROR') {
        setErrorMessage('❌ Erro de conexão. Verifique sua internet e tente novamente.')
      } else if (error.message?.includes('Invalid login credentials')) {
        setErrorMessage('Email ou senha incorretos')
      } else if (error.message?.includes('Email not confirmed')) {
        setErrorMessage('Por favor, confirme seu email antes de fazer login')
      } else {
        setErrorMessage(`Erro ao fazer login: ${error.message || 'Tente novamente.'}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestMode = () => {
    // Limpar dados locais ao entrar em modo visitante
    clearLocalData()
    setUsername('Visitante')
    setIsLoggedIn(true)
    setIsGuestMode(true)
  }

  const handleSignup = async () => {
    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)
    
    // Validações
    if (!signupName.trim()) {
      setErrorMessage('Por favor, digite seu nome completo')
      setIsLoading(false)
      return
    }

    if (!signupEmail.trim() || !signupPassword.trim() || !signupConfirmPassword.trim()) {
      setErrorMessage('Por favor, preencha todos os campos')
      setIsLoading(false)
      return
    }

    if (!isValidEmail(signupEmail)) {
      setErrorMessage('Email inválido')
      setIsLoading(false)
      return
    }

    if (signupPassword.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres')
      setIsLoading(false)
      return
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp(signupEmail, signupPassword, signupName)
      
      console.log('Resultado do signup:', result)
      
      // Mostra mensagem de sucesso
      setSuccessMessage('Conta criada com sucesso! Verifique seu email para confirmar sua conta.')
      setShowSignup(false)
      setEmail(signupEmail)
      setPassword('')
      
      // Limpa campos de signup
      setSignupName('')
      setSignupEmail('')
      setSignupPassword('')
      setSignupConfirmPassword('')
    } catch (error: any) {
      console.error('Erro detalhado ao criar conta:', error)
      
      // Tratamento de erros específicos do Supabase
      if (error.message === 'SUPABASE_NOT_CONFIGURED') {
        setErrorMessage('⚠️ Banco de dados não configurado. Use o modo visitante para testar o app ou configure o Supabase nas integrações.')
      } else if (error.message === 'NETWORK_ERROR') {
        setErrorMessage('❌ Erro de conexão. Verifique sua internet e tente novamente.')
      } else if (error.message?.includes('User already registered')) {
        setErrorMessage('Este email já está cadastrado. Faça login.')
      } else if (error.message?.includes('Email rate limit exceeded')) {
        setErrorMessage('Muitas tentativas. Aguarde alguns minutos e tente novamente.')
      } else if (error.message?.includes('Invalid email')) {
        setErrorMessage('Email inválido. Verifique e tente novamente.')
      } else if (error.message?.includes('Password should be at least')) {
        setErrorMessage('A senha deve ter no mínimo 6 caracteres.')
      } else {
        setErrorMessage(`Erro ao criar conta: ${error.message || 'Tente novamente.'}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)

    if (!resetEmail.trim()) {
      setErrorMessage('Por favor, digite seu email')
      setIsLoading(false)
      return
    }

    if (!isValidEmail(resetEmail)) {
      setErrorMessage('Email inválido')
      setIsLoading(false)
      return
    }

    try {
      await resetPassword(resetEmail)
      setSuccessMessage('Email de recuperação enviado! Verifique sua caixa de entrada.')
      setShowForgotPassword(false)
      setResetEmail('')
    } catch (error: any) {
      if (error.message === 'SUPABASE_NOT_CONFIGURED') {
        setErrorMessage('⚠️ Banco de dados não configurado. Use o modo visitante para testar o app.')
      } else if (error.message === 'NETWORK_ERROR') {
        setErrorMessage('❌ Erro de conexão. Verifique sua internet e tente novamente.')
      } else {
        setErrorMessage('Erro ao enviar email de recuperação. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      // Limpar dados locais ao fazer logout
      clearLocalData()
      setIsLoggedIn(false)
      setIsGuestMode(false)
      setUsername('')
      setEmail('')
      setPassword('')
      setErrorMessage('')
      setSuccessMessage('')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const switchToSignup = () => {
    setShowSignup(true)
    setShowForgotPassword(false)
    setErrorMessage('')
    setSuccessMessage('')
    window.scrollTo(0, 0)
  }

  const switchToLogin = () => {
    setShowSignup(false)
    setShowForgotPassword(false)
    setErrorMessage('')
    setSuccessMessage('')
    window.scrollTo(0, 0)
  }

  const switchToForgotPassword = () => {
    setShowForgotPassword(true)
    setShowSignup(false)
    setErrorMessage('')
    setSuccessMessage('')
    window.scrollTo(0, 0)
  }

  if (!isLoggedIn) {
    // Tela de Recuperação de Senha
    if (showForgotPassword) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full">
            <button
              onClick={switchToLogin}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar para login
            </button>

            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-3xl mb-4">
                <KeyRound className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 mb-2">
                Recuperar Senha
              </h1>
              <p className="text-lg font-bold text-gray-600">
                Digite seu email para receber instruções
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Digite seu email..."
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleForgotPassword()}
                  className={`h-14 pl-12 rounded-2xl border-4 font-bold text-lg ${
                    showResetEmailError 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200'
                  }`}
                />
                {showResetEmailError && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Por favor, digite um email válido</span>
                  </div>
                )}
              </div>

              {successMessage && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border-2 border-green-300 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-green-700 font-semibold text-sm">{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-red-300 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 font-semibold text-sm">{errorMessage}</span>
                </div>
              )}
              
              <Button
                onClick={handleForgotPassword}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-black text-lg shadow-lg flex items-center justify-center gap-2"
                disabled={isLoading || !resetEmail.trim() || !isValidEmail(resetEmail)}
              >
                <KeyRound className="w-5 h-5" />
                {isLoading ? 'Enviando...' : 'Enviar Email de Recuperação'}
              </Button>
            </div>
          </div>
        </div>
      )
    }

    // Tela de Criação de Conta
    if (showSignup) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full">
            <button
              onClick={switchToLogin}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar para login
            </button>

            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-3xl mb-4">
                <UserPlus className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
                Criar Conta
              </h1>
              <p className="text-lg font-bold text-gray-600">
                Preencha seus dados para começar
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Nome completo"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="h-14 pl-12 rounded-2xl border-4 border-gray-200 font-bold text-lg"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className={`h-14 pl-12 rounded-2xl border-4 font-bold text-lg ${
                    showSignupEmailError 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200'
                  }`}
                />
                {showSignupEmailError && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Por favor, digite um email válido</span>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha (mínimo 6 caracteres)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="h-14 pl-12 pr-12 rounded-2xl border-4 border-gray-200 font-bold text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                  className="h-14 pl-12 pr-12 rounded-2xl border-4 border-gray-200 font-bold text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-red-300 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 font-semibold text-sm">{errorMessage}</span>
                </div>
              )}
              
              <Button
                onClick={handleSignup}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-black text-lg shadow-lg flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <UserPlus className="w-5 h-5" />
                {isLoading ? 'Criando...' : 'Criar Conta'}
              </Button>

              <p className="text-center text-gray-600 font-semibold">
                Já tem uma conta?{' '}
                <button
                  onClick={switchToLogin}
                  className="text-purple-600 hover:text-purple-700 font-black"
                >
                  Faça login
                </button>
              </p>
            </div>
          </div>
        </div>
      )
    }

    // Tela de Login
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-cyan-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-br from-yellow-400 to-pink-500 p-4 rounded-3xl mb-4">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 mb-2">
              Speed Drawing
            </h1>
            <p className="text-lg font-bold text-gray-600">
              Entre para começar a jogar
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Digite seu email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-14 pl-12 rounded-2xl border-4 font-bold text-lg ${
                  showEmailError 
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-gray-200'
                }`}
              />
              {showEmailError && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Por favor, digite um email válido (ex: usuario@email.com)</span>
                </div>
              )}
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Digite sua senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="h-14 pl-12 rounded-2xl border-4 border-gray-200 font-bold text-lg"
              />
            </div>

            <button
              onClick={switchToForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              Esqueceu sua senha?
            </button>

            {successMessage && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border-2 border-green-300 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-green-700 font-semibold text-sm">{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-red-300 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 font-semibold text-sm">{errorMessage}</span>
              </div>
            )}
            
            <Button
              onClick={handleLogin}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-black text-lg shadow-lg flex items-center justify-center gap-2"
              disabled={!email.trim() || !password.trim() || !isValidEmail(email) || isLoading}
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-bold">OU</span>
              </div>
            </div>
            
            <Button
              onClick={switchToSignup}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 font-black text-lg shadow-lg flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Criar Nova Conta
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-bold">OU</span>
              </div>
            </div>

            <Button
              onClick={handleGuestMode}
              variant="outline"
              className="w-full h-14 rounded-2xl border-4 border-gray-300 hover:bg-gray-50 font-black text-lg shadow-lg flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Continuar sem Conta
            </Button>

            <p className="text-center text-sm text-gray-500 font-semibold mt-2">
              💡 Modo visitante: você pode jogar, mas não terá histórico salvo
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <GameScreen username={username} onLogout={handleLogout} isGuestMode={isGuestMode} />
}
