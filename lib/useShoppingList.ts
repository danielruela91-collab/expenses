import { useState, useEffect, useCallback, useRef } from 'react'
import { getFirebaseDb, ref, set, get, onValue, remove, isFirebaseConfigured } from './firebase'

export interface Item {
  id: string
  name: string
  done: boolean
  createdAt: number
}

const STORAGE_KEY = 'lista-compras'

export function useShoppingList() {
  const [items, setItems] = useState<Item[]>([])
  const [mounted, setMounted] = useState(false)
  const [useFirebase] = useState(isFirebaseConfigured())
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Load items from Firebase or localStorage
  useEffect(() => {
    const loadItems = async () => {
      try {
        if (useFirebase) {
          const db = getFirebaseDb()
          if (!db) {
            // Fallback to localStorage
            const stored = localStorage.getItem(STORAGE_KEY)
            setItems(stored ? JSON.parse(stored) : [])
            setMounted(true)
            return
          }

          // Set up real-time listener for Firebase
          const itemsRef = ref(db, 'items')
          const unsubscribe = onValue(
            itemsRef,
            (snapshot) => {
              if (snapshot.exists()) {
                const data = snapshot.val()
                const itemsArray = Array.isArray(data) ? data : Object.values(data)
                setItems(itemsArray as Item[])
              } else {
                setItems([])
              }
              setMounted(true)
            },
            (error) => {
              console.error('Firebase read error:', error)
              // Fallback to localStorage
              const stored = localStorage.getItem(STORAGE_KEY)
              setItems(stored ? JSON.parse(stored) : [])
              setMounted(true)
            }
          )

          unsubscribeRef.current = unsubscribe
        } else {
          // Use localStorage only
          const stored = localStorage.getItem(STORAGE_KEY)
          setItems(stored ? JSON.parse(stored) : [])
          setMounted(true)
        }
      } catch (error) {
        console.error('Error loading items:', error)
        setMounted(true)
      }
    }

    loadItems()

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [useFirebase])

  const persist = useCallback(
    async (updated: Item[]) => {
      setItems(updated)

      if (useFirebase) {
        try {
          const db = getFirebaseDb()
          if (db) {
            const itemsRef = ref(db, 'items')
            await set(itemsRef, updated)
          }
        } catch (error) {
          console.error('Firebase write error:', error)
        }
      }

      // Always backup to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('localStorage write error:', error)
      }
    },
    [useFirebase]
  )

  const addItem = useCallback(
    (name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return

      const updated: Item[] = [
        { id: Date.now().toString(), name: trimmed, done: false, createdAt: Date.now() },
        ...items,
      ]
      persist(updated)
    },
    [items, persist]
  )

  const toggleItem = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id)
      if (!item) return

      const updated = items.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
      persist(updated)
      return !item.done // Return true if item was just marked as done
    },
    [items, persist]
  )

  const deleteItem = useCallback(
    (id: string) => {
      persist(items.filter((i) => i.id !== id))
    },
    [items, persist]
  )

  const clearDone = useCallback(() => {
    persist(items.filter((i) => !i.done))
  }, [items, persist])

  return {
    items,
    mounted,
    addItem,
    toggleItem,
    deleteItem,
    clearDone,
    useFirebase,
  }
}
