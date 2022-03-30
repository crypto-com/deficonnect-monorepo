import { fromBase64, toBase64 } from '@cosmjs/encoding'
import { TxBody, AuthInfo } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { expect } from 'chai'
import { transformProtoToJSON, transformJSONtoProto } from './cosmos-msg-tool'

it('cosmos-msg-tool.test', () => {
  const TxBodyBase64 =
    'CsABCikvaWJjLmFwcGxpY2F0aW9ucy50cmFuc2Zlci52MS5Nc2dUcmFuc2ZlchKSAQoIdHJhbnNmZXISC2NoYW5uZWwtMTI1GhYKCGJhc2V0Y3JvEgoxMDAwMDAwMDAwIit0Y3JvMTl5Z2FodmNmaHJ1OGtmd3l4M2VqbGxqeng2dDdyY2d3ZWVzcnQ0KipldGgxbjBxOXMwMjZtYzM0d2RhZjI2czAyY2Z4MDNqazJlNzR0YWRwdzM4gPymrNTXhNUW'
  const fromBase64R = fromBase64(TxBodyBase64)
  const tx = TxBody.decode(fromBase64R)
  const txJSON = transformProtoToJSON(TxBody.toJSON(tx))
  console.info('txJSON:', JSON.stringify(txJSON))
  const base64Result = toBase64(TxBody.encode(TxBody.fromJSON(transformJSONtoProto(txJSON))).finish())
  expect(base64Result).to.eql(TxBodyBase64)

  const authInfoBase64 = fromBase64(
    'Ck4KRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiEDYYToBTdYWFoiCn48H2/Pn6MWFgkWWMmw74ZWfASQlQYSBAoCCAESBBDAqQc='
  )
  const authInfo = AuthInfo.decode(authInfoBase64)
  const authJSON = transformProtoToJSON(AuthInfo.toJSON(authInfo))
  console.info('authJSON:', JSON.stringify(authJSON))
  const authBase64Result = toBase64(AuthInfo.encode(AuthInfo.fromJSON(transformJSONtoProto(authJSON))).finish())
  console.info('authBase64Result:', authBase64Result)
})
