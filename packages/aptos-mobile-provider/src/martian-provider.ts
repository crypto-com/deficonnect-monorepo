import { MaybeHexString, Types } from 'aptos'
import { DeFiConnectBaseProvider } from './base-provider'

interface IOptions {
  sender?: MaybeHexString
  sequence_number?: any
  max_gas_amount?: string // "4000",
  gas_unit_price?: string // "1",
  gas_currency_code?: string //  "XUS",
  // Unix timestamp, in seconds + 10 seconds
  expiration_timestamp_secs?: string // (Math.floor(Date.now() / 1000) + 10).toString(),
}

export class DeFiConnectMartianProvider extends DeFiConnectBaseProvider {
  async generateTransaction(
    sender: MaybeHexString,
    payload: Types.TransactionPayload,
    options?: IOptions,
  ): Promise<string> {
    const params = [
      {
        sender,
        payload,
        options,
      },
    ]
    return this.connectorClient.sendRequest({
      method: 'aptos_generateTransaction',
      params,
    })
  }

  async signTransaction(
    transaction: string, // RawTransaction serialized string
  ): Promise<string> {
    const params = [
      {
        transaction,
      },
    ]
    return this.connectorClient.sendRequest({
      method: 'aptos_signTransactionMartian',
      params,
    })
  }

  async submitTransaction(signedTransaction: string): Promise<string> {
    const params = [
      {
        transaction: signedTransaction,
      },
    ]
    return this.connectorClient.sendRequest({
      method: 'aptos_submitTransactionMartian',
      params,
    }) // txnHash
  }

  async signAndSubmitTransaction(
    transaction: string, // RawTransaction serialized string
  ): Promise<Types.Transaction> {
    const params = [
      {
        transaction,
      },
    ]
    return this.connectorClient.sendRequest({
      method: 'aptos_signAndSubmitTransactionMartian',
      params,
    })
  }

  async generateSignAndSubmitTransaction(
    sender: MaybeHexString,
    payload: Types.TransactionPayload,
    options?: IOptions,
  ): Promise<string> {
    const params = [
      {
        sender,
        payload,
        options,
      },
    ]
    return this.connectorClient.sendRequest({
      method: 'aptos_generateSignAndSubmitTransaction',
      params,
    }) // txnHash
  }

  async signGenericTransaction(payload: {
    func: string
    args: []
    type_args: []
  }): Promise<{
    success: boolean
    txnHash: string
    vm_status: string
  }> {
    const params = [
      {
        payload,
      },
    ]
    return this.connectorClient.sendRequest({
      method: 'aptos_signGenericTransaction',
      params,
    })
  }
}
