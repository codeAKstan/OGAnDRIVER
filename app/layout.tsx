import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OGAnDRIVER',
  description: 'Empowering Vehicle Owners in Nigeri',
  generator: 'codeAKstan',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
