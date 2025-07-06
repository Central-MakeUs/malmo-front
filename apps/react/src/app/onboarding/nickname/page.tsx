import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/onboarding/nickname/')({
  component: NicknamePage,
})

function NicknamePage() {
  return <div>NicknamePage</div>
}
