# @deficonnect/defi-link

## Install

```bash
yarn add "@deficonnect/defi-link"
```

## Usage

### for `web3-react`
if you use `web3-react`, it is easy to integrat:

> `DeFiLinkConnector` has implement `AbstractConnector` from `web3-react`

```tsx
import { DeFiLinkConnector } from '@deficonnect/defi-link'

const connector = new DeFiLinkConnector({
  supportedChainIds: [1],
  rpc: [1: 'https://mainnet.infura.io/v3/INFURA_API_KEY'],
  pollingInterval: 15000,
})
connector.activate()
```

### normally

```tsx
import { DeFiLinkConnector } from '@deficonnect/defi-link'
import Web3 from "web3"

const connector = new DeFiLinkConnector({
  supportedChainIds: [1],
  rpc: [1: 'https://mainnet.infura.io/v3/INFURA_API_KEY'],
  pollingInterval: 15000,
})
connector.activate()
const provider = await connector.getProvider()
const web3 = new Web3(provider)
```
