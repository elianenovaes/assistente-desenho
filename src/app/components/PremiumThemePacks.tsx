'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Package, Crown, Check, X } from 'lucide-react'
import { PremiumBadge } from './PremiumBadge'

interface PremiumThemePacksProps {
  isPremium: boolean
  onPacksSelected: (packs: string[]) => void
  selectedPacks: string[]
  onPremiumClick?: () => void
}

export const PREMIUM_THEME_PACKS = {
  'Anime': [
    'Naruto', 'Goku', 'Luffy', 'Pikachu', 'Totoro', 'Sailor Moon', 'Ash Ketchum',
    'Doraemon', 'Sonic', 'Mario', 'Link', 'Kirby', 'Pokébola', 'Espada Mestre',
    'Kunai', 'Rasengan', 'Kamehameha', 'Chapéu de Palha', 'Dragon Ball', 'Sharingan'
  ],
  'Jogos': [
    'Minecraft', 'Roblox', 'Among Us', 'Fortnite', 'Free Fire', 'Brawl Stars',
    'Clash Royale', 'Pokémon GO', 'Mario Kart', 'Sonic', 'Pac-Man', 'Tetris',
    'Controle de Videogame', 'Espada de Diamante', 'Creeper', 'Steve', 'Impostor',
    'Lhama', 'Picareta', 'Baú do Tesouro'
  ],
  'Princesas': [
    'Elsa', 'Anna', 'Cinderela', 'Branca de Neve', 'Ariel', 'Bela', 'Jasmine',
    'Rapunzel', 'Moana', 'Tiana', 'Mulan', 'Pocahontas', 'Aurora', 'Merida',
    'Coroa', 'Castelo', 'Varinha Mágica', 'Sapatilha de Cristal', 'Rosa Encantada', 'Tiara'
  ],
  'Terror': [
    'Fantasma', 'Zumbi', 'Vampiro', 'Múmia', 'Lobisomem', 'Bruxa', 'Caveira',
    'Aranha Gigante', 'Morcego', 'Abóbora de Halloween', 'Casa Assombrada',
    'Cemitério', 'Caldeirão', 'Vassoura', 'Chapéu de Bruxa', 'Teia de Aranha',
    'Lua Cheia', 'Caixão', 'Poção Mágica', 'Olho Mágico'
  ],
  'Dinossauros': [
    'T-Rex', 'Velociraptor', 'Triceratops', 'Brontossauro', 'Estegossauro',
    'Pterodáctilo', 'Diplodoco', 'Anquilossauro', 'Espinossauro', 'Parasaurolophus',
    'Ovo de Dinossauro', 'Fóssil', 'Vulcão', 'Pegada de Dinossauro', 'Osso',
    'Caverna Pré-histórica', 'Meteoro', 'Planta Pré-histórica', 'Ninho', 'Garra'
  ],
  'Super-Heróis': [
    'Homem-Aranha', 'Batman', 'Superman', 'Mulher Maravilha', 'Capitão América',
    'Homem de Ferro', 'Thor', 'Hulk', 'Flash', 'Aquaman', 'Pantera Negra',
    'Escudo', 'Capa', 'Máscara', 'Raio', 'Teia', 'Martelo', 'Armadura',
    'Símbolo de Herói', 'Batmóvel', 'Traje de Herói'
  ],
  'Espaço': [
    'Foguete', 'Astronauta', 'Planeta Terra', 'Lua', 'Sol', 'Estrela Cadente',
    'Saturno', 'Marte', 'Júpiter', 'Cometa', 'Meteoro', 'Galáxia', 'Buraco Negro',
    'Estação Espacial', 'Satélite', 'Telescópio', 'Alienígena', 'OVNI',
    'Capacete Espacial', 'Nave Espacial'
  ],
  'Fundo do Mar': [
    'Sereia', 'Polvo', 'Estrela do Mar', 'Cavalo Marinho', 'Caranguejo',
    'Água-viva', 'Tartaruga Marinha', 'Golfinho', 'Baleia', 'Tubarão',
    'Peixe Palhaço', 'Coral', 'Concha', 'Pérola', 'Âncora', 'Baú do Tesouro',
    'Navio Pirata', 'Algas Marinhas', 'Submarino', 'Farol'
  ]
}

export function PremiumThemePacks({ isPremium, onPacksSelected, selectedPacks, onPremiumClick }: PremiumThemePacksProps) {
  const [isOpen, setIsOpen] = useState(false)

  const togglePack = (packName: string) => {
    if (!isPremium) return

    if (selectedPacks.includes(packName)) {
      onPacksSelected(selectedPacks.filter(p => p !== packName))
    } else {
      onPacksSelected([...selectedPacks, packName])
    }
  }

  const packNames = Object.keys(PREMIUM_THEME_PACKS)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-black text-lg shadow-lg flex items-center justify-center gap-2">
          <Package className="w-5 h-5" />
          <span>Pacotes de Temas</span>
          {!isPremium && <Crown className="w-4 h-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Pacotes de Temas Exclusivos
            </DialogTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {isPremium ? (
            <div className="space-y-4">
              <p className="text-gray-600 font-bold text-center">
                Selecione os pacotes que deseja usar no sorteio
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {packNames.map((packName) => {
                  const isSelected = selectedPacks.includes(packName)
                  const themes = PREMIUM_THEME_PACKS[packName as keyof typeof PREMIUM_THEME_PACKS]
                  
                  return (
                    <button
                      key={packName}
                      onClick={() => togglePack(packName)}
                      className={`p-6 rounded-2xl border-4 transition-all text-left ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400 shadow-lg scale-105'
                          : 'bg-white border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-black text-gray-800 mb-1">
                            {packName}
                          </h3>
                          <p className="text-sm font-bold text-gray-600">
                            {themes.length} temas
                          </p>
                        </div>
                        {isSelected && (
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {themes.slice(0, 6).map((theme, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                          >
                            {theme}
                          </span>
                        ))}
                        {themes.length > 6 && (
                          <span className="text-xs font-semibold text-gray-500">
                            +{themes.length - 6} mais
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="text-center pt-4 border-t-2 border-gray-200">
                <p className="text-sm font-bold text-gray-600">
                  ✨ {selectedPacks.length} pacote(s) selecionado(s)
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 relative">
              {/* Conteúdo desfocado/borrado */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-2xl"></div>
              
              {/* Preview borrado dos pacotes */}
              <div className="opacity-30 blur-sm pointer-events-none mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {packNames.slice(0, 8).map((packName) => (
                    <div
                      key={packName}
                      className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200"
                    >
                      <p className="font-black text-gray-800">{packName}</p>
                      <p className="text-xs font-semibold text-gray-600">
                        {PREMIUM_THEME_PACKS[packName as keyof typeof PREMIUM_THEME_PACKS].length} temas
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conteúdo premium sobreposto */}
              <div className="relative z-20">
                <div className="mb-6">
                  <div className="inline-block p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
                    <Crown className="w-16 h-16 text-orange-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-4">
                  Desbloqueie Pacotes Exclusivos
                </h3>
                <p className="text-gray-600 font-bold mb-6 max-w-md mx-auto">
                  Acesse 8 pacotes temáticos com mais de 160 temas exclusivos!
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 max-w-md mx-auto">
                  <p className="text-sm font-bold text-gray-700 mb-3">
                    ✨ Pacotes disponíveis:
                  </p>
                  <ul className="text-left text-sm font-semibold text-gray-600 space-y-2">
                    <li>🎮 Anime • Jogos • Princesas</li>
                    <li>👻 Terror • Dinossauros</li>
                    <li>🦸 Super-Heróis • Espaço</li>
                    <li>🌊 Fundo do Mar</li>
                  </ul>
                </div>
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    onPremiumClick?.()
                  }}
                  className="h-14 px-8 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 font-black text-lg shadow-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Assinar Premium
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
