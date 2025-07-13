import { PlusCircle } from 'lucide-react'

function ChatInput() {
  return (
    <div className="sticky bottom-0 flex w-full items-center gap-2 bg-white px-5 py-[10px]">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-[12px] border border-gray-200 bg-white px-2 py-[2px] shadow-[1px_2px_12px_0px_#00000014]">
        <p className="text-label-1 font-medium text-gray-500">0/500자</p>
      </div>
      <PlusCircle />
      <input
        className="flex-1 rounded-[42px] border border-gray-300 px-3 py-[13px]"
        placeholder="메시지를 입력해주세요"
      />
    </div>
  )
}

export default ChatInput
