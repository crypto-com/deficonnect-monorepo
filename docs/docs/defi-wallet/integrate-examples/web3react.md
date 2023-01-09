---
title: Integrating with Web3React
sidebar_position: 3
---

# Integrating with Web3-React

## Step 1: Install ethers and web3-react

Install ethers.js as a required dependency for web3-react. If you are building your dapp with web3.js, you can additionally install the library.

```bash npm2yarn
npm install ethers
npm install web3 # optional

npm install @web3-react/core
```

## Step 2: Import and Setup Web3ReactProvider

```jsx
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider) {
  return new Web3Provider(provider);
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <App />
  </Web3ReactProvider>,
  document.getElementById("root")
);
```

## Step 3: Import and Instantiate Wallet Connectors

```base npm2yarn
npm install @deficonnect/web3-connector
npm install @web3-react/injected-connector # Injected (e.g. Metamask)
```

```jsx
import { DeFiWeb3Connector } from "@deficonnect/web3-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

const DeFiWallet = new DeFiWeb3Connector({
  supportedChainIds: [1],
  chainType: "eth", // only support 'eth' for DeFiWeb3Connector
  chainId: "25",
  rpcUrls: {
    1: "https://mainnet.infura.io/v3/INFURA_API_KEY",
    25: "https://evm-cronos.crypto.org/",
  },
});

const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 25, 42],
});
```

## Connect and Disconnect from Wallet

```jsx
import { useWeb3React } from "@web3-react/core";
```

```jsx
function App() {

  const { activate, deactivate } = useWeb3React();
    ...
}
```

```jsx
<button onClick={() => { activate(DeFiWallet) }}>DeFi Wallet</button>
<button onClick={() => { activate(Injected) }}>Metamask</button>

<button onClick={deactivate}>Disconnect</button>
```

## Access connection, account, network information

```jsx
/*
  active: boolean indicating connection to user’s wallet
  account: connected user's public wallet address
  chainId: chain id of the currently connected network
*/

function App() {

  # add this line
  const { active, chainId, account } = useWeb3React();
  ...

    return (
    ...

    # add these 3 lines
    <div>Connection Status: {active}</div>
    <div>{Account: {account}</div>
    <div>{Network ID: {chainId}</div>
    ...

  );
}
```

## Switch Networks or Add Custom Networks

```jsx
const { library } = useWeb3React();

// example of switching or adding network with Harmony Mainnet
const switchNetwork = async () => {
  try {
    await library.provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x63564c40" }],
    });
  } catch (switchError) {
    // 4902 error code indicates the chain is missing on the wallet
    if (switchError.code === 4902) {
      try {
        await library.provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x63564c40",
              rpcUrls: ["https://api.harmony.one"],
              chainName: "Harmony Mainnet",
              nativeCurrency: { name: "ONE", decimals: 18, symbol: "ONE" },
              blockExplorerUrls: ["https://explorer.harmony.one"],
              iconUrls: [
                "https://harmonynews.one/wp-content/uploads/2019/11/slfdjs.png",
              ],
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
};
```
