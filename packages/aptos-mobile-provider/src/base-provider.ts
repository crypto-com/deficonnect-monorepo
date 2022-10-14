import Emitter from 'events'
import { ConnectorClient } from './connect-client'
import type { MaybeHexString } from 'aptos'
import type { TransactionPayload, AccountSignature } from 'aptos/src/generated'

interface IAccount {
  publicKey: MaybeHexString | undefined
  address: MaybeHexString | undefined
}

interface AptosNetworkConfig {
  name: string
  chainType: 'aptos'
  chainId: string
  rpcUrl: string
  symbol: string
  explorer?: string
}

interface IResponse {
  hash: string
  sender?: string
  sequence_number?: string
  max_gas_amount?: string
  gas_unit_price?: string
  expiration_timestamp_secs?: string
  payload?: TransactionPayload
  signature?: AccountSignature
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

  constructor() {
    super()
    this.connectorClient = new ConnectorClient()
  }

  async account(): Promise<MaybeHexString> {
    return this.connectorClient.sendRequest({ method: 'aptos_account' })
  }

  async connect(network?: AptosNetworkConfig): Promise<IAccount> {
    return this.connectorClient.sendRequest({
      method: 'aptos_connect',
      params: [
        {
          network,
        },
      ],
    })
  }

  async isConnected(): Promise<boolean> {
    return this.connectorClient.sendRequest({ method: 'aptos_isConnected' })
  }

  async signAndSubmitTransaction(
    transaction: TransactionPayload,
    options?: any,
  ) {
    return this.connectorClient.sendRequest({
      method: 'aptos_signAndSubmitTransaction',
      params: [
        {
            transaction,
            options,
        },
      ],
    })
  }

  async signTransaction(transaction: TransactionPayload, options?: any): Promise<IResponse> {
    return this.connectorClient.sendRequest({
      method: 'aptos_signTransaction',
      params: [
        {
            transaction,
            options,
        },
      ],
    })
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
    return this.connectorClient.sendRequest({ method: 'aptos_disconnect' })
  }

  setResponse(response: any) {
    const payload = {
      ...response,
      jsonrpc: '2.0',
    }
    this.connectorClient.handleJSONRequestEvent(payload)
  }
}
