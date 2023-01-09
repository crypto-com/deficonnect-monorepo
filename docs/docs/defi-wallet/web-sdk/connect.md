---
title: Connect
sidebar_position: 4
---

# Connect

```ts
import Web3 from "web3";

async function connect() {
  await connector.activate();
  const provider = await connector.getProvider();
  web3 = new Web3(provider);
  accounts = await web3.eth.getAccounts();
}
```
