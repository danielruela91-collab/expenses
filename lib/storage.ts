import { promises as fs } from 'fs'
import path from 'path'

interface Item {
  id: string
  name: string
  completed: boolean
  createdAt: string
}

const STORAGE_FILE = path.join(process.cwd(), 'data', 'items.json')

async function ensureStorageFile() {
  try {
    await fs.stat(STORAGE_FILE)
  } catch {
    const dir = path.dirname(STORAGE_FILE)
    try {
      await fs.mkdir(dir, { recursive: true })
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'EEXIST') throw e
    }
    await fs.writeFile(STORAGE_FILE, JSON.stringify([]))
  }
}

async function readItems(): Promise<Item[]> {
  try {
    await ensureStorageFile()
    const data = await fs.readFile(STORAGE_FILE, 'utf-8')
    return JSON.parse(data || '[]')
  } catch (error) {
    console.error('Error reading items:', error)
    return []
  }
}

async function writeItems(items: Item[]): Promise<void> {
  try {
    await ensureStorageFile()
    await fs.writeFile(STORAGE_FILE, JSON.stringify(items, null, 2))
  } catch (error) {
    console.error('Error writing items:', error)
  }
}

export async function getItems(): Promise<Item[]> {
  const items = await readItems()
  return items.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function addItem(name: string): Promise<Item> {
  const items = await readItems()
  const newItem: Item = {
    id: Date.now().toString(),
    name,
    completed: false,
    createdAt: new Date().toISOString(),
  }
  items.push(newItem)
  await writeItems(items)
  return newItem
}

export async function updateItem(
  id: string,
  updates: Partial<Item>
): Promise<Item | null> {
  const items = await readItems()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return null

  items[index] = { ...items[index], ...updates }
  await writeItems(items)
  return items[index]
}

export async function deleteItem(id: string): Promise<boolean> {
  const items = await readItems()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return false

  items.splice(index, 1)
  await writeItems(items)
  return true
}
