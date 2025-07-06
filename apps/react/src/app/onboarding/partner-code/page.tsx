import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/onboarding/partner-code/')({
  component: PartnerCodePage,
})

function PartnerCodePage() {
  return <div>PartnerCodePage</div>
}
