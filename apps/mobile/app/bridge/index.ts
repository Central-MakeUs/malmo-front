import { Bridge, bridge, postMessageSchema } from '@webview-bridge/react-native'
import * as WebBrowser from 'expo-web-browser'

import { z } from 'zod'
import * as v from 'valibot'

type BridgeStore = {
  showNative: boolean
  count: number
  data: { text: string }
}

type BridgeActions = {
  setShowNative(show: boolean): Promise<void>
  openInAppBrowser(url: string): Promise<void>
  getMessage(): Promise<"I'm from native">
  increase(): Promise<void>
  setDataText(text: string): Promise<void>
}

export type AppBridgeState = Bridge & BridgeStore & BridgeActions

export const appBridge = bridge<AppBridgeState>(({ set, get }) => {
  const actions: BridgeActions = {
    async setShowNative(show: boolean) {
      set({ showNative: show })
    },
    async openInAppBrowser(url) {
      await WebBrowser.openBrowserAsync(url, {})
    },
    async getMessage() {
      return "I'm from native" as const
    },
    async increase() {
      set({ count: get().count + 1 })
    },
    async setDataText(text) {
      set({ data: { text } })
    },
  }

  return {
    showNative: true,
    count: 0,
    data: { text: '' },
    ...actions,
  }
})

export const appSchema = postMessageSchema({
  setWebMessage_zod: {
    validate: (value) => {
      return z.object({ message: z.string() }).parse(value)
    },
  },
  setWebMessage_valibot: {
    validate: (value) => {
      return v.parse(v.object({ message: v.string() }), value)
    },
  },
  setDataText: {
    validate: (value) => {
      return z.object({ text: z.string() }).parse(value)
    },
  },
  openInAppBrowser: {
    validate: (value) => {
      return z.object({ url: z.string().url() }).parse(value)
    },
  },
  setDataText_valibot: {
    validate: (value) => {
      return v.parse(v.object({ text: v.string() }), value)
    },
  },
})

export type AppBridge = typeof appBridge
export type AppPostMessageSchema = typeof appSchema
