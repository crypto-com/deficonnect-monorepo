import { decodeBech32Pubkey } from '@cosmjs/amino'
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

export class DeFiCosmosProvider {
  protected isDeFiCosmosProvider = true

  public client: DeFiConnectorClient
  constructor(config: DeFiCosmosProviderArguments) {
    const { client } = config
    this.client = client
  }
  get signer(): OfflineDirectSigner {
    const account = this.client.connector.session.accounts[0]
    const pubkey = decodeBech32Pubkey(account)
    const accountData: AccountData = {
      address: account,
      algo: 'secp256k1',
      pubkey: pubkey.value,
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
    const { chainId, networkId } = this.client.connector.session
    const account = this.client.connector.session.accounts[0]
    return this.client.connector.sendJSONRequest({
      method: 'cosmos_sendTransaction',
      params: [payload],
      session: {
        chainId: chainId as string,
        networkId: networkId as string,
        account,
      },
    })
  }
}
