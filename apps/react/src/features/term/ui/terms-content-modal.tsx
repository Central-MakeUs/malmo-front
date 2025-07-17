import { ChevronLeft } from 'lucide-react'

interface TermsContentModalProps {
  title: string
  content: string
  onClose: () => void
}

export function TermsContentModal({ title, content, onClose }: TermsContentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex h-[50px] items-center border-b border-gray-200 px-5">
        <button onClick={onClose} className="flex h-7 w-7 items-center justify-center">
          <ChevronLeft className="h-7 w-7 text-gray-iron-950" />
        </button>
        <h2 className="ml-3 text-base font-bold">{title}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
}
