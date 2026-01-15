'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Crown } from 'lucide-react'
import { PremiumBadge } from './PremiumBadge'

interface ChallengeWheelProps {
  isPremium: boolean
  onChallengeGenerated: (challenge: string) => void
  disabled?: boolean
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

export function ChallengeWheel({ isPremium, onChallengeGenerated, disabled }: ChallengeWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null)

  const spinWheel = () => {
    if (!isPremium) return

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

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500" />
          Desafio Extra
        </h2>
        {!isPremium && <PremiumBadge size="sm" />}
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
        <div className="text-center py-6">
          <div className="mb-4">
            <div className="inline-block p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
              <Crown className="w-12 h-12 text-orange-500" />
            </div>
          </div>
          <p className="text-gray-600 font-bold mb-4">
            Desbloqueie desafios extras como:
          </p>
          <div className="space-y-2 text-sm font-semibold text-gray-700">
            <p>🎨 "com a mão esquerda"</p>
            <p>👁️ "de olhos vendados"</p>
            <p>🎯 "usando apenas 3 cores"</p>
            <p>✏️ "sem tirar a caneta do papel"</p>
          </div>
          <Button
            className="mt-6 h-12 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 font-black shadow-lg"
          >
            <Crown className="w-5 h-5 mr-2" />
            Assinar Premium
          </Button>
        </div>
      )}
    </div>
  )
}
