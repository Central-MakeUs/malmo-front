import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

import onboardingEndImage from '@/assets/images/onboarding-end-2.png'
import bridge from '@/shared/bridge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'

const UPDATE_DATE = new Date('2026-03-26T00:00:00')
const SHOW_DURATION_DAYS = 7

function isWithinShowPeriod(): boolean {
  const now = new Date()
  const expiresAt = new Date(UPDATE_DATE)
  expiresAt.setDate(expiresAt.getDate() + SHOW_DURATION_DAYS)
  return now >= UPDATE_DATE && now < expiresAt
}

export function PersonalityRenewalModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isWithinShowPeriod()) return

    const fetchSeen = async () => {
      const seen = await bridge.getPersonalityRenewalModalSeen()
      setOpen(!seen)
    }

    fetchSeen()
  }, [])

  const handleClose = () => {
    bridge.setPersonalityRenewalModalSeen?.()
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={undefined}>
      <AlertDialogContent>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center text-gray-iron-400"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex justify-center">
          <img src={onboardingEndImage} alt="" className="h-[165px] w-[184px]" />
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle>성향 테스트가 리뉴얼되었어요</AlertDialogTitle>
          <AlertDialogDescription>
            MBTI와 애착유형을 결합해
            <br />
            더욱 공감되는 연애 성향을 알려 드릴게요
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>기대돼요!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
