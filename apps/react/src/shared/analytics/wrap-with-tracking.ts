import { trackButtonClick } from './amplitude'

import type { ButtonName, Category } from './constants'

// 고정 버튼 이름용 오버로드
export function wrapWithTracking<T extends any[]>(
  buttonName: ButtonName,
  category: Category,
  handler?: (...args: T) => void
): (...args: T) => void

// 동적 버튼 이름용 오버로드
export function wrapWithTracking<T extends any[]>(
  buttonNameResolver: (...args: T) => ButtonName | undefined,
  category: Category,
  handler?: (...args: T) => void
): (...args: T) => void

// 구현
export function wrapWithTracking<T extends any[]>(
  buttonNameOrResolver: ButtonName | ((...args: T) => ButtonName | undefined),
  category: Category,
  handler?: (...args: T) => void
) {
  return (...args: T) => {
    const buttonName = typeof buttonNameOrResolver === 'function' ? buttonNameOrResolver(...args) : buttonNameOrResolver

    if (buttonName) {
      trackButtonClick(buttonName, category)
    }

    handler?.(...args)
  }
}
