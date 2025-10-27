import React, { useCallback, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface WebViewErrorProps {
  onRetry: () => void
  errorDescription?: string
  errorCode?: number | string
  errorDomain?: string
}

export function WebViewError({ onRetry, errorDescription, errorCode, errorDomain }: WebViewErrorProps) {
  const [showDevDetails, setShowDevDetails] = useState(false)

  const userFacingMessage = useMemo(() => {
    if (errorDescription && errorDescription.trim().length > 0) {
      return errorDescription
    }
    if (errorCode) {
      return `오류 코드 ${errorCode}가 발생했습니다. 잠시 후 다시 시도해 주세요.`
    }
    return '네트워크 연결을 확인하거나 잠시 후 다시 시도해 주세요.'
  }, [errorDescription, errorCode])

  const handleShowDevDetails = useCallback(() => {
    setShowDevDetails(true)
  }, [])

  return (
    <View style={styles.container}>
      {/* 경고 아이콘 */}
      <View style={styles.imageContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.triangleIcon}>
            <Text style={styles.exclamationMark}>!</Text>
          </View>
        </View>
      </View>

      {/* 제목 */}
      <Text style={styles.title}>일시적인 오류가 발생했어요</Text>

      {/* 설명 */}
      <Text style={styles.description}>잠시 후에 다시 시도해 주세요!</Text>

      <View style={styles.userDetailBox}>
        <Text style={styles.userDetailText}>{userFacingMessage}</Text>
      </View>

      {showDevDetails && (
        <View style={styles.devDetailBox}>
          <Text style={styles.devDetailTitle}>개발자 정보</Text>
          <Text style={styles.devDetailText}>Domain: {errorDomain ?? '-'}</Text>
          <Text style={styles.devDetailText}>Code: {errorCode ?? '-'}</Text>
          <Text style={styles.devDetailText}>Description: {errorDescription ?? '-'}</Text>
        </View>
      )}

      {/* 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={onRetry}
        onLongPress={handleShowDevDetails}
        delayLongPress={5000}
      >
        <Text style={styles.buttonText}>홈으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangleIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#6B7280',
  },
  exclamationMark: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#18181B',
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  detailButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 16,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  userDetailBox: {
    maxWidth: 320,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  userDetailText: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
  },
  devDetailBox: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  devDetailTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FBBF24',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  devDetailText: {
    fontSize: 12,
    color: '#E5E7EB',
    lineHeight: 18,
  },
  button: {
    width: 300,
    height: 54,
    backgroundColor: '#6B7280',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
})
