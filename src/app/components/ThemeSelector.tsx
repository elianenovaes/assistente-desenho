'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { PREMIUM_THEME_PACKS } from './PremiumThemePacks'

interface ThemeSelectorProps {
  onThemeSelected: (theme: { text: string; category: string }) => void
  disabled?: boolean
  customThemes?: Record<string, string[]>
  isPremium?: boolean
  selectedPremiumPacks?: string[]
  selectedCategories?: string[]
}

const DEFAULT_THEMES = {
  'Animais': [
    'Cachorro', 'Gato', 'Elefante', 'Girafa', 'Leão', 'Tigre', 'Urso', 'Panda',
    'Coelho', 'Tartaruga', 'Peixe', 'Tubarão', 'Baleia', 'Golfinho', 'Pinguim',
    'Águia', 'Coruja', 'Papagaio', 'Flamingo', 'Pavão'
  ],
  'Objetos': [
    'Cadeira', 'Mesa', 'Lâmpada', 'Relógio', 'Telefone', 'Computador', 'Livro',
    'Caneta', 'Óculos', 'Guarda-chuva', 'Chave', 'Mochila', 'Bola', 'Bicicleta',
    'Carro', 'Avião', 'Barco', 'Trem', 'Foguete', 'Helicóptero'
  ],
  'Alimentos': [
    'Pizza', 'Hambúrguer', 'Sorvete', 'Bolo', 'Maçã', 'Banana', 'Morango',
    'Melancia', 'Uva', 'Laranja', 'Pão', 'Queijo', 'Ovo', 'Café', 'Suco',
    'Chocolate', 'Donut', 'Cupcake', 'Pipoca', 'Batata Frita'
  ],
  'Natureza': [
    'Árvore', 'Flor', 'Sol', 'Lua', 'Estrela', 'Nuvem', 'Montanha', 'Rio',
    'Mar', 'Praia', 'Cachoeira', 'Arco-íris', 'Raio', 'Neve', 'Chuva',
    'Vulcão', 'Ilha', 'Deserto', 'Floresta', 'Jardim'
  ],
  'Profissões': [
    'Médico', 'Professor', 'Bombeiro', 'Policial', 'Chef', 'Artista', 'Músico',
    'Atleta', 'Cientista', 'Astronauta', 'Piloto', 'Marinheiro', 'Fazendeiro',
    'Construtor', 'Eletricista', 'Encanador', 'Padeiro', 'Jardineiro', 'Veterinário', 'Dentista'
  ],
  'Esportes': [
    'Futebol', 'Basquete', 'Vôlei', 'Tênis', 'Natação', 'Corrida', 'Ciclismo',
    'Skate', 'Surf', 'Boxe', 'Karatê', 'Judô', 'Ginástica', 'Dança', 'Yoga',
    'Escalada', 'Esqui', 'Patinação', 'Golf', 'Baseball'
  ],
  'Emoções': [
    'Feliz', 'Triste', 'Bravo', 'Surpreso', 'Assustado', 'Apaixonado',
    'Cansado', 'Animado', 'Entediado', 'Confuso', 'Orgulhoso', 'Envergonhado',
    'Nervoso', 'Calmo', 'Ansioso', 'Relaxado', 'Frustrado', 'Aliviado', 'Curioso', 'Sonolento'
  ],
  'Lugares': [
    'Casa', 'Escola', 'Hospital', 'Parque', 'Shopping', 'Cinema', 'Teatro',
    'Museu', 'Biblioteca', 'Restaurante', 'Praia', 'Montanha', 'Cidade',
    'Fazenda', 'Castelo', 'Igreja', 'Estádio', 'Aeroporto', 'Estação', 'Ponte'
  ]
}

export function ThemeSelector({ 
  onThemeSelected, 
  disabled, 
  customThemes, 
  isPremium = false, 
  selectedPremiumPacks = [],
  selectedCategories = []
}: ThemeSelectorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [themes, setThemes] = useState(DEFAULT_THEMES)

  useEffect(() => {
    // Combinar temas padrão + customizados + pacotes premium selecionados
    let combinedThemes = { ...DEFAULT_THEMES }

    // Adicionar temas customizados (sempre disponível)
    if (customThemes) {
      combinedThemes = { ...combinedThemes, ...customThemes }
    }

    // Adicionar pacotes premium selecionados (apenas se premium)
    if (isPremium && selectedPremiumPacks.length > 0) {
      selectedPremiumPacks.forEach(packName => {
        const packThemes = PREMIUM_THEME_PACKS[packName as keyof typeof PREMIUM_THEME_PACKS]
        if (packThemes) {
          combinedThemes[packName] = packThemes
        }
      })
    }

    setThemes(combinedThemes)
  }, [customThemes, isPremium, selectedPremiumPacks])

  const generateTheme = () => {
    setIsGenerating(true)
    
    // Filtrar categorias baseado na seleção do usuário (se premium e houver seleção)
    let availableCategories = Object.keys(themes)
    
    if (isPremium && selectedCategories.length > 0) {
      // Usar apenas as categorias selecionadas
      availableCategories = availableCategories.filter(cat => selectedCategories.includes(cat))
    }
    
    // Se não houver categorias disponíveis, usar todas
    if (availableCategories.length === 0) {
      availableCategories = Object.keys(themes)
    }
    
    // Selecionar categoria aleatória
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)]
    
    // Selecionar tema aleatório da categoria
    const themesInCategory = themes[randomCategory as keyof typeof themes]
    
    if (!themesInCategory || themesInCategory.length === 0) {
      setIsGenerating(false)
      return
    }
    
    const randomTheme = themesInCategory[Math.floor(Math.random() * themesInCategory.length)]
    
    // Simular delay de geração
    setTimeout(() => {
      onThemeSelected({
        text: randomTheme,
        category: randomCategory
      })
      setIsGenerating(false)
    }, 500)
  }

  // Calcular quantas categorias estão ativas
  const activeCategories = isPremium && selectedCategories.length > 0 
    ? selectedCategories.length 
    : Object.keys(themes).length

  return (
    <>
      <Button
        onClick={generateTheme}
        disabled={disabled || isGenerating}
        className="w-full h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 font-black text-xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-6 h-6 mr-2 animate-spin" />
            Gerando...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6 mr-2" />
            Sortear Tema
          </>
        )}
      </Button>
      
      <p className="text-sm text-gray-600 font-bold mt-4 text-center">
        ✨ {activeCategories} categoria(s) ativa(s)
      </p>
    </>
  )
}
