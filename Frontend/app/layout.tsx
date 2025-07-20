import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'libtrack App',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
