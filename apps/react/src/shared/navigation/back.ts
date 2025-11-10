let manualBackIntent = false
let manualBackResetTimer: ReturnType<typeof setTimeout> | null = null

const RESET_TIMEOUT_MS = 1000

const clearManualBackIntent = () => {
  manualBackIntent = false
  if (manualBackResetTimer) {
    clearTimeout(manualBackResetTimer)
    manualBackResetTimer = null
  }
}

export function markManualBack() {
  manualBackIntent = true
  if (manualBackResetTimer) {
    clearTimeout(manualBackResetTimer)
  }
  manualBackResetTimer = setTimeout(() => {
    clearManualBackIntent()
  }, RESET_TIMEOUT_MS)
}

export function consumeManualBack() {
  const current = manualBackIntent
  clearManualBackIntent()
  return current
}

type RouterLike = {
  history: {
    back: () => void
  }
}

export function backWithHistory(router: RouterLike) {
  markManualBack()
  router.history.back()
}
