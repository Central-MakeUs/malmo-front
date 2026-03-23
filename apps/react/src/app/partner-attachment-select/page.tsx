import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { ATTACHMENT_OPTIONS } from '@/features/attachment'
import { useAuth } from '@/features/auth'
import { TitleSection } from '@/features/onboarding/ui/title-section'
import { useUpdatePartnerProfileMutation } from '@/features/profile'
import { personalityFlowSearchSchema, usePersonalityFlow } from '@/features/profile/lib/personality-flow'
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
import { toast } from '@/shared/ui/toast'

import type { MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'

export const Route = createFileRoute('/partner-attachment-select/')({
  validateSearch: personalityFlowSearchSchema,
  component: PartnerAttachmentSelectPage,
})

function PartnerAttachmentSelectPage() {
  const { userInfo } = useAuth()
  const { flow, from, next } = usePersonalityFlow()
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState<MemberDataLoveTypeCategoryEnum | null>(
    ATTACHMENT_OPTIONS.find((o) => o.value === userInfo?.partnerLoveTypeCategory)?.value ?? null
  )
  const [isDontKnow, setIsDontKnow] = useState(userInfo?.partnerLoveTypeCategory === 'UNKNOWN')
  const [showDontKnowModal, setShowDontKnowModal] = useState(false)

  const partnerMutation = useUpdatePartnerProfileMutation({ errorMessage: '저장 중 오류가 발생했습니다' })

  const handleConfirm = () => {
    if ((!selectedType && !isDontKnow) || partnerMutation.isPending) return
    if (isDontKnow) {
      setShowDontKnowModal(true)
      return
    }
    partnerMutation.mutate(
      {
        loveTypeCategory: selectedType!,
      },
      {
        onSuccess: () => {
          if (from === 'profile') toast.success('상대 성향이 변경되었어요!')
          next()
        },
      }
    )
  }

  const handleDontKnow = () => {
    if (partnerMutation.isPending) return
    setSelectedType(null)
    setIsDontKnow(true)
  }

  const handleDontKnowConfirm = () => {
    partnerMutation.mutate(
      { loveTypeCategory: 'UNKNOWN' },
      {
        onSuccess: () => {
          if (flow === 'full-flow') {
            navigate({ to: '/partner-result-preview', search: { flow }, replace: true })
          } else if (from === 'profile') {
            toast.success('상대 성향이 변경되었어요!')
            next()
          } else {
            navigate({ to: '/', replace: true })
          }
        },
      }
    )
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay">
        <DetailHeaderBar center={getChatEntryProgressBar(flow === 'full-flow', 4)} />
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
              onClick={() => {
                setSelectedType(option.value)
                setIsDontKnow(false)
              }}
              disabled={partnerMutation.isPending}
              className="w-full text-left"
            >
              {option.label}
            </SelectableButton>
          ))}

          <SelectableButton
            onClick={handleDontKnow}
            disabled={partnerMutation.isPending}
            className="w-full text-left"
            selected={isDontKnow}
          >
            상대의 애착유형을 모르겠어요
          </SelectableButton>
        </div>

        <FixedBottom>
          <Button
            text="프로필 완성!"
            onClick={handleConfirm}
            disabled={(!selectedType && !isDontKnow) || partnerMutation.isPending}
          />
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
