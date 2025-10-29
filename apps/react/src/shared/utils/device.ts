export function isAndroid() {
  if (typeof navigator === 'undefined') return false
  return /Android/i.test(navigator.userAgent)
}
