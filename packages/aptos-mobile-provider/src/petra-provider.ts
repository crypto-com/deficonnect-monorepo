import { Types } from 'aptos'
import { DeFiConnectBaseProvider } from './base-provider'

export class DeFiConnectPetraProvider extends DeFiConnectBaseProvider {
  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any,
  ): Promise<Types.Transaction> {
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

  async signTransaction(transaction: Types.TransactionPayload, options?: any): Promise<Uint8Array> {
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

  onAccountChange(listener: (...args: any[]) => void) {
    this.connectorClient.on('updateAccount', async () => {
      const account = await this.account()
      listener(account)
    })
  }

  onNetworkChange(listener: (...args: any[]) => void) {
    this.connectorClient.on('updateNetwork', async () => {
      const network = await this.network()
      listener({ networkName: network })
    })
  }
}
