/* eslint-disable require-atomic-updates */
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
import { getWindowMetadata } from '@walletconnect/window-metadata'

export const DEFI_CONNECT_URL = 'wss://wallet-connect.crypto.com/api/v2/ncwconnect/relay/ws'
export const DEFI_CONNECT_PROTOCOL = 'dc'
export const DEFI_CONNECT_VERSION = 3

interface ConnectorClientArgs {
  dappName: string
}

export class ConnectorClient extends Emitter {
  socketTransport?: WebSocketClient
  args: ConnectorClientArgs
  constructor(args: ConnectorClientArgs) {
    super()
    this.args = args
    this.on('dc_sessionUpdate', (req) => {
      const session = this.getSession()
      if (!isJsonRpcRequest(req)) {
        return
      }
      if (!session || !session.connected) {
        return
      }

      const sessionParam = req.params[0]
      if (!sessionParam.approved) {
        this.deleteSession()
        this.emit('disconnect')
        return
      }
      if (sessionParam.chainId) {
        session.chainId = sessionParam.chainId
      }
      if (sessionParam.chainType) {
        session.chainType = sessionParam.chainType
      }
      if (sessionParam.accounts) {
        session.accounts = sessionParam.accounts
      }
      if (sessionParam.selectedWalletId) {
        session.selectedWalletId = sessionParam.selectedWalletId
      }
      if (sessionParam.wallets) {
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
    if (!json) {
      return
    }
    return cryptoLib.decrypt(json, key)
  }

  getDeviceId(): string {
    let deviceId = localStorage.getItem('deficonnect-device-id') ?? ''
    if (!deviceId) {
      deviceId = uuid()
      localStorage.setItem('deficonnect-device-id', deviceId)
    }
    return deviceId
  }

  async stop() {
    if (this.socketTransport?.close) {
      this.socketTransport.close()
    }
    this.socketTransport = undefined
  }

  async connectEagerly() {
    const session = this.getSession()
    if (session && session.connected) {
      this.subscribe(session.clientId)
      return session
    }
    return undefined
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
      clientMeta: getWindowMetadata(),
      peerId: handshakeTopic,
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
    this.emit('disconnect')
  }

  async sessionRequest(session: IDeFiConnectSession) {
    this.setSession(session)
    this.emit('sessionRequest', session)
    try {
      await this.subscribe(session.clientId)
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
      if (result) {
        session.connected = true
        session.accounts = result.accounts
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
    this.socketTransport = new WebSocketClient(this.getDeviceId(), this.args.dappName)
    this.socketTransport.open()
    const session = this.getSession()
    if (session) {
      this.socketTransport.subscribe(session.clientId)
    }
    this.socketTransport.on('message', (socketMessage: ISocketMessage) => {
      this.handleJSONRequestEvent(socketMessage as any)
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
    await this.start()
    const session = this.getSession()

    if (!session) {
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
    if (this.socketTransport?.send) {
      this.socketTransport.send({
        type: 'pub',
        payload: JSON.stringify(payload),
        rpc_id: msg.id,
        rpc_method: rpcMethod,
        silent,
        topic: session.peerId,
        from: 'dapp',
        name: session.clientMeta?.name,
      })
    }
  }

  async subscribe(topic: string) {
    await this.start()
    if (this.socketTransport?.subscribe) {
      this.socketTransport.subscribe(topic)
    }
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
