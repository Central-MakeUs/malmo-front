import { ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import momoProfile from '@/assets/images/momo-profile.png'
import HeartIcon from '@/assets/icons/heart.svg'

interface ProfileSectionProps {
  nickname: string
  dDay: number
}

export function ProfileSection({ nickname, dDay }: ProfileSectionProps) {
  const navigate = useNavigate()

  const handleProfileClick = () => {
    navigate({ to: '/my-page/profile' })
  }

  return (
    <div className="pt-5">
      {/* 프로필 이미지 */}
      <div className="mx-[140px] flex justify-center">
        <img src={momoProfile} alt="프로필" className="h-24 w-24" />
      </div>

      {/* 닉네임 */}
      <div className="mt-3 flex justify-center">
        <div className="relative cursor-pointer" onClick={handleProfileClick}>
          <h2 className="heading1-bold text-center text-gray-iron-950">{nickname || '사용자'}</h2>
          <ChevronRight
            className="absolute top-1/2 ml-1 h-6 w-6 -translate-y-1/2 text-gray-iron-700"
            style={{ left: 'calc(100% + 4px)' }}
          />
        </div>
      </div>

      {/* 연인과 D-day */}
      <div className="mt-[18px] flex h-8 justify-center">
        <div className="flex items-center rounded-[30px] border border-gray-iron-200 px-4">
          <span className="body2-semibold text-gray-iron-950">연인과</span>
          <HeartIcon className="mx-[9px] h-4 w-4" />
          <span className="body2-semibold text-gray-iron-950">D+{dDay}</span>
        </div>
      </div>
    </div>
  )
}
