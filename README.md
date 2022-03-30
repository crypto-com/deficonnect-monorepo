# WalletConnect v1.x.x

Open protocol for connecting Wallets to Dapps - https://walletconnect.org

## Packages

| SDK           | Current Version                                                                                      | Description |
| ------------- | ---------------------------------------------------------------------------------------------------- | ----------- |
| @deficonnect/sdk | [![npm version](https://badge.fury.io/js/walletconnect.svg)](https://badge.fury.io/js/walletconnect) | SDK         |

| Clients               | Current Version                                                                                                              | Description       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| @deficonnect/core   | [![npm version](https://badge.fury.io/js/%40walletconnect%2Fcore.svg)](https://badge.fury.io/js/%40walletconnect%2Fcore)     | Core Client       |
| @deficonnect/client | [![npm version](https://badge.fury.io/js/%40walletconnect%2Fclient.svg)](https://badge.fury.io/js/%40walletconnect%2Fclient) | Isomorphic Client |

| Providers                        | Current Version                                                                                                                                    | Description       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| @deficonnect/ethereum-provider | [![npm version](https://badge.fury.io/js/%40walletconnect%2Fethereum-provider.svg)](https://badge.fury.io/js/%40walletconnect%2Fethereum-provider) | Ethereum Provider |
| @deficonnect/truffle-provider  | [![npm version](https://badge.fury.io/js/%40walletconnect%2Ftruffle-provider.svg)](https://badge.fury.io/js/%40walletconnect%2Ftruffle-provider)   | Truffle Provider  |
| @deficonnect/web3-provider     | [![npm version](https://badge.fury.io/js/%40walletconnect%2Fweb3-provider.svg)](https://badge.fury.io/js/%40walletconnect%2Fweb3-provider)         | Web3 Provider     |
| @deficonnect/web3-subprovider  | [![npm version](https://badge.fury.io/js/%40walletconnect%2Fweb3-subprovider.svg)](https://badge.fury.io/js/%40walletconnect%2Fweb3-subprovider)   | Web3 Subprovider  |

| Helpers                          | Current Version                                                                                                                                    | Description       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| @deficonnect/browser-utils     | [![npm version](https://badge.fury.io/js/%40walletconnect%2Fbrowser-utils.svg)](https://badge.fury.io/js/%40walletconnect%2Fbrowser-utils)         | Browser Utilities |
| @deficonnect/http-connection   | [![npm version](https://badge.fury.io/js/%40walletconnect%2Fhttp-connection.svg)](https://badge.fury.io/js/%40walletconnect%2Fhttp-connection)     | HTTP Connection   |
| @deficonnect/iso-crypto        | [![npm version](https://badge.fury.io/js/%40walletconnect%2Fiso-crypto.svg)](https://badge.fury.io/js/%40walletconnect%2Fiso-crypto)               | Isomorphic Crypto |
| @deficonnect/qrcode-modal      | [![npm version](https://badge.fury.io/js/%40walletconnect%2Fqrcode-modal.svg)](https://badge.fury.io/js/%40walletconnect%2Fqrcode-modal)           | QR Code Modal     |
| @deficonnect/react-native-dapp | [![npm version](https://badge.fury.io/js/%40walletconnect%2Freact-native-dapp.svg)](https://badge.fury.io/js/%40walletconnect%2Freact-native-dapp) | React-Native Dapp |
| @deficonnect/signer-connection | [![npm version](https://badge.fury.io/js/%40walletconnect%2Fsigner-connection.svg)](https://badge.fury.io/js/%40walletconnect%2Fsigner-connection) | Signer Connection |
| @deficonnect/socket-transport  | [![npm version](https://badge.fury.io/js/%40walletconnect%2Fsocket-transport.svg)](https://badge.fury.io/js/%40walletconnect%2Fsocket-transport)   | Socket Transport  |
| @deficonnect/types             | [![npm version](https://badge.fury.io/js/%40walletconnect%2Ftypes.svg)](https://badge.fury.io/js/%40walletconnect%2Ftypes)                         | Typescript Types  |
| @deficonnect/utils             | [![npm version](https://badge.fury.io/js/%40walletconnect%2Futils.svg)](https://badge.fury.io/js/%40walletconnect%2Futils)                         | Utility Library   |

`## Quick Start`

Find quick start examples for your platform at https://docs.walletconnect.org/quick-start

## Documentation

Read more about WalletConnect protocol and how to use our Clients at https://docs.walletconnect.org

## Contributors

This project exists thanks to all the people who contribute.
<a href="https://github.com/monacohq/walletconnect-monorepo/graphs/contributors"><img src="https://opencollective.com/walletconnect/contributors.svg?width=890&button=false" /></a>

All contributions are welcome! Feel free to create an Issue or make a PR in this repository

## License

LGPL-3.0

## publish
Node.js use v14.17.6

```bash
$ npm run new-version
```

```bash
$ npm run build
```

```bash
$ npm run npm-publish:latest
```