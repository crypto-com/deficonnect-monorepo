import Emitter from 'events'
import { ConnectorClient } from './connect-client'
import { MaybeHexString, Types, BCS } from 'aptos'
import { NetworkConfig } from '@deficonnect/types'

interface IAccount {
  publicKey: MaybeHexString | undefined
  address: MaybeHexString | undefined
}
interface SignMessageResponse {
  address: string
  application: string
  chainId: number
  fullMessage: string // The message that was generated to sign
  message: string // The message passed in by the user
  nonce: string
  prefix: string // Should always be APTOS
  signature: string // The signed full message
}

interface SignMessagePayload {
  address?: boolean // Should we include the address of the account in the message
  application?: boolean // Should we include the domain of the dapp
  chainId?: boolean // Should we include the current chain id the wallet is connected to
  message: string // The message to be signed and displayed to the user
  nonce: string // A nonce the dapp should generate
}

export class DeFiConnectBaseProvider extends Emitter {
  connectorClient: ConnectorClient
  isDeficonnectProvider = true
  connected: boolean
  constructor() {
    super()
    this.connectorClient = new ConnectorClient()
    this.connected = false
  }

  async account(): Promise<IAccount> {
    return this.connectorClient.sendRequest({ method: 'aptos_account' })
  }

  async network(): Promise<string> {
    return this.connectorClient.sendRequest({ method: 'aptos_network' })
  }

  async connect(network?: NetworkConfig): Promise<IAccount> {
    try {
      const res = await this.connectorClient.sendRequest({
        method: 'aptos_connect',
        params: [
          {
            network,
          },
        ],
      })
      this.connected = true
      return res
    } catch (error) {
      this.connected = false
      throw error
    }
  }

  async isConnected(): Promise<boolean> {
    return Promise.resolve(this.connected)
  }

  async signMessage(msgPayload: SignMessagePayload): Promise<SignMessageResponse> {
    return this.connectorClient.sendRequest({
      method: 'aptos_signMessage',
      params: [
        {
          transaction: msgPayload,
        },
      ],
    })
  }

  async disconnect(): Promise<void> {
    this.connected = false
    return this.connectorClient.sendRequest({ method: 'aptos_disconnect' })
  }

  async getAccount(address: MaybeHexString): Promise<Types.AccountData> {
    return this.connectorClient.sendRequest({
      method: 'aptos_getAccount',
      params: [
        {
          address,
        },
      ],
    })
  }

  async getChainId(): Promise<number> {
    return this.connectorClient.sendRequest({ method: 'aptos_getChainId' })
  }

  async getLedgerInfo(): Promise<Types.IndexResponse> {
    return this.connectorClient.sendRequest({ method: 'aptos_getLedgerInfo' })
  }

  async getTransactions(query?: {
    start?: number // The start transaction version of the page. Default is the latest ledger version
    limit?: number
  }): Promise<Types.Transaction[]> {
    return this.connectorClient.sendRequest({
      method: 'aptos_getTransactions',
      params: [
        {
          query,
        },
      ],
    })
  }

  async getTransactionByHash(txnHash: string): Promise<Types.Transaction> {
    return this.connectorClient.sendRequest({
      method: 'aptos_getTransactionByHash',
      params: [
        {
          txnHash,
        },
      ],
    })
  }

  async getAccountTransactions(
    address: MaybeHexString,
    query?: {
      start?: number
      limit?: number
    },
  ): Promise<Types.Transaction[]> {
    return this.connectorClient.sendRequest({
      method: 'aptos_getAccountTransactions',
      params: [{ address, query }],
    })
  }

  async getAccountResources(
    address: MaybeHexString,
    query?: {
      start?: number
      limit?: number
    },
  ): Promise<Types.MoveResource[]> {
    return this.connectorClient.sendRequest({
      method: 'aptos_getAccountResources',
      params: [{ address, query }],
    })
  }

  async createCollection(name: string, description: string, url: string): Promise<string> {
    return this.connectorClient.sendRequest({
      method: 'aptos_createCollection',
      params: [{ name, description, url }],
    }) // The hash of the transaction submitted to the API
  }

  async createToken(
    collectionName: string,
    name: string,
    description: string,
    supply: number,
    url: string,
    max?: BCS.AnyNumber,
    royalty_payee_address?: MaybeHexString,
    royalty_points_denominator?: number,
    royalty_points_numerator?: number,
    property_keys?: string[],
    property_values?: string[],
    property_types?: string[],
  ): Promise<string> {
    return this.connectorClient.sendRequest({
      method: 'aptos_createCollection',
      params: [
        {
          collectionName,
          name,
          description,
          supply,
          url,
          max,
          royalty_payee_address,
          royalty_points_denominator,
          royalty_points_numerator,
          property_keys,
          property_values,
          property_types,
        },
      ],
    }) // The hash of the transaction submitted to the API
  }

  setResponse(response: any) {
    const payload = {
      ...response,
      jsonrpc: '2.0',
    }
    this.connectorClient.handleJSONRequestEvent(payload)
  }

  mobileDisconnect() {
    this.connected = false
    this.connectorClient.emit('mobileDisconnect')
  }

  updateAccount() {
    this.connectorClient.emit('updateAccount')
  }

  updateNetwork() {
    this.connectorClient.emit('updateNetwork')
  }

  onAccountChange(listener: (...args: any[]) => void) {
    this.connectorClient.on('updateAccount', async () => {
      const account = await this.account()
      listener(account)
    })
  }

  onNetworkChange(listener: (...args: any[]) => void) {
    this.connectorClient.on('updateNetwork', async () => {
      const network = await this.network()
      listener(network)
    })
  }

  onDisconnect(listener: (...args: any[]) => void) {
    this.connectorClient.on('mobileDisconnect', async () => {
      listener()
    })
  }
}
