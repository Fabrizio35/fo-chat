import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/providers/providers'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FOChat',
  description: 'Chat app',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className}`}>
        <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
