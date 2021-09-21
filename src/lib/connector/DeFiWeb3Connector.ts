import { ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { IClientMeta, IRPCMap } from '@deficonnect/types'
import { getClientMeta } from '@deficonnect/utils'
import { DeFiConnector, DeFiConnectorUpdateEvent } from './DeFiConnector'

export const URI_AVAILABLE = 'URI_AVAILABLE'

export interface DeFiWeb3ConnectorArguments {
  supportedChainIds?: number[]
  rpc?: IRPCMap
  infuraId?: string
  chainId?: number
  clientMeta?: IClientMeta
  pollingInterval?: number
  bridge?: string
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

function getSupportedChains({ supportedChainIds, rpc }: DeFiWeb3ConnectorArguments): number[] | undefined {
  if (supportedChainIds) {
    return supportedChainIds
  }
  return rpc ? Object.keys(rpc).map((k) => Number(k)) : undefined
}

export class DeFiWeb3Connector extends AbstractConnector {
  defiConnector: DeFiConnector

  constructor(config: DeFiWeb3ConnectorArguments) {
    super({ supportedChainIds: getSupportedChains(config) })
    const clientMeta = config.clientMeta || getClientMeta() || undefined

    this.defiConnector = new DeFiConnector({
      name: clientMeta?.name ?? '',
      logo: clientMeta?.icons[0] ?? '',
      bridge: config.bridge,
      eth: config,
    })
    this.defiConnector.on(DeFiConnectorUpdateEvent.Update, (params) => {
      if (!params) {
        return
      }
      const { chainId, provider, account } = params
      this.emitUpdate({ chainId, provider, account })
    })
    this.defiConnector.on(DeFiConnectorUpdateEvent.Deactivate, () => {
      this.emitDeactivate()
    })
  }

  public async activate(): Promise<ConnectorUpdate> {
    const { chainId, provider, account } = await this.defiConnector.activate()
    return { chainId, provider, account }
  }

  public async getProvider(): Promise<any> {
    return this.defiConnector.provider
  }

  public async getChainId(): Promise<number | string> {
    const provider = await this.getProvider()
    return provider.send('eth_chainId')
  }

  public async getAccount(): Promise<null | string> {
    const provider = await this.getProvider()
    return provider.send('eth_accounts').then((accounts: string[]): string => accounts[0])
  }

  public close(): Promise<void> {
    return this.defiConnector.deactivate()
  }

  public deactivate(): void {
    this.defiConnector.deactivate()
  }
}
