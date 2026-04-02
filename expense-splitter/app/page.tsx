'use client'

import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'

interface Item {
  id: string
  name: string
  done: boolean
  createdAt: number
}

const STORAGE_KEY = 'lista-compras'

function loadItems(): Item[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveItems(items: Item[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function fireConfetti() {
  confetti({
    particleCount: 130,
    spread: 90,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
  })
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [input, setInput] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(loadItems())
    setMounted(true)
  }, [])

  const persist = useCallback((updated: Item[]) => {
    setItems(updated)
    saveItems(updated)
  }, [])

  const addItem = (e: React.FormEvent) => {
    e.preventDefault()
    const name = input.trim()
    if (!name) return
    const updated: Item[] = [
      { id: Date.now().toString(), name, done: false, createdAt: Date.now() },
      ...items,
    ]
    persist(updated)
    setInput('')
  }

  const toggleItem = (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const updated = items.map((i) => i.id === id ? { ...i, done: !i.done } : i)
    persist(updated)
    if (!item.done) fireConfetti()
  }

  const deleteItem = (id: string) => {
    persist(items.filter((i) => i.id !== id))
  }

  const clearDone = () => {
    persist(items.filter((i) => !i.done))
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

        <form onSubmit={addItem} className="flex gap-2 mb-8">
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

        {items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🛍️</p>
            <p className="text-gray-500">Lista vazia — adicione o que precisar comprar!</p>
          </div>
        )}

        {pending.length > 0 && (
          <section className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Para comprar ({pending.length})
            </p>
            <ul className="space-y-2">
              {pending.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 group"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 rounded-full border-2 border-indigo-500 hover:bg-indigo-500 flex-shrink-0 transition-colors"
                  />
                  <span className="flex-1 text-gray-100">{item.name}</span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {done.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Comprado ({done.length})
            </p>
            <ul className="space-y-2 mb-4">
              {done.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 group"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-indigo-600 flex-shrink-0 flex items-center justify-center"
                  >
                    <span className="text-white text-xs leading-none">✓</span>
                  </button>
                  <span className="flex-1 text-gray-500 line-through">{item.name}</span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={clearDone}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-600 rounded-xl transition-colors"
            >
              Limpar comprados
            </button>
          </section>
        )}
      </div>
    </main>
  )
}
