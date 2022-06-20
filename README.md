# DeFiConnect Monorepo

<p align="center">
    <a href="https://lgtm.com/projects/g/crypto-com/deficonnect-monorepo/alerts/"><img alt="Total alerts" src="https://img.shields.io/lgtm/alerts/g/crypto-com/deficonnect-monorepo.svg?logo=lgtm&logoWidth=18"/></a>
    <a href="https://lgtm.com/projects/g/crypto-com/deficonnect-monorepo/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/crypto-com/deficonnect-monorepo.svg?logo=lgtm&logoWidth=18"/></a>
    <a href="https://discord.gg/qTs3qW3j"><img alt="Join Discord" src="https://img.shields.io/discord/783264383978569728?logo=discord"/></a>
</p>

## Packages

DeFiConnect is a library that consists of many smaller npm packages within the @deficonnect namespace, a so called monorepo. Here are some of them to get an idea:



| Package                                                      | Description                                                  | Latest                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [@deficonnect/connector-client](packages/connector-client)   | WebSocket connection manager, providing JSON-RPC calling capability | [![npm version](https://img.shields.io/npm/v/@deficonnect/connector-client.svg)](https://www.npmjs.com/package/@deficonnect/connector-client) |
| [@deficonnect/cosmos-signer](packages/cosmos-signer)         | Wrap the provider to support the API of the cosmos SDK       | [![npm version](https://img.shields.io/npm/v/@deficonnect/cosmos-signer.svg)](https://www.npmjs.com/package/@deficonnect/cosmos-signer) |
| [@deficonnect/provider](packages/provider)                   | This package is used to help dapps connect to crypto.com wallet extension. Automatically detect the running environment, and proxy the method call to the provider | [![npm version](https://img.shields.io/npm/v/@deficonnect/provider.svg)](https://www.npmjs.com/package/@deficonnect/provider) |
| [@deficonnect/qrcode-modal](packages/qrcode-modal)           | Display QR code in direct connection mode                    | [![npm version](https://img.shields.io/npm/v/@deficonnect/qrcode-modal.svg)](https://www.npmjs.com/package/@deficonnect/qrcode-modal) |
| [@deficonnect/types](packages/types)                         | types                                                        | [![npm version](https://img.shields.io/npm/v/@deficonnect/types.svg)](https://www.npmjs.com/package/@deficonnect/types) |
| [@deficonnect/utils](packages/utils)                         | utils                                                        | [![npm version](https://img.shields.io/npm/v/@deficonnect/utils.svg)](https://www.npmjs.com/package/@deficonnect/utils) |
| [@deficonnect/websocket-provider](packages/websocket-provider) | This provider used in direct connection mode                 | ![npm version](https://img.shields.io/npm/v/@deficonnect/websocket-provider.svg) |



## Installation
```bash
npm install "deficonnect"
```


### 
### Connector 
**Used as model**

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



**Used as script tag**

```html
<script type="module" src="https://unpkg.com/deficonnect/dist/index.umd.js"></script>

<script>
const connector = new window.DeFiConnect.DeFiWeb3Connector({
  supportedChainIds: [1],
  rpc: { 1: 'https://mainnet.infura.io/v3/INFURA_API_KEY' },
  pollingInterval: 15000
})
</script>
```



#### API

| Parameters       | Description | Type                  | Exmaple                      | Default |
| ---------------- | ----------- | --------------------- | ---------------------------- | ------- |
| supportedChainIds |             | `number[]`            | `[1, 2]`                                | - |
| rpc               |             | `Object`              | `{1: 'https://rpc', 2: 'https://rpc2'}` | - |
| pollingInterval   |             | `number`              | `15000`                                 | - |

#### Functions

| Parameters | Description | Type                  | Exmaple                        | Default |
| ---------- | ----------- | --------------------- | ------------------------------ | ------- |
| activate   |             | `() => Promise<void>` | `await connector.activate()`   | -       |
| deactivate |             | `() => Promise<void>` | `await connector.deactivate()` | -       |



### Provider(EIP-1193)
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





