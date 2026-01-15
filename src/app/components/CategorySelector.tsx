'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Settings, Check, Crown } from 'lucide-react'
import { PremiumBadge } from './PremiumBadge'

interface CategorySelectorProps {
  isPremium: boolean
  availableCategories: string[]
  selectedCategories: string[]
  onCategoriesSelected: (categories: string[]) => void
}

export function CategorySelector({ 
  isPremium, 
  availableCategories, 
  selectedCategories, 
  onCategoriesSelected 
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleCategory = (category: string) => {
    if (!isPremium) return

    if (selectedCategories.includes(category)) {
      // Não permitir desmarcar se for a última categoria
      if (selectedCategories.length === 1) {
        const alertDiv = document.createElement('div')
        alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
        alertDiv.textContent = '⚠️ Você precisa ter pelo menos uma categoria selecionada!'
        document.body.appendChild(alertDiv)
        setTimeout(() => alertDiv.remove(), 2000)
        return
      }
      onCategoriesSelected(selectedCategories.filter(c => c !== category))
    } else {
      onCategoriesSelected([...selectedCategories, category])
    }
  }

  const selectAll = () => {
    if (!isPremium) return
    onCategoriesSelected([...availableCategories])
  }

  const deselectAll = () => {
    if (!isPremium) return
    // Manter pelo menos uma categoria
    if (availableCategories.length > 0) {
      onCategoriesSelected([availableCategories[0]])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 font-black text-lg shadow-lg">
          <Settings className="w-5 h-5 mr-2" />
          Selecionar Categorias
          {!isPremium && <PremiumBadge size="sm" className="ml-2" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
            Escolha as Categorias do Sorteio
          </DialogTitle>
        </DialogHeader>

        {isPremium ? (
          <div className="space-y-4">
            <div className="flex gap-2 justify-center">
              <Button
                onClick={selectAll}
                className="h-10 px-6 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 font-bold"
              >
                Selecionar Todas
              </Button>
              <Button
                onClick={deselectAll}
                className="h-10 px-6 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 font-bold"
              >
                Desmarcar Todas
              </Button>
            </div>

            <p className="text-gray-600 font-bold text-center">
              Selecione as categorias que deseja incluir no sorteio de temas
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableCategories.map((category) => {
                const isSelected = selectedCategories.includes(category)
                
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`p-4 rounded-2xl border-4 transition-all text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-100 to-blue-100 border-cyan-400 shadow-lg scale-105'
                        : 'bg-white border-gray-200 hover:border-cyan-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-gray-800">
                        {category}
                      </h3>
                      {isSelected && (
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-1.5 rounded-full">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="text-center pt-4 border-t-2 border-gray-200">
              <p className="text-sm font-bold text-gray-600">
                ✨ {selectedCategories.length} de {availableCategories.length} categoria(s) selecionada(s)
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="inline-block p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
                <Crown className="w-16 h-16 text-orange-500" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-4">
              Recurso Exclusivo Premium
            </h3>
            <p className="text-gray-600 font-bold mb-6 max-w-md mx-auto">
              Com o Premium, você pode escolher exatamente quais categorias deseja que apareçam no sorteio de temas!
            </p>
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 mb-6 max-w-md mx-auto">
              <p className="text-sm font-bold text-gray-700 mb-3">
                ✨ Benefícios:
              </p>
              <ul className="text-left text-sm font-semibold text-gray-600 space-y-2">
                <li>✓ Escolha categorias específicas</li>
                <li>✓ Personalize seus sorteios</li>
                <li>✓ Combine com pacotes premium</li>
                <li>✓ Controle total sobre os temas</li>
              </ul>
            </div>
            <Button
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 font-black text-lg shadow-lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              Assinar Premium
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
