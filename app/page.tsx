'use client'

import { useState, useCallback, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useShoppingList } from '@/lib/useShoppingList'
import { getEmoji } from '@/lib/emojiMap'

export default function Home() {
  const { items, mounted, addItem, toggleItem, deleteItem, clearDone } = useShoppingList()
  const [input, setInput] = useState('')

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 130,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    })
  }, [])

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    addItem(input)
    setInput('')
  }

  const handleToggleItem = (id: string) => {
    const wasJustMarkedDone = toggleItem(id)
    if (wasJustMarkedDone) {
      fireConfetti()
    }
  }

  const pending = items.filter((i) => !i.done)
  const done = items.filter((i) => i.done)

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-400 mb-1">🛒 Lista de Compras</h1>
          <p className="text-gray-500 text-sm">Sua lista compartilhada</p>
        </div>
        <form onSubmit={handleAddItem} className="flex gap-2 mb-8">
          <input
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="O que precisa comprar?"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            Add
          </button>
        </form>

        {pending.length === 0 && done.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum item adicionado</p>
            <p className="text-gray-600 text-sm mt-2">Comece a adicionar itens acima!</p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-widest">
                  Pendentes ({pending.length})
                </h2>
                <div className="space-y-2">
                  {pending.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors group"
                    >
                      <button
                        onClick={() => handleToggleItem(item.id)}
                        className="w-5 h-5 rounded border-2 border-gray-600 flex-shrink-0 cursor-pointer hover:border-indigo-400 transition-colors bg-transparent"
                        aria-label="Marcar como comprado"
                      />
                      <span className="flex-1 text-gray-100">
                        {getEmoji(item.name) && <span className="mr-2">{getEmoji(item.name)}</span>}
                        {item.name}
                      </span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {done.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-widest">
                  Comprados ({done.length})
                </h2>
                <div className="space-y-2">
                  {done.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-gray-800 rounded-lg p-4 opacity-60 hover:bg-gray-750 transition-colors group"
                    >
                      <button
                        onClick={() => handleToggleItem(item.id)}
                        className="w-5 h-5 rounded border-2 border-indigo-500 bg-indigo-600 flex-shrink-0 cursor-pointer flex items-center justify-center hover:bg-indigo-500 transition-colors"
                        aria-label="Desmarcar"
                      >
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      </button>
                      <span className="flex-1 text-gray-100 line-through">
                        {getEmoji(item.name) && <span className="mr-2">{getEmoji(item.name)}</span>}
                        {item.name}
                      </span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {done.length > 0 && (
                  <button
                    onClick={clearDone}
                    className="mt-4 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-lg transition-colors text-sm"
                  >
                    Limpar comprados
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
