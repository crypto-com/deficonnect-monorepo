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

  async disconnect(): Promise<void> {
    return this.connectorClient.sendRequest({ method: 'aptos_disconnect' })
  }

  setResponse(responseString: string) {
    const response = JSON.parse(responseString)
    const payload = {
      ...response,
      jsonrpc: '2.0',
    }
    this.connectorClient.handleJSONRequestEvent(payload)
  }
}
