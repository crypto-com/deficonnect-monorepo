---
description: Cosmos JSON-RPC Methods
---

# Cosmos

## cosmos_sendTransaction

IBC request demo
``` json
{
    "id":1633401844820623,
    "jsonrpc":"2.1",
    "method":"cosmos_sendTransaction",
    "params":[
        {
            "signerAddress":"tcro1sqkt6egk7pgjt7deh52truhfvhznagc7tdqmuj",
            "signDoc":{
                "chainId":"testnet-croeseid-4",
                "accountNumber":"693",
                "body":{
                    "messages":[
                        {
                            "typeUrl": "/cosmos.bank.v1beta1.MsgSend",
			     "value": {
				"fromAddress": "senderAddress",
				"toAddress": "recipientAddress",
				"amount": [...amount],
			      },
                        }
                    ],
                    "memo":"",
                    "timeoutHeight":"0",
                    "extensionOptions":[

                    ],
                    "nonCriticalExtensionOptions":[

                    ]
                },
                "authInfo":{
                    "signerInfos":[
                        {
                            "publicKey":{
                                "typeUrl":"/cosmos.crypto.secp256k1.PubKey",
                                "value":"CiECXrin6CVU1nVW7m4wbHZq8m5uepUEeqtkavjoha7A1vo="
                            },
                            "modeInfo":{
                                "single":{
                                    "mode":"SIGN_MODE_DIRECT"
                                }
                            },
                            "sequence":"6"
                        }
                    ],
                    "fee":{
                        "amount":[{
                          "denom": "",
                          "amount": ""
                        }],
                        "gasLimit":"120000",
                        "payer":"",
                        "granter":""
                    }
                }
            }
        }
    ],
}
```

response demo for the cosmos_sendTransaction request:
``` json
{
  "id": xxx,
  "jsonrpc": '2.1',
  "result": "CsUBCsIBCikvaWJjLmFwcGxpY2F0aW9ucy50cmFuc2Zlci52MS5Nc2dUcmFuc2ZlchKUAQoIdHJhbnNmZXISC2NoYW5uZWwtMTI5GhUKCGJhc2V0Y3JvEgkxMDAwMDAwMDAiK3Rjcm8xc3FrdDZlZ2s3cGdqdDdkZWg1MnRydWhmdmh6bmFnYzd0ZHFtdWoqK3RjcmMxc3l5cTVsNWVyMHhhbXc1dnl2cDJ3cjY5NjY3bmR4NDQ5OHQ2YTUyADiA2Lbbz7jO1hYSawpQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohAl64p+glVNZ1Vu5uMGx2avJubnqVBHqrZGr46IWuwNb6EgQKAggBGBwSFwoRCghiYXNldGNybxIFMjAwMDAQwKkHGkAHTBUrbrFZL2zT0p8sIDn5TEVnnAFnf08fvWkDOexO/zGDLkB62OJPL7rNO82lNLLTI/cgDhr5PD6xM3CLbt/X" // RawTx base64 encode
}
```
