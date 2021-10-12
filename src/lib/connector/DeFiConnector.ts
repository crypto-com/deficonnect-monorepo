/* eslint-disable @typescript-eslint/camelcase */
import 'regenerator-runtime/runtime'
import { IWalletConnectOptions } from '@deficonnect/types'
import Web3Provider from '@deficonnect/web3-provider'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { SessionStorage } from '../SessionStorage'
import { addUrlParams } from '../tools/url-tools'
import { DeFiConnectorClient } from '../DeFiConnectorClient'
import { DeFiWeb3ConnectorArguments } from './DeFiWeb3Connector'
import { InstallExtensionQRCodeModal } from '../InstallExtensionModal'
import { DeFiCosmosProvider, isDeFiCosmosProvider } from './DeFiCosmosProvider'

export interface DeFiConnectorArguments {
  name: string
  supprtedChainTypes: DeFiConnectorChainType[]
  bridge?: string
  eth?: DeFiWeb3ConnectorArguments
  cosmos?: DeFiCosmosConnectorArguments
}

export interface DeFiCosmosConnectorArguments {
  supportedChainIds: string[]
}

export interface DeFiConnectorProviderGenerateArguments {
  chainId: string
  chainType: string
  config: DeFiConnectorArguments
  connectorClient: DeFiConnectorClient
}

export type DeFiConnectorEventCallback = (param?: DeFiConnectorUpdate, error?: Error) => void
export type DeFiConnectorEventUnsubscribe = () => void

export enum DeFiConnectorUpdateEvent {
  Update = 'DeFiConnectorUpdate',
  Error = 'DeFiConnectorError',
  Deactivate = 'DeFiConnectorDeactivate',
}

interface EventEmitter {
  event: DeFiConnectorUpdateEvent
  callback: DeFiConnectorEventCallback
}

export type DeFiConnectorChainType = 'eth' | 'cosmos'
export interface DeFiConnectorUpdate {
  chainType?: DeFiConnectorChainType
  chainId?: string
  account?: string
  provider?: DeFiConnectorProvider
}

// export type DeFiAddressType = 'eth' | 'cro' | 'tcro'
export interface DeFiAddressTuple {
  type: string
  address: string
}

export type DeFiConnectorProvider = DeFiCosmosProvider | Web3Provider

const GLOBAL_DEFILINK_BRIDGE_URL = 'https://wallet-connect.crypto.com/api/v1/ncwconnect/relay/ws'

const formaChainType = (value: any): DeFiConnectorChainType => {
  if (value === 'eth' || value === 'cosmos') {
    return value
  }
  return 'eth'
}

export class DeFiConnector extends AbstractConnector {
  config: DeFiConnectorArguments
  eventEmitters: EventEmitter[] = []
  connectorClient?: DeFiConnectorClient

  private _provider?: DeFiConnectorProvider

  constructor(config: DeFiConnectorArguments) {
    super()
    this.config = config
  }

  async getProvider(): Promise<any> {
    return this.provider
  }
  async getChainId(): Promise<string | number> {
    return this.chainId
  }
  async getAccount(): Promise<string | null> {
    return this.account
  }

  async generateClient(): Promise<DeFiConnectorClient> {
    let connectorClient: DeFiConnectorClient
    if (typeof window.deficonnectClientGenerator === 'function') {
      connectorClient = await window.deficonnectClientGenerator(this.config)
    } else {
      const wcConfig: IWalletConnectOptions = {
        bridge: addUrlParams(this.config.bridge ?? GLOBAL_DEFILINK_BRIDGE_URL, {
          role: 'dapp',
          dapp_name: this.config.name,
        }),
        qrcodeModal: InstallExtensionQRCodeModal,
      }
      connectorClient = new DeFiConnectorClient(wcConfig, new SessionStorage())
    }
    connectorClient.connector.on('disconnect', () => {
      this.emitDeactivate()
    })
    connectorClient.connector.on('session_update', async (error: Error | null, payload: any | null) => {
      if (error) {
        this.emitError(error)
        return
      }
      this.provider = await this.generateProvider({
        chainId: this.chainId,
        chainType: this.chainType,
        connectorClient,
        config: this.config,
      })
      this.emitUpdate({
        account: this.account,
        chainType: this.chainType,
        chainId: this.chainId,
        provider: this.provider,
      })
    })
    return connectorClient
  }

  async generateProvider(params: DeFiConnectorProviderGenerateArguments): Promise<DeFiConnectorProvider> {
    const { chainId, chainType, connectorClient } = params
    if (typeof window.deficonnectProviderGenerator === 'function') {
      return await window.deficonnectProviderGenerator({ chainId, chainType, config: this.config, connectorClient })
    } else {
      if (chainType === 'eth') {
        return new Web3Provider({
          ...this.config.eth,
          connector: connectorClient.connector,
        })
      }
      if (chainType === 'cosmos') {
        return new DeFiCosmosProvider({
          supportedChainIds: this.config.cosmos?.supportedChainIds ?? [],
          client: connectorClient,
        })
      }
    }
    throw new Error('must provider eth or cosmos config')
  }

  async activate(): Promise<DeFiConnectorUpdate> {
    try {
      let connectorClient = this.connectorClient
      if (!connectorClient) {
        connectorClient = await this.generateClient()
      }
      if (this.config.supprtedChainTypes.length == 0) {
        throw new Error('must provider supprtedNetworks')
      }
      const expectChainType = this.config.supprtedChainTypes[0]
      let expectChainId = '1'
      if (expectChainType === 'eth') {
        if (this.config.eth == undefined) {
          throw new Error('must provider eth config')
        }
        expectChainId = `${this.config.eth.supportedChainIds[0] ?? 1}`
      }
      if (expectChainType === 'cosmos') {
        if (this.config.cosmos == undefined) {
          throw new Error('must provider cosmos config')
        }
        expectChainId = `${this.config.cosmos.supportedChainIds[0] ?? 1}`
      }
      const { chainId, chainType } = await connectorClient.connector.connect({
        chainId: expectChainId,
        chainType: expectChainType,
      })
      this.provider = await this.generateProvider({
        chainId,
        chainType,
        connectorClient,
        config: this.config,
      })
      this.provider = await this.generateProvider({ chainId, chainType, connectorClient, config: this.config })
      await this.provider?.enable()
      this.connectorClient = connectorClient
      return {
        account: this.account,
        chainType: this.chainType,
        chainId: this.chainId,
        provider: this.provider,
      }
    } catch (error) {
      console.error('DeFiConnector activate error:', error)
      throw error
    }
  }

  getAddressList(addressTypes: string[]): DeFiAddressTuple[] {
    const connectorClient = this.connectorClient
    if (!connectorClient) {
      throw new Error('you has not active this connector')
    }
    return addressTypes.map((type) => {
      return {
        type,
        address: connectorClient.connector.session.wallets[0].addresses[type].address,
      }
    })
  }

  async deactivate(): Promise<void> {
    if (!this.connectorClient) {
      return
    }
    return this.connectorClient.connector.killSession()
  }

  get chainId(): string {
    return `${this.connectorClient?.connector.chainId ?? ''}`
  }

  get chainType(): DeFiConnectorChainType {
    return formaChainType(this.connectorClient?.connector.chainType)
  }

  get account(): string {
    return this.connectorClient?.connector.session.accounts[0] ?? ''
  }

  get provider(): DeFiConnectorProvider | undefined {
    return this._provider
  }
  set provider(value: DeFiConnectorProvider | undefined) {
    this._provider = value
    if (!isDeFiCosmosProvider(value)) {
      window.ethereum = value
    }
  }

  onEvent(event: DeFiConnectorUpdateEvent, callback: DeFiConnectorEventCallback): DeFiConnectorEventUnsubscribe {
    const eventEmitter = { event, callback }
    this.eventEmitters.push(eventEmitter)
    return () => {
      this.eventEmitters = this.eventEmitters.filter((item) => item !== eventEmitter)
    }
  }

  protected emitUpdate(update: DeFiConnectorUpdate): void {
    this.eventEmitters.forEach((emitter) => {
      if (emitter.event === DeFiConnectorUpdateEvent.Update) {
        emitter.callback(update, undefined)
      }
    })
  }

  protected emitError(error: Error): void {
    this.eventEmitters.forEach((emitter) => {
      if (emitter.event === DeFiConnectorUpdateEvent.Error) {
        emitter.callback(undefined, error)
      }
    })
  }

  protected emitDeactivate(): void {
    this.eventEmitters.forEach((emitter) => {
      if (emitter.event === DeFiConnectorUpdateEvent.Deactivate) {
        emitter.callback(undefined, undefined)
      }
    })
    this.connectorClient = undefined
  }
}
