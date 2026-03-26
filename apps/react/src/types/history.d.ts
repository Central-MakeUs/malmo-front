declare module '@tanstack/history' {
  interface HistoryState {
    skipTransition?: boolean
    forceDirection?: 'back' | 'forward'
  }
}
