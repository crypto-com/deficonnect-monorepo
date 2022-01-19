# deficonnect

## Install

```bash
npm install "deficonnect"
```

## Usage

### for `web3-react`

if you use `web3-react`, it is easy to integrat:

> `DeFiWeb3Connector` has implement `AbstractConnector` from `web3-react`

```tsx
import { DeFiWeb3Connector } from 'deficonnect'

const connector = new DeFiWeb3Connector({
  supportedChainIds: [1],
  rpc: { 1: 'https://mainnet.infura.io/v3/INFURA_API_KEY' },
  pollingInterval: 15000,
})
connector.activate()
```

### normally

```tsx
import { DeFiWeb3Connector } from 'deficonnect'
import Web3 from "web3"

const connector = new DeFiWeb3Connector({
  supportedChainIds: [1],
  rpc: [1: 'https://mainnet.infura.io/v3/INFURA_API_KEY'],
  pollingInterval: 15000,
})
connector.activate()
const provider = await connector.getProvider()
const web3 = new Web3(provider)
```

## release package step

1. change the package.json version, and create PR to master.
2. approved release on CI control
3. create a new tag on Github
