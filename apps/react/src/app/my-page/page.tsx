import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import momoProfile from '@/assets/images/momo-profile.png'
import HeartIcon from '@/assets/icons/heart.svg'
import ChatIcon from '@/assets/icons/chat.svg'
import LikeIcon from '@/assets/icons/like.svg'
import { BottomNavigation } from '@/shared/ui/bottom-navigation'
import { useAuth } from '@/features/auth'
import { calculateDDay } from '@/shared/utils/date'
import { useTerms, TermsContentModal } from '@/features/term'
import { TermsResponseDataTermsTypeEnum } from '@data/user-api-axios/api'

// 마이페이지에서 표시할 약관 타입들
const MY_PAGE_TERMS_TYPES: readonly TermsResponseDataTermsTypeEnum[] = [
  TermsResponseDataTermsTypeEnum.ServiceUsage,
  TermsResponseDataTermsTypeEnum.PrivacyPolicy,
]

export const Route = createFileRoute('/my-page/')({
  component: MyPageComponent,
})

enum MenuGroup {
  BASIC = 'basic',
  TERMS = 'terms',
}

interface MenuItem {
  label: string
  group: MenuGroup
  onClick: () => void
}

function MyPageComponent() {
  // 라우터 네비게이션
  const navigate = useNavigate()

  // 사용자 데이터
  const { userInfo } = useAuth()

  // D-day 계산
  const dDay = calculateDDay(userInfo.startLoveDate)

  // 약관 데이터
  const { terms, selectedTermId, selectedTermContent, handleShowTerms, handleCloseTerms } = useTerms()

  // 마이페이지에서 표시할 약관들만 타입으로 필터링
  const myPageTerms = terms.filter((term) => MY_PAGE_TERMS_TYPES.includes(term.type))

  // 전체 메뉴 아이템
  const menuItems: MenuItem[] = [
    // 기본 메뉴
    {
      label: '애착유형 검사하기',
      group: MenuGroup.BASIC,
      onClick: () => console.log('Navigate to /attachment-test'),
    },
    {
      label: '문의하기',
      group: MenuGroup.BASIC,
      onClick: () => console.log('Navigate to /contact'),
    },
    {
      label: '계정 관리',
      group: MenuGroup.BASIC,
      onClick: () => console.log('Navigate to /account'),
    },
    // 약관
    ...myPageTerms.map((term) => ({
      label: term.title,
      group: MenuGroup.TERMS,
      onClick: () => handleShowTerms(term.termsId),
    })),
  ]

  return (
    <div className="min-h-screen bg-white pb-[60px]">
      {/* 약관 모달 */}
      {selectedTermId !== null && selectedTermContent && (
        <TermsContentModal
          title={selectedTermContent.title || ''}
          content={selectedTermContent.content || ''}
          onClose={handleCloseTerms}
        />
      )}

      {/* 헤더 */}
      <header className="flex h-[60px] items-center px-5">
        <h1 className="heading2-bold text-gray-iron-950">마이페이지</h1>
      </header>

      {/* 프로필 섹션 */}
      <div className="pt-5">
        {/* 프로필 이미지 */}
        <div className="mx-[140px] flex justify-center">
          <img src={momoProfile} alt="프로필" className="h-24 w-24" />
        </div>

        {/* 닉네임 */}
        <div className="mt-3 flex justify-center">
          <div className="relative">
            <h2 className="heading1-bold text-center text-gray-iron-950">{userInfo.nickname || '사용자'}</h2>
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

      {/* 통계 박스 */}
      <div className="mt-5 px-5">
        <div className="rounded-xl bg-gray-neutral-100 px-5 py-4">
          <div className="relative flex items-center justify-center">
            {/* 가운데 세로 구분선 */}
            <div className="absolute left-1/2 h-[36px] w-px -translate-x-1/2 bg-gray-iron-300"></div>

            {/* 대화 통계 - 왼쪽 영역 */}
            <div className="flex w-1/2 flex-col items-center justify-center">
              <p className="body4-medium text-gray-iron-500">지금까지 모은 대화</p>
              <div className="mt-2 flex items-center">
                <ChatIcon className="h-6 w-6" />
                <span className="heading1-bold ml-1 text-gray-iron-950">{userInfo.totalChatRoomCount || 0}</span>
              </div>
            </div>

            {/* 마음 통계 - 오른쪽 영역 */}
            <div className="flex w-1/2 flex-col items-center justify-center">
              <p className="body4-medium text-gray-iron-500">지금까지 모은 마음</p>
              <div className="mt-2 flex items-center">
                <LikeIcon className="h-6 w-6" />
                <span className="heading1-bold ml-1 text-gray-iron-950">
                  {userInfo.totalCoupleQuestionCount ? userInfo.totalCoupleQuestionCount - 1 : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div className="mt-7">
        {menuItems.map((item, index) => {
          const prevItem = menuItems[index - 1]
          const isNewGroup = prevItem && prevItem.group !== item.group
          const needsDivider = index > 0 && prevItem?.group === item.group && item.group === 'basic'

          return (
            <div key={item.label}>
              {isNewGroup && <div className="h-[6px] bg-gray-neutral-50"></div>}
              {needsDivider && <hr className="mx-5 h-px border-0 bg-gray-iron-100" />}
              <div
                className="flex h-16 cursor-pointer items-center justify-between pr-6 pl-5 hover:bg-gray-50"
                onClick={item.onClick}
              >
                <span className="body1-medium text-gray-iron-950">{item.label}</span>
                <ChevronRight className="h-5 w-5 text-gray-iron-500" />
              </div>
            </div>
          )
        })}
      </div>
      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
}
