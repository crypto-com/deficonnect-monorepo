import React from "react";
import "./styles.css";
import "antd/dist/antd.css";
import { Button } from "antd";
import Web3 from "web3";
import { DeFiWeb3Connector } from "deficonnect";

let provider;
let web3;
let accounts;

export default function App() {

  async function deficonnect() {
    if (!provider) {
      const connector = new DeFiWeb3Connector({
        supportedChainIds: [1],
        rpc: {
          1: "https://mainnet.infura.io/v3/INFURA_API_KEY",
          25: "https://evm.cronos.org/", // cronos mainet
        },
        pollingInterval: 15000,
      });
      await connector.activate();
      console.log('connector', connector)
      const provider = await connector.getProvider();
      console.log('provider', provider)
      web3 = new Web3(provider);
    }

    if (!accounts) {
      accounts = await web3.eth.getAccounts();
      print(`Wallet address: ${accounts[0].toLowerCase()}`);
    }
  }

  function print(str) {
    const p = document.createElement("p");
    p.innerText = str;
    document.getElementById("userWalletAddress").appendChild(p);
  }

  return (
    <div className="App">
      <h1>Defi Connect - React Example</h1>
      <h2>A basic example of using React with Defi Connect</h2>
      <div className="deficonnectBtn">
        <Button type="primary" onClick={() => deficonnect()}>
          Connect
        </Button>
      </div>
      <pre id="userWalletAddress"></pre>
    </div>
  );
}
