import { IParseURIResult } from '@walletconnect/types'
import { appendToQueryString, getQueryString, parseWalletConnectUri } from '@walletconnect/utils'

export const formatToCWEURI = (uri: string) => {
  const result: IParseURIResult = parseWalletConnectUri(uri)
  const bridge = encodeURIComponent(removeAllUrlParams(decodeURIComponent(result.bridge)))
  return `CWE:${result.handshakeTopic}@${result.version}?bridge=${bridge}&key=${result.key}`
}

export const formatToWCURI = (uri: string) => {
  const result: IParseURIResult = parseWalletConnectUri(uri)
  return `wc:${result.handshakeTopic}@${result.version}?bridge=${result.bridge}&key=${result.key}`
}

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
