import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'

import { ATTACHMENT_OPTIONS } from '@/features/attachment'
import { useAuth } from '@/features/auth'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { personalityFlowSearchSchema } from '@/features/profile/lib/personality-flow'
import { Screen } from '@/shared/layout/screen'
import memberService from '@/shared/services/member.service'
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
import { getChatEntryProgressBar } from '@/shared/ui/flow-progress-bar'
import { getPersonalityStepDots } from '@/shared/ui/flow-step-dots'
import { DetailHeaderBar } from '@/shared/ui/header-bar'
import { SelectableButton } from '@/shared/ui/selectable-button'
import { toast } from '@/shared/ui/toast'

import type { MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'

export const Route = createFileRoute('/partner-attachment-select/')({
  validateSearch: personalityFlowSearchSchema,
  component: PartnerAttachmentSelectPage,
})

function PartnerAttachmentSelectPage() {
  const navigate = useNavigate()
  const { flow, chatId } = useSearch({ from: Route.id })
  const { refreshUserInfo } = useAuth()
  const [showDontKnowModal, setShowDontKnowModal] = useState(false)

  const updateMutation = useMutation({
    mutationFn: async (type: MemberDataLoveTypeCategoryEnum | null) => {
      const { data } = await memberService.updateMember({
        updateMemberRequestDto: { otherLoveTypeCategory: type },
      })
      return data
    },
    onSuccess: async (_data, type) => {
      await refreshUserInfo()
      navigateToNextAfterSelect(type !== null)
    },
    onError: () => {
      toast.error('저장 중 오류가 발생했습니다')
    },
  })

  const navigateToNextAfterSelect = (hasData: boolean) => {
    if (flow === 'partner-personality') {
      navigate({ to: '/attachment-test/result/partner' })
    } else if (flow === 'chat-entry') {
      if (hasData) {
        navigate({ to: '/partner-result-preview', search: { flow, chatId } })
      } else {
        navigate({ to: '/chat', search: { chatId }, replace: true })
      }
    } else {
      navigate({ to: '/attachment-test/result/partner' })
    }
  }

  const handleSelect = (type: MemberDataLoveTypeCategoryEnum) => {
    if (updateMutation.isPending) return
    updateMutation.mutate(type)
  }

  const handleDontKnow = () => {
    if (updateMutation.isPending) return
    setShowDontKnowModal(true)
  }

  const handleDontKnowConfirm = () => {
    updateMutation.mutate(null)
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

        <div className="mt-auto mb-5 px-5 pb-[var(--safe-bottom)]">
          <Button text="건너뛰기" type="secondary" onClick={() => navigateToNextAfterSelect(false)} />
        </div>
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
