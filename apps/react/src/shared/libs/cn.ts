import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  // 클래스 문자열 병합 + Tailwind 유틸 충돌 정리
  return twMerge(clsx(inputs))
}
