import { bridge, postMessageSchema } from '@webview-bridge/react-native'
import * as WebBrowser from 'expo-web-browser'

import { z } from 'zod'
import * as v from 'valibot'

export const appBridge = bridge({
  async getMessage() {
    return "I'm from native" as const
  },
  async openInAppBrowser(url: string) {
    console.log('openInAppBrowser', url)
    await WebBrowser.openBrowserAsync(url, {})
  },
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
})

export type AppBridge = typeof appBridge
export type AppPostMessageSchema = typeof appSchema
