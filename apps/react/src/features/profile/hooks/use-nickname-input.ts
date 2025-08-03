import { useState } from 'react'

// 닉네임 최대 길이 상수
export const NICKNAME_MAX_LENGTH = 10

interface UseNicknameInputProps {
  initialValue?: string
  onNicknameChange?: (nickname: string) => void
}

export function useNicknameInput({ initialValue = '', onNicknameChange }: UseNicknameInputProps = {}) {
  const [nickname, setNickname] = useState(initialValue)

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 특수문자와 공백 제거
    const filteredValue = e.target.value.replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ]/g, '')

    // 최대 길이 제한
    if (filteredValue.length <= NICKNAME_MAX_LENGTH) {
      setNickname(filteredValue)
      onNicknameChange?.(filteredValue)
    }
  }

  const isValidNickname = (name: string) => {
    // 특수문자, 띄어쓰기 검증 정규식
    const regex = /^[a-zA-Z0-9가-힣]+$/
    return regex.test(name)
  }

  const clearNickname = () => {
    setNickname('')
  }

  const isValid = nickname.trim().length > 0 && isValidNickname(nickname)

  return {
    nickname,
    setNickname,
    clearNickname,
    handleNicknameChange,
    isValid,
    maxLength: NICKNAME_MAX_LENGTH,
  }
}
