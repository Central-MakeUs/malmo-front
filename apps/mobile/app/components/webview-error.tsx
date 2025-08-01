import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface WebViewErrorProps {
  onRetry: () => void
}

export function WebViewError({ onRetry }: WebViewErrorProps) {
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

      {/* 버튼 */}
      <TouchableOpacity style={styles.button} onPress={onRetry}>
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
    marginBottom: 40,
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
