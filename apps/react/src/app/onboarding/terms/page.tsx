import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/onboarding/terms/')({
  component: TermsPage,
})

function TermsPage() {
  return <div>TermsPage</div>
}
