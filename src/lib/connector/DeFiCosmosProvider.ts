import { DeFiConnectorClient } from '../DeFiConnectorClient'

export interface DeFiCosmosConnectorArguments {
  client: DeFiConnectorClient
}

export class DeFiCosmosProvider {
  public client: DeFiConnectorClient
  constructor(config: DeFiCosmosConnectorArguments) {
    const { client } = config
    this.client = client
  }
  send = async (payload: any): Promise<any> => {
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
