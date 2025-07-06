import { createFileRoute } from '@tanstack/react-router'
import AppleLogo from '@/assets/icons/apple-logo.svg'
import KakaoLogo from '@/assets/icons/kakao-logo.svg'
import malmoLogo from '@/assets/images/malmo-logo.png'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      {/* 로고 영역 */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-5">
        <div className="w-full">
          <div className="flex justify-center">
            <img src={malmoLogo} alt="말모 로고" className="h-auto w-[160px]" />
          </div>
        </div>
      </div>

      <div className="w-full px-5 pb-[calc(32px+env(safe-area-inset-bottom,0px))]">
        {/* 카카오 로그인 버튼 */}
        <button className="mb-3 flex h-[52px] w-full items-center justify-center rounded-[8px] bg-[#FEE500]">
          <KakaoLogo className="mr-2" width={24} height={24} />
          <span className="body1-semibold text-[#16181D]">카카오로 시작하기</span>
        </button>

        {/* 애플 로그인 버튼 */}
        <button className="flex h-[52px] w-full items-center justify-center rounded-[8px] bg-black text-white">
          <AppleLogo className="mr-2" width={24} height={24} />
          <span className="body1-semibold text-[#FFFFFF]">Apple로 시작하기</span>
        </button>
      </div>
    </div>
  )
}
