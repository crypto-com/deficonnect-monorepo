import { IWalletConnectOptions } from '@deficonnect/types'
import Web3Provider from '@deficonnect/web3-provider'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { addUrlParams } from '../tools/url-tools'
import { DeFiConnectorClient } from '../DeFiConnectorClient'
import { DeFiWeb3ConnectorArguments } from './DeFiWeb3Connector'
import { InstallExtensionQRCodeModal } from '../InstallExtensionModal'
import { DeFiCosmosProvider } from './DeFiCosmosProvider'
import { DefaultSessionStorage } from '../SessionStorage'

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

/**
 * the type value is like = 'eth' | 'cro' | 'tcro'
 */
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

  chainId = ''
  chainType: DeFiConnectorChainType = 'eth'
  accounts: string[] = []

  async getProvider(): Promise<any> {
    return this.provider
  }
  async getChainId(): Promise<string | number> {
    return this.chainId
  }
  async getAccount(): Promise<string | null> {
    return this.accounts[0]
  }

  get _supportedChainIds(): string[] {
    const ethChainIds = this.config.eth?.supportedChainIds.map((item) => item.toString()) ?? []
    const cosmosChainIds = this.config.cosmos?.supportedChainIds ?? []
    return ethChainIds.concat(cosmosChainIds)
  }

  async generateClient(): Promise<DeFiConnectorClient> {
    let connectorClient: DeFiConnectorClient

    async function checkIsReady(times = 0) {
      return new Promise((resolve) => {
        function check() {
          if (times > 0 && typeof window.deficonnectClientGenerator !== 'function') {
            setTimeout(async () => {
              --times
              check()
            }, 100)
            return
          }
          resolve(true)
        }
        check()
      })
    }

    await checkIsReady(10)

    if (typeof window.deficonnectClientGenerator === 'function') {
      connectorClient = await window.deficonnectClientGenerator(this.config)
      if (typeof connectorClient.clearSessionStorage == 'undefined') {
        connectorClient.clearSessionStorage = DeFiConnectorClient.prototype.clearSessionStorage
      }
    } else {
      const wcConfig: IWalletConnectOptions = {
        bridge: addUrlParams(this.config.bridge ?? GLOBAL_DEFILINK_BRIDGE_URL, {
          role: 'dapp',
          dapp_name: this.config.name,
        }),
        qrcodeModal: InstallExtensionQRCodeModal,
      }
      const sessionStorage = new DefaultSessionStorage({ supportedChainIds: this._supportedChainIds })
      connectorClient = new DeFiConnectorClient({
        connectorOpts: wcConfig,
        sessionStorage,
      })
    }
    connectorClient.connector.on('disconnect', () => {
      this.emitDeactivate()
    })
    connectorClient.connector.on('session_update', async (error: Error | null, payload: any | null) => {
      if (error) {
        this.emitError(error)
        return
      }
      if (!payload?.params[0]) {
        return
      }
      const { params: [{ chainId, chainType, accounts }] = [] } = payload
      if (!chainId || !chainType || !accounts) {
        return
      }
      this.chainId = chainId
      this.chainType = chainType
      this.accounts = accounts
      this.provider = await this.generateProvider({
        chainId,
        chainType,
        connectorClient,
        config: this.config,
      })
      await this.provider?.enable()
      this.emitUpdate({
        account: accounts[0],
        chainType,
        chainId,
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
      const { chainId, chainType, accounts } = await connectorClient.connector.connect({
        chainId: expectChainId,
        chainType: expectChainType,
      })
      this.chainId = chainId
      this.chainType = formaChainType(chainType)
      this.accounts = accounts
      this.provider = await this.generateProvider({
        chainId,
        chainType,
        connectorClient,
        config: this.config,
      })
      await this.provider?.enable()
      this.connectorClient = connectorClient
      return {
        account: accounts[0],
        chainType: formaChainType(chainType),
        chainId,
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
  public async close(): Promise<void> {
    // called by dapp when user click the disconnect function

    // avoid the dApp never being able to connect to the extension again
    this.connectorClient?.clearSessionStorage()
    try {
      await this.provider?.close()
    } finally {
      await this.connectorClient?.connector.killSession()
    }
  }

  async deactivate(): Promise<void> {
    // called by dapp when chainId notsupport or something error

    // avoid the dApp never being able to connect to the extension again
    this.connectorClient?.clearSessionStorage()

    if (typeof this.provider?.stop == 'function') {
      this.provider?.stop()
    }
    await this.connectorClient?.connector.killSession()
    this.emitDeactivate()
  }

  get provider(): DeFiConnectorProvider | undefined {
    return this._provider
  }
  set provider(value: DeFiConnectorProvider | undefined) {
    this._provider = value
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
