'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Settings, Plus, Trash2, Edit2, Save, X, Crown } from 'lucide-react'
import { saveUserThemes, loadUserThemes, getDefaultThemes } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'
import { PremiumBadge } from './PremiumBadge'

const DEFAULT_THEMES = getDefaultThemes()

interface ThemeManagerProps {
  onThemesUpdate: (themes: Record<string, string[]>) => void
  isGuestMode?: boolean
  isPremium?: boolean
}

export function ThemeManager({ onThemesUpdate, isGuestMode = false, isPremium = false }: ThemeManagerProps) {
  const [themes, setThemes] = useState<Record<string, string[]>>(DEFAULT_THEMES)
  const [selectedCategory, setSelectedCategory] = useState<string>('Animais')
  const [newTheme, setNewTheme] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [editingTheme, setEditingTheme] = useState<{ category: string; index: number; value: string } | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Carregar temas ao montar o componente
  useEffect(() => {
    loadThemes()
  }, [isGuestMode])

  const loadThemes = async () => {
    try {
      setIsLoading(true)
      
      if (isGuestMode) {
        // Modo visitante: sempre usa temas padrão, não salva nada
        setThemes(DEFAULT_THEMES)
        onThemesUpdate(DEFAULT_THEMES)
        setUserId(null)
        return
      }

      // Usuário logado: carrega do Supabase
      const user = await getCurrentUser()
      if (user) {
        setUserId(user.id)
        const userThemes = await loadUserThemes(user.id)
        setThemes(userThemes)
        onThemesUpdate(userThemes)
      } else {
        // Sem usuário: usa temas padrão
        setThemes(DEFAULT_THEMES)
        onThemesUpdate(DEFAULT_THEMES)
        setUserId(null)
      }
    } catch (error) {
      console.error('Erro ao carregar temas:', error)
      setThemes(DEFAULT_THEMES)
      onThemesUpdate(DEFAULT_THEMES)
    } finally {
      setIsLoading(false)
    }
  }

  // Salvar temas
  const saveThemes = async (updatedThemes: Record<string, string[]>) => {
    setThemes(updatedThemes)
    onThemesUpdate(updatedThemes)

    // Modo visitante: não salva nada
    if (isGuestMode || !userId) {
      return
    }

    // Usuário logado: salva no Supabase
    try {
      await saveUserThemes(userId, updatedThemes)
    } catch (error) {
      console.error('Erro ao salvar temas:', error)
      alert('Erro ao salvar temas. Por favor, tente novamente.')
    }
  }

  // Contar categorias customizadas (não padrão)
  const countCustomCategories = () => {
    const defaultCategories = Object.keys(DEFAULT_THEMES)
    return Object.keys(themes).filter(cat => !defaultCategories.includes(cat)).length
  }

  const handleAddTheme = () => {
    if (!newTheme.trim()) return
    
    const updatedThemes = {
      ...themes,
      [selectedCategory]: [...themes[selectedCategory], newTheme.trim()]
    }
    saveThemes(updatedThemes)
    setNewTheme('')
  }

  const handleRemoveTheme = (category: string, index: number) => {
    const updatedThemes = {
      ...themes,
      [category]: themes[category].filter((_, i) => i !== index)
    }
    saveThemes(updatedThemes)
  }

  const handleStartEdit = (category: string, index: number) => {
    setEditingTheme({
      category,
      index,
      value: themes[category][index]
    })
  }

  const handleSaveEdit = () => {
    if (!editingTheme || !editingTheme.value.trim()) return
    
    const updatedThemes = {
      ...themes,
      [editingTheme.category]: themes[editingTheme.category].map((theme, i) =>
        i === editingTheme.index ? editingTheme.value.trim() : theme
      )
    }
    saveThemes(updatedThemes)
    setEditingTheme(null)
  }

  const handleCancelEdit = () => {
    setEditingTheme(null)
  }

  const handleAddCategory = () => {
    if (!newCategory.trim() || themes[newCategory.trim()]) return
    
    // LIMITE PLANO GRATUITO: máximo 3 categorias customizadas
    if (!isPremium && countCustomCategories() >= 3) {
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg z-50 animate-bounce'
      alertDiv.innerHTML = '👑 Plano gratuito: máximo 3 categorias customizadas. Assine Premium para ilimitado!'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 3000)
      return
    }
    
    const updatedThemes = {
      ...themes,
      [newCategory.trim()]: []
    }
    saveThemes(updatedThemes)
    setSelectedCategory(newCategory.trim())
    setNewCategory('')
  }

  const handleRemoveCategory = (category: string) => {
    const { [category]: _, ...rest } = themes
    saveThemes(rest)
    if (selectedCategory === category) {
      setSelectedCategory(Object.keys(rest)[0] || '')
    }
  }

  const handleResetToDefaults = () => {
    if (confirm('Tem certeza que deseja restaurar os temas padrão? Todos os temas personalizados serão perdidos.')) {
      saveThemes(DEFAULT_THEMES)
      setSelectedCategory('Animais')
    }
  }

  const customCategoriesCount = countCustomCategories()
  const isCustomCategory = !Object.keys(DEFAULT_THEMES).includes(selectedCategory)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 font-bold text-lg shadow-lg"
          disabled={isGuestMode || isLoading}
        >
          <Settings className="w-5 h-5 mr-2" />
          {isGuestMode ? 'Gerenciar Temas (Indisponível)' : isLoading ? 'Carregando...' : 'Gerenciar Temas'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
            Gerenciar Temas
          </DialogTitle>
        </DialogHeader>

        {isGuestMode && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 mb-4">
            <p className="text-yellow-800 font-semibold text-center">
              ⚠️ Modo Visitante: Gerenciamento de temas desabilitado. Crie uma conta para personalizar seus temas!
            </p>
          </div>
        )}

        {!isPremium && !isGuestMode && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-300 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-800 font-bold">
                  📊 Plano Gratuito: {customCategoriesCount}/3 categorias customizadas
                </p>
                <p className="text-sm text-orange-700 font-semibold mt-1">
                  Assine Premium para categorias ilimitadas!
                </p>
              </div>
              <PremiumBadge />
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Adicionar Nova Categoria */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800">➕ Adicionar Nova Categoria</h3>
              {!isPremium && (
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  {customCategoriesCount}/3 usadas
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nome da categoria..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                className="h-10 rounded-xl border-2 border-purple-300 font-bold"
                disabled={isGuestMode}
              />
              <Button
                onClick={handleAddCategory}
                className="h-10 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 font-bold"
                disabled={isGuestMode}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Seletor de Categoria */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">📂 Selecione uma Categoria</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(themes).map((category) => {
                const isDefault = Object.keys(DEFAULT_THEMES).includes(category)
                return (
                  <div key={category} className="relative group">
                    <Button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full h-12 rounded-xl font-bold transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {category}
                      {!isDefault && (
                        <span className="ml-1 text-xs">✨</span>
                      )}
                    </Button>
                    {!isDefault && !isGuestMode && (
                      <Button
                        onClick={() => handleRemoveCategory(category)}
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Adicionar Novo Tema */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              ➕ Adicionar Tema em "{selectedCategory}"
            </h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nome do tema..."
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTheme()}
                className="h-10 rounded-xl border-2 border-green-300 font-bold"
                disabled={isGuestMode}
              />
              <Button
                onClick={handleAddTheme}
                className="h-10 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-bold"
                disabled={isGuestMode}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Lista de Temas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800">
                📝 Temas em "{selectedCategory}" ({themes[selectedCategory]?.length || 0})
              </h3>
              <Button
                onClick={handleResetToDefaults}
                variant="outline"
                className="h-8 px-3 rounded-lg border-2 border-orange-300 hover:bg-orange-50 font-bold text-sm"
                disabled={isGuestMode}
              >
                🔄 Restaurar Padrões
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {themes[selectedCategory]?.map((theme, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 border-2 border-yellow-300 flex items-center justify-between gap-2"
                >
                  {editingTheme?.category === selectedCategory && editingTheme?.index === index ? (
                    <>
                      <Input
                        type="text"
                        value={editingTheme.value}
                        onChange={(e) => setEditingTheme({ ...editingTheme, value: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="h-8 rounded-lg border-2 border-yellow-400 font-bold flex-1"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <Button
                          onClick={handleSaveEdit}
                          className="h-8 w-8 p-0 rounded-lg bg-green-500 hover:bg-green-600"
                        >
                          <Save className="w-4 h-4 text-white" />
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          className="h-8 w-8 p-0 rounded-lg bg-gray-500 hover:bg-gray-600"
                        >
                          <X className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-gray-800 flex-1">{theme}</span>
                      {!isGuestMode && (
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleStartEdit(selectedCategory, index)}
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-blue-200"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            onClick={() => handleRemoveTheme(selectedCategory, index)}
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-red-200"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
