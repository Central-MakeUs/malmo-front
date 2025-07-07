import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

function LoginPage() {
  return <div>LoginPage</div>
}
