import Lottie from 'lottie-react'

import loadingAnimation from '@/assets/lottie/load.json'
import { Screen } from '@/shared/layout/screen'

export function PageLoadingFallback() {
  return (
    <Screen>
      <Screen.Content className="flex h-full flex-1 items-center justify-center bg-white">
        <div className="flex w-full max-w-[160px] flex-col items-center gap-4">
          <Lottie animationData={loadingAnimation} loop autoplay className="w-full" />
        </div>
      </Screen.Content>
    </Screen>
  )
}
