import * as cryptoLib from '@walletconnect/iso-crypto'
import type { IDeFiConnectSession, IJsonRpcRequest, NetworkConfig, ISocketMessage, WSMessage } from '@deficonnect/types'
import {
  convertHexToArrayBuffer,
  isJsonRpcRequest,
  isJsonRpcResponseError,
  isJsonRpcResponseSuccess,
  isWSMessage,
  uuid,
  safeJsonParse,
  signingMethods,
  convertArrayBufferToHex,
  payloadId,
} from '@deficonnect/utils'
import Emitter from 'events'
import { WebSocketClient } from './websocket-client'

export const DEFI_CONNECT_URL = 'wss://wallet-connect.crypto.com/api/v2/ncwconnect/relay/ws'
export const DEFI_CONNECT_PROTOCOL = 'dc'
export const DEFI_CONNECT_VERSION = 3

export class ConnectorClient extends Emitter {
  socketTransport?: WebSocketClient
  constructor() {
    super()
    const id: string = localStorage.getItem('deficonnect-device-id') ?? uuid()
    this.socketTransport = new WebSocketClient(id)
    this.on('dc_sessionUpdate', (req) => {
      const session = this.getSession()
      if(!isJsonRpcRequest(req)) {
        return
      }
      if(!session || !session.connected) {
        return
      }
      
      const sessionParam = req.params[0]
      if(!sessionParam.approved) {
        this.deleteSession()
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
      this.setSession(session)
      this.emit('sessionUpdate')
    })
  }

  async decodeJSONRequest(wsMessage: WSMessage) {
    const sessItem = await this.getSession()
    if (!sessItem) {
      return
    }
    const keyString = sessItem.key
    if (!keyString) {
      return
    }
    const key = convertHexToArrayBuffer(keyString)
    const json = safeJsonParse(wsMessage.payload)
    if(!json) {
      return
    }
    return cryptoLib.decrypt(json, key)
  }

  getDeviceId(): string {
    let deviceId = localStorage.getItem('deficonnect-device-id') ?? ''
    if(!deviceId) {
      deviceId = uuid()
      localStorage.setItem('deficonnect-device-id', deviceId)
    }
    return deviceId
  }

  async stop() {
    this.socketTransport?.close()
    this.socketTransport = undefined
  }
  async connectEagerly(network: NetworkConfig) {
    const session = this.getSession()
    if(session && session.connected) {
      return this.sessionRequest(session)
    } else {
      return this.connect(network)
    }
  }
  async connect(network: NetworkConfig) {
    const { chainId, chainType } = network
    const keyBuffer = await cryptoLib.generateKey()
    const key = convertArrayBufferToHex(keyBuffer, true)

    const clientId = uuid()
    const handshakeTopic = uuid()
    const handshakeId = payloadId()

    const session: IDeFiConnectSession = {
      connected: false,
      accounts: [],
      chainId,
      chainType,
      bridge: DEFI_CONNECT_URL,
      key,
      clientId,
      clientMeta: null,
      peerId: '',
      peerMeta: null,
      handshakeId,
      handshakeTopic,
      selectedWalletId: '',
      wallets: [],
    }
    return this.sessionRequest(session)
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
    this.deleteSession()
  }
  async sessionRequest(session: IDeFiConnectSession) {
    this.setSession(session)
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
      if(session) {
        session.connected = true
        session.chainId = result.chainId
        session.chainType = result.chainType
        session.peerId = result.peerId
        session.peerMeta = result.peerMeta
        session.selectedWalletId = result.selectedWalletId
        session.wallets = result.wallets
        this.setSession(session)
        this.emit('connect')
      }
      return result
    } catch (error) {
      this.deleteSession()
      throw error
    }
  }
  getSession() {
    return safeJsonParse(localStorage.getItem('deficonnect-session')) as IDeFiConnectSession | null
  }
  setSession(session: IDeFiConnectSession) {
    localStorage.setItem('deficonnect-session', JSON.stringify(session))
  }
  deleteSession() {
    localStorage.removeItem('deficonnect-session')
  }

  async start() {
    if (this.socketTransport) {
      return
    }
    this.socketTransport = new WebSocketClient(this.getDeviceId())
    this.socketTransport.on('message', (socketMessage: ISocketMessage) =>
      this.handleJSONRequestEvent(socketMessage as any),
    )
    this.socketTransport.open()
    const session = this.getSession()
    if (session) {
      this.socketTransport.subscribe(session.clientId)
    }
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
    await this.start()
    const session = this.getSession()

    if (!session) {
      console.warn('can not find session', msg)
      throw new Error(`send request failed: ${msg.method}`)
    }

    const keyBuffer = convertHexToArrayBuffer(session.key)
    const encryptBeforePayload = {
      ...msg,
      session: {
        chainId: session?.chainId ?? '',
        chainType: session?.chainType ?? '',
        account: session?.accounts?.[0] ?? '',
      },
    }
    const payload = await cryptoLib.encrypt(encryptBeforePayload, keyBuffer)

    const rpcReq: IJsonRpcRequest | undefined = isJsonRpcRequest(msg)
      ? msg
      : undefined
    const silent = !signingMethods.includes(rpcReq?.method ?? '')
    const rpcMethod = rpcReq?.method ?? ''
    this.socketTransport?.send({
      type: 'pub',
      payload: JSON.stringify(payload),
      rpc_id: msg.id,
      rpc_method: rpcMethod,
      silent,
      topic: session.peerId,
    })
  }

  async sendRaw(msg: any) {
    await this.start()
    this.socketTransport?.send(msg)
  }

  private async handleJSONRequestEvent(wsMessage: any) {
    if (!isWSMessage(wsMessage)) {
      return
    }
    const payload = await this.decodeJSONRequest(wsMessage)
    if (!payload) {
      return
    }

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
