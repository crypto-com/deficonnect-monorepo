import { DeFiConnectBaseProvider } from './base-provider'

export class DeFiConnectAptosProvider extends DeFiConnectBaseProvider {
  async network(): Promise<string> {
    return this.connectorClient.sendRequest({ method: 'aptos_network' })
  }

  mobileDisconnect() {
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
