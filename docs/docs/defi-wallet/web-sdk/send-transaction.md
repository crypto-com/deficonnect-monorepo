---
title: Send Transaction & RPC Called
sidebar_position: 5
---

# Send Transaction

transaction rpc method called guide(all of the rpc methods called same this):

```ts
async function sendTransaction() {
  const provider = await connector.getProvider();

  provider.request({
    method: "eth_sendTransaction",
    params: [
      {
        /* your transaction params */
      },
    ],
  });
}
```
