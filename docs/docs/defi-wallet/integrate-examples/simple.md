---
title: Simple Example
sidebar_position: 1
---

# Simple Example

here's a simple example

```jsx title="App.jsx"
import React from "react";
import Web3 from "web3";
import { DeFiWeb3Connector } from "@deficonnect/web3-connector";

let provider;
let web3;
let accounts = [];
let connector;

export function App(props) {
  async function connect() {
    if (!provider) {
      connector = new DeFiWeb3Connector({
        supportedChainIds: [1],
        appName: "your app name",
        chainType: "eth", // only support 'eth' for DeFiWeb3Connector
        chainId: "1", // for eth is 1
        rpcUrls: {
          1: "https://mainnet.infura.io/v3/INFURA_API_KEY",
          25: "https://evm.cronos.org/", // cronos mainet
        },
        pollingInterval: 15000,
      });
      await connector.activate();
      console.log("connector", connector);
      const provider = await connector.getProvider();
      console.log("provider", provider);
      web3 = new Web3(provider);
      const r = await provider.request({
        method: "dc_sessionRequest",
        params: [
          {
            peerMeta: { name: "test" },
            chainId: "1",
            chainType: "aptos",
          },
        ],
      });
      console.log("r", r);
    }

    accounts = await web3.eth.getAccounts();
    print(`Wallet address: ${accounts[0].toLowerCase()}`);
  }

  async function deactivate() {
    await connector.deactivate();
    accounts = await web3.eth.getAccounts();
    print(`Wallet address: ${accounts[0]}`);
  }

  function print(str) {
    const p = document.createElement("p");
    p.innerText = str;
    document.getElementById("userWalletAddress").appendChild(p);
  }

  return (
    <div className="App">
      <h1>DeFi Connect - React Example</h1>
      <h2>A basic example of using React with DeFi Connect</h2>

      <div className="connect">
        <button type="primary" onClick={connect}>
          Connect
        </button>
      </div>

      <div className="deactivate">
        <button type="primary" onClick={deactivate}>
          Deactivate
        </button>
      </div>

      <pre id="userWalletAddress"></pre>
    </div>
  );
}
```
