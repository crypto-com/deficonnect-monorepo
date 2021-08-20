# defilink

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/defilink.svg)](https://www.npmjs.com/package/defilink) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add "git+https://github.com/monacohq/ncw-wallet-connector#main"
```

## Usage

```tsx
import { DeFiLinkConnector } from 'defilink'

const connector = new DeFiLinkConnector({
    supportedChainIds: SUPPORTED_CHAIN_IDS,
    rpc: NETWORK_URLS,
    pollingInterval: 15000,
  })
connector.activate()
```

## License

MIT © [Crypto.com](https://github.com/Crypto.com)
