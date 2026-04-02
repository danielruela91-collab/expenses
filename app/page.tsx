'use client'

import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { ShoppingListForm } from '@/components/ShoppingListForm'
import { ShoppingListItem } from '@/components/ShoppingListItem'

interface Item {
  id: string
  name: string
  completed: boolean
  createdAt: string
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    fetchItems()
    const interval = setInterval(fetchItems, 2000)
    return () => clearInterval(interval)
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to fetch items:', error)
    }
  }

  const addItem = async (name: string) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (response.ok) {
        await fetchItems()
      }
    } catch (error) {
      console.error('Failed to add item:', error)
    }
  }

  const toggleItem = async (id: string) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      })
      if (response.ok) {
        triggerConfetti()
        await fetchItems()
      }
    } catch (error) {
      console.error('Failed to update item:', error)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchItems()
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  const triggerConfetti = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()

      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: rect.left / window.innerWidth + 0.5,
          y: rect.top / window.innerHeight + 0.5,
        },
      })
    }
  }

  const activeItems = items.filter((item) => !item.completed)
  const completedItems = items.filter((item) => item.completed)

  return (
    <main className="min-h-screen py-8 px-4">
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }} />

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
            🛒 Shopping List
          </h1>
          <p className="text-center text-gray-600 text-sm mb-6">
            Share with your wife
          </p>

          <ShoppingListForm onAdd={addItem} />

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <>
              {activeItems.length === 0 && completedItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Add items to your shopping list!
                </p>
              ) : (
                <>
                  {activeItems.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        To Buy ({activeItems.length})
                      </h2>
                      <div className="space-y-2">
                        {activeItems.map((item) => (
                          <ShoppingListItem
                            key={item.id}
                            item={item}
                            onComplete={() => toggleItem(item.id)}
                            onDelete={() => deleteItem(item.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {completedItems.length > 0 && (
                    <div>
                      <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Bought ({completedItems.length})
                      </h2>
                      <div className="space-y-2">
                        {completedItems.map((item) => (
                          <ShoppingListItem
                            key={item.id}
                            item={item}
                            onComplete={() => {}}
                            onDelete={() => deleteItem(item.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
