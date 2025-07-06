import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/intro/')({
  component: IntroPage,
})

function IntroPage() {
  return <div>IntroPage</div>
}
