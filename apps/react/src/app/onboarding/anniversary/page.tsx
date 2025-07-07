import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/onboarding/anniversary/')({
  component: AnniversaryPage,
})

function AnniversaryPage() {
  return <div>AnniversaryPage</div>
}
