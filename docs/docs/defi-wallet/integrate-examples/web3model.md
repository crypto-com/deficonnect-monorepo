---
title: Integrating with Web3Model
sidebar_position: 2
---

# Integrating with Web3Model

## Step 1: Install Web3Modal and an Ethereum library

```bash npm2yarn
npm install ethers // or web3
npm install web3modal
```

## Step 2: Install `@deficonnect/provider` library

```bash npm2yarn
npm install @deficonnect/provider
```

## Step 3: Instantiate web3modal

```ts
import { DeFiConnectProvider } from "@deficonnect/provider";

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    "custom-deficonnect": {
      display: {
        name: "Crypto.com DeFi Wallet",
        description: "Connect to Crypto.com DeFi Wallet",
        logo: "https://crypto.com/defi/swap/favicon.c5a5b109.png",
      },
      package: DeFiConnectProvider,
      options: {
        rpcUrls: {
          25: "https://evm.cronos.org/", // cronos mainet
        },
        chainType: "eth",
        chainId: "25",
      },
      connector: async (ProviderPackage, options) => {
        const provider = new ProviderPackage(options);
        await provider.enable();
        return provider;
      },
    },
  },
});
```

## Establish a Connection to Wallet

```tsx
import { ethers } from "ethers";
import { useState } from "react";

function App() {
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      setProvider(provider);
      setLibrary(library);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
}
```
