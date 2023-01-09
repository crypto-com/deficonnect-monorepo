# DeFiConnect Monorepo

<p align="center">
    <a href="https://lgtm.com/projects/g/crypto-com/deficonnect-monorepo/alerts/"><img alt="Total alerts" src="https://img.shields.io/lgtm/alerts/g/crypto-com/deficonnect-monorepo.svg?logo=lgtm&logoWidth=18"/></a>
    <a href="https://lgtm.com/projects/g/crypto-com/deficonnect-monorepo/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/crypto-com/deficonnect-monorepo.svg?logo=lgtm&logoWidth=18"/></a>
    <a href="https://discord.gg/qTs3qW3j"><img alt="Join Discord" src="https://img.shields.io/discord/783264383978569728?logo=discord"/></a>
</p>

## upgrade from V1 to V2

> it is very easy to upgrade to V2 version.
> 
> no code change. only need change to import `@deficonnect/web3-connector` package



## Packages

DeFiConnect is a library that consists of many smaller npm packages within the @deficonnect namespace, a so called monorepo. Here are some of them to get an idea:



| Package                                                      | Description                                                  | Latest                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [@deficonnect/cosmos-signer](packages/cosmos-signer)         | Wrap the provider to support the API of the cosmos SDK       | [![npm version](https://img.shields.io/npm/v/@deficonnect/cosmos-signer.svg)](https://www.npmjs.com/package/@deficonnect/cosmos-signer) |
| [@deficonnect/provider](packages/provider)                   | This package is used to help dapps connect to crypto.com wallet extension. Automatically detect the running environment, and proxy the method call to the provider | [![npm version](https://img.shields.io/npm/v/@deficonnect/provider.svg)](https://www.npmjs.com/package/@deficonnect/provider) |
| [@deficonnect/qrcode-modal](packages/qrcode-modal)           | Display QR code in direct connection mode                    | [![npm version](https://img.shields.io/npm/v/@deficonnect/qrcode-modal.svg)](https://www.npmjs.com/package/@deficonnect/qrcode-modal) |
| [@deficonnect/types](packages/types)                         | types                                                        | [![npm version](https://img.shields.io/npm/v/@deficonnect/types.svg)](https://www.npmjs.com/package/@deficonnect/types) |
| [@deficonnect/utils](packages/utils)                         | utils                                                        | [![npm version](https://img.shields.io/npm/v/@deficonnect/utils.svg)](https://www.npmjs.com/package/@deficonnect/utils) |
| [@deficonnect/web3-connector](packages/web3-connector) | implement `AbstractConnector` from `web3-react`                 | ![npm version](https://img.shields.io/npm/v/@deficonnect/web3-connector.svg) |
