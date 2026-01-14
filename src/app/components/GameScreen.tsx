'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Clock, Sparkles, RotateCcw, LogOut, Plus, History, Trophy, Users, X, Award, Play, Pause, Settings, Trash2 } from 'lucide-react'
import { ThemeSelector } from './ThemeSelector'
import { ThemeManager } from './ThemeManager'
import { HistoryPanel } from './HistoryPanel'
import { Checkbox } from '@/components/ui/checkbox'

interface GameScreenProps {
  username: string
  onLogout: () => void
  isGuestMode: boolean
}

interface Challenge {
  theme: string
  category: string
  duration: number
  playerName: string
  timestamp: number
  allPlayers?: { name: string; position: number; time: number }[]
}

interface Player {
  name: string
  time: number
  finished: boolean
  position?: number
}

const ALL_PRESET_TIMES = [
  { value: 30, label: '30 segundos' },
  { value: 60, label: '1 minuto' },
  { value: 120, label: '2 minutos' },
  { value: 300, label: '5 minutos' }
]

export function GameScreen({ username, onLogout, isGuestMode }: GameScreenProps) {
  const [selectedTime, setSelectedTime] = useState(60)
  const [customTime, setCustomTime] = useState('')
  const [currentTheme, setCurrentTheme] = useState<{ text: string; category: string } | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  
  // Novos estados para múltiplos jogadores
  const [gameMode, setGameMode] = useState<'setup' | 'playing' | 'ranking'>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayerName, setNewPlayerName] = useState('')
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [showRanking, setShowRanking] = useState(false)
  const [finishedPlayers, setFinishedPlayers] = useState<Set<string>>(new Set())
  
  // Estado para temas customizados
  const [customThemes, setCustomThemes] = useState<Record<string, string[]> | undefined>(undefined)
  
  // Novos estados para configuração de tempos
  const [availableTimes, setAvailableTimes] = useState<number[]>([60, 120, 300])
  const [showTimeConfig, setShowTimeConfig] = useState(false)
  const [customTimeInput, setCustomTimeInput] = useState('')
  const [sameTimeForAll, setSameTimeForAll] = useState(false)
  const [sameTimeValue, setSameTimeValue] = useState(60)
  
  const tickSoundRef = useRef<HTMLAudioElement | null>(null)
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null)
  const lastWarningTimeRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    // Carregar histórico do localStorage apenas se não for modo guest
    if (!isGuestMode) {
      const saved = localStorage.getItem(`challenges_${username}`)
      if (saved) {
        setChallenges(JSON.parse(saved))
      }
    }

    // Criar sons usando Web Audio API
    if (typeof window !== 'undefined') {
      // Som de tick (bip curto)
      const tickAudio = new Audio()
      tickAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwPUKXi8LdjHAU4kNbyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs/y2Ik2CBhnu+znm0oMD1Cl4vC3YxwFOJDW8sx5LAUkd8fw3ZBAChRdtOvrqFUUCkaf4PK+bCEFK4LP8tmJNggYZ7vs55tKDA9QpeLwt2McBTiQ1vLMeSwFJHfH8N2QQAoUXbTr66hVFApGn+DyvmwhBSuCz/LZiTYIGGe77OebSgwPUKXi8LdjHAU4kNbyzHksBSR3x/DdkEAKFF206+uoVRQKRp/g8r5sIQUrgs/y2Yk2CBhnu+znm0oMD1Cl4vC3YxwFOJDW8sx5LAUkd8fw3ZBAChRdtOvrqFUUCkaf4PK+bCEFK4LP8tmJNggYZ7vs55tKDA9QpeLwt2McBTiQ1vLMeSwFJHfH8N2QQAoUXbTr66hVFApGn+DyvmwhBSuCz/LZiTYIGGe77OebSgwPUKXi8LdjHAU4kNbyzHksBSR3x/DdkEAKFF206+uoVRQKRp/g8r5sIQUrgs/y2Yk2CBhnu+znm0oMD1Cl4vC3YxwFOJDW8sx5LAUkd8fw3ZBAChRdtOvrqFUUCkaf4PK+bCEFK4LP8tmJNggYZ7vs55tKDA9QpeLwt2McBTiQ1vLMeSwFJHfH8N2QQAoUXbTr66hVFApGn+DyvmwhBSuCz/LZiTYIGGe77OebSgwPUKXi8LdjHAU4kNbyzHksBSR3x/DdkEAKFF206+uoVRQKRp/g8r5sIQUrgs/y2Yk2CBhnu+znm0oMD1Cl4vC3Yw=='
      tickSoundRef.current = tickAudio

      // Som de alarme (bip longo)
      const alarmAudio = new Audio()
      alarmAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwPUKXi8LdjHAU4kNbyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs/y2Ik2CBhnu+znm0oMD1Cl4vC3YxwFOJDW8sx5LAUkd8fw3ZBAChRdtOvrqFUUCkaf4PK+bCEFK4LP8tmJNggYZ7vs55tKDA9QpeLwt2McBTiQ1vLMeSwFJHfH8N2QQAoUXbTr66hVFApGn+DyvmwhBSuCz/LZiTYIGGe77OebSgwPUKXi8LdjHAU4kNbyzHksBSR3x/DdkEAKFF206+uoVRQKRp/g8r5sIQUrgs/y2Yk2CBhnu+znm0oMD1Cl4vC3YxwFOJDW8sx5LAUkd8fw3ZBAChRdtOvrqFUUCkaf4PK+bCEFK4LP8tmJNggYZ7vs55tKDA9QpeLwt2McBTiQ1vLMeSwFJHfH8N2QQAoUXbTr66hVFApGn+DyvmwhBSuCz/LZiTYIGGe77OebSgwPUKXi8LdjHAU4kNbyzHksBSR3x/DdkEAKFF206+uoVRQKRp/g8r5sIQUrgs/y2Yk2CBhnu+znm0oMD1Cl4vC3YxwFOJDW8sx5LAUkd8fw3ZBAChRdtOvrqFUUCkaf4PK+bCEFK4LP8tmJNggYZ7vs55tKDA9QpeLwt2McBTiQ1vLMeSwFJHfH8N2QQAoUXbTr66hVFApGn+DyvmwhBSuCz/LZiTYIGGe77OebSgwPUKXi8LdjHAU4kNbyzHksBSR3x/DdkEAKFF206+uoVRQKRp/g8r5sIQUrgs/y2Yk2CBhnu+znm0oMD1Cl4vC3Yw=='
      alarmSoundRef.current = alarmAudio
    }
  }, [username, isGuestMode])

  // Atualizar tempos dos jogadores quando availableTimes ou sameTimeForAll mudar
  useEffect(() => {
    if (gameMode === 'setup' && players.length > 0) {
      setPlayers(prevPlayers => {
        if (sameTimeForAll) {
          // Todos jogadores recebem o mesmo tempo
          return prevPlayers.map(p => ({ ...p, time: sameTimeValue }))
        } else {
          // Redistribuir tempos únicos
          const usedTimes = new Set<number>()
          return prevPlayers.map(p => {
            const unusedTimes = availableTimes.filter(t => !usedTimes.has(t))
            if (unusedTimes.length === 0) {
              // Se não há tempos disponíveis, manter o tempo atual
              return p
            }
            const newTime = unusedTimes[Math.floor(Math.random() * unusedTimes.length)]
            usedTimes.add(newTime)
            return { ...p, time: newTime }
          })
        }
      })
    }
  }, [availableTimes, sameTimeForAll, sameTimeValue, gameMode])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1
          const maxTime = players.length > 0 ? Math.max(...players.map(p => p.time)) : 0
          const timeElapsed = maxTime - newTime

          // Verificar cada jogador
          players.forEach(player => {
            const timeRemaining = player.time - timeElapsed
            
            // Tocar som de tick nos últimos 10 segundos de cada jogador (apenas uma vez por segundo)
            if (timeRemaining <= 10 && timeRemaining > 0) {
              const lastWarning = lastWarningTimeRef.current.get(player.name) || -1
              if (lastWarning !== timeRemaining) {
                tickSoundRef.current?.play().catch(() => {})
                lastWarningTimeRef.current.set(player.name, timeRemaining)
              }
            }
            
            // Se o tempo do jogador acabou exatamente agora
            if (timeElapsed === player.time && !finishedPlayers.has(player.name)) {
              // Tocar alarme
              alarmSoundRef.current?.play().catch(() => {})
              
              // Marcar jogador como finalizado
              setFinishedPlayers(prev => new Set(prev).add(player.name))
              
              // Atualizar estado do jogador
              setPlayers(prevPlayers => prevPlayers.map(p => 
                p.name === player.name ? { ...p, finished: true } : p
              ))
            }
          })

          // Se chegou a zero, parar o jogo e mostrar ranking
          if (newTime === 0) {
            setIsRunning(false)
            setGameMode('ranking')
            // Tocar alarme final
            alarmSoundRef.current?.play().catch(() => {})
          }

          return newTime
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, isPaused, timeLeft, players, finishedPlayers])

  const handleToggleTime = (timeValue: number) => {
    setAvailableTimes(prev => {
      if (prev.includes(timeValue)) {
        // Não permitir desmarcar se for o último
        if (prev.length === 1) return prev
        return prev.filter(t => t !== timeValue)
      } else {
        return [...prev, timeValue].sort((a, b) => a - b)
      }
    })
  }

  const handleAddCustomTime = () => {
    const timeInSeconds = parseInt(customTimeInput)
    if (isNaN(timeInSeconds) || timeInSeconds <= 0) {
      // Alerta rápido
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
      alertDiv.textContent = '⚠️ Digite um tempo válido em segundos!'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 2000)
      return
    }
    
    // Verificar se já existe
    if (availableTimes.includes(timeInSeconds)) {
      // Alerta rápido para tempo repetido
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
      alertDiv.textContent = '⚠️ Este tempo já existe!'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 2000)
      setCustomTimeInput('')
      return
    }
    
    setAvailableTimes(prev => [...prev, timeInSeconds].sort((a, b) => a - b))
    setCustomTimeInput('')
  }

  const handleRemoveCustomTime = (timeValue: number) => {
    // Não permitir remover se for o último tempo
    if (availableTimes.length === 1) {
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
      alertDiv.textContent = '⚠️ Você precisa ter pelo menos um tempo disponível!'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 2000)
      return
    }
    
    setAvailableTimes(prev => prev.filter(t => t !== timeValue))
  }

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return
    
    if (availableTimes.length === 0) {
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
      alertDiv.textContent = '⚠️ Selecione pelo menos um tempo disponível!'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 2000)
      return
    }
    
    let assignedTime: number
    
    if (sameTimeForAll) {
      // Todos jogadores recebem o mesmo tempo
      assignedTime = sameTimeValue
    } else {
      // Criar lista de tempos ainda não usados
      const usedTimes = players.map(p => p.time)
      const unusedTimes = availableTimes.filter(t => !usedTimes.includes(t))
      
      // Se não há tempos não usados, não permitir adicionar mais jogadores
      if (unusedTimes.length === 0) {
        const alertDiv = document.createElement('div')
        alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
        alertDiv.textContent = '⚠️ Você tem mais jogadores que tempos disponíveis! Adicione mais tempos ou ative "Tempo igual para todos".'
        document.body.appendChild(alertDiv)
        setTimeout(() => alertDiv.remove(), 3000)
        return
      }
      
      // Sortear tempo aleatório entre os não usados
      assignedTime = unusedTimes[Math.floor(Math.random() * unusedTimes.length)]
    }
    
    const newPlayer: Player = {
      name: newPlayerName.trim(),
      time: assignedTime,
      finished: false
    }
    
    setPlayers([...players, newPlayer])
    setNewPlayerName('')
  }

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index))
  }

  const handleStartGame = () => {
    if (players.length === 0) {
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
      alertDiv.textContent = '⚠️ Adicione pelo menos um jogador!'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 2000)
      return
    }
    if (!currentTheme) {
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
      alertDiv.textContent = '⚠️ Gere um tema primeiro!'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 2000)
      return
    }
    
    // Encontrar o maior tempo entre os jogadores
    const maxTime = Math.max(...players.map(p => p.time))
    setTimeLeft(maxTime)
    setIsRunning(true)
    setIsPaused(false)
    setGameMode('playing')
    setFinishedPlayers(new Set())
    lastWarningTimeRef.current.clear()
  }

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(0)
    setCurrentTheme(null)
    setPlayers([])
    setGameMode('setup')
    setShowRanking(false)
    setFinishedPlayers(new Set())
    lastWarningTimeRef.current.clear()
  }

  const handleSelectWinner = (playerName: string, position: number) => {
    setPlayers(prev => prev.map(p => 
      p.name === playerName ? { ...p, position } : p
    ))
  }

  const handleSaveRanking = () => {
    // Não salvar se estiver em modo guest
    if (isGuestMode) {
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
      alertDiv.textContent = '⚠️ Modo visitante: histórico não será salvo. Crie uma conta para salvar!'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 3000)
      handleReset()
      return
    }

    // Salvar desafio com todos os jogadores
    if (currentTheme) {
      const sortedPlayers = [...players]
        .filter(p => p.position)
        .sort((a, b) => (a.position || 999) - (b.position || 999))
      
      const newChallenge: Challenge = {
        theme: currentTheme.text,
        category: currentTheme.category,
        duration: Math.max(...players.map(p => p.time)),
        playerName: `${sortedPlayers.length} jogadores`,
        timestamp: Date.now(),
        allPlayers: sortedPlayers.map(p => ({
          name: p.name,
          position: p.position || 0,
          time: p.time
        }))
      }
      
      const updated = [newChallenge, ...challenges]
      setChallenges(updated)
      localStorage.setItem(`challenges_${username}`, JSON.stringify(updated))
    }
    
    handleReset()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimeLabel = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds % 60 === 0) return `${seconds / 60}min`
    return `${Math.floor(seconds / 60)}min ${seconds % 60}s`
  }

  const handleCustomTime = () => {
    const time = parseInt(customTime)
    if (time > 0 && time <= 600) {
      setSelectedTime(time)
      setCustomTime('')
    }
  }

  const getPositionEmoji = (position: number) => {
    switch(position) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '🏅'
    }
  }

  const getTimerColor = () => {
    if (gameMode !== 'playing' || !isRunning) {
      return 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600'
    }
    
    const maxTime = Math.max(...players.map(p => p.time))
    const timeElapsed = maxTime - timeLeft
    
    // Verificar se algum jogador está nos últimos 10 segundos
    const someoneInDanger = players.some(player => {
      const timeRemaining = player.time - timeElapsed
      return timeRemaining <= 10 && timeRemaining > 0 && !player.finished
    })
    
    if (someoneInDanger) {
      return 'text-red-500 animate-pulse'
    }
    
    return 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-cyan-400 p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-400 to-pink-500 p-3 rounded-2xl">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">
                Speed Drawing
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-bold">
                Olá, {username}! {isGuestMode && '(Modo Visitante)'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isGuestMode && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-12 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 font-bold text-base sm:text-lg">
                    <History className="w-5 h-5 mr-2" />
                    Histórico
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">
                      Histórico de Desafios
                    </DialogTitle>
                  </DialogHeader>
                  <HistoryPanel challenges={challenges} />
                </DialogContent>
              </Dialog>
            )}

            <Button
              onClick={onLogout}
              variant="outline"
              className="h-12 px-6 rounded-2xl border-4 border-red-300 hover:bg-red-50 font-bold text-base sm:text-lg"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Theme Management */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Temas
              </h2>
              
              <div className="space-y-3">
                <ThemeManager onThemesUpdate={setCustomThemes} />
                
                <ThemeSelector
                  onThemeSelected={setCurrentTheme}
                  disabled={gameMode === 'playing'}
                  customThemes={customThemes}
                />
              </div>
            </div>

            {/* Time Configuration */}
            {gameMode === 'setup' && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-cyan-500" />
                  Tempos Disponíveis
                </h2>
                
                {/* Opção de tempo igual para todos */}
                <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Checkbox
                      id="same-time-all"
                      checked={sameTimeForAll}
                      onCheckedChange={(checked) => setSameTimeForAll(checked as boolean)}
                      className="h-6 w-6"
                    />
                    <label
                      htmlFor="same-time-all"
                      className="flex-1 text-lg font-bold text-gray-800 cursor-pointer"
                    >
                      ⏱️ Tempo igual para todos
                    </label>
                  </div>
                  
                  {sameTimeForAll && (
                    <div className="mt-3">
                      <select
                        value={sameTimeValue}
                        onChange={(e) => setSameTimeValue(parseInt(e.target.value))}
                        className="w-full h-12 rounded-xl border-2 border-purple-300 font-bold text-gray-800 px-4 bg-white"
                      >
                        {availableTimes.map(time => (
                          <option key={time} value={time}>
                            {formatTimeLabel(time)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 mb-4">
                  {availableTimes.map((timeValue) => {
                    return (
                      <div
                        key={timeValue}
                        className="flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4 border-2 border-cyan-200"
                      >
                        <span className="text-lg font-bold text-gray-800">
                          {formatTimeLabel(timeValue)}
                        </span>
                        <Button
                          onClick={() => handleRemoveCustomTime(timeValue)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    )
                  })}
                </div>

                {/* Adicionar tempo customizado */}
                <div className="flex gap-2 pt-3 border-t-2 border-gray-200">
                  <Input
                    type="number"
                    placeholder="Tempo em segundos..."
                    value={customTimeInput}
                    onChange={(e) => setCustomTimeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTime()}
                    className="h-10 rounded-xl border-2 border-gray-300 font-bold"
                    min="1"
                  />
                  <Button
                    onClick={handleAddCustomTime}
                    className="h-10 px-4 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 font-bold mt-4 text-center">
                  {sameTimeForAll 
                    ? '✨ Todos jogadores receberão o mesmo tempo' 
                    : '✨ Tempos serão sorteados sem repetição'}
                </p>
              </div>
            )}

            {/* Players List */}
            {gameMode === 'setup' && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-pink-500" />
                  Jogadores
                </h2>
                
                <div className="space-y-3 mb-4">
                  {players.map((player, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-2xl p-4 border-4 border-yellow-300 flex items-center justify-between">
                      <div>
                        <p className="font-black text-gray-800">{player.name}</p>
                        <p className="text-sm font-bold text-gray-600">
                          ⏱️ {formatTimeLabel(player.time)}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleRemovePlayer(index)}
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full hover:bg-red-200"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Nome do jogador"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    className="h-12 rounded-2xl border-4 border-gray-200 font-bold"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
                  />
                  <Button
                    onClick={handleAddPlayer}
                    className="h-12 px-4 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 font-bold"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Center Panel - Timer or Ranking */}
          <div className="lg:col-span-2">
            {gameMode === 'ranking' ? (
              // Ranking Screen
              <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 min-h-[500px]">
                <div className="text-center mb-8">
                  <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-cyan-500 mb-4">
                    🎉 Tempo Acabou!
                  </h2>
                  <p className="text-xl font-bold text-gray-600">Selecione os vencedores</p>
                </div>

                <div className="space-y-4 mb-8">
                  {players.map((player, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 border-4 border-purple-300">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-2xl font-black text-gray-800">{player.name}</p>
                          <p className="text-sm font-bold text-gray-600">
                            Tempo: {formatTimeLabel(player.time)}
                          </p>
                        </div>
                        {player.position && (
                          <div className="text-4xl">
                            {getPositionEmoji(player.position)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((pos) => (
                          <Button
                            key={pos}
                            onClick={() => handleSelectWinner(player.name, pos)}
                            className={`flex-1 h-12 rounded-xl font-black transition-all ${
                              player.position === pos
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {pos}º
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleSaveRanking}
                    className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 font-black text-xl shadow-lg"
                    disabled={!players.every(p => p.position)}
                  >
                    <Trophy className="w-6 h-6 mr-2" />
                    {isGuestMode ? 'Finalizar Jogo' : 'Salvar Ranking'}
                  </Button>
                  <Button
                    onClick={handleReset}
                    className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 font-black text-xl shadow-lg"
                  >
                    <RotateCcw className="w-6 h-6 mr-2" />
                    Novo Jogo
                  </Button>
                </div>
              </div>
            ) : (
              // Game Screen
              <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 min-h-[500px] flex flex-col items-center justify-center">
                {/* Current Theme Display */}
                {currentTheme && (
                  <div className="mb-8 text-center">
                    <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
                      {currentTheme.category}
                    </div>
                    <h3 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-cyan-500 animate-pulse">
                      {currentTheme.text}
                    </h3>
                  </div>
                )}

                {/* Timer Display */}
                <div className="mb-8">
                  <div className={`text-8xl sm:text-9xl font-black ${getTimerColor()}`}>
                    {formatTime(timeLeft || (players.length > 0 ? Math.max(...players.map(p => p.time)) : selectedTime))}
                  </div>
                  {isPaused && gameMode === 'playing' && (
                    <div className="text-center mt-4">
                      <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-lg font-bold animate-pulse">
                        ⏸️ PAUSADO
                      </span>
                    </div>
                  )}
                </div>

                {/* Players Status During Game */}
                {gameMode === 'playing' && (
                  <div className="mb-8 w-full max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {players.map((player, index) => {
                        const maxTime = Math.max(...players.map(p => p.time))
                        const timeElapsed = maxTime - timeLeft
                        const isFinished = timeElapsed >= player.time
                        const timeRemaining = player.time - timeElapsed
                        const isInDanger = timeRemaining <= 10 && timeRemaining > 0 && !isFinished
                        
                        return (
                          <div
                            key={index}
                            className={`rounded-2xl p-4 border-4 transition-all ${
                              isFinished
                                ? 'bg-gradient-to-r from-red-100 to-orange-100 border-red-300 opacity-60'
                                : isInDanger
                                ? 'bg-gradient-to-r from-red-100 to-orange-100 border-red-400 shadow-lg animate-pulse'
                                : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-lg'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-black text-gray-800">{player.name}</p>
                                <p className="text-sm font-bold text-gray-600">
                                  {formatTimeLabel(player.time)}
                                </p>
                              </div>
                              <div className="text-2xl">
                                {isFinished ? '⏰' : isInDanger ? '🔥' : '✏️'}
                              </div>
                            </div>
                            {isFinished && (
                              <div className="mt-2 text-center">
                                <span className="text-xs font-bold text-red-600 bg-red-200 px-3 py-1 rounded-full">
                                  TEMPO ESGOTADO
                                </span>
                              </div>
                            )}
                            {isInDanger && !isFinished && (
                              <div className="mt-2 text-center">
                                <span className="text-xs font-bold text-orange-600 bg-orange-200 px-3 py-1 rounded-full">
                                  ⚠️ {timeRemaining}s RESTANTES
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Control Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  {gameMode === 'setup' ? (
                    <Button
                      onClick={handleStartGame}
                      className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 font-black text-xl shadow-lg transform hover:scale-105 transition-all"
                      disabled={!currentTheme || players.length === 0}
                    >
                      <Sparkles className="w-6 h-6 mr-2" />
                      Iniciar Jogo
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePauseResume}
                      className={`flex-1 h-16 rounded-2xl font-black text-xl shadow-lg ${
                        isPaused
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600'
                          : 'bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600'
                      }`}
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-6 h-6 mr-2" />
                          Continuar
                        </>
                      ) : (
                        <>
                          <Pause className="w-6 h-6 mr-2" />
                          Pausar
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    onClick={handleReset}
                    className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 font-black text-xl shadow-lg"
                  >
                    <RotateCcw className="w-6 h-6 mr-2" />
                    Reiniciar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
