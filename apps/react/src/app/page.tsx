import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="size-full">
      <img src="/images/main-desktop.png" alt="main-desktop" className="hidden size-full lg:block" />
      <img src="/images/main-mobile.png" alt="main-mobile" className="size-full lg:hidden" />
    </div>
  )
}
