import { ConnectorClient, DEFI_CONNECT_PROTOCOL, DEFI_CONNECT_URL, DEFI_CONNECT_VERSION } from '@deficonnect/connector-client'
import { IDeFiConnectSession, NetworkConfig, IDeFiConnectProvider } from '@deficonnect/types'
import { payloadId, signingMethods } from '@deficonnect/utils'
import Emitter from 'events'

interface RequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | object
}

export class WebSocketProvider extends Emitter implements IDeFiConnectProvider {
  connectorClient: ConnectorClient
  networkConfig: NetworkConfig
  isDeficonnectProvider = true

  constructor(network: NetworkConfig) {
    super()
    this.networkConfig = network
    this.connectorClient = new ConnectorClient()
    this.connectorClient.on('connect', () => {
      this.emit('chainChanged', this.chainId)
      this.emit('accountsChanged', this.accounts)
    })
    this.connectorClient.on('disconnect', () => {
      this.emit('disconnect', { code: 4900, message: 'disconnect' })
      this.emit('chainChanged', this.chainId)
      this.emit('accountsChanged', this.accounts)
    })
    this.connectorClient.on('sessionUpdate', () => {
      this.emit('chainChanged', this.chainId)
      this.emit('accountsChanged', this.accounts)
    })
    this.connectorClient.on('sessionRequest', (session: IDeFiConnectSession) => {
      const uri = `${DEFI_CONNECT_PROTOCOL}:${session.handshakeTopic}@${DEFI_CONNECT_VERSION}?bridge=${DEFI_CONNECT_URL}&key=${session.key}`
      console.warn('TODO: on display qrcode', uri)
      alert(uri)
    })
  }
  get chainId() {
    return '0x' + Number(this.networkVersion).toString(16)
  }
  get networkVersion() {
    return this.connectorClient.getSession()?.chainId ?? '1'
  }
  get accounts() {
    const accounts = this.connectorClient.getSession()?.accounts ?? []
    return accounts.map((item) => item.toLocaleLowerCase())
  }

  async connectEagerly(network: NetworkConfig): Promise<string[]> {
    this.networkConfig = network
    if (this.accounts.length > 0) {
      return this.accounts
    }
    await this.connectorClient.connectEagerly()
    return this.accounts
  }

  async connect(network: NetworkConfig): Promise<string[]> {
    this.networkConfig = network
    if (this.accounts.length > 0) {
      return this.accounts
    }
    await this.connectorClient.connect(this.networkConfig)
    return this.accounts
  }

  async enable(network: NetworkConfig): Promise<string[]> {
    await this.connect(network)
    return this.accounts
  }
  async close(): Promise<void> {
    return this.connectorClient.disconnect()
  }

  get connected(): boolean {
    return this.accounts.length > 0
  }

  async sendRpcRequest(args: RequestArguments): Promise<any> {
    return this.connectorClient.send({
      id: payloadId(),
      jsonrpc: '2.0',
      method: args.method,
      params: args.params as any,
    })
  }

  async request(args: RequestArguments): Promise<unknown> {
    const method = args.method
    switch (method) {
      case 'eth_requestAccounts':
        await this.connect(this.networkConfig)
        return this.accounts
      case 'eth_chainId':
        await this.connectEagerly(this.networkConfig)
        return this.chainId
      case 'eth_accounts':
        await this.connectEagerly(this.networkConfig)
        return this.accounts
      case 'net_version':
        await this.connectEagerly(this.networkConfig)
        return this.connectorClient.getSession()?.chainId
    }
    if (signingMethods.includes(args.method)) {
      return this.sendRpcRequest(args)
    }
    return this.handleOtherRequests(args)
  }
  async handleOtherRequests(args: RequestArguments): Promise<unknown> {
    const chainType = this.connectorClient.getSession()?.chainType
    const chainId = this.chainId
    const rpcUrl = this.networkConfig.rpcUrls[chainId]
    if(chainType == 'eth' && rpcUrl) {
      const body = JSON.stringify({
        id: payloadId(),
        jsonrpc: '2.0',
        method: args.method,
        params: args.params,
      })
      const result = await fetch(rpcUrl, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body,
      }).then((res) => {
        return res.json()
      })
      return result
    }
    throw new Error(`can not resolve request: ${args}`)
  }
}
