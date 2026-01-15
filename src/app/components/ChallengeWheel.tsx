'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sparkles, Zap, Crown, X } from 'lucide-react'
import { PremiumBadge } from './PremiumBadge'

interface ChallengeWheelProps {
  isPremium: boolean
  onChallengeGenerated: (challenge: string) => void
  disabled?: boolean
  onPremiumClick?: () => void
}

const DIFFICULTY_CHALLENGES = [
  'com a mão esquerda',
  'com a mão direita',
  'de olhos vendados',
  'usando apenas 3 cores',
  'sem tirar a caneta do papel',
  'em 30 segundos',
  'usando apenas formas geométricas',
  'sem olhar para o papel',
  'com a mão não dominante',
  'usando apenas linhas retas',
  'usando apenas linhas curvas',
  'em modo espelho',
  'de cabeça para baixo',
  'com os olhos fechados',
  'usando apenas pontos',
  'sem levantar a caneta',
  'em câmera lenta',
  'o mais rápido possível',
  'com detalhes exagerados',
  'em versão minimalista'
]

export function ChallengeWheel({ isPremium, onChallengeGenerated, disabled, onPremiumClick }: ChallengeWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)

  const spinWheel = () => {
    if (!isPremium) {
      setShowPremiumModal(true)
      return
    }

    setIsSpinning(true)
    setCurrentChallenge(null)

    // Animação de roleta
    let count = 0
    const interval = setInterval(() => {
      const randomChallenge = DIFFICULTY_CHALLENGES[Math.floor(Math.random() * DIFFICULTY_CHALLENGES.length)]
      setCurrentChallenge(randomChallenge)
      count++

      if (count >= 10) {
        clearInterval(interval)
        setIsSpinning(false)
        onChallengeGenerated(randomChallenge)
      }
    }, 100)
  }

  const handlePremiumClick = () => {
    setShowPremiumModal(false)
    setShowAccountModal(true)
  }

  const handleCreateAccount = () => {
    setShowAccountModal(false)
    onPremiumClick?.()
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Zap className="w-6 h-6 text-orange-500" />
            Desafio Extra
          </h2>
          {!isPremium && <Crown className="w-5 h-5 text-orange-500" />}
        </div>

        {isPremium ? (
          <>
            {currentChallenge && (
              <div className="mb-4 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl border-4 border-orange-300">
                <p className="text-center text-lg font-black text-gray-800">
                  🎯 {currentChallenge}
                </p>
              </div>
            )}

            <Button
              onClick={spinWheel}
              disabled={disabled || isSpinning}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 font-black text-lg shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSpinning ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Girando...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Girar Roleta
                </>
              )}
            </Button>

            <p className="text-sm text-gray-600 font-bold mt-3 text-center">
              ✨ Adiciona um desafio extra ao tema
            </p>
          </>
        ) : (
          <div className="text-center py-4 relative">
            {/* Conteúdo desfocado/borrado */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-2xl"></div>
            
            {/* Preview borrado da roleta */}
            <div className="opacity-30 blur-sm pointer-events-none mb-4">
              <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl border-4 border-orange-300 mb-4">
                <p className="text-center text-lg font-black text-gray-800">
                  🎯 com a mão esquerda
                </p>
              </div>
              <div className="h-14 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl"></div>
            </div>

            {/* Conteúdo premium sobreposto */}
            <div className="relative z-20">
              <div className="mb-3">
                <div className="inline-block p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
                  <Crown className="w-10 h-10 text-orange-500" />
                </div>
              </div>
              <p className="text-gray-600 font-bold mb-3">
                Desbloqueie desafios extras como:
              </p>
              <div className="space-y-1 text-sm font-semibold text-gray-700 mb-4">
                <p>🎨 "com a mão esquerda"</p>
                <p>👁️ "de olhos vendados"</p>
                <p>🎯 "usando apenas 3 cores"</p>
                <p>✏️ "sem tirar a caneta do papel"</p>
              </div>
              <Button
                onClick={() => {
                  setShowPremiumModal(true)
                }}
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 font-black shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Assinar Premium
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Premium */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Recurso Premium
              </DialogTitle>
              <Button
                onClick={() => setShowPremiumModal(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="text-center py-4">
              <div className="mb-4">
                <div className="inline-block p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
                  <Crown className="w-12 h-12 text-orange-500" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-3">
                Desafios Extras Exclusivos
              </h3>
              <p className="text-gray-600 font-bold mb-4 max-w-md mx-auto">
                Adicione um nível extra de dificuldade aos seus desenhos com mais de 20 desafios diferentes!
              </p>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 mb-4 max-w-md mx-auto">
                <p className="text-sm font-bold text-gray-700 mb-2">
                  ✨ Exemplos de desafios:
                </p>
                <ul className="text-left text-sm font-semibold text-gray-600 space-y-1">
                  <li>🎨 Com a mão não dominante</li>
                  <li>👁️ De olhos vendados</li>
                  <li>🎯 Usando apenas 3 cores</li>
                  <li>✏️ Sem tirar a caneta do papel</li>
                  <li>⚡ Em 30 segundos</li>
                  <li>🔺 Apenas formas geométricas</li>
                </ul>
              </div>
              <Button
                onClick={handlePremiumClick}
                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 font-black text-lg shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Assinar Premium
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Criação de Conta */}
      <Dialog open={showAccountModal} onOpenChange={setShowAccountModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                Criar Conta
              </DialogTitle>
              <Button
                onClick={() => setShowAccountModal(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </DialogHeader>

          <div className="text-center py-6">
            <div className="mb-6">
              <div className="inline-block p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
                <Crown className="w-16 h-16 text-orange-500" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-4">
              Premium Exclusivo
            </h3>
            <p className="text-gray-600 font-bold mb-6 max-w-sm mx-auto">
              Para assinar o plano Premium, você precisa criar uma conta no Speed Drawing!
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
              <p className="text-sm font-bold text-gray-700 mb-3">
                ✨ Com uma conta você terá:
              </p>
              <ul className="text-left text-sm font-semibold text-gray-600 space-y-2">
                <li>💾 Histórico de desafios salvos</li>
                <li>👥 Perfil personalizado</li>
                <li>🏆 Estatísticas e conquistas</li>
                <li>👑 Acesso ao Premium</li>
              </ul>
            </div>
            <Button
              onClick={handleCreateAccount}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 font-black text-lg shadow-lg"
            >
              Criar Conta Agora
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
