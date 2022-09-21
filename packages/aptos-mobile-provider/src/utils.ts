import { IJsonRpcRequest, IJsonRpcMessage, IJsonRpcResponseSuccess, IJsonRpcResponseError, IJsonRpcResponse } from '@deficonnect/types'

export function isJsonRpcRequest(object: any): object is IJsonRpcRequest {
  return object &&
    typeof object.method !== 'undefined' &&
    typeof object.id !== 'undefined' &&
    typeof object.jsonrpc !== 'undefined'
}

export function isJsonRpcResponseSuccess(object: any): object is IJsonRpcResponseSuccess {
  return object &&
    typeof object.result !== 'undefined' &&
    typeof object.id !== 'undefined' &&
    typeof object.jsonrpc !== 'undefined'
}

export function isJsonRpcResponseError(object: any): object is IJsonRpcResponseError {
  return object &&
    typeof object.error !== 'undefined' &&
    typeof object.id !== 'undefined' &&
    typeof object.jsonrpc !== 'undefined'
}

export function isJsonRpcResponse(object: any): object is IJsonRpcResponse {
  return isJsonRpcResponseSuccess(object) || isJsonRpcResponseError(object)
}

export function isJsonRpcMessage(object: any): object is IJsonRpcMessage {
  return isJsonRpcRequest(object) || isJsonRpcResponse(object)
}

export function payloadId(): number {
  const date = Date.now() * Math.pow(10, 3)
  const extra = Math.floor(Math.random() * Math.pow(10, 3))
  return date + extra
}
