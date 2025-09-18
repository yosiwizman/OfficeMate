"use client"
import React from 'react'

export function AdminBadge() {
  const logsUrl = process.env.NEXT_PUBLIC_LOGS_URL
  const isAdmin = process.env.NEXT_PUBLIC_ADMIN === 'true'
  if (!isAdmin) return null
  return (
    <a href={logsUrl || '/api/health'} target={logsUrl ? '_blank' : undefined}
      style={{ position: 'fixed', top: 12, right: 16, background: '#1118', color: '#fff', padding: '4px 8px', borderRadius: 8, fontSize: 12, textDecoration: 'none' }}>
      Admin
    </a>
  )
}
