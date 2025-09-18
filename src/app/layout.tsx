import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { AdminBadge } from '@/components/AdminBadge'

export const metadata: Metadata = {
  title: 'OfficeMate',
  description: 'OfficeMate workspace',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdminBadge />
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}
