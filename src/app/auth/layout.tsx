import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autenticación | FOChat',
  description: 'Accede o regístrate a FOChat',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
