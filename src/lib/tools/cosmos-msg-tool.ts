import { AuthInfo, SignDoc, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import {
  CosmosAnyJSON,
  CosmosMsgTransferJSON,
  CosmosSignRequestJSON,
  CosmosSignResponseJSON,
} from '../connector/CosmosTypes'
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx'
import { fromBase64, toBase64 } from '@cosmjs/encoding'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { Any } from 'cosmjs-types/google/protobuf/any'

export const decodeToSignRequestJSON = (signerAddress: string, signDoc: SignDoc): CosmosSignRequestJSON => {
  const txBody = TxBody.decode(signDoc.bodyBytes)
  const messages = txBody.messages.map((msg) => {
    return {
      typeUrl: msg.typeUrl,
      value: MsgTransfer.decode(msg.value),
    }
  })
  const authInfo = AuthInfo.decode(signDoc.authInfoBytes)
  const signerInfos = authInfo.signerInfos.map((signerInfo) => {
    let publicKey: CosmosAnyJSON<string> | undefined
    if (signerInfo.publicKey) {
      publicKey = {
        typeUrl: signerInfo.publicKey?.typeUrl,
        value: signerInfo.publicKey && toBase64(signerInfo.publicKey.value),
      }
    }
    return {
      modeInfo: signerInfo.modeInfo,
      sequence: signerInfo.sequence,
      publicKey,
    }
  })
  return {
    signerAddress,
    signDoc: {
      chainId: signDoc.chainId,
      accountNumber: signDoc.accountNumber,
      body: {
        ...txBody,
        messages,
      },
      authInfo: {
        ...authInfo,
        signerInfos,
      },
    },
  }
}

export const encodeJSONToSignResponse = (respJSON: CosmosSignResponseJSON): DirectSignResponse => {
  const messages = respJSON.signDoc.body.messages.map((msg) => {
    return {
      typeUrl: msg.typeUrl,
      value: MsgTransfer.encode(msg.value).finish(),
    }
  })
  const signerInfos = respJSON.signDoc.authInfo.signerInfos.map((signerInfo) => {
    let publicKey: Any | undefined
    if (signerInfo.publicKey) {
      publicKey = {
        typeUrl: signerInfo.publicKey.typeUrl,
        value: fromBase64(signerInfo.publicKey.value),
      }
    }
    return {
      modeInfo: signerInfo.modeInfo,
      sequence: signerInfo.sequence,
      publicKey,
    }
  })
  const txBody: TxBody = {
    ...respJSON.signDoc.body,
    messages,
    extensionOptions: [],
    nonCriticalExtensionOptions: [],
  }

  return {
    signed: {
      chainId: respJSON.signDoc.chainId,
      accountNumber: respJSON.signDoc.accountNumber,
      bodyBytes: TxBody.encode(txBody).finish(),
      authInfoBytes: AuthInfo.encode({
        ...respJSON.signDoc.authInfo,
        signerInfos,
      }).finish(),
    },
    signature: respJSON.signature,
  }
}
