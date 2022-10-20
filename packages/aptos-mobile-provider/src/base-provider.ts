import Emitter from 'events'
import { ConnectorClient } from './connect-client'
import type { MaybeHexString } from 'aptos'
import { NetworkConfig, IDeFiConnectProvider, JsonRpcRequestArguments } from '@deficonnect/types'
import type { TransactionPayload, AccountSignature } from 'aptos/src/generated'
import { isDeFiConnectProvider } from '@deficonnect/utils'
import { InstallExtensionModalProvider } from '@deficonnect/qrcode-modal'

interface IAccount {
  publicKey: MaybeHexString | undefined
  address: MaybeHexString | undefined
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

export class DeFiConnectBaseProvider extends Emitter {
  connectorClient: ConnectorClient
  isDeficonnectProvider = true
  installExtensionModal: InstallExtensionModalProvider
  deficonnectProvider?: DeFiConnectBaseProvider
  constructor() {
    super()
    this.connectorClient = new ConnectorClient()
    this.installExtensionModal = new InstallExtensionModalProvider()
  }

  async getProvider(): Promise<IDeFiConnectProvider | undefined> {
    async function checkInjectProvider(times = 0): Promise<any> {
      return new Promise((resolve) => {
        function check() {
          if (isDeFiConnectProvider(window.deficonnect)) {
            resolve(window.deficonnect)
            return
          }
          if (navigator?.userAgent?.includes('DeFiWallet') && window.aptos) {
            resolve(window.aptos)
            return
          }
          if (times > 0) {
            setTimeout(async () => {
              --times
              check()
            }, 50)
            return
          }
          resolve(undefined)
        }
        check()
      })
    }
    return checkInjectProvider()
  }

  async account(): Promise<IAccount> {
    return this.connectorClient.sendRequest({ method: 'aptos_account' })
  }

  async connect(network?: NetworkConfig): Promise<IAccount> {
    const provider = await this.getProvider()
    if (!provider) {
      if (network) this.installExtensionModal.open({ networkConfig: network })
      throw new ProviderRpcError(4100, 'can not find deficonnect provider')
    }
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
  ): Promise<IResponse> {
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

  async signTransaction(transaction: TransactionPayload, options?: any): Promise<Uint8Array> {
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
