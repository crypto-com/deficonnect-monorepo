import type { IDeFiConnectProvider, IDeFiConnectSessionAddresses, IJsonRpcMessage, NetworkConfig } from '@deficonnect/types'
import { isJsonRpcResponseError, isJsonRpcResponseSuccess, payloadId, signingMethods } from '@deficonnect/utils'
import Emitter from 'events'
import { ConnectorClient, ProviderRpcError, RequestArguments } from './connect-client'

export class DeFiConnectProvider extends Emitter implements IDeFiConnectProvider {
  connectorClient: ConnectorClient
  networkConfig?: NetworkConfig
  isDeficonnectProvider = true

  constructor() {
    super()
    this.connectorClient = new ConnectorClient()
    this.connectorClient.on('connect', () => {
      this.emit('chainChanged', this.chainId)
      this.emit('accountsChanged', this.accounts)
    })
    this.on('disconnect', () => {
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
    if (this.chainType === 'eth') {
      return '0x' + Number(this.networkVersion).toString(16)
    } else {
      return this.connectorClient.session?.chainId ?? ''
    }
  }
  get networkVersion() {
    return this.connectorClient.session?.chainId ?? '1'
  }
  get accounts() {
    const accounts = this.connectorClient.session?.accounts ?? []
    return accounts.map((item) => item.toLocaleLowerCase())
  }
  get chainType() {
    return this.connectorClient.session?.chainType ?? 'eth'
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
      case 'wallet_getAllAccounts':
        await this.connectEagerly(this.networkConfig)
        return this.wallet_getAllAccounts()
      case 'net_version':
        await this.connectEagerly()
        return this.connectorClient.session?.chainId
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
      return this.connectorClient.sendRequest({
        method: args.method,
        params: args.params as any,
      })
    }
    return this.handleOtherRequests(args)
  }

  private async handleOtherRequests(args: RequestArguments): Promise<unknown> {
    const chainType = this.connectorClient.session?.chainType
    const chainId = this.networkVersion
    const rpcUrl = this.networkConfig?.rpcUrls[chainId]
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
  
  sendRpcMessage(payload: IJsonRpcMessage) {
    this.connectorClient.handleJSONRequestEvent(payload)
  }

  private async wallet_getAllAccounts(): Promise<IDeFiConnectSessionAddresses> {
    const session = this.connectorClient.session
    const wallet = session?.wallets.find(
      (w) => w.id === session?.selectedWalletId,
    )
    if (!wallet) {
      throw new Error('can not find address for special chainId')
    }
    return wallet.addresses
  }
}

declare global {
  interface Window {
    ethereum?: any
    deficonnect?: any
    deficonnectProvider?: any
  }
}

window.deficonnect = {
  Provider: DeFiConnectProvider,
  postMessage: null,
}
window.deficonnectProvider = new DeFiConnectProvider()
