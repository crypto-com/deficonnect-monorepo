# cryptolink

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/cryptolink.svg)](https://www.npmjs.com/package/cryptolink) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add "git+https://github.com/Andy-Bin-Crypto/ncw-wallet-connector.git#main"
```

## Usage

```tsx
import { CryptoWalletConnector } from 'cryptolink'

const cryptoWallet = new CryptoWalletConnector({
    supportedChainIds: SUPPORTED_CHAIN_IDS,
    rpc: NETWORK_URLS,
    bridge: 'http://localhost:5555',//Replace it with your own brige host
    qrcode: true,
    pollingInterval: 15000,
  })
cryptoWallet.activate()
```

## License

MIT © [Crypto.com](https://github.com/Crypto.com)
