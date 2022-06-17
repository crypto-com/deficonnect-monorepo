import * as queryStringUtils from 'query-string'
import { IParseURIResult } from '@deficonnect/types'
import { parseWalletConnectUri } from './session'

export function getQueryString(url: string): string {
  const pathEnd: number | undefined = url.indexOf('?') !== -1 ? url.indexOf('?') : undefined

  const queryString: string = typeof pathEnd !== 'undefined' ? url.substr(pathEnd) : ''

  return queryString
}

export function appendToQueryString(queryString: string, newQueryParams: any): string {
  let queryParams = parseQueryString(queryString)

  queryParams = { ...queryParams, ...newQueryParams }

  queryString = formatQueryString(queryParams)

  return queryString
}

export function parseQueryString(queryString: string): any {
  return queryStringUtils.parse(queryString)
}

export function formatQueryString(queryParams: any): string {
  return queryStringUtils.stringify(queryParams)
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

// export const formatUriAddUrlParams = (uri: string, params: any): string => {
//   const result: IParseURIResult = parseWalletConnectUri(uri)
//   const bridge = encodeURIComponent(addUrlParams(decodeURIComponent(result.bridge), params))
//   return `${result.protocol}:${result.handshakeTopic}@${result.version}?bridge=${bridge}&key=${result.key}`
// }

export const replaceUriProtocol = (uri: string, protocol: string): string => {
  const result: IParseURIResult = parseWalletConnectUri(uri)
  const bridge = encodeURIComponent(removeAllUrlParams(decodeURIComponent(result.bridge)))
  return `${protocol}:${result.handshakeTopic}@${result.version}?bridge=${bridge}&key=${result.key}`
}

export const formatToCWEURI = (uri: string): string => {
  return replaceUriProtocol(uri, 'CWE')
}

// export const formatToWCURI = (uri: string): string => {
//   return replaceUriProtocol(uri, 'wc')
// }

// export const limitWords = (txt: string, length = 20): string => {
//   let str = txt
//   str = str.substr(0, length) + (str.length > length ? '...' : '')
//   return str
// }
