import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useRef, useState } from 'react'

import { ATTACHMENT_OPTIONS } from '@/features/attachment'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useMemberUpdateMutation } from '@/features/profile'
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
  const [showDontKnowModal, setShowDontKnowModal] = useState(false)
  const pendingHasDataRef = useRef(false)

  const updateMutation = useMemberUpdateMutation({
    onSuccess: () => navigateAfterPartnerAttachment(navigate, flow, chatId, pendingHasDataRef.current),
    errorMessage: '저장 중 오류가 발생했습니다',
  })

  const handleSelect = (type: MemberDataLoveTypeCategoryEnum) => {
    if (updateMutation.isPending) return
    pendingHasDataRef.current = true
    updateMutation.mutate({ otherLoveTypeCategory: type })
  }

  const handleDontKnow = () => {
    if (updateMutation.isPending) return
    setShowDontKnowModal(true)
  }

  const handleDontKnowConfirm = () => {
    pendingHasDataRef.current = false
    updateMutation.mutate({ otherLoveTypeCategory: null })
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
              상대의 성향이
              <br />
              무엇인가요?
            </>
          }
        />

        <div className="mt-[68px] flex flex-col gap-3 px-5">
          {ATTACHMENT_OPTIONS.map((option) => (
            <SelectableButton
              key={option.value}
              selected={false}
              onClick={() => handleSelect(option.value)}
              disabled={updateMutation.isPending}
              className="w-full"
            >
              {option.label}
            </SelectableButton>
          ))}

          {flow !== 'partner-personality' && (
            <button
              onClick={handleDontKnow}
              disabled={updateMutation.isPending}
              className="body2-medium w-full rounded-[10px] border border-gray-neutral-300 py-4 text-center text-gray-iron-500 transition-all"
            >
              상대의 애착유형을 모르겠어요
            </button>
          )}
        </div>

        <FixedBottom>
          <Button
            text="건너뛰기"
            type="secondary"
            onClick={() => {
              pendingHasDataRef.current = false
              navigateAfterPartnerAttachment(navigate, flow, chatId, false)
            }}
          />
        </FixedBottom>
      </Screen.Content>

      <AlertDialog open={showDontKnowModal} onOpenChange={setShowDontKnowModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>상대의 성향을 모르시나요?</AlertDialogTitle>
            <AlertDialogDescription>
              상대의 성향을 모르는 경우 AI가 대화 중 상대의 성향을 분석할 예정이에요
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDontKnowConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Screen>
  )
}
