'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit, Crown, Plus, Trash2, Save } from 'lucide-react'
import { PremiumBadge } from './PremiumBadge'

interface CustomThemeEditorProps {
  isPremium: boolean
  onSaveCustomList: (categoryName: string, themes: string[]) => void
  onPremiumClick?: () => void
}

export function CustomThemeEditor({ isPremium, onSaveCustomList, onPremiumClick }: CustomThemeEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [themesText, setThemesText] = useState('')

  const handleSave = () => {
    if (!isPremium) return
    if (!categoryName.trim() || !themesText.trim()) {
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
      alertDiv.textContent = '⚠️ Preencha o nome da categoria e os temas!'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 2000)
      return
    }

    // Separar temas por linha ou vírgula
    const themes = themesText
      .split(/[\n,]/)
      .map(t => t.trim())
      .filter(t => t.length > 0)

    if (themes.length === 0) {
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
      alertDiv.textContent = '⚠️ Adicione pelo menos um tema!'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 2000)
      return
    }

    onSaveCustomList(categoryName.trim(), themes)
    
    // Feedback de sucesso
    const alertDiv = document.createElement('div')
    alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
    alertDiv.textContent = `✅ Lista "${categoryName}" criada com ${themes.length} temas!`
    document.body.appendChild(alertDiv)
    setTimeout(() => alertDiv.remove(), 2000)

    // Limpar campos
    setCategoryName('')
    setThemesText('')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 font-black text-lg shadow-lg flex items-center justify-center gap-2">
          <Edit className="w-5 h-5" />
          <span>Editor Personalizado</span>
          {!isPremium && <Crown className="w-4 h-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
            Editor Personalizado
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {isPremium ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nome da Categoria
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Festa de Aniversário, Personagens Favoritos..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="h-12 rounded-xl border-2 border-gray-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Lista de Temas (um por linha ou separado por vírgula)
                </label>
                <Textarea
                  placeholder="Digite seus temas aqui...&#10;&#10;Exemplo:&#10;Bolo de Chocolate&#10;Balões Coloridos&#10;Presente Surpresa&#10;Vela de Aniversário"
                  value={themesText}
                  onChange={(e) => setThemesText(e.target.value)}
                  className="min-h-[200px] rounded-xl border-2 border-gray-300 font-bold resize-none"
                />
                <p className="text-sm text-gray-600 font-semibold mt-2">
                  💡 Dica: Perfeito para festas temáticas, vídeos personalizados ou desafios específicos!
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 font-black"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Salvar Lista
                </Button>
                <Button
                  onClick={() => {
                    setCategoryName('')
                    setThemesText('')
                  }}
                  variant="outline"
                  className="h-12 px-6 rounded-xl border-2 border-gray-300 font-bold"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Limpar
                </Button>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border-2 border-blue-200">
                <p className="text-sm font-bold text-gray-700 mb-2">
                  ✨ Exemplos de uso:
                </p>
                <ul className="text-sm font-semibold text-gray-600 space-y-1">
                  <li>🎂 Festa de aniversário com temas específicos</li>
                  <li>🎥 Criar vídeos temáticos para YouTube/TikTok</li>
                  <li>🎨 Desafios personalizados para amigos</li>
                  <li>🏫 Atividades educacionais customizadas</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 relative">
              {/* Conteúdo desfocado/borrado */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-2xl"></div>
              
              {/* Preview borrado do editor */}
              <div className="opacity-30 blur-sm pointer-events-none mb-6">
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                  <div className="h-48 bg-gray-200 rounded-xl"></div>
                  <div className="flex gap-3">
                    <div className="flex-1 h-12 bg-green-200 rounded-xl"></div>
                    <div className="h-12 w-24 bg-gray-200 rounded-xl"></div>
                  </div>
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
                  Crie Suas Próprias Listas
                </h3>
                <p className="text-gray-600 font-bold mb-6 max-w-md mx-auto">
                  Com o Editor Personalizado você pode criar listas de temas específicas para:
                </p>
                <div className="space-y-3 mb-6 max-w-md mx-auto">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 text-left">
                    <p className="font-black text-gray-800">🎂 Festas de Aniversário</p>
                    <p className="text-sm font-semibold text-gray-600">Temas personalizados para a festa</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 text-left">
                    <p className="font-black text-gray-800">🎥 Vídeos Temáticos</p>
                    <p className="text-sm font-semibold text-gray-600">Conteúdo específico para seu canal</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 text-left">
                    <p className="font-black text-gray-800">🏫 Atividades Educacionais</p>
                    <p className="text-sm font-semibold text-gray-600">Listas customizadas para ensino</p>
                  </div>
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
