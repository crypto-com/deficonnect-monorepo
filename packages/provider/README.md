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
import { DeFiConnectProvider } from '@deficonnect/provider'

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

### Provider(EIP-1193)
```typescript
interface RequestArguments {
 method: string;
 params?: unknown[] | object;
}

// Send JSON RPC requests
const result = await provider.request(payload: RequestArguments);

// Close provider session
await provider.close()
```

- [ethereum RPC methods](./ethereum-rpc.md)
  
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
#### Functions

| Parameters | Description | Type                  | Exmaple                       | Default |
| ---------- | ----------- | --------------------- | ----------------------------- | ------- |
| disconnect |             | `() => Promise<void>` | `await provider.disconnect()` | -       |

#### Event

| Parameters      | Description | Type                                     | Exmaple | Default |
| --------------- | ----------- | ---------------------------------------- | ------- | ------- |
| accountsChanged |             | `(account: string[]) => void`            |         | -       |
| chainChanged    |             | `(chainId: number) => void`              |         | -       |
| connect         |             | `() => void`                             |         |         |
| disconnect      |             | `(code: number, reason: string) => void` |         |         |


