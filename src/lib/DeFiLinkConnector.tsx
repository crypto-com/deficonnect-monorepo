import React from 'react'
import { ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { IClientMeta, IRPCMap, IWalletConnectProviderOptions } from '@deficonnect/types'
import { SessionStorage } from './SessionStorage'
import { DeFiLinkConnectorGenerator } from './WalletConnect'
import { InstallExtensionQRCodeModal } from './InstallExtensionModal'
import WalletConnectProvider from '@deficonnect/web3-provider'
import { addUrlParams } from './tools'
import { getClientMeta } from '@deficonnect/utils'

export const URI_AVAILABLE = 'URI_AVAILABLE'

export interface DeFiLinkConnectorArguments {
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

function getSupportedChains({ supportedChainIds, rpc }: DeFiLinkConnectorArguments): number[] | undefined {
  if (supportedChainIds) {
    return supportedChainIds
  }
  return rpc ? Object.keys(rpc).map((k) => Number(k)) : undefined
}

export class DeFiLinkConnector extends AbstractConnector {
  private readonly config: IWalletConnectProviderOptions

  public walletConnectProvider?: any
  public cryptoExtentionProvider?: any

  constructor(config: DeFiLinkConnectorArguments) {
    super({ supportedChainIds: getSupportedChains(config) })
    const clientMeta = config.clientMeta || getClientMeta() || undefined
    this.config = {
      ...config,
      qrcode: false,
      clientMeta,
      bridge: 'https://wallet-connect.crypto.com/api/v1/ncwconnect/relay/ws',
    }

    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
  }

  private handleChainChanged(chainId: number | string): void {
    this.emitUpdate({ chainId })
  }

  private handleAccountsChanged(accounts: string[]): void {
    this.emitUpdate({ account: accounts[0] })
  }

  private handleDisconnect(): void {
    this.emitDeactivate()
    // we have to do this because of a @deficonnect/web3-provider bug
    if (this.walletConnectProvider) {
      this.walletConnectProvider.stop()
      this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged)
      this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged)
      this.walletConnectProvider = undefined
    }
    this.emitDeactivate()
  }

  getDocument(): Document {
    let document: Document | undefined
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
      document = window.document
    }
    if (!document) {
      throw new Error('document is not defined in Window')
    }
    return document
  }

  public hasLocalStoragedSession(): boolean {
    const storage = new SessionStorage()
    if (storage.getSession()) {
      return true
    }
    return false
  }

  public async activate(): Promise<ConnectorUpdate> {
    let walletConnectProvider = this.walletConnectProvider
    if (!walletConnectProvider && typeof window.cryptoconnectProviderGenerator === 'function') {
      walletConnectProvider = await window.cryptoconnectProviderGenerator(this.config)
    }
    if (!walletConnectProvider) {
      const { clientMeta: { name: dappName = '' } = {} } = this.config
      // eslint-disable-next-line @typescript-eslint/camelcase
      const params = { role: 'dapp', dapp_name: dappName, isDirect: true }
      const bridge = this.config.bridge && addUrlParams(this.config.bridge || '', params)
      walletConnectProvider = new WalletConnectProvider({
        ...this.config,
        bridge,
        qrcode: true,
        qrcodeModal: InstallExtensionQRCodeModal,
        connector: DeFiLinkConnectorGenerator(
          {
            ...this.config,
            bridge,
            qrcodeModal: InstallExtensionQRCodeModal,
          },
          new SessionStorage()
        ).connector,
      })
    }
    // ensure that the uri is going to be available, and emit an event if there's a new uri
    if (!walletConnectProvider.wc.connected) {
      await walletConnectProvider.wc.createSession({
        chainId: this.supportedChainIds && this.supportedChainIds.length > 0 ? this.supportedChainIds[0] : 1,
      })
      this.emit(URI_AVAILABLE, walletConnectProvider.wc.uri)
    }
    const account = await walletConnectProvider
      .enable()
      .then((accounts: string[]): string => accounts[0])
      .catch((error: Error): void => {
        // TODO ideally this would be a better check
        if (error.message === 'User closed modal') {
          throw new UserRejectedRequestError()
        }

        throw error
      })

    walletConnectProvider.on('disconnect', this.handleDisconnect)
    walletConnectProvider.on('chainChanged', this.handleChainChanged)
    walletConnectProvider.on('accountsChanged', this.handleAccountsChanged)
    this.walletConnectProvider = walletConnectProvider
    return { provider: walletConnectProvider, account }
  }

  public async getProvider(): Promise<any> {
    return this.walletConnectProvider
  }

  public async getChainId(): Promise<number | string> {
    return this.walletConnectProvider.send('eth_chainId')
  }

  public async getAccount(): Promise<null | string> {
    return this.walletConnectProvider.send('eth_accounts').then((accounts: string[]): string => accounts[0])
  }

  public deactivate() {
    if (this.walletConnectProvider) {
      this.walletConnectProvider.stop()
      this.walletConnectProvider.removeListener('disconnect', this.handleDisconnect)
      this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged)
      this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged)
    }
  }

  public async close() {
    await this.walletConnectProvider?.close()
    this.walletConnectProvider = undefined
  }
}
