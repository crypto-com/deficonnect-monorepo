# @deficonnect/connector-client

deficonnect core package, support websocket message encrypt/decode and send/receive.

## Installation

### use npm package manager

```bash
npm install "@deficonnect/connector-client"
```


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

