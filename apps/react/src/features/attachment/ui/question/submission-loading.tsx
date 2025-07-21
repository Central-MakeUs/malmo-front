import Note from '@/assets/icons/note.svg'

interface SubmissionLoadingProps {
  nickname?: string
}

export function SubmissionLoading({ nickname = '베리' }: SubmissionLoadingProps) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white px-[20px]">
      <Note className="h-[236px] w-[320px]" />
      <div className="mt-[24px] text-center">
        <h1 className="heading1-bold text-gray-iron-950">
          곧 <span className="text-malmo-rasberry-500">{nickname}</span>님의 결과를 보여드릴게요
        </h1>
        <p className="body2-medium mt-[4px] text-gray-iron-500">조금만 기다려주세요!</p>
      </div>
    </div>
  )
}
