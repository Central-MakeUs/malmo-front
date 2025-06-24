import { Bridge, bridge, postMessageSchema } from '@webview-bridge/react-native'
import * as WebBrowser from 'expo-web-browser'

import { z } from 'zod'
import * as v from 'valibot'

interface AppBridgeState extends Bridge {
  openInAppBrowser(url: string): Promise<void>
  getMessage(): Promise<"I'm from native">
  count: number
  increase(): Promise<void>
  data: {
    text: string
  }
  setDataText(text: string): Promise<void>
}

export const appBridge = bridge<AppBridgeState>(({ get, set }) => ({
  async getMessage() {
    return "I'm from native" as const
  },
  async openInAppBrowser(url: string) {
    await WebBrowser.openBrowserAsync(url, {})
  },
  data: {
    text: '',
  },
  count: 0,
  async increase() {
    set({
      count: get().count + 1,
    })
  },
  async setDataText(text) {
    set({
      data: {
        text,
      },
    })
  },
}))

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
