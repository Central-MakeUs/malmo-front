import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const ctwMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [],
      font: ['suit'],
      animate: ['up', 'down'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return ctwMerge(clsx(inputs))
}
