import { Types } from 'aptos'
import { DeFiConnectBaseProvider } from './base-provider'

export class DeFiConnectAptosProvider extends DeFiConnectBaseProvider {
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
}
