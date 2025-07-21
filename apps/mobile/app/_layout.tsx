import { Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { initializeKakaoSDK } from '@react-native-kakao/core'

export default function RootLayout() {
  useEffect(() => {
    const initKakao = async () => {
      try {
        await initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY || '')
      } catch (error) {
        console.error('카카오 SDK 초기화 실패:', error)
      }
    }

    initKakao()
  }, [])

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}
