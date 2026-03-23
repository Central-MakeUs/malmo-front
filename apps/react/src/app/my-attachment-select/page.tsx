import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { ATTACHMENT_OPTIONS } from '@/features/attachment'
import { useAuth } from '@/features/auth'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useMemberUpdateMutation } from '@/features/profile'
import { personalityFlowSearchSchema, usePersonalityFlow } from '@/features/profile/lib/personality-flow'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import { FixedBottom } from '@/shared/ui/fixed-bottom'
import { getChatEntryProgressBar } from '@/shared/ui/flow-progress-bar'
import { getPersonalityStepDots } from '@/shared/ui/flow-step-dots'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { KeyMessageBanner } from '@/shared/ui/key-message-banner'
import { SelectableButton } from '@/shared/ui/selectable-button'
import { toast } from '@/shared/ui/toast'

import type { MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'

export const Route = createFileRoute('/my-attachment-select/')({
  validateSearch: personalityFlowSearchSchema,
  component: MyAttachmentSelectPage,
})

function MyAttachmentSelectPage() {
  const navigate = useNavigate()
  const { userInfo } = useAuth()
  const { flow, from, next } = usePersonalityFlow()
  const [selectedType, setSelectedType] = useState<MemberDataLoveTypeCategoryEnum | null>(
    userInfo?.loveTypeCategory ?? null
  )

  const updateMutation = useMemberUpdateMutation({
    onSuccess: () => {
      if (from === 'profile') toast.success('내 성향이 변경되었어요!')
      next()
    },
    errorMessage: '저장 중 오류가 발생했습니다',
  })

  const handleConfirm = () => {
    if (!selectedType || updateMutation.isPending) return
    updateMutation.mutate({ loveTypeCategory: selectedType })
  }

  const handleDontKnow = () => {
    navigate({ to: '/attachment-test', search: { flow, from } })
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar center={getChatEntryProgressBar(flow === 'full-flow', 2)} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        {getPersonalityStepDots(flow === 'my-personality', 2)}
        <TitleSection
          title={
            <>
              나의 애착유형을
              <br />
              선택해주세요
            </>
          }
        />
        <div className="mt-4 px-5">
          <KeyMessageBanner title="내 애착유형을 모른다면? 테스트 GO" onClick={handleDontKnow} />
        </div>

        <div className="mt-10 flex flex-col gap-3 px-5">
          <div className="mt-3 flex flex-col gap-3">
            {ATTACHMENT_OPTIONS.map((option) => (
              <SelectableButton
                key={option.value}
                selected={selectedType === option.value}
                onClick={() => setSelectedType(option.value)}
                disabled={updateMutation.isPending}
                className="w-full text-left"
              >
                {option.label}
              </SelectableButton>
            ))}
          </div>
        </div>

        <FixedBottom>
          <Button text="프로필 완성!" onClick={handleConfirm} disabled={!selectedType || updateMutation.isPending} />
        </FixedBottom>
      </Screen.Content>
    </Screen>
  )
}
