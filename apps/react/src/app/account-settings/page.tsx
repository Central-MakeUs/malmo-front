import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account-settings/')({
  component: AccountSettingsComponent,
})

function AccountSettingsComponent() {
  return <div>내 정보 수정</div>
}
