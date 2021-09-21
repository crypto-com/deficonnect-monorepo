/* eslint-disable @typescript-eslint/camelcase */
import { IWalletConnectOptions } from '@deficonnect/types'
import Web3Provider from '@deficonnect/web3-provider'
import { SessionStorage } from '../SessionStorage'
import { addUrlParams } from '../tools'
import { DeFiConnectorClient } from '../DeFiConnectorClient'
import { DeFiWeb3ConnectorArguments } from './DeFiWeb3Connector'
import { InstallExtensionQRCodeModal } from '../InstallExtensionModal'

export interface DeFiConnectorArguments {
  name: string
  logo: string
  bridge?: string
  eth?: DeFiWeb3ConnectorArguments
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

const GLOBAL_DEFILINK_BRIDGE_URL = 'https://wallet-connect.crypto.com/api/v1/ncwconnect/relay/ws'

export interface DeFiConnectorUpdate {
  networkId?: string
  chainId?: string
  account?: string
  provider?: any
}

export class DeFiConnector {
  config: DeFiConnectorArguments
  eventEmitters: EventEmitter[] = []
  connectorClient: DeFiConnectorClient

  private _provider: any

  constructor(config: DeFiConnectorArguments) {
    this.config = config
    this.connectorClient = this.generateClient()
  }

  generateClient(): DeFiConnectorClient {
    const wcConfig: IWalletConnectOptions = {
      bridge: addUrlParams(this.config.bridge ?? GLOBAL_DEFILINK_BRIDGE_URL, {
        role: 'dapp',
        dapp_name: this.config.name,
      }),
      qrcodeModal: InstallExtensionQRCodeModal,
    }
    const connectorClient = new DeFiConnectorClient(wcConfig, new SessionStorage())
    connectorClient.connector.on('disconnect', () => {
      this.emitDeactivate()
    })
    connectorClient.connector.on('session_update', (error: Error | null, payload: any | null) => {
      if (error) {
        this.emitError(error)
        return
      }
      this.emitUpdate({
        account: connectorClient.connector.session.accounts[0],
        networkId: this.networkId,
        chainId: this.chainId,
        provider: '',
      })
    })
    return connectorClient
  }

  async activate(): Promise<DeFiConnectorUpdate> {
    let chainId = 1
    let networkId = 'eth'
    if (this.config.eth) {
      chainId = this.config.eth.chainId ?? 1
      networkId = 'eth'
      this.provider = new Web3Provider({
        pollingInterval: 1500,
        connector: this.connectorClient.connector,
      })
    }
    await this.connectorClient.connector.connect({ chainId, networkId })
    await this.provider.enable()
    return {
      account: this.account,
      networkId: this.networkId,
      chainId: this.chainId,
      provider: this.provider,
    }
  }

  deactivate(): Promise<void> {
    return this.connectorClient.connector.killSession()
  }

  get chainId(): string {
    return `${this.connectorClient.connector.session.chainId}`
  }

  get networkId(): string {
    return `${this.connectorClient.connector.session.networkId}`
  }

  get account(): string {
    return this.connectorClient.connector.session.accounts[0]
  }

  get provider(): any {
    return this._provider
  }
  set provider(value: any) {
    this._provider = value
  }

  on(event: DeFiConnectorUpdateEvent, callback: DeFiConnectorEventCallback): DeFiConnectorEventUnsubscribe {
    const eventEmitter = { event, callback }
    this.eventEmitters.push(eventEmitter)
    return () => {
      this.eventEmitters = this.eventEmitters.filter((item) => item !== eventEmitter)
    }
  }

  protected emitUpdate(update: DeFiConnectorUpdate): void {
    this.eventEmitters.forEach((emitter) => {
      if (emitter.event == DeFiConnectorUpdateEvent.Update) {
        emitter.callback(update, undefined)
      }
    })
  }

  protected emitError(error: Error): void {
    this.eventEmitters.forEach((emitter) => {
      if (emitter.event == DeFiConnectorUpdateEvent.Error) {
        emitter.callback(undefined, error)
      }
    })
  }

  protected emitDeactivate(): void {
    this.eventEmitters.forEach((emitter) => {
      if (emitter.event == DeFiConnectorUpdateEvent.Deactivate) {
        emitter.callback(undefined, undefined)
      }
    })
    this.connectorClient = this.generateClient()
  }
}
