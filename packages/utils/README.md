# DeFiConnect

## Installation

### use npm package manager

```bash
npm install "deficonnect"
```

### use script tag

```html
<script type="module" src="https://unpkg.com/deficonnect/dist/index.umd.js"></script>
```

the global variable is: `window.DeFiConnect`

```javascript
const connector = new window.DeFiConnect.DeFiWeb3Connector({
  supportedChainIds: [1],
  rpc: { 1: 'https://mainnet.infura.io/v3/INFURA_API_KEY' },
  pollingInterval: 15000
})
```

## Usage

### connect wallet

> if you use `web3-react`, it is easy to integrate:
> `DeFiWeb3Connector` has implement `AbstractConnector` from `web3-react`

```tsx
import { DeFiWeb3Connector } from 'deficonnect'

const connector = new DeFiWeb3Connector({
  supportedChainIds: [1],
  rpc: { 1: 'https://mainnet.infura.io/v3/INFURA_API_KEY' },
  pollingInterval: 15000
})
connector.activate()
```

### methods for DeFiWeb3Connector

```typescript
// connect to the Wallet
await connector.activate()

// disconnect the Wallet
await connector.deactivate()
```

### events for Provider (EIP-1193)

```typescript
// Subscribe to accounts change
provider.on('accountsChanged', (accounts: string[]) => {
  console.log(accounts)
})

// Subscribe to chainId change
provider.on('chainChanged', (chainId: number) => {
  console.log(chainId)
})

// Subscribe to session connection
provider.on('connect', () => {
  console.log('connect')
})

// Subscribe to session disconnection
provider.on('disconnect', (code: number, reason: string) => {
  console.log(code, reason)
})
```

### methods for Provider

```typescript
interface RequestArguments {
 method: string;
 params?: unknown[] | object;
}

// Send JSON RPC requests
const result = await provider.request(payload: RequestArguments);

// Close provider session
await provider.disconnect()
```

### methods for Web3

```typescript
//  Get Accounts
const accounts = await web3.eth.getAccounts()

//  Get Chain Id
const chainId = await web3.eth.chainId()

//  Get Network Id
const networkId = await web3.eth.net.getId()

// Send Transaction
const txHash = await web3.eth.sendTransaction(tx)

// Sign Transaction
const signedTx = await web3.eth.signTransaction(tx)

// Sign Message
const signedMessage = await web3.eth.sign(msg)

// Sign Typed Data
const signedTypedData = await web3.eth.signTypedData(msg)
```

## release package step

1. change the package.json version, and create PR to master.
2. approved release on CI control
3. create a new tag on Github
