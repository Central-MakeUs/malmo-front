import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { NicknameEditSheet, useProfileEdit } from '@/features/profile'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

export const Route = createFileRoute('/my-page/profile/')({
  component: ProfileEditPage,
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

function ProfileEditPage() {
  const navigate = useNavigate()
  const profileEdit = useProfileEdit()

  const menuItems = [
    {
      label: '닉네임 변경',
      onClick: wrapWithTracking(BUTTON_NAMES.OPEN_NICKNAME_SHEET, CATEGORIES.PROFILE, () =>
        profileEdit.openNicknameSheet()
      ),
    },
  ]

  return (
    <div className="h-full bg-white">
      {/* 헤더 */}
      <DetailHeaderBar title="내 정보" onBackClick={() => navigate({ to: '/my-page' })} />

      {/* 메뉴 리스트 */}
      <div className="mt-0">
        {menuItems.map((item, index) => (
          <div key={item.label}>
            {index > 0 && <hr className="h-px border-0 bg-gray-iron-100" />}
            <MenuItem label={item.label} onClick={item.onClick} />
          </div>
        ))}
      </div>

      {/* 바텀시트 */}
      <NicknameEditSheet
        isOpen={profileEdit.isNicknameSheetOpen}
        onOpenChange={profileEdit.setNicknameSheetOpen}
        onSave={wrapWithTracking(BUTTON_NAMES.SAVE_NICKNAME, CATEGORIES.PROFILE)}
      />
    </div>
  )
}
