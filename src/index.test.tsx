/* eslint-disable @typescript-eslint/camelcase */
import { encodeAminoPubkey, encodeSecp256k1Pubkey, Pubkey } from '@cosmjs/amino'
import { Bech32, fromBase64, fromHex, toBase64, toHex } from '@cosmjs/encoding'
import { TxBody, AuthInfo, SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { Any } from 'cosmjs-types/google/protobuf/any'
// import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx'
import { decodeToSignRequestJSON, encodeJSONToSignResponse } from './lib/tools/cosmos-msg-tool'

describe('ExampleComponent', () => {
  it('is truthy', () => {
    // console.info('decodeBech32Pubkey: ', decodeBech32Pubkey('tcro19ygahvcfhru8kfwyx3ejlljzx6t7rcgweesrt4'))
    // const { words } = bech32.decode('cosmospub1addwnpepqd8sgxq7aw348ydctp3n5ajufgxp395hksxjzc6565yfp56scupfqhlgyg5')
    // const a = '0x' + Buffer.from(bech32.fromWords(words)).toString('hex')
    // console.info('a:', a)
    // const result = Bech32.decode('cosmospub1addwnpepqd8sgxq7aw348ydctp3n5ajufgxp395hksxjzc6565yfp56scupfqhlgyg5')
    // console.info('Bech32 result:', result)
    // console.info('encodeSecp256k1Pubkey(result.data) result 2:', encodeSecp256k1Pubkey(result.data))
    // console.info('Bech32 result 2:', Buffer.from(result.data).toString('hex'))
    // const pubkey: Pubkey = {
    //   type: 'tendermint/PubKeySecp256k1',
    //   value: 'A2GE6AU3WFhaIgp+PB9vz5+jFhYJFljJsO+GVnwEkJUG',
    // }
    // const result = encodeAminoPubkey(pubkey)
    // console.info('encodeAminoPubkey(pubkey):', encodeAminoPubkey(pubkey))
    // console.info('Bech32 result 2:', Buffer.from(result).toString('hex'))
    // const fromBase64Result = fromBase64('A2GE6AU3WFhaIgp+PB9vz5+jFhYJFljJsO+GVnwEkJUG')
    // console.info('fromBase64 result:', fromBase64Result)
    // console.info('encodeSecp256k1Pubkey(result.data) result 2:', encodeSecp256k1Pubkey(fromBase64Result))
  })
  // it('test2', () => {
  //   const fromHexR = fromHex('0399c6f51ad6f98c9c583f8e92bb7758ab2ca9a04110c0a1126ec43e5453d196c1')
  //   const fromBase64R = fromBase64('Avksd3ok3bc1TNYX1Fncv1u0ypYG0qlwe188T2ptPxxQ')
  //   console.info('fromHex:', fromBase64R)
  //   console.info('encodeSecp256k1Pubkey:', encodeSecp256k1Pubkey(fromBase64R))
  //   console.info('toBase64:', toBase64(fromBase64R))
  // })
  // it('signDoc decode', () => {
  //   const fromBase64R = fromBase64(
  //     'CsABCikvaWJjLmFwcGxpY2F0aW9ucy50cmFuc2Zlci52MS5Nc2dUcmFuc2ZlchKSAQoIdHJhbnNmZXISC2NoYW5uZWwtMTI1GhYKCGJhc2V0Y3JvEgoxMDAwMDAwMDAwIit0Y3JvMTl5Z2FodmNmaHJ1OGtmd3l4M2VqbGxqeng2dDdyY2d3ZWVzcnQ0KipldGgxbjBxOXMwMjZtYzM0d2RhZjI2czAyY2Z4MDNqazJlNzR0YWRwdzM4gPymrNTXhNUW'
  //   )
  //   const tx = TxBody.decode(fromBase64R)
  //   console.info('transformProtoToJSON:', JSON.stringify(transformProtoToJSON(TxBody.toJSON(tx))))
  //   console.info('tx1:' + JSON.stringify(TxBody.toJSON(tx)))
  //   console.info('tx.messages1:', tx.messages[0].value)
  //   const path = 'cosmjs-types' + tx.messages[0].typeUrl.replace(/\./g, '/')
  //   const compontens = path.split('/')
  //   const latestComponent = compontens.pop() || 'default'
  //   compontens.push('tx')
  //   const MessageObj = require(compontens.join('/'))[latestComponent]
  //   // const MessageObj = require(`cosmjs-types/ibc/applications/transfer/v1/tx`).MsgTransfer
  //   console.info('tx.messages2:', MessageObj.toJSON(MessageObj.decode(tx.messages[0].value)))

  //   const authInfoBase64 = fromBase64(
  //     'Ck4KRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiEDYYToBTdYWFoiCn48H2/Pn6MWFgkWWMmw74ZWfASQlQYSBAoCCAESBBDAqQc='
  //   )
  //   const authInfo = AuthInfo.decode(authInfoBase64)
  //   console.info('authInfo:', AuthInfo.toJSON(authInfo))
  //   console.info('transformProtoToJSON authInfo:', JSON.stringify(transformProtoToJSON(AuthInfo.toJSON(authInfo))))
  // })
  it('cosmos JSON decode', () => {
    const siginJSONstring = `{"bodyBytes":"CsABCikvaWJjLmFwcGxpY2F0aW9ucy50cmFuc2Zlci52MS5Nc2dUcmFuc2ZlchKSAQoIdHJhbnNmZXISC2NoYW5uZWwtMTI1GhYKCGJhc2V0Y3JvEgoxMDAwMDAwMDAwIit0Y3JvMTl5Z2FodmNmaHJ1OGtmd3l4M2VqbGxqeng2dDdyY2d3ZWVzcnQ0KipldGgxbjBxOXMwMjZtYzM0d2RhZjI2czAyY2Z4MDNqazJlNzR0YWRwdzM4gMTuz+CentUW","authInfoBytes":"ClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiEDYYToBTdYWFoiCn48H2/Pn6MWFgkWWMmw74ZWfASQlQYSBAoCCAEYARIEEMCpBw==","chainId":"testnet-croeseid-4","accountNumber":"1338"}`
    const signDoc = SignDoc.fromJSON(JSON.parse(siginJSONstring))
    const decodeR = decodeToSignRequestJSON('tcro19ygahvcfhru8kfwyx3ejlljzx6t7rcgweesrt4', signDoc)
    console.info('decodeR:', JSON.stringify(decodeR, null, 2))
    const encodeR = encodeJSONToSignResponse({
      signDoc: decodeR.signDoc,
      signature: {
        pub_key: {
          type: 'pub_key123',
          value: 'pub_key123',
        },
        signature: 'signature',
      },
    })
    // console.info('encodeR:', JSON.stringify(encodeR, null, 2))
    console.info(
      'encodeR2:',
      JSON.stringify(decodeToSignRequestJSON('tcro19ygahvcfhru8kfwyx3ejlljzx6t7rcgweesrt4', encodeR.signed), null, 2)
    )
    const betch32 = Bech32.decode('tcrc1n0q9s026mc34wdaf26s02cfx03jk2e74gcavzw')
    console.info('betch32:', betch32.prefix)
    console.info('toHex:', toHex(betch32.data))
    console.info('toBase64:', toBase64(betch32.data))
  })
})
