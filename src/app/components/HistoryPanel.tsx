'use client'

import { Trophy, Clock, Calendar, Users } from 'lucide-react'

interface Challenge {
  theme: string
  category: string
  duration: number
  playerName: string
  timestamp: number
  allPlayers?: { name: string; position: number; time: number }[]
}

interface HistoryPanelProps {
  challenges: Challenge[]
}

export function HistoryPanel({ challenges }: HistoryPanelProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimeLabel = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds % 60 === 0) return `${seconds / 60}min`
    return `${Math.floor(seconds / 60)}min ${seconds % 60}s`
  }

  const getPositionEmoji = (position: number) => {
    switch(position) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '🏅'
    }
  }

  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-lg font-bold text-gray-500">
          Nenhum desafio concluído ainda
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Complete um jogo e salve o ranking para ver o histórico aqui!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
                {challenge.category}
              </div>
              <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 mb-3">
                {challenge.theme}
              </p>
            </div>
          </div>

          {/* Lista de todos os participantes */}
          {challenge.allPlayers && challenge.allPlayers.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-purple-500" />
                <h4 className="text-sm font-black text-gray-700 uppercase">
                  Participantes ({challenge.allPlayers.length})
                </h4>
              </div>
              <div className="space-y-2">
                {challenge.allPlayers.map((player, playerIndex) => (
                  <div
                    key={playerIndex}
                    className="flex items-center justify-between bg-white rounded-xl p-3 border-2 border-purple-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPositionEmoji(player.position)}</span>
                      <div>
                        <p className="font-black text-gray-800">{player.name}</p>
                        <p className="text-xs font-bold text-gray-500">
                          Tempo: {formatTimeLabel(player.time)}
                        </p>
                      </div>
                    </div>
                    <div className="text-lg font-black text-purple-600">
                      {player.position}º lugar
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm font-bold text-gray-600 pt-4 border-t-2 border-purple-200">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>{formatTimeLabel(challenge.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-pink-500" />
              <span>{formatDate(challenge.timestamp)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
