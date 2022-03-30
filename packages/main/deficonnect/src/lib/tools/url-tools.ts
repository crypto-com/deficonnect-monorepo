import { IParseURIResult } from '@deficonnect/types'
import { appendToQueryString, getQueryString, parseWalletConnectUri } from '@deficonnect/utils'

export const removeAllUrlParams = (url: string): string => {
  if (!url || url.length === 0) {
    return url
  }
  const splitUrl = url.split('?')
  return splitUrl[0]
}

export const addUrlParams = (url: string, params: any): string => {
  if (!url || url.length === 0) {
    return url
  }
  const splitUrl = url.split('?')
  const queryString = appendToQueryString('?' + getQueryString(splitUrl[1] || ''), params)
  return splitUrl[0] + '?' + queryString
}

export const formatUriAddUrlParams = (uri: string, params: any): string => {
  const result: IParseURIResult = parseWalletConnectUri(uri)
  const bridge = encodeURIComponent(addUrlParams(decodeURIComponent(result.bridge), params))
  return `${result.protocol}:${result.handshakeTopic}@${result.version}?bridge=${bridge}&key=${result.key}`
}

export const replaceUriProtocol = (uri: string, protocol: string): string => {
  const result: IParseURIResult = parseWalletConnectUri(uri)
  const bridge = encodeURIComponent(removeAllUrlParams(decodeURIComponent(result.bridge)))
  return `${protocol}:${result.handshakeTopic}@${result.version}?bridge=${bridge}&key=${result.key}`
}

export const formatToCWEURI = (uri: string): string => {
  return replaceUriProtocol(uri, 'CWE')
}

export const formatToWCURI = (uri: string): string => {
  return replaceUriProtocol(uri, 'wc')
}

export const limitWords = (txt: string, length = 20): string => {
  let str = txt
  str = str.substr(0, length) + (str.length > length ? '...' : '')
  return str
}
