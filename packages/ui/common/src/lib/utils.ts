import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const ctwMerge = extendTailwindMerge({
  extend: {
    theme: {
      font: ['suit'],
      text: [
        'display-00',
        'display-01',
        'display-02',
        'title-01',
        'header-01',
        'header-02',
        'body-01',
        'body-02',
        'body-03',
        'caption-01',
        'caption-02',
      ],
      animate: ['up', 'down'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return ctwMerge(clsx(inputs))
}
