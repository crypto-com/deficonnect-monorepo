import type { IJsonRpcMessage } from '@deficonnect/types'
import Emitter from 'events'
import { ConnectorClient } from './connect-client'
import type { MaybeHexString } from 'aptos'
import type { TransactionPayload } from 'aptos/src/generated'

interface IAccount {
  publicKey: MaybeHexString | undefined
  address: MaybeHexString | undefined
}

export class DeFiConnectAptosProvider extends Emitter {
  connectorClient: ConnectorClient
  isDeficonnectProvider = true

  constructor() {
    super()
    this.connectorClient = new ConnectorClient()
  }

  async account(): Promise<IAccount> {
    return this.connectorClient.sendRequest({ method: 'aptos_account' })
  }

  async connect(): Promise<IAccount> {
    return this.connectorClient.sendRequest({ method: 'aptos_connect' })
  }

  async isConnected(): Promise<boolean> {
    return this.connectorClient.sendRequest({ method: 'aptos_isConnected' })
  }

  async network(): Promise<string> {
    return this.connectorClient.sendRequest({ method: 'aptos_network' })
  }

  async signAndSubmitTransaction(
    transaction: TransactionPayload,
    options: any,
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

  async signTransaction(transaction: TransactionPayload, options: any) {
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

declare global {
  interface Window {
    aptos: DeFiConnectAptosProvider
    deficonnect?: any
  }
}

window.aptos = new DeFiConnectAptosProvider()

window.deficonnect = {
  AptosProvider: DeFiConnectAptosProvider,
  connectorClient: window.aptos.connectorClient,
  postMessage: null,
}
