import { pubkeyType } from '@cosmjs/amino'
import { fromBase64, toBase64 } from '@cosmjs/encoding'
import { AccountData, DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing'
import { IDeFiConnectProvider } from '@deficonnect/types'
import { SignDoc, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { decodeToSignRequestJSON } from './cosmos-msg-tool'

export class OfflineSigner implements OfflineDirectSigner {
  provider: IDeFiConnectProvider
  constructor(provider: IDeFiConnectProvider) {
    this.provider = provider
  }
  async getAccounts(): Promise<readonly AccountData[]> {
    const result = await this.provider.request({ method: 'cosmos_getAccounts' }) as AccountData
    return [result]
  }
  async signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> {
    const accounts = await this.getAccounts()
    const jsonRpcRequestParams = decodeToSignRequestJSON(signerAddress, signDoc)
    const signResult = await this.provider.request({
      method: 'cosmos_sendTransaction',
      params: [jsonRpcRequestParams],
    }) as string
    const tx = TxRaw.decode(fromBase64(signResult))
    const signature = toBase64(tx.signatures[0])
    return {
      signed: {
        bodyBytes: tx.bodyBytes,
        authInfoBytes: tx.authInfoBytes,
        chainId: signDoc.chainId,
        accountNumber: signDoc.accountNumber,
      },
      signature: {
        pub_key: {
          type: pubkeyType.secp256k1,
          value: accounts[0].pubkey,
        },
        signature,
      },
    }
  }
}
