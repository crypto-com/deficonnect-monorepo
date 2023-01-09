---
title: Migrating from v1 to v2
sidebar_position: 8
---

## Migration overview

it is very easy to upgrade to V2 version.
no code change. only need change to import `@deficonnect/web3-connector` package

```mdx-code-block
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
```

```mdx-code-block
<Tabs groupId="operating-systems">
  <TabItem value="v2" label="v2">
```

```ts {1} showLineNumbers
import { DeFiWeb3Connector } from "@deficonnect/web3-connector";

const connector = new DeFiWeb3Connector({
  supportedChainIds: [1],
  appName: "your app name", // optional
  chainType: "eth", // only support 'eth' for DeFiWeb3Connector
  chainId: "25", // for eth is 1
  rpcUrls: {
    1: "https://mainnet.infura.io/v3/INFURA_API_KEY",
    25: "https://evm-cronos.crypto.org/",
  },
});
connector.activate();
```

```mdx-code-block
  </TabItem>
  <TabItem value="v1" label="v1">
```

```ts {1} showLineNumbers
import { DeFiWeb3Connector } from "deficonnect";

const connector = new DeFiWeb3Connector({
  supportedChainIds: [1],
  rpc: { 1: "https://mainnet.infura.io/v3/INFURA_API_KEY" },
  pollingInterval: 15000,
});
connector.activate();
```

```mdx-code-block
  </TabItem>
</Tabs>
```
