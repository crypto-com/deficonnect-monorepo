import { Coin, StdSignature } from '@cosmjs/amino'
import { ModeInfo, Fee } from 'cosmjs-types/cosmos/tx/v1beta1/tx'

export interface CosmosSignRequestJSON {
  signerAddress: string
  signDoc: CosmosSignDocJSON
}

export interface CosmosSignDocJSON {
  body: CosmosTxBodyJSON
  authInfo: CosmosAuthInfoJSON
  chainId: string
  accountNumber: string
}

export interface CosmosTxBodyJSON {
  messages: CosmosAnyJSON<CosmosMsgTransferJSON>[]
  memo: string
  timeoutHeight: string
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
  timeoutHeight?: {
    revisionNumber: string
    revisionHeight: string
  }
  timeoutTimestamp: string
}

export interface CosmosAuthInfoJSON {
  signerInfos: CosmosSignerInfoJSON[]
  fee?: Fee
}

export interface CosmosSignerInfoJSON {
  publicKey?: CosmosAnyJSON<string>
  modeInfo?: ModeInfo
  sequence: string
}

export interface CosmosSignResponseJSON {
  signed: CosmosSignDocJSON
  signature: StdSignature
}
