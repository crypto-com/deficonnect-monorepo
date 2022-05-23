import { NetworkConfig, IDeFiConnectSession, IJsonRpcRequest, IJsonRpcMessage } from '@deficonnect/types'
import { isJsonRpcRequest, uuid, payloadId, isJsonRpcResponseSuccess, isJsonRpcResponseError } from '@deficonnect/utils'
import { getWindowMetadata } from '@walletconnect/window-metadata'
import Emitter from 'events'

export interface RequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | object
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
  session?: IDeFiConnectSession

  constructor() {
    super()
    this.on('dc_sessionUpdate', (req) => {
      const session = this.session
      if(!isJsonRpcRequest(req)) {
        return
      }
      if(!session || !session.connected) {
        return
      }
      
      const sessionParam = req.params[0]
      if(!sessionParam.approved) {
        this.session = undefined
        this.emit('disconnect')
        return
      }
      if(sessionParam.chainId) {
        session.chainId = sessionParam.chainId
      }
      if(sessionParam.chainType) {
        session.chainType = sessionParam.chainType
      }
      if(sessionParam.accounts) {
        session.accounts = sessionParam.accounts
      }
      if(sessionParam.selectedWalletId) {
        session.selectedWalletId = sessionParam.selectedWalletId
      }
      if(sessionParam.wallets) {
        session.wallets = sessionParam.wallets
      }
      this.session = session
      this.emit('sessionUpdate')
    })
  }
  async connectEagerly(network?: NetworkConfig) {
    const requestSession = this.generateSession(network)
    return this.sessionInit(requestSession)
  }
  async connect(network?: NetworkConfig) {
    const requestSession = this.generateSession(network)
    return this.sessionRequest(requestSession)
  }
  async disconnect() {
    await this.sendIgnoreResponse({
      id: payloadId(),
      jsonrpc: '2.0',
      method: 'dc_sessionUpdate',
      params: [{
        approved: false,
        chainId: null,
        chainType: null,
        accounts: null,
        selectedWalletId: null,
        rpcUrl: '',
        wallets: [],
      }],
    })
    this.session = undefined
    this.emit('disconnect')
  }

  private generateSession(network?: NetworkConfig): IDeFiConnectSession {
    const { chainId = '', chainType = '' } = network || {}

    const clientId = uuid()
    const handshakeTopic = uuid()
    const handshakeId = payloadId()

    return {
      connected: false,
      accounts: [],
      chainId,
      chainType,
      bridge: '',
      key: '',
      clientId,
      clientMeta: getWindowMetadata(),
      peerId: handshakeTopic,
      peerMeta: null,
      handshakeId,
      handshakeTopic,
      selectedWalletId: '',
      wallets: [],
    }
  }

  private async sessionInit(session: IDeFiConnectSession) {
    try {
      const result = await this.send({
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'dc_sessionInit',
        params: [
          {
            peerId: session.clientId,
            peerMeta: session.clientMeta,
            chainId: session.chainId,
            chainType: session.chainType,
            accountTypes: ['eth', 'cro', 'tcro', 'cosmos'],
          },
        ],
      })
      if(result) {
        this.session = result
        this.emit('connect')
      }
      return result
    } catch (error) {
      this.session = undefined
      throw error
    }
  }
  
  private async sessionRequest(session: IDeFiConnectSession) {
    this.session = session
    this.emit('sessionRequest', session)
    try {
      const result = await this.send({
        id: session.handshakeId,
        jsonrpc: '2.0',
        method: 'dc_sessionRequest',
        params: [
          {
            peerId: session.clientId,
            peerMeta: session.clientMeta,
            chainId: session.chainId,
            chainType: session.chainType,
            accountTypes: ['eth', 'cro', 'tcro', 'cosmos'],
          },
        ],
      })
      if(result) {
        session.connected = true
        session.accounts = result.accounts
        session.chainId = result.chainId
        session.chainType = result.chainType
        session.peerId = result.peerId
        session.peerMeta = result.peerMeta
        session.selectedWalletId = result.selectedWalletId
        session.wallets = result.wallets
        this.session = session
        this.emit('connect')
      }
      return result
    } catch (error) {
      this.session = undefined
      throw error
    }
  }

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
      this.once(`response-${msg.id}`, (resp) => {
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
      session: {
        chainId: this.session?.chainId ?? '',
        chainType: this.session?.chainType ?? '',
        account: this.session?.accounts?.[0] ?? '',
      },
    }
    if(window.deficonnect && window.deficonnect.postMessage) {
      window.deficonnect.postMessage(requestPayload)
    } else {
      throw new ProviderRpcError(4100, 'provider is not ready')
    }
  }

  async handleJSONRequestEvent(payload: IJsonRpcMessage) {
    if (isJsonRpcRequest(payload)) {
      this.emit(payload.method, payload)
    } else if (
      isJsonRpcResponseSuccess(payload) ||
      isJsonRpcResponseError(payload)
    ) {
      this.emit(`response-${payload.id}`, payload)
    }
  }
}
