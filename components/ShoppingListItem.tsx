'use client'

interface Item {
  id: string
  name: string
  completed: boolean
}

interface ShoppingListItemProps {
  item: Item
  onComplete: () => void
  onDelete: () => void
}

export function ShoppingListItem({ item, onComplete, onDelete }: ShoppingListItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
        item.completed
          ? 'bg-gray-100 border-gray-200'
          : 'bg-white border-gray-200 hover:border-indigo-300'
      }`}
    >
      <input
        type="checkbox"
        checked={item.completed}
        onChange={onComplete}
        disabled={item.completed}
        className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
      />
      <span
        className={`flex-1 ${
          item.completed
            ? 'text-gray-500 line-through'
            : 'text-gray-900 font-medium'
        }`}
      >
        {item.name}
      </span>
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500 transition-colors p-1"
        title="Delete"
      >
        ✕
      </button>
    </div>
  )
}
