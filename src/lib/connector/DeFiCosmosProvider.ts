import { decodeBech32Pubkey, encodeBech32Pubkey } from '@cosmjs/amino'
import { Bech32 } from '@cosmjs/encoding'
import { AccountData, DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing'
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { DeFiConnectorClient } from '../DeFiConnectorClient'
import { DeFiCosmosConnectorArguments } from './DeFiConnector'

export interface DeFiCosmosProviderArguments extends DeFiCosmosConnectorArguments {
  client: DeFiConnectorClient
}

export function isDeFiCosmosProvider(object: any): object is DeFiCosmosProvider {
  return typeof object.isDeFiCosmosProvider !== 'undefined'
}

const CroChainInfo = [
  {
    chainId: 'crypto-org-chain-mainnet-1',
    addressType: 'cro',
  },
  {
    chainId: 'testnet-croeseid-4',
    addressType: 'tcro',
  },
]
export class DeFiCosmosProvider {
  protected isDeFiCosmosProvider = true
  public client: DeFiConnectorClient
  constructor(config: DeFiCosmosProviderArguments) {
    const { client } = config
    this.client = client
  }
  get account(): string {
    console.info('get account:')
    const addressType =
      CroChainInfo.find((item) => item.chainId === this.client.connector.chainId)?.addressType ?? 'cro'
    console.info('get account addressType:', addressType)
    console.info('get account:', this.client.connector.session.wallets[0].address[addressType])
    return this.client.connector.session.wallets[0].address[addressType] ?? ''
  }
  get signer(): OfflineDirectSigner {
    const account = this.account
    const accountData: AccountData = {
      address: account,
      algo: 'secp256k1',
      pubkey: Bech32.decode(account).data,
    }
    return {
      getAccounts: async (): Promise<AccountData[]> => [accountData],
      signDirect: async (signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> => {
        return this.sendTransaction({
          signerAddress,
          signDoc,
        })
      },
    }
  }

  async enable(): Promise<void> {
    return
  }
  sendTransaction = async (payload: any): Promise<any> => {
    const { chainId, chainType } = this.client.connector.session
    const account = this.account
    return this.client.connector.sendJSONRequest({
      method: 'cosmos_sendTransaction',
      params: [payload],
      session: {
        chainId: chainId as string,
        chainType: chainType as string,
        account,
      },
    })
  }
}
