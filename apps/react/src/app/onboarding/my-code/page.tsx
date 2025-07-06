import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/onboarding/my-code/')({
  component: MyCodePage,
})

function MyCodePage() {
  return <div>MyCodePage</div>
}
