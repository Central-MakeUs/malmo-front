import Lottie from 'lottie-react'

import noteAnimation from '@/assets/lottie/note.json'

interface SubmissionLoadingProps {
  nickname?: string
}

export function SubmissionLoading({ nickname = '사용자' }: SubmissionLoadingProps) {
  return (
    <div className="-mt-[30px] flex h-full w-full flex-col items-center justify-center bg-white px-[20px]">
      <Lottie animationData={noteAnimation} className="h-[236px] w-[320px]" />
      <div className="mt-[24px] text-center">
        <h1 className="heading1-bold break-keep text-gray-iron-950">
          곧 <span className="text-malmo-rasberry-500">{nickname}</span>님의 결과를 보여드릴게요
        </h1>
        <p className="body2-medium mt-[4px] text-gray-iron-500">조금만 기다려주세요!</p>
      </div>
    </div>
  )
}
