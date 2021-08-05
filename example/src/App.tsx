import React from 'react'

import { CryptoWalletConnector, InstallExtensionModal } from 'cryptolink'
import 'cryptolink/dist/index.css'

export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
}

export const NETWORK_LABELS: { [chainId in SupportedChainId | number]: string } = {
  [SupportedChainId.MAINNET]: 'Mainnet',
  [SupportedChainId.RINKEBY]: 'Rinkeby',
  [SupportedChainId.ROPSTEN]: 'Ropsten',
  [SupportedChainId.GOERLI]: 'Görli',
  [SupportedChainId.KOVAN]: 'Kovan',
  [SupportedChainId.ARBITRUM_ONE]: 'Arbitrum',
  [SupportedChainId.ARBITRUM_RINKEBY]: 'Arbitrum Testnet',
}

const INFURA_KEY = "4bf032f2d38a4ed6bb975b80d6340847"

const NETWORK_URLS: {
  [chainId in SupportedChainId]: string
} = {
  [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.GOERLI]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.KOVAN]: `https://kovan.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ARBITRUM_ONE]: `https://arb1.arbitrum.io/rpc`,
  [SupportedChainId.ARBITRUM_RINKEBY]: `https://rinkeby.arbitrum.io/rpc`,
}

const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.KOVAN,
  SupportedChainId.GOERLI,
  SupportedChainId.RINKEBY,
  SupportedChainId.ROPSTEN,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
]

const App = () => {
  return (<div>
    <button onClick={() => {
      const cryptoWallet = new CryptoWalletConnector({
        supportedChainIds: SUPPORTED_CHAIN_IDS,
        rpc: NETWORK_URLS,
        bridge: 'https://uniswap.bridge.walletconnect.org',//'http://localhost:5555',
        qrcode: true,
        pollingInterval: 15000,
      })
      cryptoWallet.activate()
    }}>Connect Test</button>
  </div>)
}

export default App
