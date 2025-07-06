import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/onboarding/complete/')({
  component: CompletePage,
})

function CompletePage() {
  return <div>CompletePage</div>
}
