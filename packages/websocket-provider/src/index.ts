import { ConnectorClient, DEFI_CONNECT_URL, DEFI_CONNECT_VERSION } from '@deficonnect/connector-client'
import { IDeFiConnectSession, NetworkConfig, IDeFiConnectProvider, IDeFiConnectSessionAddresses, IDeFiConnectSessionAddress } from '@deficonnect/types'
import { isJsonRpcResponseError, isJsonRpcResponseSuccess, payloadId, signingMethods } from '@deficonnect/utils'
import Emitter from 'events'

interface RequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | object
}

class ProviderRpcError extends Error {
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

export class WebSocketProvider extends Emitter implements IDeFiConnectProvider {
  connectorClient: ConnectorClient
  networkConfig: NetworkConfig
  isDeficonnectProvider = true

  constructor(network: NetworkConfig) {
    super()
    this.networkConfig = network
    this.connectorClient = new ConnectorClient({ dappName: network.appName })
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
      const uri = `CWE:${session.handshakeTopic}@${DEFI_CONNECT_VERSION}?bridge=${DEFI_CONNECT_URL}&key=${session.key}&role=extension`
      console.warn('TODO: on display qrcode', uri)
      alert(uri)
    })
  }
  get chainId() {
    if(this.chainType === 'eth') {
      return '0x' + Number(this.networkVersion).toString(16)
    } else {
      return this.connectorClient.getSession()?.chainId ?? ''
    }
  }
  get networkVersion() {
    return this.connectorClient.getSession()?.chainId ?? '1'
  }
  get accounts() {
    const accounts = this.connectorClient.getSession()?.accounts ?? []
    return accounts.map((item) => item.toLocaleLowerCase())
  }
  get chainType() {
    return this.connectorClient.getSession()?.chainType ?? 'eth'
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
    if(this.connected) {
      return this.connectorClient.disconnect()
    } else {
      this.connectorClient.deleteSession()
    }
  }

  get connected(): boolean {
    return this.accounts.length > 0
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
      case 'cosmos_getAccounts':
        await this.connectEagerly(this.networkConfig)
        return this.cosmos_getAccounts()
      case 'wallet_getAllAccounts':
        await this.connectEagerly(this.networkConfig)
        return this.wallet_getAllAccounts()
      case 'net_version':
        await this.connectEagerly(this.networkConfig)
        return this.connectorClient.getSession()?.chainId
      case 'eth_newFilter':
      case 'eth_newBlockFilter':
      case 'eth_newPendingTransactionFilter':
      case 'eth_uninstallFilter':
      case 'eth_subscribe':
        throw new ProviderRpcError(
          4200,
          `not support calling ${method}. Please use your own solution`,
        )
    }
    if (signingMethods.includes(args.method)) {
      return this.sendRpcRequest(args)
    }
    return this.handleOtherRequests(args)
  }

  private async sendRpcRequest(args: RequestArguments): Promise<any> {
    return this.connectorClient.send({
      id: payloadId(),
      jsonrpc: '2.0',
      method: args.method,
      params: args.params as any,
    })
  }
  
  private async handleOtherRequests(args: RequestArguments): Promise<unknown> {
    const chainType = this.connectorClient.getSession()?.chainType
    const chainId = this.networkVersion
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
      }).then((resp) => {
        if (isJsonRpcResponseSuccess(resp)) {
          return resp.result
        } else if (isJsonRpcResponseError(resp)) {
          throw resp.error
        } else {
          throw new ProviderRpcError(
            -32000,
            `can not parse the response for request ${args.method}.`,
          )
        }
      })
      return result
    }
    throw new ProviderRpcError(
      4200,
      `not support calling ${args.method} for current network: ${chainId}`,
    )
  }
  private async cosmos_getAccounts(): Promise<IDeFiConnectSessionAddress> {
    const session = this.connectorClient.getSession()
    const wallet = session?.wallets.find(w => w.id === session?.selectedWalletId)
    if(!wallet) {
      throw new Error('can not find address for special chainId')
    }
    const result = Object.entries(wallet.addresses).find(([, value]) => {
      return this.accounts.includes(value.address)
    })
    if(!result) {
      throw new Error('can not find address for special chainId')
    }
    return result[1]
  }
  private async wallet_getAllAccounts(): Promise<IDeFiConnectSessionAddresses> {
    const session = this.connectorClient.getSession()
    const wallet = session?.wallets.find(w => w.id === session?.selectedWalletId)
    if(!wallet) {
      throw new Error('can not find address for special chainId')
    }
    return wallet.addresses
  }
  
}
