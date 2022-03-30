/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthInfo, SignDoc, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { fromBase64, toBase64 } from '@cosmjs/encoding'
import { DirectSignResponse, isTsProtoGeneratedType, TsProtoGeneratedType } from '@cosmjs/proto-signing'
import { defaultRegistryTypes } from '@cosmjs/stargate'
import Long from 'long'
import { CosmosSignRequestJSON, CosmosSignResponseJSON } from '../connector/CosmosTypes'

function queryPrototypeFromUrl(typeUrl: string): TsProtoGeneratedType {
  const ProtobufType = defaultRegistryTypes.find((item) => item[0] === typeUrl)?.[1]
  if (ProtobufType && isTsProtoGeneratedType(ProtobufType)) {
    return ProtobufType
  }
  throw new Error(`can not find ProtoGeneratedType for typeUrl:${typeUrl}`)
}

export const transformProtoToJSON = (object: any): any => {
  const result = {}
  if (object instanceof Array) {
    return object.map((item) => transformProtoToJSON(item))
  }
  if (object && typeof object.typeUrl === 'string' && typeof object.value === 'string') {
    try {
      const ProtobufType = queryPrototypeFromUrl(object.typeUrl)
      return {
        typeUrl: object.typeUrl,
        value: transformProtoToJSON(ProtobufType.toJSON(ProtobufType.decode(fromBase64(object.value)))),
      }
    } catch (error) {
      return object
    }
  }
  for (const key in object) {
    const value = object[key]
    if (typeof value == 'object') {
      result[key] = transformProtoToJSON(value)
      continue
    }
    result[key] = value
  }
  return result
}

export const transformJSONtoProto = (object: any): any => {
  const result = {}
  if (object instanceof Array) {
    return object.map((item) => transformJSONtoProto(item))
  }
  if (object && typeof object.typeUrl === 'string' && typeof object.value === 'object') {
    try {
      const ProtobufType = queryPrototypeFromUrl(object.typeUrl)
      const JSONValue = transformJSONtoProto(object.value)
      const newValue = ProtobufType.encode(ProtobufType.fromJSON(JSONValue)).finish()
      return {
        typeUrl: object.typeUrl,
        value: toBase64(newValue),
      }
    } catch (error) {
      return object
    }
  }
  for (const key in object) {
    const value = object[key]
    if (typeof value == 'object') {
      result[key] = transformJSONtoProto(value)
      continue
    }
    result[key] = value
  }
  return result
}

export const decodeToSignRequestJSON = (signerAddress: string, signDoc: SignDoc): CosmosSignRequestJSON => {
  const txBody = TxBody.decode(signDoc.bodyBytes)
  const authInfo = AuthInfo.decode(signDoc.authInfoBytes)
  return {
    signerAddress,
    signDoc: {
      chainId: signDoc.chainId,
      accountNumber: signDoc.accountNumber.toString(),
      body: transformProtoToJSON(TxBody.toJSON(txBody)),
      authInfo: transformProtoToJSON(AuthInfo.toJSON(authInfo)),
    },
  }
}

export const encodeJSONToSignResponse = (respJSON: CosmosSignResponseJSON): DirectSignResponse => {
  return {
    signed: {
      chainId: respJSON.signed.chainId,
      accountNumber: Long.fromString(respJSON.signed.accountNumber),
      bodyBytes: TxBody.encode(TxBody.fromJSON(transformJSONtoProto(respJSON.signed.body))).finish(),
      authInfoBytes: AuthInfo.encode(AuthInfo.fromJSON(transformJSONtoProto(respJSON.signed.authInfo))).finish(),
    },
    signature: respJSON.signature,
  }
}
