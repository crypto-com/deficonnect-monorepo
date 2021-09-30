import { Coin } from '@cosmjs/amino'
import { ModeInfo, SignerInfo, Fee } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { Height } from 'cosmjs-types/ibc/core/client/v1/client'

export interface CosmosSignRequestJSON {
  signerAddress: string
  signDoc: CosmosSignDocJSON
}

export interface CosmosSignDocJSON {
  body: CosmosTxBodyJSON
  authInfo: CosmosAuthInfoJSON
  chainId: string
  accountNumber: Long
}

export interface CosmosTxBodyJSON {
  messages: CosmosAnyJSON<CosmosMsgTransferJSON>[]
  memo: string
  timeoutHeight: Long
}
export interface CosmosAnyJSON<T> {
  typeUrl: string
  value: T
}

export interface CosmosMsgTransferJSON {
  sourcePort: string
  sourceChannel: string
  token?: Coin
  sender: string
  receiver: string
  timeoutHeight?: Height
  timeoutTimestamp: Long
}

export interface CosmosAuthInfoJSON {
  signerInfos: CosmosSignerInfoJSON[]
  fee?: Fee
}

export interface CosmosSignerInfoJSON {
  publicKey?: CosmosAnyJSON<string>
  modeInfo?: ModeInfo
  sequence: Long
}

export interface CosmosSignResponseJSON {
  signDoc: CosmosSignDocJSON
  signature: StdSignature
}
