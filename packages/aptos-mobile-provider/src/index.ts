import { DeFiConnectAptosProvider } from './aptos-provider'
import { DeFiConnectMartianProvider } from './martian-provider'
declare global {
  interface Window {
    aptos: DeFiConnectAptosProvider
    martian: DeFiConnectMartianProvider
    deficonnect: any
  }
}

window.aptos = new DeFiConnectAptosProvider()
window.martian = new DeFiConnectMartianProvider()

window.deficonnect = {
  aptos: window.aptos,
  connectorClient: window.aptos.connectorClient,
  postMessage: null,
}
