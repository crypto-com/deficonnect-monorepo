---
title: Setup
sidebar_position: 3
---

# Setup

This page explains how to integrate DeFi Wallet SDK as the default provider for your dapp using web3.js. You can follow a similar pattern if you are using ethers.js.

## Setting up DeFi Wallet SDK

:::info

Instructions are in TypeScript. The usage is the same in JavaScript, except for the occasional TypeScript type annotation such as string[] or as any.

:::

### Prerequisites

- A Typescript project set up locally, created with `yarn create react-app my-app --template typescript` or `similar`
- web3.js installed using `npm install web3` or `similar`

### Initializing

In your project, add the following code to initialize DeFi Wallet SDK and a Web3 object:

```ts title="App.tsx"
import { DeFiWeb3Connector } from "@deficonnect/web3-connector";

const connector = new DeFiWeb3Connector({
  supportedChainIds: [1],
  chainType: "eth", // only support 'eth' for DeFiWeb3Connector
  chainId: "25",
  rpcUrls: {
    1: "https://mainnet.infura.io/v3/INFURA_API_KEY",
    25: "https://evm-cronos.crypto.org/",
  },
});
```
