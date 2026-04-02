import { NextRequest, NextResponse } from 'next/server'
import { getItems, addItem } from '@/lib/storage'

export async function GET() {
  try {
    const items = await getItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error('Failed to fetch items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400 }
      )
    }

    const item = await addItem(name.trim())
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Failed to add item:', error)
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}
