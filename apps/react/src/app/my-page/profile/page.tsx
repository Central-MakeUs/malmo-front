import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Badge } from '@/shared/ui/badge'
import { DetailHeaderBar } from '@/shared/components/header-bar'
import { usePartnerInfo } from '@/features/member'

export const Route = createFileRoute('/my-page/profile/')({
  component: ProfileEditComponent,
})

interface MenuItemProps {
  label: string
  onClick: () => void
  rightElement?: React.ReactNode
}

function MenuItem({ label, onClick, rightElement }: MenuItemProps) {
  return (
    <div className="flex h-16 cursor-pointer items-center justify-between px-5 hover:bg-gray-50" onClick={onClick}>
      <span className="body1-medium text-gray-iron-950">{label}</span>
      <div className="flex items-center">{rightElement}</div>
    </div>
  )
}

function ProfileEditComponent() {
  const navigate = useNavigate()

  // 커플 연동 상태 확인
  const { data: partnerInfo, isError, error } = usePartnerInfo()
  const isCoupleConnected = !isError && !!partnerInfo

  const menuItems = [
    {
      label: '닉네임 변경',
      onClick: () => console.log('닉네임 변경'),
    },
    {
      label: '디데이 변경',
      onClick: () => console.log('디데이 변경'),
    },
    {
      label: '커플 연동 관리',
      onClick: () => console.log('커플 연동 관리'),
      rightElement: (
        <Badge
          className={isCoupleConnected ? 'bg-malmo-rasberry-25 text-malmo-rasberry-500' : 'bg-gray-100 text-gray-600'}
        >
          {isCoupleConnected ? '연동 중' : '연동 필요'}
        </Badge>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <DetailHeaderBar title="내 정보" onBackClick={() => navigate({ to: '/my-page' })} />

      {/* 메뉴 리스트 */}
      <div className="mt-0">
        {menuItems.map((item, index) => (
          <div key={item.label}>
            {index > 0 && <hr className="h-px border-0 bg-gray-iron-100" />}
            <MenuItem label={item.label} onClick={item.onClick} rightElement={item.rightElement} />
          </div>
        ))}
      </div>
    </div>
  )
}
