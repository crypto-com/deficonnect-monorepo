import { DeFiConnectAptosProvider } from './aptos-provider'
import type { MaybeHexString } from 'aptos'

export class DeFiConnectMartainProvider extends DeFiConnectAptosProvider {
  async network(): Promise<string> {
    return this.connectorClient.sendRequest({ method: 'aptos_network' })
  }

  async generateTransaction(sender: MaybeHexString, payload: any, options?: any): Promise<any> {
    this.connectorClient.sendRequest({
        method: 'aptos_generateTransaction',
        params: [
            {
                sender,
                payload,
                options,
            },
        ],
    })
  }
}
