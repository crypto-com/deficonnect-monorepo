---
title: Injected Provider
sidebar_position: 5
---

# Injected Provider

The DeFi Wallet browser extension injects an Ethereum provider, as specified by [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193), into the browser at window.ethereum.

You can use this provider in your dapp to request user's Ethereum accounts, read on-chain data, and have the user sign messages and transactions, without using the DeFi Wallet SDK.

## Wallet browser extension injects environment variables

if you are installed wallet browser extension, then it will auto inject followings variables to window:

```ts title="Injected Provider(Adapt to different eco)"
interface Window {
  ethereum?: Provider;
  deficonnectProvider?: Provider;
  aptos?: PetraProvider;
  petra?: PetraProvider;
  martian?: MartianProvider;
  deficonnect: { aptos?: PetraProvider; ethereum?: Provider };
}
```

but you don't need care about it, DeFi Wallet SDK will auto handle it.

## Benefits of Using DeFi Wallet SDK vs. the Injected Provider

The basic functionality between DeFi Wallet SDK and the DeFi Wallet injected provider is very similar. However, the SDK provides some additional helpful features:

- TODO: Implement

## Properties

`isDeficonnectProvider`

Identifies if this provider is DeFi Wallet.

## Methods

```ts title="request(args)"
interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}
```

DeFi Wallet uses `request(args)` to wrap an RPC API. The params and return value vary by RPC method.

If the request fails for any reason, the Promise will reject with an Ethereum RPC Error.

DeFi Wallet supports many standardized Ethereum RPC methods and others, including:

```ts
const dappAllowMethods = [
  "aptos_createCollection",
  "aptos_createToken",
  "aptos_generateSignAndSubmitTransaction",
  "aptos_generateTransaction",
  "aptos_getAccount",
  "aptos_getAccountResources",
  "aptos_getAccountTransactions",
  "aptos_getChainId",
  "aptos_getLedgerInfo",
  "aptos_getTransactionByHash",
  "aptos_getTransactions",
  "aptos_signAndSubmitTransaction",
  "aptos_signAndSubmitTransactionMartian",
  "aptos_signGenericTransaction",
  "aptos_signMessage",
  "aptos_signTransaction",
  "aptos_signTransactionMartian",
  "aptos_submitTransactionMartian",
  "cosmos_getAccounts",
  "cosmos_sendTransaction",
  "cosmos_signDirect",
  "cosmos_proxyJsonRpcRequest",
  "dapp_ping",
  "dc_sessionInit",
  "dc_sessionRequest",
  "dc_sessionUpdate",
  "eth_accounts",
  "eth_chainId",
  "eth_proxyJsonRpcRequest",
  "eth_sendTransaction",
  "eth_sign",
  "eth_signTransaction",
  "eth_signTypedData",
  "eth_signTypedData_v1",
  "eth_signTypedData_v2",
  "eth_signTypedData_v3",
  "eth_signTypedData_v4",
  "eth_proxyJsonRpcRequest",
  "eth_requestAccounts",
  "net_version",
  "personal_sign",
  "wallet_addEthereumChain",
  "wallet_getAllAccounts",
  "wallet_switchEthereumChain",
  "wallet_watchAsset",
];
```
