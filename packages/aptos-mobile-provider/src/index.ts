import { DeFiConnectPetraProvider } from './petra-provider'
import { DeFiConnectMartianProvider } from './martian-provider'
declare global {
  interface Window {
    aptos: DeFiConnectPetraProvider
    martian: DeFiConnectMartianProvider
    deficonnect: any
  }
}

window.aptos = new DeFiConnectPetraProvider()
window.martian = new DeFiConnectMartianProvider()

window.deficonnect = {
  aptos: window.aptos,
  connectorClient: window.aptos.connectorClient,
  postMessage: null,
}
