import React, { useRef } from 'react'
import { Text, Button, SafeAreaView, TextInput, View, StyleSheet, StatusBar, ScrollView } from 'react-native'
import { createWebView, useBridge, type BridgeWebView } from '@webview-bridge/react-native'
import { appBridge, appSchema } from './bridge'

export const { WebView, postMessage } = createWebView({
  bridge: appBridge,
  postMessageSchema: appSchema,
  debug: true,
  fallback: (method) => {
    console.warn(`Method '${method}' not found in native`)
  },
})

export default function App() {
  const webviewRef = useRef<BridgeWebView>(null)

  const { count, data, increase, setDataText, showNative, setShowNative } = useBridge(appBridge)

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={{ height: showNative ? '33%' : 0 }}>
        <ScrollView contentContainerStyle={styles.nativeContentContainer}>
          <Text style={styles.headerTitle}>React Native UI</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Native → Web: 메시지 보내기</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Set Web Message (zod)"
                onPress={() => postMessage('setWebMessage_zod', { message: 'zod !' })}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Set Web Message (valibot)"
                onPress={() => postMessage('setWebMessage_valibot', { message: 'valibot !' })}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>공유 상태 관리</Text>

            <View style={styles.stateItem}>
              <Text style={styles.stateLabel}>
                Webview Count: <Text style={styles.stateValue}>{count}</Text>
              </Text>
              <Button onPress={increase} title="Increase From Native" />
            </View>

            <View style={styles.stateItem}>
              <Text style={styles.stateLabel}>
                Webview Data Text: <Text style={styles.stateValue}>{data.text}</Text>
              </Text>
              <TextInput
                value={data.text}
                onChangeText={setDataText}
                style={styles.input}
                placeholder="여기에 입력하세요..."
              />
            </View>
          </View>

          <View style={styles.card}>
            <Button onPress={() => setShowNative(false)} title="Close Native UI" />
          </View>
        </ScrollView>
      </View>

      {/* 2. WebView 영역 */}
      <View style={styles.webviewContainer}>
        <WebView ref={webviewRef} source={{ uri: 'http://localhost:3001' }} style={styles.webview} />
      </View>
    </SafeAreaView>
  )
}

// --- 스타일시트 ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  nativeContentContainer: {
    padding: 16,
  },
  nativeContainer: {
    height: '33%',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1A202C',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // 그림자 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // 그림자 (Android)
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2D3748',
  },
  buttonContainer: {
    marginVertical: 4,
  },
  stateItem: {
    marginVertical: 10,
  },
  stateLabel: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
  },
  stateValue: {
    fontWeight: 'bold',
    color: '#2B6CB0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F7FAFC',
  },
  webviewContainer: {
    flex: 2,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  webview: {
    height: '100%',
    width: '100%',
  },
})
