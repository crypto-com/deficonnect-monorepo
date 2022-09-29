import { DeFiConnectAptosProvider } from './aptos-provider'
import { DeFiConnectMartainProvider } from './martain-provider'
declare global {
  interface Window {
    aptos: DeFiConnectAptosProvider
    martian: DeFiConnectMartainProvider
    pontem: DeFiConnectAptosProvider
    spika: DeFiConnectAptosProvider
    deficonnect?: any
  }
}

window.aptos = new DeFiConnectAptosProvider()
window.martian = new DeFiConnectMartainProvider()
window.pontem = window.aptos
window.spika = window.aptos

window.deficonnect = {
  AptosProvider: DeFiConnectAptosProvider,
  connectorClient: window.aptos.connectorClient,
  postMessage: null,
}
