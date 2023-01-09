import { IJsonRpcRequest, IJsonRpcMessage } from '@deficonnect/types'
import {
  isJsonRpcRequest,
  payloadId,
  isJsonRpcResponseSuccess,
  isJsonRpcResponseError,
} from './utils'
import Emitter from 'events'

export interface RequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | Record<string, unknown>
}

export class ProviderRpcError extends Error {
  code: number
  message: string
  constructor(code: number, message: string) {
    super()
    this.code = code
    this.message = message
  }

  toString() {
    return `${this.message} (${this.code})`
  }
}

export class ConnectorClient extends Emitter {
  async sendRequest(args: RequestArguments): Promise<any> {
    return this.send({
      id: payloadId(),
      jsonrpc: '2.0',
      method: args.method,
      params: args.params as any,
    })
  }

  async send(msg: IJsonRpcRequest): Promise<any> {
    await this.sendIgnoreResponse(msg)
    return new Promise((resolve, reject) => {
      this.once(`response-${msg.id}`, resp => {
        if (isJsonRpcResponseSuccess(resp)) {
          resolve(resp.result)
        } else if (isJsonRpcResponseError(resp)) {
          reject(resp.error)
        } else {
          reject(new Error('can not parse the response'))
        }
      })
    })
  }

  async sendIgnoreResponse(msg: IJsonRpcRequest): Promise<any> {
    const requestPayload = {
      ...msg,
    }
    if (window.deficonnect && window.deficonnect.postMessage) {
      window.deficonnect.postMessage(requestPayload)
    } else {
      throw new ProviderRpcError(4100, 'provider is not ready')
    }
  }

  async handleJSONRequestEvent(payload: IJsonRpcMessage) {
    if (isJsonRpcRequest(payload)) {
      this.emit(payload.method, payload)
    } else if (isJsonRpcResponseSuccess(payload) || isJsonRpcResponseError(payload)) {
      this.emit(`response-${payload.id}`, payload)
    }
  }

  setResponse(response: any) {
    const payload = {
      ...response,
      jsonrpc: '2.0',
    }
    this.handleJSONRequestEvent(payload)
  }
}

export default new ConnectorClient()
