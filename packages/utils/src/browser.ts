import {
  detect,
  BrowserInfo,
  BotInfo,
  NodeInfo,
  SearchBotDeviceInfo,
  ReactNativeInfo,
} from 'detect-browser'
import * as windowGetters from '@walletconnect/window-getters'

export function detectEnv(
  userAgent?: string,
): BrowserInfo | BotInfo | NodeInfo | SearchBotDeviceInfo | ReactNativeInfo | null {
  return detect(userAgent)
}

export function detectOS() {
  const env = detectEnv()
  return env && env.os ? env.os : undefined
}

export function isAndroid(): boolean {
  const os = detectOS()
  return os ? os.toLowerCase().includes('android') : false
}

export function isIOS(): boolean {
  const os = detectOS()
  return os
    ? os.toLowerCase().includes('ios') ||
        (os.toLowerCase().includes('mac') && navigator.maxTouchPoints > 1)
    : false
}

export function isMobile(): boolean {
  const os = detectOS()
  return os ? isAndroid() || isIOS() : false
}

export function isNode(): boolean {
  const env = detectEnv()
  const result = env && env.name ? env.name.toLowerCase() === 'node' : false
  return result
}

export const getLocalStorage = windowGetters.getLocalStorage
