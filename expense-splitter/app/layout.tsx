import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lista de Compras',
  description: 'Lista de compras compartilhada',
<<<<<<<< HEAD:expense-splitter/app/layout.tsx
========
  icons: {
    icon: '/favicon.svg',
  },
>>>>>>>> claude/earnings-calculator-app-96Qk7:app/layout.tsx
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-950 min-h-screen">
        {children}
      </body>
    </html>
  )
}
