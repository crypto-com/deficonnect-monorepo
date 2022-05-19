import Emitter from 'events'

interface RequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | object
}

export class WebSocketProvider extends Emitter {
  connectorClient: ConnectorClient
  networkConfig?: NetworkConfig
  isDeFiConnector = true

  constructor() {
    super()
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
    this.connectorClient.on('update', () => {
      this.emit('chainChanged', this.chainId)
      this.emit('accountsChanged', this.accounts)
    })
  }
  get chainId() {
    return '0x' + Number(this.networkVersion).toString(16)
  }
  get networkVersion() {
    return this.connectorClient.session?.chainId ?? '1'
  }
  get accounts() {
    const accounts = this.connectorClient.session?.accounts ?? []
    return accounts.map((item) => item.toLocaleLowerCase())
  }

  async connectEagerly(network?: NetworkConfig): Promise<string[]> {
    if (this.accounts.length > 0) {
      return this.accounts
    }
    if (network) {
      this.networkConfig = network
    }
    return this.connectorClient.connectEagerly(this.networkConfig)
  }

  async connect(network?: NetworkConfig): Promise<string[]> {
    if (this.accounts.length > 0) {
      return this.accounts
    }
    if (network) {
      this.networkConfig = network
    }
    return this.connectorClient.connect(this.networkConfig)
  }

  async enable(): Promise<string[]> {
    return this.connect()
  }
  async close(): Promise<void> {
    return this.connectorClient.disconnect()
  }

  get connected(): boolean {
    return this.accounts.length > 0
  }

  async request(args: RequestArguments): Promise<unknown> {
    const method = args.method
    switch (method) {
      case 'eth_requestAccounts':
        await this.connect()
        return this.accounts
      case 'eth_chainId':
        await this.connectEagerly()
        return this.chainId
      case 'eth_accounts':
        await this.connectEagerly()
        return this.accounts
      case 'net_version':
        await this.connectEagerly()
        return this.connectorClient.session?.chainId
    }
    if (dappUIRequestMethods.includes(args.method)) {
      return this.connectorClient.rpcClient.sendRequest({
        method: args.method,
        params: args.params as any,
      })
    }
    if (method.startsWith('cosmos_')) {
      return this.connectorClient.rpcClient.sendRequest({
        method: 'cosmos_proxyJsonRpcRequest',
        params: [args],
      })
    } else {
      return this.connectorClient.rpcClient.sendRequest({
        method: 'eth_proxyJsonRpcRequest',
        params: [args],
      })
    }
  }
}
