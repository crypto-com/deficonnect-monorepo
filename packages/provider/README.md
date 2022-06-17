# @deficonnect/provider

## Installation

### use npm package manager

here's an full example of how to use this package: [dapp-connect-provider-example](../../examples/dapp-connect-provider-example/DefiConnector.ts)

```bash
npm install "@deficonnect/provider"
```

### use script tag

```html
<script type="module" src="https://unpkg.com/@deficonnect/provider/dist/index.umd.js"></script>
```

the global variable is: `DeFiConnectProvider`

### constructor

```javascript
const provider = new DeFiConnectProvider({
  appName: 'your app name'
  chainType: 'eth'
  chainId: '28' // for eth is 1
  rpcUrls: {
    1: 'https://mainnet.infura.io/v3/INFURA_API_KEY',
    28: 'https://evm-cronos.crypto.org/',
  }
})
```

### methods for DeFiConnectProvider

this is a eip-1193 compatible provider.
more detail info: https://eips.ethereum.org/EIPS/eip-1193

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

- [ethereum RPC methods](./ethereum-rpc.md)

- [cosmos RPC methods](./cosmos-rpc.md)
  
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
