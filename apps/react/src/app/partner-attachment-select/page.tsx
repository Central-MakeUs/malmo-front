import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useRef, useState } from 'react'

import { ATTACHMENT_OPTIONS } from '@/features/attachment'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useUpdatePartnerProfileMutation } from '@/features/profile'
import { navigateAfterPartnerAttachment, personalityFlowSearchSchema } from '@/features/profile/lib/personality-flow'
import { Screen } from '@/shared/layout/screen'
import { Button } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'
import { FixedBottom } from '@/shared/ui/fixed-bottom'
import { getChatEntryProgressBar } from '@/shared/ui/flow-progress-bar'
import { getPersonalityStepDots } from '@/shared/ui/flow-step-dots'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { SelectableButton } from '@/shared/ui/selectable-button'

import type { MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'

export const Route = createFileRoute('/partner-attachment-select/')({
  validateSearch: personalityFlowSearchSchema,
  component: PartnerAttachmentSelectPage,
})

function PartnerAttachmentSelectPage() {
  const navigate = useNavigate()
  const { flow, chatId } = useSearch({ from: Route.id })
  const [selectedType, setSelectedType] = useState<MemberDataLoveTypeCategoryEnum | null>(null)
  const [showDontKnowModal, setShowDontKnowModal] = useState(false)
  const pendingHasDataRef = useRef(false)

  const updateMutation = useUpdatePartnerProfileMutation({
    onSuccess: () => navigateAfterPartnerAttachment(navigate, flow, chatId, pendingHasDataRef.current),
    errorMessage: '저장 중 오류가 발생했습니다',
  })

  const handleConfirm = () => {
    if (!selectedType || updateMutation.isPending) return
    pendingHasDataRef.current = true
    updateMutation.mutate({ loveTypeCategory: selectedType })
  }

  const handleDontKnow = () => {
    if (updateMutation.isPending) return
    setShowDontKnowModal(true)
  }

  const handleDontKnowConfirm = () => {
    pendingHasDataRef.current = false
    updateMutation.mutate({ loveTypeCategoryProvided: false })
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar center={getChatEntryProgressBar(flow === 'chat-entry', 5)} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col bg-white">
        {getPersonalityStepDots(flow === 'partner-personality', 2)}
        <TitleSection
          title={
            <>
              상대의 애착유형을
              <br />
              선택해주세요
            </>
          }
        />

        <div className="mt-[68px] flex flex-col gap-3 px-5">
          {ATTACHMENT_OPTIONS.map((option) => (
            <SelectableButton
              key={option.value}
              selected={selectedType === option.value}
              onClick={() => setSelectedType(option.value)}
              disabled={updateMutation.isPending}
              className="w-full py-5 text-left"
            >
              {option.label}
            </SelectableButton>
          ))}

          <SelectableButton
            onClick={handleDontKnow}
            disabled={updateMutation.isPending}
            className="body2-medium w-full rounded-[10px] border border-gray-neutral-300 py-5 text-left text-gray-iron-500 transition-all"
            selected={false}
          >
            상대의 애착유형을 모르겠어요
          </SelectableButton>
        </div>

        <FixedBottom>
          <Button text="프로필 완성!" onClick={handleConfirm} disabled={!selectedType || updateMutation.isPending} />
        </FixedBottom>
      </Screen.Content>

      <AlertDialog open={showDontKnowModal} onOpenChange={setShowDontKnowModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>앗! 상대 정보는 AI가 추측할게요</AlertDialogTitle>
            <AlertDialogDescription>
              상담에서 상대 정보를 자세히 입력할수록
              <br />
              정확한 추측이 가능해요
              <br />
              <br />
              *성향 결과지는 상담 1회 진행 후 보여드려요
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>돌아가기</AlertDialogCancel>
            <AlertDialogAction onClick={handleDontKnowConfirm}>완료하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Screen>
  )
}
