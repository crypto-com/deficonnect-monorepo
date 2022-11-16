import { DeFiConnectPetraProvider } from './petra-provider'
import { DeFiConnectMartianProvider } from './martian-provider'
import ConnectorClientInstance, { ConnectorClient } from './connect-client'
declare global {
  interface Window {
    connectorClient: ConnectorClient
    aptos: DeFiConnectPetraProvider
    petra: DeFiConnectPetraProvider
    martian: DeFiConnectMartianProvider
    deficonnect: any
  }
}

window.aptos = new DeFiConnectPetraProvider()
window.petra = new DeFiConnectPetraProvider()
window.martian = new DeFiConnectMartianProvider()

window.deficonnect = {
  aptos: window.aptos,
  connectorClient: ConnectorClientInstance,
  postMessage: null,
}
